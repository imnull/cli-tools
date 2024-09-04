import { padStart } from '@imnull/es5-string'
import { L, R, TDateLike, TTimeUnit, UNIT_MAP, MINUTE, HOUR, DAY, CN_WEEKNAMES, SECOND } from './config'

export { DAY, HOUR, MINUTE, SECOND }

export const getUnit = (u: TTimeUnit) => UNIT_MAP[u]

export const parseDate = (d: TDateLike) => {
    if (d instanceof Date) {
        return new Date(d.getTime())
    } else if (typeof d === 'number') {
        return new Date(d)
    } else {
        const [y = '0', M = '0', D = '1', h = '0', m = '0', s = '0', S = '0'] = `${d}`.trim().split(/[^\d]+/)
        const year = Number(y)
        const month = Number(M) - 1
        const date = Number(D)
        const hour = Number(h) || 0
        const minute = Number(m) || 0
        const second = Number(s) || 0
        const ms = Number(S) || 0
        return new Date(year, month, date, hour, minute, second, ms)
    }
}

/**
 * 
 * @param fmt yyyy-MM-dd hh:mm:ss.SSS
 * @param d 
 */
export const formatDate = (d: Date, fmt: string = 'yyyy-MM-dd') => {
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()
    const second = d.getSeconds()
    const ms = d.getMilliseconds()
    return fmt
        .replace(/y+/, m => L(year, 4))
        .replace(/M+/, m => L(month, Math.min(2, m.length)))
        .replace(/d+/, m => L(date, Math.min(2, m.length)))
        .replace(/h+/, m => L(hour, Math.min(2, m.length)))
        .replace(/m+/, m => L(minute, Math.min(2, m.length)))
        .replace(/s+/, m => L(second, Math.min(2, m.length)))
        .replace(/S+/, m => R(ms, Math.min(3, m.length)))
}


export const getDays = (date: Date = new Date()) => {
    const timezoneOffset = date.getTimezoneOffset() * MINUTE
    const time = date.getTime() - timezoneOffset
    return Math.floor(time / DAY)
}

const resolveDot = (n: number, dot: number) => {
    if(dot > 0) {
        const u = Math.pow(10, dot)
        return Math.round(n * u) / u
    } else if(dot === 0) {
        return n >> 0
    }
    return n
}

export const duration = (ms: number, unit: TTimeUnit = 'day', dot: number = 0) => {
    if(unit === 'ms') {
        return ms
    }
    return resolveDot(ms / UNIT_MAP[unit], dot)
}

export const diff = (a: Date, b: Date, unit: TTimeUnit = 'ms', dot: number = 0) => {
    return resolveDot(duration(a.getTime(), unit, -1) - duration(b.getTime(), unit, -1), dot)
}

export const timespan = (ms: number): [number, number, number, number, number] => {
    let left = ms
    const day = left / DAY >> 0
    left -= day * DAY
    const hour = left / HOUR >> 0
    left -= hour * HOUR
    const minute = left / MINUTE >> 0
    left -= minute * MINUTE
    const second = left / SECOND >> 0
    left -= second * SECOND
    const millisecond = left
    return [day, hour, minute, second, millisecond]
}

export const getMonthDays = (month: number = new Date().getMonth(), year: number = new Date().getFullYear()) => {
    const firstDay = new Date(year, month, 1).getDate()
    const lastDay = new Date(year, month + 1, 0).getDate()

    const nowTime = Date.now()

    const list: Date[] = []
    for (let d = firstDay; d <= lastDay; d += 1) {
        const day = new Date(year, month, d, 23, 59, 59)
        if (day.getTime() >= nowTime) {
            break
        }
        list.push(day)
    }
    return list
}

export const addTime = (d: Date, offset: number, type: TTimeUnit) => {
    const ms = d.getTime(), add = UNIT_MAP[type] * offset >> 0
    d.setTime(ms + add)
    return d
}

export const getCnWeekDay = (date: Date, names: string[] = CN_WEEKNAMES) => {
    return names[date.getDay()] || ''
}

export class Timespan {
    private ts: [number, number, number, number, number] = [0, 0, 0, 0, 0]
    constructor(ms: number = 0) {
        this.update(ms)
    }
    update(ms: number) {
        this.ts = timespan(ms)
        return this
    }

    getDay() {
        return this.ts[0]
    }
    getHour() {
        return this.ts[1]
    }
    getMinute() {
        return this.ts[2]
    }
    getSecond() {
        return this.ts[3]
    }
    getMillisecond() {
        return this.ts[4]
    }

    /**
     * ### 占位符
     * - %day 天
     * - %hour 小时
     * - %minute 分钟
     * - %second 秒
     * - %ms 毫秒
     * ### 补齐位数
     * %day:3 表示padStart向前补齐3位0
     * @param fmt 
     */
    format(fmt: string = '%day天 %hour:2小时 %minute:2分钟 %second:2秒 %ms毫秒') {
        return fmt.replace(/%(day|hour|minute|second|ms)(:\d+)?/g, (m, key, count) => {
            if(!count) {
                count = ':1'
            }
            const u = Number(count.substring(1)) || 1
            let val: number
            switch(key) {
                case 'day': {
                    val = this.getDay()
                    break
                }
                case 'hour': {
                    val = this.getHour()
                    break
                }
                case 'minute': {
                    val = this.getMinute()
                    break
                }
                case 'second': {
                    val = this.getSecond()
                    break
                }
                case 'ms':
                default: {
                    val = this.getMillisecond()
                    break
                }
            }
            return padStart(`${val}`, u, '0')
        })
    }
}

export class DateTime {

    static parse(raw: TDateLike | DateTime) {
        return new DateTime(raw)
    }

    private readonly raw: TDateLike
    private readonly dt: Date
    constructor(raw: TDateLike | DateTime) {
        if (raw instanceof DateTime) {
            this.raw = raw.raw
            this.dt = parseDate(raw.dt)
        } else {
            this.raw = raw
            this.dt = parseDate(raw)
        }
    }

    format(tpl: string) {
        return formatDate(this.dt, tpl)
    }

    valueOf() {
        return this.dt
    }

    toString() {
        return this.dt.toString()
    }

    addTime(offset: number, unit: TTimeUnit = 'hour') {
        addTime(this.dt, offset, unit)
        return this
    }

    reach(target: Date) {
        return this.diff(target, 'ms') >= 0
    }

    clone() {
        return new DateTime(this)
    }

    reset() {
        const dt = parseDate(this.raw)
        this.dt.setTime(dt.getTime())
        return this
    }

    getWeekDay() {
        return this.dt.getDay()
    }

    getWeekDayCn() {
        return getCnWeekDay(this.dt)
    }

    getCurrentMonthDays() {

        const year = this.dt.getFullYear()
        const month = this.dt.getMonth()

        const firstDay = new Date(year, month, 1).getDate()
        const lastDay = new Date(year, month + 1, 0).getDate()

        const nowTime = Date.now()

        const list: Date[] = []
        for (let d = firstDay; d <= lastDay; d += 1) {
            const day = new Date(year, month, d, 23, 59, 59)
            if (day.getTime() >= nowTime) {
                break
            }
            list.push(day)
        }
        return list
    }

    getTime() {
        return this.dt.getTime()
    }

    diff(date: Date, unit: TTimeUnit = 'day') {
        return diff(this.dt, date, unit)
    }

    timespan(date: Date) {
        return new Timespan(diff(this.dt, date, 'ms'))
    }
}