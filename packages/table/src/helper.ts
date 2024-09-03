import { calWidth } from './utils'

export const trim = (s: string) => s.replace(/^\s+|\s+$/g, '')

export const genArr = <T = unknown>(n: number, v: T) => {
    const arr: T[] = []
    for(let i = 0; i < n; i++) {
        arr[i] = v
    }
    return arr
}

export const repeat = (s: string, c: number) => {
    if(c <= 0 || isNaN(c)) {
        return ''
    }
    return genArr(c, s).join('')
}

export const padStart = (s: string, len: number, char = ' ') => {
    return len > calWidth(s) ? repeat(char, len - calWidth(s)) + s : s
}

export const padEnd = (s: string, len: number, char = ' ') => {
    return len > calWidth(s) ? s + repeat(char, len - calWidth(s)) : s
}

