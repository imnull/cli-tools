export const repeat = (s: unknown, c: number) => {
    const C = c >> 0
    if(C <= 0) {
        return ''
    }
    const S = s + ''
    const arr: string[] = []
    for(let i = 0; i < C; i++) {
        arr[i] = S
    }
    return arr.join('')
}

export const padStart = (s: unknown, len: number, c: string = ' ') => {
    const S = s + ''
    return repeat(c, len - S.length) + S
}

export const padEnd = (s: unknown, len: number, c: string = ' ') => {
    const S = s + ''
    return S + repeat(c, len - S.length)
}

export const padCenter = (s: unknown, len: number, c: string = ' ') => {
    const S = s + '', G = len - S.length, L = G / 2 >> 0, R = G - L
    return repeat(c, L) + S + repeat(c, R)
}
