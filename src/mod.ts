/* eslint-disable @typescript-eslint/naming-convention */

import * as fs from "fs";
import * as path from "path";
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IpreSptLoadMod } from "@spt/models/external/IpreSptLoadMod";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

interface WeatherPreset {
    name: string;
    weight: number;
    apply: (seasonConfig: any) => void;
}

interface ModConfig {
    weatherPatchEnabled: boolean;
    debugLogging: boolean;
    nameMode: "custom" | "realistic";
}

class BGReplace implements IpreSptLoadMod, IPostDBLoadMod {
    private configPath = path.resolve(__dirname, "..", "config", "config.json");
    private config: ModConfig = {
        weatherPatchEnabled: true,
        debugLogging: false,
        nameMode: "custom"
    };

    private customNames: string[] = [
        "Pluto!", "Pigeon", "Pijinski", "eukyre", "FemboyBuddy", "Eco",
        "Exxtrasneaky", "ffloid", "Hj", "Jeri_", "Turok", "Okbozo", "Ronin117",
        "Screwball0", "LaptopSPT", "Nonbinary Wafflehouse", "Kezzy", "Neptune",
        "Femtune", "DoctorPepper", "WireSpeed", "Spoonman", "Acer", "Navi",
        "DevilFlippy", "Volcano"
    ];

