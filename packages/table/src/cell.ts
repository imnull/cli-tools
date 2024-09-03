import { colors, parseStyle, TColorNames, TStyleNames } from '@imnull/cli-color'
import { calWidth, isEmptyData } from "./utils"
import { padEnd, padStart, repeat } from './helper'

export type TTableData = unknown[][]

export type TCellProcess<T = unknown, C = unknown> = (val: C, index: number) => T
export type TAlign = 'left' | 'right' | 'center'

export type TRenderOptions = {
    padding?: number;
    padChar?: string;
    align?: TAlign | TCellProcess<TAlign, Cell>;
    color?: TColorNames | TCellProcess<TColorNames, Cell>;
    style?: TStyleNames | TStyleNames[] | TCellProcess<TStyleNames | TStyleNames[], Cell>;
    cell?: TCellProcess;
}

export type TRenderTableOptions = TRenderOptions & {
    borderColor?: TColorNames;
    head?: string[];
    headAlign?: TAlign;
    headColor?: TColorNames;
    headStyle?: TStyleNames | TStyleNames[];
}

const paddingContent = (content: unknown, padding: number, color: TColorNames, style: TStyleNames | TStyleNames[], padChar = ' ') => {
    return colors.use(`${repeat(padChar, padding)}${content}${repeat(padChar, padding)}`, color, parseStyle(style))
}

export class Cell {
    private readonly value: unknown
    private readonly index: number
    private readonly options: TRenderOptions

    constructor(value: unknown, index: number, options: TRenderOptions = {}) {
        this.value = value
        this.index = index
        this.options = options
    }

    getAlign(): TAlign {
        const { align } = this.options
        if(typeof align === 'function') {
            return align(this, this.index) || 'left'
        }
        return align || 'left'
    }
    getColor(): TColorNames {
        const { color } = this.options
        if(typeof color === 'function') {
            return color(this, this.index) || 'none'
        }
        return color || 'none'
    }

    getStyle(): TStyleNames | TStyleNames[] {
        const { style } = this.options
        if(typeof style === 'function') {
            return style(this, this.index) || 'none'
        }
        return style || 'none'
    }

    valueOf() {
        return this.value
    }

    toString() {
        let val = this.valueOf()
        const { cell } = this.options
        if(typeof cell === 'function') {
            val = cell(val, this.index)
        }
        return isEmptyData(val) ? '' : `${val}`
    }

    render(size: number) {
        const {
            padding = 1,
            padChar = ' ',
        } = this.options
        const s = this.toString()
        const sLen = calWidth(s)
        const color = this.getColor()
        const style = this.getStyle()
        const align = this.getAlign()
        switch (align) {
            case 'right': return paddingContent(padStart(s, size, padChar), padding, color, style)
            case 'center': {
                const gap = size - sLen
                const left = gap / 2 >> 0
                const right = gap - left
                return paddingContent(`${repeat(padChar, left)}${s}${repeat(padChar, right)}`, padding, color, style)
            }
            default:
            case 'left':
                return paddingContent(padEnd(s, size, padChar), padding, color, style)
        }
    }
}