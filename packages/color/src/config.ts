export const STYLES = {
    /** 应用粗体样式 */
    bold: '\x1b[1m',
    /** 应用细体（轻体）样式 */
    faint: '\x1b[2m',
    /** 应用斜体样式（并非所有终端都支持） */
    italic: '\x1b[3m',
    /** 应用下划线样式 */
    underline: '\x1b[4m',
    /** 应用闪烁样式（大多数现代终端不支持） */
    blink: '\x1b[5m',
    /** 应用反转颜色样式（前景色和背景色交换） */
    reverse: '\x1b[7m',
    /** 应用隐藏样式（并非所有终端都支持） */
    hidden: '\x1b[8m',
}

/** 重置所有样式和颜色 */
export const RESET = '\x1b[0m'

export const COLORS = {
    none: '',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    brightBlack: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
}

export const BG_COLORS = {
    none: '',
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    brightBlack: '\x1b[100m',
    brightRed: '\x1b[101m',
    brightGreen: '\x1b[102m',
    brightYellow: '\x1b[103m',
    brightBlue: '\x1b[104m',
    brightMagenta: '\x1b[105m',
    brightCyan: '\x1b[106m',
    brightWhite: '\x1b[107m',
}

export const ADDITIONAL_COLORS = {
    notBold: '\x1b[21m',
    noUnderline: '\x1b[24m',
    noReverse: '\x1b[27m',
    noHidden: '\x1b[28m'
}

export type TColors = keyof typeof COLORS
export type TBackgroundColors = keyof typeof BG_COLORS
export type TOptions = {
    bold?: boolean;
    faint?: boolean;
    italic?: boolean;
    underline?: boolean;
    blink?: boolean;
    reverse?: boolean;
    hidden?: boolean;
    background?: TBackgroundColors;
}