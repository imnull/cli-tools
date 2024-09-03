export const isEmptyData = (v: unknown) => typeof v === 'undefined'

const getStringByteLength = (s: string) => {
    // console.log(s, s.length, s.split('').map(c => c.charCodeAt(0).toString(2).length > 7 ? 2 : 1).reduce((r, v) => r + v, 0))
    return s.split('').map(c => getCharWidth(c)).reduce((r, v) => r + v, 0)
}

export const calWidth = (cell: unknown) => {
    if (isEmptyData(cell)) {
        return 0
    } else {
        return getStringByteLength(cell + '')
    }
}

export const getCharWidth = (char: string): number => {
    const codePoint = char.codePointAt(0); // 获取字符的 Unicode 码点
    if(!codePoint) {
        return 0
    }

    // 检查字符是否属于东亚宽字符集
    // 韩文音节初声 (Hangul Jamo init. consonants)
    // CJK (Chinese, Japanese, Korean) 统一表意文字块 (0x4E00-0x9FFF)
    // 全宽和半宽表格 (0xFF00-0xFFEF)
    // CJK 兼容表意文字 (0xF900-0xFAFF)
    // CJK 统一表意文字扩展块 A (0x3400-0x4DBF)
    // 韩文音节块 (Hangul Syllables) (0xAC00-0xD7AF)
    // CJK 统一表意文字扩展块 B (0x20000-0x2A6DF)
    if ((codePoint >= 0x1100  && codePoint <= 0x115F) || // 韩文音节初声
        (codePoint >= 0x2E80  && codePoint <= 0xA4CF && codePoint !== 0x303F) || // CJK 部首补充..彝文字
        (codePoint >= 0xAC00  && codePoint <= 0xD7A3) || // 韩文音节块
        (codePoint >= 0xF900  && codePoint <= 0xFAFF) || // CJK 兼容表意文字
        (codePoint >= 0xFE10  && codePoint <= 0xFE19) || // 垂直形式
        (codePoint >= 0xFE30  && codePoint <= 0xFE6F) || // CJK 兼容形式
        (codePoint >= 0xFF00  && codePoint <= 0xFF60) || // 全宽形式
        (codePoint >= 0xFFE0  && codePoint <= 0xFFE6) || // 半宽和全宽形式
        (codePoint >= 0x20000 && codePoint <= 0x2FFFD) || // CJK 统一表意文字扩展块 B
        (codePoint >= 0x30000 && codePoint <= 0x3FFFD)) {  // CJK 统一表意文字扩展块 C-F
        return 2; // 如果字符属于东亚宽字符集，则占用2个位置
    }

    return 1; // 其他字符默认占用1个位置
}