    private realisticNames = {
        usec: [
            "James Smith",
            "John Johnson",
            "Robert Williams",
            "Michael Brown",
            "William Jones",
            "David Miller",
            "Richard Davis",
            "Charles Garcia",
            "Joseph Rodriguez",
            "Thomas Martinez",
            "Christopher Wilson",
            "Daniel Anderson",
            "Matthew Taylor",
            "Anthony Thomas",
            "Mark Hernandez",
            "Donald Moore",
            "Steven Jackson",
            "Paul Martin",
            "Andrew Lee",
            "Joshua Perez",
            "Kenneth Thompson",
            "Kevin White",
            "Brian Harris",
            "George Sanchez",
            "Edward Clark",
            "Ronald Ramirez",
            "Timothy Lewis",
            "Jason Robinson",
            "Jeffrey Walker",
            "Ryan Hall",
            "Jacob Allen",
            "Gary Young",
            "Nicholas King",
            "Eric Wright",
            "Jonathan Scott",
            "Stephen Torres",
            "Larry Nguyen",
            "Justin Hill",
            "Scott Flores",
            "Brandon Green",
            "Benjamin Adams",
            "Samuel Baker",
            "Gregory Nelson",
            "Alexander Carter",
            "Patrick Mitchell",
            "Frank Perez",
            "Raymond Roberts",
            "Jack Turner",
            "Dennis Phillips",
            "Jerry Campbell",
            "Tyler Parker",
            "Aaron Evans",
            "Jose Edwards",
            "Adam Collins",
            "Henry Stewart",
            "Douglas Sanchez",
            "Peter Morris",
            "Nathan Rogers",
            "Zachary Reed",
            "Kyle Cook",
            "Walter Morgan",
            "Harold Bell",
            "Ethan Murphy",
            "Carl Bailey",
            "Arthur Rivera",
            "Ryan Cooper",
            "Albert Richardson",
            "Sean Cox",
            "Christian Howard",
            "Roger Ward",
            "Lawrence Brooks",
            "Jesse Kelly",
            "Bryan Sanders",
            "Billy Price",
            "Jordan Bennett",
            "Troy Patterson",
            "Wayne Hughes",
            "Derek Flores",
            "Russell Simmons",
            "Philip Foster",
            "Joe Gonzales",
            "Johnny Bryant",
            "Randy Alexander",
            "Louis Russell",
            "Billy Griffin",
            "Philip Diaz",
            "Vincent Hayes",
            "Bobby Myers",
            "Johnny Ford",
            "Howard Hamilton",
            "Eugene Graham",
            "Willie Sullivan",
            "Ralph Wallace",
            "Roy West",
            "Brandon Cole",
            "Carlos Reynolds",
            "Billy Jenkins",
            "Bruce Perry",
            "Willie Powell",
            "Gabriel Long",
            "Albert Patterson",
            "Dylan Hughes",
            "Juan Flores",
            "Carl Simmons",
            "Arthur Foster",
            "Ryan Gonzales",
            "Sean Bryant",
            "Victor Alexander",
            "Keith Griffin",
            "Lawrence Diaz",
            "Scott Hayes",
            "Brandon Myers",
            "Benjamin Ford",
            "Adam Hamilton",
            "Trevor Graham",
            "Patrick Sullivan",
            "Evan Wallace",
            "Shawn West",
            "Curtis Cole",
            "Derek Reynolds",
            "Nathan Jenkins",
            "Jared Perry",
            "Lucas Powell",
            "Christian Long",
            "Austin Patterson",
            "Jordan Hughes",
            "Cameron Flores",
            "Alex Simmons",
            "Brandon Foster",
            "Kyle Gonzales",
            "Ethan Bryant",
            "Logan Alexander",
            "Nathan Russell",
            "Caleb Griffin",
            "Aaron Diaz",
            "Jason Hayes",
            "Matthew Myers",
            "Ryan Ford",
            "Tyler Hamilton",
            "Justin Graham",
            "Connor Sullivan",
            "Brandon Wallace",
            "Dylan West",
            "Zachary Cole",
            "Luke Reynolds",
            "Alex Jenkins",
            "Ian Perry",
            "Evan Powell",
            "Eli Long",
            "Christian Patterson",
            "Nicholas Hughes",
            "Trevor Flores",
            "Jason Simmons",
            "Brandon Foster",
            "Austin Gonzales",
            "Kevin Bryant",
            "Sean Alexander",
            "Adam Russell",
            "Brian Griffin",
            "Tyler Diaz",
            "Nathan Hayes",
            "Eric Myers",
            "Cameron Ford",
            "Kyle Hamilton",
            "Ryan Graham",
            "Brandon Sullivan",
            "Logan Wallace",
            "Dylan West",
            "Zachary Cole",
            "Lucas Reynolds",
            "Evan Jenkins",
            "Christian Perry",
            "Nathan Powell",
            "Eli Long",
            "Jason Patterson",
            "Aaron Hughes",
            "Jordan Flores",
            "Kyle Simmons",
            "Matthew Foster",
            "Justin Gonzales",
            "Adam Bryant",
            "Sean Alexander",
            "Ryan Russell",
            "Brian Griffin",
            "Connor Diaz",
            "Trevor Hayes",
            "Caleb Myers",
            "Ethan Ford",
            "Nicholas Hamilton",
            "Christian Graham",
            "Logan Sullivan",
            "Dylan Wallace",
            "Brandon West",
            "Evan Cole",
            "Austin Reynolds",
            "Luke Jenkins",
            "Zachary Perry",
            "Ryan Powell",
            "Eli Long",
            "Jason Patterson",
            "Aaron Hughes",
            "Jordan Flores",
            "Kyle Simmons",
            "Matthew Foster",
            "Justin Gonzales",
            "Adam Bryant",
            "Sean Alexander",
            "Ryan Russell",
            "Brian Griffin",
            "Connor Diaz",
            "Trevor Hayes",
            "Caleb Myers",
            "Ethan Ford",
            "Nicholas Hamilton",
            "Christian Graham",
            "Logan Sullivan",
            "Dylan Wallace",
            "Brandon West",
            "Evan Cole",
            "Cody Richardson",
            "Blake Montgomery",
            "Travis Burke",
            "Corey Johnston",
            "Dustin Lambert",
            "Shane Douglas",
            "Bradley Harmon",
            "Mitchell Barrett",
            "Spencer Kelley",
            "Garrett Lowe",
            "Adrian Neal",
            "Colin Bishop",
            "Damian Fisher",
            "Trevor Gardner",
            "Brendan Hart",
            "Derrick Hunt",
            "Julian Newman",
            "Malcolm Pierce",
            "Phillip Riley",
            "Troy Spencer",
            "Edwin Walsh",
            "Chad Warren",
            "Frederick West",
            "Eliot Willis",
            "Cameron Bryant",
            "Dylan Fisher",
            "Brady Simmons",
            "Jared Ellis",
            "Spencer Hudson",
            "Caleb Parker",
            "Marcus Vaughn",
            "Trevor Wheeler",
            "Connor Vaughn",
            "Gavin Flynn",
            "Sean Harrison",
            "Julian Marsh",
            "Derek Lyons",
            "Nathaniel Shaw",
            "Tanner Douglas",
            "Logan McBride",
            "Asher Chambers",
            "Malcolm Palmer",
            "Grayson Barrett",
            "Evan Fox",
            "Colton Nash",
            "Austin Boone",
            "Jared Ramsey",
            "Hunter Foster",
            "Blake Morrison",
            "Cody Barker",
            "Brady Steele",
            "Landon Harper",
            "Troy Spencer"
        ],
        bear: [
            "Александр Иванов",
            "Дмитрий Смирнов",
            "Сергей Кузнецов",
            "Андрей Попов",
            "Алексей Васильев",
            "Михаил Петров",
            "Владимир Соколов",
            "Игорь Михайлов",
            "Николай Фёдоров",
            "Павел Морозов",
            "Константин Волков",
            "Юрий Алексеев",
            "Артём Лебедев",
            "Денис Соловьёв",
            "Фёдор Козлов",
            "Владислав Степанов",
            "Евгений Николаев",
            "Максим Орлов",
            "Олег Семёнов",
            "Виталий Павлов",
            "Роман Васильев",
            "Алексей Богданов",
            "Илья Васильев",
            "Сергей Крылов",
            "Николай Ларионов",
            "Андрей Дмитриев",
            "Артём Белов",
            "Дмитрий Фролов",
            "Михаил Павлов",
            "Александр Григорьев",
            "Евгений Захаров",
            "Владислав Петров",
            "Павел Макаров",
            "Иван Никитин",
            "Алексей Андреев",
            "Константин Морозов",
            "Николай Тихонов",
            "Денис Сорокин",
            "Фёдор Васильев",
            "Владимир Волков",
            "Игорь Киселёв",
            "Артём Гусев",
            "Алексей Соловьёв",
            "Михаил Кузьмин",
            "Александр Новиков",
            "Евгений Романов",
            "Роман Фёдоров",
            "Павел Денисов",
            "Илья Николаев",
            "Сергей Захаров",
            "Константин Белов",
            "Дмитрий Беляев",
            "Алексей Орлов",
            "Николай Семёнов",
            "Фёдор Лебедев",
            "Владимир Кузнецов",
            "Артём Морозов",
            "Михаил Никитин",
            "Евгений Попов",
            "Алексей Васильев",
            "Денис Петров",
            "Сергей Андреев",
            "Владимир Фролов",
            "Константин Григорьев",
            "Николай Романов",
            "Михаил Соловьёв",
            "Александр Беликов",
            "Игорь Новиков",
            "Артём Лебедев",
            "Павел Васильев",
            "Алексей Морозов",
            "Дмитрий Николаев",
            "Роман Кузнецов",
            "Сергей Петров",
            "Владимир Никитин",
            "Александр Михайлов",
            "Дмитрий Захаров",
            "Сергей Орлов",
            "Андрей Романов",
            "Алексей Степанов",
            "Михаил Григорьев",
            "Владимир Лебедев",
            "Игорь Павлов",
            "Николай Волков",
            "Павел Богданов",
            "Константин Ларионов",
            "Юрий Кузьмин",
            "Артём Никитин",
            "Денис Андреев",
            "Фёдор Новиков",
            "Владислав Попов",
            "Евгений Морозов",
            "Максим Петров",
            "Олег Фёдоров",
            "Виталий Киселёв",
            "Роман Лебедев",
            "Алексей Павлов",
            "Илья Григорьев",
            "Сергей Николаев",
            "Николай Васильев",
            "Андрей Волков",
            "Артём Захаров",
            "Дмитрий Орлов",
            "Михаил Романов",
            "Александр Степанов",
            "Евгений Лебедев",
            "Владислав Павлов",
            "Павел Григорьев",
            "Иван Новиков",
            "Алексей Морозов",
            "Константин Никитин",
            "Николай Андреев",
            "Денис Новиков",
            "Фёдор Попов",
            "Владимир Морозов",
            "Игорь Петров",
            "Артём Фёдоров",
            "Алексей Лебедев",
            "Михаил Павлов",
            "Александр Григорьев",
            "Евгений Волков",
            "Роман Николаев",
            "Павел Васильев",
            "Илья Захаров",
            "Сергей Орлов",
            "Константин Романов",
            "Дмитрий Степанов",
            "Алексей Ларионов",
            "Николай Кузьмин",
            "Фёдор Никитин",
            "Владимир Андреев",
            "Игорь Новиков",
            "Артём Попов",
            "Денис Морозов",
            "Михаил Петров",
            "Александр Фёдоров",
            "Евгений Лебедев",
            "Владислав Павлов",
            "Павел Григорьев",
            "Иван Новиков",
            "Алексей Морозов",
            "Константин Никитин",
            "Николай Андреев",
            "Денис Новиков",
            "Фёдор Попов",
            "Владимир Морозов",
            "Игорь Петров",
            "Артём Фёдоров",
            "Алексей Лебедев",
            "Михаил Павлов",
            "Александр Григорьев",
            "Евгений Волков",
            "Роман Николаев",
            "Павел Васильев",
            "Илья Захаров",
            "Сергей Орлов",
            "Константин Романов",
            "Дмитрий Степанов",
            "Алексей Ларионов",
            "Николай Кузьмин",
            "Фёдор Никитин",
            "Владимир Андреев",
            "Игорь Новиков",
            "Артём Попов",
            "Денис Морозов",
            "Михаил Петров",
            "Александр Фёдоров",
            "Евгений Лебедев",
            "Владислав Павлов",
            "Павел Григорьев",
            "Иван Новиков",
            "Алексей Морозов",
            "Константин Никитин",
            "Николай Андреев",
            "Денис Новиков",
            "Фёдор Попов",
            "Владимир Морозов",
            "Игорь Петров",
            "Артём Фёдоров",
            "Алексей Лебедев",
            "Михаил Павлов",
            "Александр Григорьев",
            "Евгений Волков",
            "Роман Николаев",
            "Павел Васильев",
            "Илья Захаров",
            "Сергей Орлов",
            "Константин Романов",
            "Дмитрий Степанов",
            "Алексей Ларионов",
            "Николай Кузьмин",
            "Фёдор Никитин",
            "Владимир Андреев",
            "Игорь Новиков",
            "Артём Попов",
            "Денис Морозов",
            "Михаил Петров",
            "Александр Фёдоров",
            "Евгений Лебедев",
            "Владислав Павлов",
            "Павел Григорьев",
            "Иван Новиков",
            "Алексей Морозов",
            "Константин Никитин",
            "Николай Андреев",
            "Денис Новиков",
            "Фёдор Попов",
            "Владимир Морозов",
            "Игорь Петров",
            "Артём Фёдоров",
            "Алексей Лебедев",
            "Михаил Павлов",
            "Александр Григорьев",
            "Евгений Волков",
            "Роман Николаев",
            "Павел Васильев",
            "Илья Захаров",
            "Сергей Орлов",
            "Константин Романов"
        ]
    };

