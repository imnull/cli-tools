import { TColorNames, TStyleNames, colors, parseStyle } from '@imnull/cli-color'
import { TABLE_CHARS } from './config'
import { repeat, padEnd, padStart, genArr } from './helper'
import { isEmptyData, calWidth } from './utils'
import { Cell, TTableData, TRenderOptions, TRenderTableOptions } from './cell'

const BREAK_LINE = '\n'
const DEFAULT_COLOR: TColorNames = 'none'
const DEFAULT_BORDER_COLOR: TColorNames = 'brightBlack'

const calColumnCount = (data: TTableData) => {
    return data.map(r => r.length).reduce((r, v) => r > v ? r : v, 0)
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

const renderRow = (row: Cell[], size: number[], B: string, renderBorder: boolean, lineOptions: TRenderOptions) => {
    let result = [
        B,
        row.map((v, i) => v.render(size[i])).join(B),
        B,
    ].join('')
    if(renderBorder) {
        result = renderInnerLine(size, lineOptions) + BREAK_LINE + result
    }
    return result
}

const renderHead = (head: string[], count: number, size: number[], B: string, options: TRenderOptions) => {
    const _head = fixRow(head, count).map((v, i) => new Cell(v, i, options))
    const result = [
        B,
        _head.map((v, i) => v.render(size[i])).join(B),
        B,
    ].join('')
    return result
}

const formatTable = (data: TTableData, width: number, options: TRenderOptions) => {
    return data.map((row, I) => {
        const cells: Cell[] = []
        for(let i = 0; i < width; i++) {
            const val = isEmptyData(row[i]) ? '' : row[i]
            cells.push(new Cell(val, i, options))
        }
        return cells
    })
}

export const renderTable = (rawData: TTableData, options: TRenderTableOptions = {}) => {
    const {
        head,
        style = 'none',
        align = 'left',
        cell,
        color = DEFAULT_COLOR,
        borderColor = DEFAULT_BORDER_COLOR,
        headAlign = 'center',
        headColor = 'brightWhite',
        headStyle = 'bold',
        ...rest
    } = options
    const { count, size } = scanTableColumns(rawData, head)
    const rowOptions = { ...rest, color, style, align, cell }
    const lineOptions = { ...rest, colors: borderColor }
    const headOptions = { ...rest, align: headAlign, color: headColor, style: headStyle }
    const B = colors.use(TABLE_CHARS.V, borderColor)

    const data = formatTable(rawData, count, rowOptions)

    const rows = data.map((row, idx) => renderRow(row, size, B, idx > 0, lineOptions))
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