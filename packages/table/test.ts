import { Colors } from '@imnull/cli-color'
import { renderTable } from './src/index'

const DEMO = `
imnull\t2024-08-01\tS\t2024-08-01 21:30:00\t3.5
imnull\t2024-08-02\tS\t2024-08-02 19:35:00\t1.6
imnull\t2024-08-03\tE
imnull\t2024-08-04\tE
imnull\t2024-08-05\tS\t2024-08-05 21:43:00\t3.7
abc\t2024-08-06\tS\t2024-08-06 18:02:00\t0.0
imnull\t2024-08-07\tS\t2024-08-07 20:10:00\t2.2
imnull\t2024-08-08\tS\t2024-08-08 19:20:00\t1.3
imnull\t2024-08-09\tS\t2024-08-09 18:11:00\t0.2
mk\t2024-08-10\tE
imnull\t2024-08-11\tE
imnull\t2024-08-12\tS\t2024-08-12 20:04:00\t2.1
imnull\t2024-08-13\tS\t2024-08-13 20:04:00\t2.1
imnull\t2024-08-14\tS\t2024-08-14 20:04:00\t2.1
imnull\t2024-08-15\tS\t2024-08-15 20:17:00\t2.3
Bob\t2024-08-16\tS\t2024-08-16 22:12:00\t4.2
imnull\t2024-08-17\tE\t2024-08-17 12:03:00
imnull\t2024-08-18\tE
imnull\t2024-08-19\tS\t2024-08-19 20:08:00\t2.1
imnull\t2024-08-20\tS\t2024-08-20 21:43:00\t3.7
Tom\t2024-08-21\tS\t2024-08-21 18:03:00\t0.1
Jerry\t2024-08-22\tS\t2024-08-22 20:08:00\t2.1
`.trim().split(/[\r\n]+/).map(s => s.trim().split(/\t+/))




console.log(renderTable(DEMO, {
    align: (val, i) => {
        if(i == 2) {
            return val === 'E' ? 'right' : 'left'
        } else if(i == 4) {
            return Number(val) < 2 ? 'right' : 'left'
        }
        return 'center'
    },
    head: ['name', 'date', 'status', 'time', 'delay time (hour)'],
    color: (val, i) => {
        if(i == 0) {
            if(val === 'Bob') {
                return 'brightRed'
            } else if(val === 'Tom' || val === 'Jerry') {
                return 'brightYellow'
            } else {
                return 'green'
            }
        } else if(i == 2) {
            return val == 'E' ? 'red' : 'green'
        } else if(i == 4) {
            return Number(val) > 3 ? 'brightGreen' : Number(val) < 2 ? 'yellow' : 'green'
        }
        return 'brightBlack'
    },
    style: (val, i) => {
        if(i == 3) {
            return 'italic'
        } else if(i == 4) {
            return Number(val) > 3 ? ['bold'] : Number(val) < 2 ? ['blink'] : 'none'
        }
        return 'none'
    },
}))