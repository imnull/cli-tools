#!/usr/bin/env node

import { colors, TColorNames } from '@imnull/cli-color'
import {
    
    queryJsDependsMap,
    queryCssDependsMap,
    queryJsonDependsMap,
    queryWxmlDependsMap,
    traverse,
    TDependItem,
    parseMinipAppAlias,
} from './index'

const COLOR_MAP: Record<string, TColorNames> = {
    'js': 'green',
    'ts': 'brightGreen',
    'wxml': 'blue',
    'wxs': 'brightBlue',
    'json': 'yellow',
    'wxss': 'magenta',
    'scss': 'brightMagenta',
}

const stringify = (item: TDependItem, depth: number) => {
    const checker = colors.use(` [ ${item.exists ? '✔︎' : '✕'} ]`, item.exists ? 'green' : 'red')
    const prefix = colors.use('- '.repeat(depth), 'brightBlack')
    const ext = item.type.substring(1)
    const content = colors.use(item.router, COLOR_MAP[ext] || 'none') + colors.use(` [${ext}]`, COLOR_MAP[ext] || 'none', { bold: true })
    return checker + ' ' + prefix + content
}

const trav = (root: TDependItem) => {
    traverse(root, (item, depth) => {
        console.log(stringify(item, depth))
    })
}

const main = (rootDir: string, router: string) => {
    const alias = parseMinipAppAlias(rootDir)

    const jsRoot = queryJsDependsMap(router, {
        alias,
        extensions: ['.js', '.ts']
    })
    
    const wxmlRoot = queryWxmlDependsMap(router, {
        alias,
        extensions: ['.wxs', '.wxml']
    })
    
    const cssRoot = queryCssDependsMap(router, {
        alias,
        extensions: ['.scss', '.wxss']
    })
    
    const jsonRoot = queryJsonDependsMap(router, {
        alias,
        extensions: ['.json']
    })

    console.log('')
    console.log(colors.brightWhite(`[javascript]`, { bold: true }))
    trav(jsRoot)
    console.log('')
    console.log(colors.brightWhite(`[wxml/wxs]`, { bold: true }))
    trav(wxmlRoot)
    console.log('')
    console.log(colors.brightWhite(`[scss/wxss]`, { bold: true }))
    trav(cssRoot)
    console.log('')
    console.log(colors.brightWhite(`[json]`, { bold: true }))
    trav(jsonRoot)
    console.log('')
}

const CLI_NAME = 'mpchk'

const logHelp = () => {
    console.log('\n', colors.brightBlack(`键入`), colors.brightWhite(`'${CLI_NAME} --help'`), colors.brightBlack(`可获取更多帮助`), '\n')
}

const logDesc = () => {
    console.log('\n', colors.brightYellow(`小程序依赖检查CLI工具`, { bold: true }), colors.brightBlack(` - by marvin <imnull@outlook.com> 2024-09-16`))
    console.log('\n', colors.brightWhite(`使用说明:`))
    console.log(colors.white(`   $ ${CLI_NAME} <project-root> <page-router>`), '\n')
}

const [,,root = '', router = ''] = process.argv



if(!root) {
    console.log('\n', colors.brightRed(`缺少小程序项目目录(project-root)`))
    logHelp()
} else if(root.startsWith('-')) {
    const cmd = root.replace(/^-+/, '')
    switch(cmd) {
        case 'h':
        case 'help': {
            logDesc()
            break
        }
    }
} else if(!router) {
    console.log('\n',colors.brightRed(`缺少小程序页面路由(page-router)`))
    logHelp()
} else {
    try {
        main(root, router)
    } catch(err) {
        console.log(colors.brightRed(`意外错误:\n${err}`))
    }
}
