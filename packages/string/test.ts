import { repeat, padCenter, padEnd, padStart } from './src'

const len = 19

console.log(repeat('-', len))
console.log(padCenter('|', len, '-'))
console.log(padEnd('|', len, '-'))
console.log(padStart('|', len, '-'))