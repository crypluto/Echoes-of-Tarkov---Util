/* eslint-disable @typescript-eslint/naming-convention */

import path from "path";
import * as fs from "fs";
import { DependencyContainer } from "tsyringe";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt-aki/models/external/IPreSptLoadMod";
import JSON5 from "json5";
import { PlutoLogColors } from "./PlutoLogging";



interface ModConfig {
    debugLogging: boolean;
    bgImageOverrideEnabled: boolean;
    fleaMarketPatchEnabled: boolean;
    singleFireRatePatchEnabled: boolean;
    singleFireRateNewValue: number;
}

class EchoesOfTarkov implements IPreSptLoadMod, IPostDBLoadMod {
    private configPath = path.resolve(__dirname, "..", "config", "config.json5");
    private config: ModConfig = {
        debugLogging: false,
        bgImageOverrideEnabled: true,
        fleaMarketPatchEnabled: true,
        singleFireRatePatchEnabled: true,
        singleFireRateNewValue: 450,
    };

    public preSptLoad(container: DependencyContainer): void {
        if (!this.config.bgImageOverrideEnabled) {
            if (this.config.debugLogging) console.log("[Echoes of Tarkov] BG Image override disabled via config.");
            return;
        }
        if (this.config.debugLogging) {
            console.log(`${PlutoLogColors.FgCyan}[Echoes of Tarkov]${PlutoLogColors.Reset} Debug message here.`);
        }
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const possibleImages = [
            "bg.png", "bg_1.png", "bg_2.png", "bg_3.png", "bg_4.png",
            "bg_5.png", "bg_6.png", "bg_7.png", "bg_8.png", "bg_9.png"
        ];

        const weights = [60, 10, 5, 5, 5, 5, 2, 2, 1, 1];
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const random = Math.random() * totalWeight;

        let cumulativeWeight = 0;
        let selectedImage = "bg.png";

        for (let i = 0; i < possibleImages.length; i++) {
            cumulativeWeight += weights[i];
            if (random < cumulativeWeight) {
                selectedImage = possibleImages[i];
                break;
            }
        }

        const imagePath = path.resolve(__dirname, "..", "res", selectedImage);
        if (fs.existsSync(imagePath)) {
            imageRouter.addRoute("/files/launcher/bg", imagePath);
            if (this.config.debugLogging) console.log(`[Echoes of Tarkov] Launcher background overridden with ${selectedImage}`);
        } else if (this.config.debugLogging) {
            console.warn(`[Echoes of Tarkov] Background image not found: ${imagePath}`);
        }
    }

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const tables = container.resolve<IDatabaseTables>("DatabaseServer").getTables();

        this.loadConfig(logger);

        this.replaceBackgroundColor(tables, logger);

        if (this.config.fleaMarketPatchEnabled) {
            this.patchFleaMarketLevel(tables, logger);
        } else if (this.config.debugLogging) {
            console.log("[Echoes of Tarkov] Flea market patch disabled via config.");
        }

        if (this.config.singleFireRatePatchEnabled) {
            this.patchSingleFireRateInItems(tables, logger);
        } else if (this.config.debugLogging) {
            console.log("[Echoes of Tarkov] SingleFireRate patch disabled via config.");
        }

        this.injectCustomNames(tables, logger);

        this.printRainbowLog();
    }

    public postSptLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const tables = container.resolve<IDatabaseTables>("DatabaseServer").getTables();

        this.replaceBackgroundColor(tables, logger);
    }

    private loadConfig(logger: ILogger): void {
        try {
            if (fs.existsSync(this.configPath)) {
                const rawData = fs.readFileSync(this.configPath, "utf-8");
                const parsedConfig = JSON5.parse(rawData);
                this.config = { ...this.config, ...parsedConfig };

                if (this.config.debugLogging) {
                    console.log("[Echoes of Tarkov] Loaded config.json5 successfully.");
                }
            } else {
                logger.warning("[Echoes of Tarkov] config.json5 not found, using default settings.");
            }
        } catch (error) {
            logger.warning(`[Echoes of Tarkov] Failed to load config.json5: ${error}`);
        }
    }

    private replaceBackgroundColor(obj: any, logger: ILogger, depth = 0, logged = { done: false }): void {
        if (depth > 20 || typeof obj !== "object" || obj === null) return;

        for (const key in obj) {
            if (key === "BackgroundColor" && typeof obj[key] === "string") {
                obj[key] = "black";
                if (this.config.debugLogging && !logged.done) {
                    console.log("[Echoes of Tarkov] Patched BackgroundColor to black");
                    logged.done = true;
                }
            } else if (typeof obj[key] === "object") {
                this.replaceBackgroundColor(obj[key], logger, depth + 1, logged);
            }
        }
    }


    private injectCustomNames(tables: IDatabaseTables, logger: ILogger): void {
        const names = ["Pluto!", "Pigeon", "Pijinski", "eukyre"];
        for (const name of names) {
            if (!tables.bots.types.usec.firstName.includes(name)) {
                tables.bots.types.usec.firstName.push(name);
                if (this.config.debugLogging) {
                    console.log(`[Echoes of Tarkov] Added custom USEC name: ${name}`);
                }
            }
            if (!tables.bots.types.bear.firstName.includes(name)) {
                tables.bots.types.bear.firstName.push(name);
                if (this.config.debugLogging) {
                    console.log(`[Echoes of Tarkov] Added custom BEAR name: ${name}`);
                }
            }
        }
    }

    private patchFleaMarketLevel(tables: IDatabaseTables, logger: ILogger): void {
        const oldLevel = tables.globals.config.RagFair.minUserLevel;
        tables.globals.config.RagFair.minUserLevel = 30;
        if (this.config.debugLogging) {
            console.log(`[Echoes of Tarkov] Raised RagFair minUserLevel from ${oldLevel} to 30`);
        }
    }

    private patchSingleFireRateInItems(tables: IDatabaseTables, logger: ILogger): void {
        const itemId = "6259b864ebedf17603599e88";
        const item = tables.templates?.items?.[itemId];

        if (!item) {
            logger.warning(`[Echoes of Tarkov] Item ${itemId} not found in items.json`);
            return;
        }

        const currentRate = item._props?.SingleFireRate;
        if (typeof currentRate === "number" && currentRate !== this.config.singleFireRateNewValue) {
            item._props.SingleFireRate = this.config.singleFireRateNewValue;
            if (this.config.debugLogging) {
                console.log(`[Echoes of Tarkov] Patched SingleFireRate for ${itemId}: ${currentRate} → ${this.config.singleFireRateNewValue}`);
            }
        } else if (this.config.debugLogging) {
            console.log(`[Echoes of Tarkov] SingleFireRate for ${itemId} is already ${currentRate}, no patch applied.`);
        }
    }

    private printRainbowLog(): void {
        console.log(
            "\x1b[94m[Echoes of Tarkov] \x1b[93m Loaded              | \x1b[91mM\x1b[0m\x1b[93ma\x1b[0m\x1b[92md\x1b[0m\x1b[96me\x1b[0m\x1b[94m \x1b[0m\x1b[95mb\x1b[0m\x1b[91my\x1b[0m\x1b[93m \x1b[0m\x1b[92mP\x1b[0m\x1b[96ml\x1b[0m\x1b[94mu\x1b[0m\x1b[95mt\x1b[0m\x1b[91mo\x1b[0m\x1b[93m!\x1b[0m"
        );
    }
}

module.exports = { mod: new EchoesOfTarkov() };
