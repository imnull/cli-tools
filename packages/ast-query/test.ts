import path from 'path'
import { queryJsDepends, queryJsDependsMap, queryCssDepends, queryJsonDepends, queryWxmlDepends } from './src'

const homedir = path.resolve(__dirname, 'demo/miniprogram')

const alias = {
    '/': homedir,
    '~/': homedir,
    '@utils/': path.join(homedir, `utils`),
}

console.log(queryJsDepends(`/pages/logs/logs`, {
    alias,
    extensions: ['.js', '.ts']
}))

console.log(queryCssDepends(`/pages/index/index`, {
    alias,
    extensions: ['.scss', '.wxss', '.css']
}))

console.log(queryJsonDepends(`/pages/index`, {
    alias,
    extensions: ['.json']
}))

console.log(queryWxmlDepends(`/pages/index`, {
    alias,
    extensions: ['.wxs', '.wxml']
}))

console.log(queryJsDependsMap(`/pages/logs/logs`, {
    alias,
    extensions: ['.js', '.ts']
}))