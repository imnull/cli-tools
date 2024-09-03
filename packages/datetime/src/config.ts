import { padStart, padEnd } from '@imnull/es5-string'

export type TDateLike = Date | string | number

export const MS = 1
export const SECOND = MS * 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export type TTimeUnit = 'day' | 'hour' | 'minute' | 'second' | 'ms'

export const UNIT_MAP: Record<TTimeUnit, number> = {
    ms: MS,
    second: SECOND,
    minute: MINUTE,
    hour: HOUR,
    day: DAY,
}

export const L = (n: number, c = 2, u = '0') => padStart(n, c, u)
export const R = (n: number, c = 2, u = '0') => padEnd(n, c, u)

export const CN_WEEKNAMES = ['日', '一', '二', '三', '四', '五', '六']
// const CN_WEEKNAMES = ['7', '1', '2', '3', '4', '5', '6']