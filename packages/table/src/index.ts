import { TColorNames, TStyleNames, colors, parseStyle } from '@imnull/cli-color'
import { TABLE_CHARS } from './config'
import { repeat, padEnd, padStart, genArr } from './helper'

type TTableData = unknown[][]
type TAlign = 'left' | 'right' | 'center'

type TRenderOptions = {
    padding?: number;
    padChar?: string;
    align?: TAlign | ((val: unknown, index: number, row: unknown[]) => TAlign);
    color?: TColorNames | ((val: unknown, index: number, row: unknown[]) => TColorNames);
    style?: TStyleNames | TStyleNames[] | ((val: unknown, index: number, row: unknown[]) => TStyleNames | TStyleNames[]);
}

type TRenderTableOptions = TRenderOptions & {
    borderColor?: TColorNames;
    head?: string[];
    headAlign?: TAlign;
    headColor?: TColorNames;
    headStyle?: TStyleNames | TStyleNames[];
}

const BREAK_LINE = '\n'
const DEFAULT_COLOR: TColorNames = 'none'
const DEFAULT_BORDER_COLOR: TColorNames = 'brightBlack'

const isEmptyData = (v: unknown) => typeof v === 'undefined'

const paddingContent = (content: unknown, padding: number, color: TColorNames, style: TStyleNames | TStyleNames[], padChar = ' ') => {
    return colors.use(`${repeat(padChar, padding)}${content}${repeat(padChar, padding)}`, color, parseStyle(style))
}

const cell = (data: unknown, index: number, row: unknown[], size: number, options: TRenderOptions) => {
    const {
        padding = 1,
        padChar = ' ',
        align = 'left',
        color = DEFAULT_COLOR,
        style = 'none'
    } = options
    const s = isEmptyData(data) ? '' : `${data}`
    const _color = typeof color === 'function' ? color(data, index, row) : color
    const _style = typeof style === 'function' ? style(data, index, row) : style
    const _align = typeof align === 'function' ? align(data, index, row) : align
    switch (_align) {
        case 'right': return paddingContent(padStart(s, size, padChar), padding, _color, _style)
        case 'center': {
            const gap = size - s.length
            const left = gap / 2 >> 0
            const right = gap - left
            return paddingContent(`${repeat(padChar, left)}${s}${repeat(padChar, right)}`, padding, _color, _style)
        }
        default:
        case 'left':
            return paddingContent(padEnd(s, size, padChar), padding, _color, _style)
    }
}

const calColumnCount = (data: TTableData) => {
    return data.map(r => r.length).reduce((r, v) => r > v ? r : v, 0)
}

const calWidth = (cell: unknown) => {
    if(isEmptyData(cell)) {
        return 0
    } else if(typeof cell === 'string') {
        return cell.length
    } else {
        return `${cell}`.length
    }
}

const calColumnWidth = (data: TTableData, index: number) => {
    return data.map(r => calWidth(r[index])).reduce((r, v) => r > v ? r : v, 0)
}

const scanTableColumns = (_data: TTableData, head?: string[]) => {
    const data = [..._data]
    if(Array.isArray(head) && head.length > 0) {
        data.push(head)
    }
    const columnCount = calColumnCount(data)
    const columnWidth = genArr(columnCount, 0).map((v, i) => v + calColumnWidth(data, i))
    return {
        count: columnCount,
        size: columnWidth,
    }
}

const fixRow = (row: unknown[], count: number) => {
    for(let i = row.length; i < count; i++) {
        row[i] = undefined
    }
    return row
}

const renderRowBorder = (size: number[], L: string, C: string, R: string, options: TRenderOptions) => {
    const {
        color = DEFAULT_BORDER_COLOR,
    } = options
    const { padding = 1 } = options
    const pad = padding * 2
    const _color = typeof color === 'function' ? DEFAULT_BORDER_COLOR : color
    return colors.use([
        L,
        size.map(v => repeat(TABLE_CHARS.H, v + pad)).join(C),
        R,
    ].join(''), _color)
}

const renderTopLine = (size: number[], options: TRenderOptions) => {
    return renderRowBorder(size, TABLE_CHARS.LT, TABLE_CHARS.CT, TABLE_CHARS.RT, options)
}
const renderBottomLine = (size: number[], options: TRenderOptions) => {
    return renderRowBorder(size, TABLE_CHARS.LB, TABLE_CHARS.CB, TABLE_CHARS.RB, options)
}
const renderInnerLine = (size: number[], options: TRenderOptions) => {
    return renderRowBorder(size, TABLE_CHARS.LM, TABLE_CHARS.CM, TABLE_CHARS.RM, options)
}

const renderRow = (row: unknown[], count: number, size: number[], B: string, renderBorder: boolean, options: TRenderOptions, lineOptions: TRenderOptions) => {
    let result = [
        B,
        fixRow(row, count).map((v, i) => cell(v, i, row, size[i], options)).join(B),
        B,
    ].join('')
    if(renderBorder) {
        result = renderInnerLine(size, lineOptions) + BREAK_LINE + result
    }
    return result
}

const renderHead = (head: string[], count: number, size: number[], B: string, options: TRenderOptions) => {
    const result = [
        B,
        fixRow(head, count).map((v, i) => cell(v, i, head, size[i], options)).join(B),
        B,
    ].join('')
    return result
}

export const renderTable = (data: TTableData, options: TRenderTableOptions = {}) => {
    const {
        borderColor = DEFAULT_BORDER_COLOR,
        head,
        headAlign = 'center',
        headColor = 'brightWhite',
        headStyle = 'bold',
    } = options
    const lineOptions = { ...options, colors: borderColor }
    const headOptions = { ...options, align: headAlign, color: headColor, style: headStyle }
    const { count, size } = scanTableColumns(data, head)
    const B = colors.use(TABLE_CHARS.V, borderColor)
    const rows = data.map((row, idx) => {
        return renderRow(row, count, size, B, idx > 0, options, lineOptions)
    })
    const fin = [
        ...rows,
        renderBottomLine(size, lineOptions),
    ]
    if(Array.isArray(head) && head.length > 0) {
        fin.unshift(renderHead(head, count, size, B, headOptions), renderInnerLine(size, lineOptions))
    }
    fin.unshift(renderTopLine(size, lineOptions))
    return fin.join(BREAK_LINE)
}