    private printRainbowLog(): void {
        console.log(
            `\x1b[94m[Echoes of Tarkov] \x1b[93m Loaded              | \x1b[91mM\x1b[93ma\x1b[92md\x1b[96me \x1b[94mB\x1b[95my \x1b[91mP\x1b[93ml\x1b[92mu\x1b[96mt\x1b[94mo\x1b[95m!\x1b[0m`
        );
    }

    public postDBLoad(container: DependencyContainer): void {
        this.printRainbowLog();

        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const logger = container.resolve<ILogger>("WinstonLogger");

        this.loadConfig(logger);

        const debugLog = (msg: string) => {
            if (this.config.debugLogging) logger.debug(`[Echoes of Tarkov] ${msg}`);
        };

        // ----- Launcher background selection -----
        const options = [
            { filename: "bg.png", weight: 3.75 },
            { filename: "bg_1.png", weight: 50 },
            { filename: "bg_2.png", weight: 20 },
            { filename: "bg_3.png", weight: 3.75 },
            { filename: "bg_4.png", weight: 3.75 },
            { filename: "bg_5.png", weight: 3.75 },
            { filename: "bg_6.png", weight: 3.75 },
            { filename: "bg_7.png", weight: 3.75 },
            { filename: "bg_8.png", weight: 3.75 },
            { filename: "bg_9.png", weight: 3.75 }
        ];

        const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
        const rand = Math.random() * totalWeight;
        let cumulative = 0;
        let selectedFile = "";

        for (const option of options) {
            cumulative += option.weight;
            if (rand < cumulative) {
                selectedFile = option.filename;
                break;
            }
        }

        const selectedPath = path.resolve(__dirname, "..", "res", selectedFile);
        if (fs.existsSync(selectedPath)) {
            console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m Utility             | Overriding launcher background with \x1b[32m${selectedFile}`);
            imageRouter.addRoute("/files/launcher/bg", selectedPath);
        } else {
            logger.warning(`Selected background not found: ${selectedPath}`);
        }

        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = db.getTables();

        // Patch BackgroundColor in memory
        this.patchBackgroundColorsInDB(tables);

        // ----- Bot name patching -----
        const factions = ["usec", "bear"];
        for (const faction of factions) {
            const botType = tables.bots.types[faction];
            if (!botType?.firstName) continue;

            if (this.config.nameMode === "custom") {
                for (const name of this.customNames) {
                    if (!botType.firstName.includes(name)) botType.firstName.push(name);
                }
                debugLog(`Added custom ${faction.toUpperCase()} names.`);
            } else if (this.config.nameMode === "realistic") {
                botType.firstName = this.realisticNames[faction] ?? [];
                debugLog(`Overwritten ${faction.toUpperCase()} names with realistic names.`);
            }
        }

        // ----- Ragfair patch -----
        if (tables.globals?.config?.RagFair) {
            const oldLevel = tables.globals.config.RagFair.minUserLevel;
            tables.globals.config.RagFair.minUserLevel = 30;
            debugLog(`Raised Ragfair min level from ${oldLevel} to 30`);
        }

        // ----- Weather patch -----
        if (!this.config.weatherPatchEnabled) {
            debugLog("Weather patch disabled via config.");
            return;
        }

        const weatherPath = this.findWeatherJson(__dirname);
        if (!weatherPath) {
            logger.error("Could not find weather.json in any parent directory.");
            return;
        }

        const weatherData = JSON.parse(fs.readFileSync(weatherPath, "utf-8"));

        const presets: WeatherPreset[] = [
            {
                name: "Hurricane",
                weight: 50,
                apply: (seasonConfig) => {
                    seasonConfig.clouds.weights = seasonConfig.clouds.values.map((_, i, arr) => i === arr.length - 1 ? 1 : 0);
                    seasonConfig.rain.weights = seasonConfig.rain.values.map((_, i, arr) => i === arr.length - 1 ? 1 : 0);
                    seasonConfig.fog.weights = seasonConfig.fog.values.map((_, i, arr) => i === arr.length - 1 ? 1 : 0);
                    seasonConfig.windSpeed.values = [0, 1, 2, 3, 4, 5, 6];
                    seasonConfig.windSpeed.weights = [0, 0, 0, 0, 0, 0, 1];
                }
            },
            {
                name: "ClearSkies",
                weight: 20,
                apply: (seasonConfig) => {
                    seasonConfig.clouds.weights = seasonConfig.clouds.values.map((_, i) => i === 0 ? 1 : 0);
                    seasonConfig.rain.weights = seasonConfig.rain.values.map(() => 0);
                    seasonConfig.fog.weights = seasonConfig.fog.values.map(() => 0);
                    seasonConfig.windSpeed.values = [0, 1, 2, 3, 4];
                    seasonConfig.windSpeed.weights = [1, 0, 0, 0, 0];
                }
            },
            {
                name: "LightRain",
                weight: 15,
                apply: (seasonConfig) => {
                    seasonConfig.clouds.weights = seasonConfig.clouds.values.map((_, i) => i === seasonConfig.clouds.values.length - 2 ? 1 : 0);
                    seasonConfig.rain.weights = seasonConfig.rain.values.map((_, i) => i === 0 ? 1 : 0);
                    seasonConfig.fog.weights = seasonConfig.fog.values.map((_, i) => i === 1 ? 1 : 0);
                    seasonConfig.windSpeed.values = [0, 1, 2, 3, 4];
                    seasonConfig.windSpeed.weights = [0, 1, 0, 0, 0];
                }
            },
            {
                name: "HeavyWind",
                weight: 15,
                apply: (seasonConfig) => {
                    seasonConfig.clouds.weights = seasonConfig.clouds.values.map((_, i) => i === seasonConfig.clouds.values.length - 2 ? 1 : 0);
                    seasonConfig.rain.weights = seasonConfig.rain.values.map(() => 0);
                    seasonConfig.fog.weights = seasonConfig.fog.values.map((_, i) => i === 2 ? 1 : 0);
                    seasonConfig.windSpeed.values = [0, 1, 2, 3, 4, 5, 6];
                    seasonConfig.windSpeed.weights = [0, 0, 0, 0, 0, 1, 0];
                }
            }
        ];

        const totalPresetWeight = presets.reduce((sum, p) => sum + p.weight, 0);
        let presetRand = Math.random() * totalPresetWeight;
        let selectedPreset: WeatherPreset | null = null;

        for (const p of presets) {
            if (presetRand < p.weight) {
                selectedPreset = p;
                break;
            }
            presetRand -= p.weight;
        }

        if (!selectedPreset) selectedPreset = presets[0];
        console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m Utility             | Applying weather preset:\x1b[32m ${selectedPreset.name}`);

        for (const season in weatherData.weather.seasonValues) {
            selectedPreset.apply(weatherData.weather.seasonValues[season]);
        }

        fs.writeFileSync(weatherPath, JSON.stringify(weatherData, null, 4));
        debugLog("Weather config patched.");
    }

    private patchBackgroundColorsInDB(obj: any, depth = 0): void {
        if (depth > 20 || typeof obj !== "object" || obj === null) return;
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (key === "BackgroundColor" && typeof value === "string") {
                obj[key] = "black";
            } else if (typeof value === "object") {
                this.patchBackgroundColorsInDB(value, depth + 1);
            }
        }
    }

