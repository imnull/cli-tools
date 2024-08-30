import { BG_COLORS, COLORS, RESET, STYLES, TBackgroundColors, TColors, TOptions } from "./config";

export type TColorNames = keyof typeof COLORS
export type TStyleNames = 'none' | keyof typeof STYLES
export type TBackgroundColorNames = keyof typeof BG_COLORS

export const parseStyle = (style: TStyleNames | TStyleNames[]) => {
    if(!Array.isArray(style)) {
        style = [style]
    }
    const obj: Record<string, boolean> = {}
    style.forEach(key => obj[key] = true)
    return obj as TOptions
}

export const Colors = { ...COLORS }

export const BackgroundColors = { ...BG_COLORS }

export const colors = {
    use: (msg: string, colorName: TColors = 'white', options: TOptions = {}) => {
        const color = COLORS[colorName]
        let bgColor = ''
        let style = '';
        if (options.bold) style += STYLES.bold;
        if (options.faint) style += STYLES.faint;
        if (options.italic) style += STYLES.italic;
        if (options.underline) style += STYLES.underline;
        if (options.blink) style += STYLES.blink;
        if (options.reverse) style += STYLES.reverse;
        if (options.hidden) style += STYLES.hidden;
        if (options.background) {
            bgColor = BG_COLORS[options.background]
        }
        return `${color}${bgColor}${style}${msg}${RESET}`;
    },
    black: (msg: string, options: TOptions = {}) => colors.use(msg, 'black', options),
    red: (msg: string, options: TOptions = {}) => colors.use(msg, 'red', options),
    green: (msg: string, options: TOptions = {}) => colors.use(msg, 'green', options),
    yellow: (msg: string, options: TOptions = {}) => colors.use(msg, 'yellow', options),
    blue: (msg: string, options: TOptions = {}) => colors.use(msg, 'blue', options),
    /** 洋红 */
    magenta: (msg: string, options: TOptions = {}) => colors.use(msg, 'magenta', options),
    /** 蓝绿；青 */
    cyan: (msg: string, options: TOptions = {}) => colors.use(msg, 'cyan', options),
    white: (msg: string, options: TOptions = {}) => colors.use(msg, 'white', options),
    /** 灰色 */
    brightBlack: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightBlack', options),
    brightRed: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightRed', options),
    brightGreen: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightGreen', options),
    brightYellow: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightYellow', options),
    brightBlue: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightBlue', options),
    /** 亮洋红 */
    brightMagenta: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightMagenta', options),
    /** 亮青 */
    brightCyan: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightCyan', options),
    brightWhite: (msg: string, options: TOptions = {}) => colors.use(msg, 'brightWhite', options),
}

type TColorParams = {
    color?: TColors;
    background?: TBackgroundColors;
    bold?: boolean;
}
export class ColorText {
    color: TColors = 'none'
    background: TBackgroundColors = 'none'
    bold: boolean = false;

    constructor(params: TColorParams = {}) {
        this.color = params.color || 'none'
        this.background = params.background || 'none'
        this.bold = !!params.bold
    }

    render(msg: string) {
        return colors.use(msg, this.color, {
            background: this.background,
            bold: this.bold,
        })
    }
    log(msg: string) {
        // console.log(this)
        console.log(this.render(msg))
    }
}