import { Colors, BackgroundColors, Styles, parseStyle, TStyleNames, TColorNames, TBackgroundColorNames, colors } from './src'

console.log(``)
console.log(`------>>>> Text Color:`)
Object.keys(Colors).forEach(name => {
    console.log(colors.use(name, name as TColorNames))
})

console.log(``)
console.log(`------>>>> Background Color:`)
Object.keys(BackgroundColors).forEach(name => {
    console.log(name + ':', colors.use(name, 'none', { background: name as TBackgroundColorNames }))
})

console.log(``)
console.log(`------>>>> Styles:`)
Object.keys(Styles).forEach(name => {
    console.log(name + ':', colors.use(name, 'none', parseStyle(name as TStyleNames)))
})