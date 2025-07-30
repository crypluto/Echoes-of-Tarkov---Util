// \user\mods\ZZZZZ-Echoes of Tarkov - Util\src\PlutoLogging.ts

/**
 * Enum for ASCII escape codes for colors and text styles in console output.
 * Supports basic, bright, background colors, styles, and extended 256 colors.
 */
export enum PlutoLogColors {
    Reset = "\x1b[0m",

    // Styles
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    // Foreground (text) colors
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    // Bright Foreground colors
    FgBrightBlack = "\x1b[90m",
    FgBrightRed = "\x1b[91m",
    FgBrightGreen = "\x1b[92m",
    FgBrightYellow = "\x1b[93m",
    FgBrightBlue = "\x1b[94m",
    FgBrightMagenta = "\x1b[95m",
    FgBrightCyan = "\x1b[96m",
    FgBrightWhite = "\x1b[97m",

    // Background colors
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",

    // Bright Background colors
    BgBrightBlack = "\x1b[100m",
    BgBrightRed = "\x1b[101m",
    BgBrightGreen = "\x1b[102m",
    BgBrightYellow = "\x1b[103m",
    BgBrightBlue = "\x1b[104m",
    BgBrightMagenta = "\x1b[105m",
    BgBrightCyan = "\x1b[106m",
    BgBrightWhite = "\x1b[107m",

    // Extended 256-color foreground - format: \x1b[38;5;${n}m
    Fg256_0 = "\x1b[38;5;0m",
    Fg256_1 = "\x1b[38;5;1m",
    Fg256_2 = "\x1b[38;5;2m",
    Fg256_3 = "\x1b[38;5;3m",
    Fg256_4 = "\x1b[38;5;4m",
    Fg256_5 = "\x1b[38;5;5m",
    Fg256_6 = "\x1b[38;5;6m",
    Fg256_7 = "\x1b[38;5;7m",
    Fg256_8 = "\x1b[38;5;8m",
    Fg256_9 = "\x1b[38;5;9m",
    Fg256_10 = "\x1b[38;5;10m",
    Fg256_11 = "\x1b[38;5;11m",
    Fg256_12 = "\x1b[38;5;12m",
    Fg256_13 = "\x1b[38;5;13m",
    Fg256_14 = "\x1b[38;5;14m",
    Fg256_15 = "\x1b[38;5;15m",

    // Extended 256-color background - format: \x1b[48;5;${n}m
    Bg256_0 = "\x1b[48;5;0m",
    Bg256_1 = "\x1b[48;5;1m",
    Bg256_2 = "\x1b[48;5;2m",
    Bg256_3 = "\x1b[48;5;3m",
    Bg256_4 = "\x1b[48;5;4m",
    Bg256_5 = "\x1b[48;5;5m",
    Bg256_6 = "\x1b[48;5;6m",
    Bg256_7 = "\x1b[48;5;7m",
    Bg256_8 = "\x1b[48;5;8m",
    Bg256_9 = "\x1b[48;5;9m",
    Bg256_10 = "\x1b[48;5;10m",
    Bg256_11 = "\x1b[48;5;11m",
    Bg256_12 = "\x1b[48;5;12m",
    Bg256_13 = "\x1b[48;5;13m",
    Bg256_14 = "\x1b[48;5;14m",
    Bg256_15 = "\x1b[48;5;15m",
}
