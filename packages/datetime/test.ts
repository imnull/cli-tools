import {
    DateTime,
    diff,
    parseDate,
    formatDate,
    timespan,
    addTime,
} from './src'

const raw = '2019 8 11 20:01:12.456'
const raw2 = '2019 7 21 13:49:23.453'

const dt = new DateTime(raw)

const formatTimespan = (timespan: [number, number, number, number, number]) => {
    return `${timespan[0]}天 ${timespan[1]}小时 ${timespan[2]}分钟 ${timespan[3]}秒 ${timespan[4]}毫秒`
}

console.log(raw, '>>>', parseDate(raw).toString())
console.log(raw, '>>>', formatDate(parseDate(raw), 'yyyy-MM-dd hh:mm:ss.SSS'))
console.log(raw, '>>>', formatDate(addTime(parseDate(raw), 1.512, 'day'), 'yyyy-MM-dd hh:mm:ss.SSS'))
console.log(raw, '-', raw2, '=', diff(parseDate(raw), parseDate(raw2), 'day'), 'day')
console.log(raw, '-', raw2, '=', diff(parseDate(raw), parseDate(raw2), 'hour'), 'hour')
console.log(raw, '-', raw2, '=', timespan(diff(parseDate(raw), parseDate(raw2), 'ms')))
console.log(raw, '-', raw2, '=', formatTimespan(timespan(diff(parseDate(raw), parseDate(raw2), 'ms'))))
console.log(`======= DateTime =======`)
console.log(raw, '>>>', dt.addTime(1.512, 'day').format('yyyy-MM-dd hh:mm:ss.SSS'))
dt.reset()
console.log(raw, '>>>', 'reach 2019 8 10 20:01:12.456', dt.reach(parseDate('2019 8 10 20:01:12.456')))
console.log(raw, '>>>', 'reach 2019 8 11 20:01:12.000', dt.reach(parseDate('2019 8 11 20:01:12.000')))
console.log(raw, '>>>', 'reach 2019 8 11 20:01:12.456', dt.reach(parseDate('2019 8 11 20:01:12.456')))
console.log(raw, '>>>', 'reach 2019 8 11 20:01:12.459', dt.reach(parseDate('2019 8 11 20:01:12.459')))
console.log(raw, '>>>', 'reach 2019 8 12 20:01:12.456', dt.reach(parseDate('2019 8 12 20:01:12.456')))
console.log(raw, '-', raw2, '=', dt.diff(parseDate(raw2), 'day'), 'day')
console.log(raw, '-', raw2, '=', dt.diff(parseDate(raw2), 'hour'), 'hour')
console.log(raw, '-', raw2, '=', timespan(dt.diff(parseDate(raw2), 'ms')))
console.log(raw, '-', raw2, '=', dt.timespan(parseDate(raw2)).format())

