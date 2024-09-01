import { TermFlasher, TCursorStyle } from './src'

const progress = (percent: number, len = 18, char = '#', blank = '-') => {
    const left = percent * len >> 0, right = len - left
    return `[${char.repeat(left)}${blank.repeat(right)}]`
}

const term = new TermFlasher()

const MAX = 100
const CURSOR: TCursorStyle[] = ['verticalBar', 'underline', 'block']
let c = 0
const h = setInterval(() => {
    if(++c > MAX) {
        clearInterval(h)
        term.reset()
        console.log(`${progress(1)} 100% `)
        console.log('Done')
    } else {
        term.log(`${progress(c / MAX)} ${c.toString().padStart(3, ' ')}% `, CURSOR[c % 3])
    }
}, 100)