    private findWeatherJson(startDir: string): string | null {
        let dir = startDir;
        for (let i = 0; i < 10; i++) {
            const testPath = path.join(dir, "SPT_Data", "Server", "configs", "weather.json");
            if (fs.existsSync(testPath)) return testPath;
            const parent = path.dirname(dir);
            if (parent === dir) break;
            dir = parent;
        }
        return null;
    }

    private loadConfig(logger: ILogger): void {
        if (fs.existsSync(this.configPath)) {
            try {
                const raw = fs.readFileSync(this.configPath, "utf-8");
                const parsed = JSON.parse(raw);

                this.config.weatherPatchEnabled = parsed.weatherPatchEnabled ?? true;
                this.config.debugLogging = parsed.debugLogging ?? false;
                this.config.nameMode = parsed.nameMode === "realistic" ? "realistic" : "custom";

                // --- Logging the loaded config ---
                console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m Config              | \x1b[32m${this.config.nameMode === "custom" ? "Custom Names Selected" : "Realistic Names Selected"}`);
                console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m Config              | Weather system\x1b[32m ${this.config.weatherPatchEnabled ? "active" : "disabled"}`);
                console.log(`\x1b[94m[Echoes of Tarkov] \x1b[93m Config              | Debug logging\x1b[32m ${this.config.debugLogging ? "on" : "off"}`);

                if (this.config.debugLogging) {
                    logger.debug(`[Echoes of Tarkov] Config loaded: ${JSON.stringify(this.config)}`);
                }
            } catch (e) {
                logger.error("[Echoes of Tarkov] \x1b[31mFailed to parse config.json, using defaults.");
            }
        } else {
            logger.warning("[Echoes of Tarkov] \x1b[33mConfig file not found, using defaults.");
        }
    }
}

module.exports = { mod: new BGReplace() };
