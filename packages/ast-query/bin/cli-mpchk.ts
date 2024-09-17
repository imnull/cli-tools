#!/usr/bin/env node

import { colors, TColorNames } from '@imnull/cli-color'
import { TermFlasher } from '@imnull/term-flash'
import {
    
    queryJsDependsMap,
    queryCssDependsMap,
    queryJsonDependsMap,
    queryWxmlDependsMap,
    traverse,
    TDependItem,
    parseMinipAppAlias,
} from '../'

const COLOR_MAP: Record<string, TColorNames> = {
    'js': 'green',
    'ts': 'brightGreen',
    'wxml': 'blue',
    'wxs': 'brightBlue',
    'json': 'yellow',
    'wxss': 'magenta',
    'scss': 'brightMagenta',
}

const stringify = (item: TDependItem, depth: number, useFilename: boolean = false) => {
    const checker = colors.use(` [ ${item.exists ? '✔︎' : '✕'} ]`, item.exists ? 'green' : 'red')
    const prefix = colors.use('- '.repeat(depth), 'brightBlack')
    const ext = item.type.substring(1)
    const content = colors.use(useFilename ? item.file : item.router, COLOR_MAP[ext] || 'none') + (ext ? colors.use(` [${ext}]`, COLOR_MAP[ext] || 'none', { bold: true }) : '')
    return checker + ' ' + prefix + content
}

type TTravOptions = {
    errorOnly?: boolean
}
const trav = (root: TDependItem, options: TTravOptions) => {
    const {
        errorOnly = true
    } = options
    if(errorOnly) {
        const flash = new TermFlasher()
        const errors: TDependItem[] = []
        traverse(root, (item, depth) => {
            if(!item.exists) {
                errors.push(item)
            }
            flash.log(stringify(item, 0))
        })
        flash.reset()
        if(errors.length < 1) {
            console.log('\n', colors.use('OK', 'green', { bold: true }))
        } else {
            console.log('')
            errors.forEach(item => {
                let it: TDependItem | null = item
                const queue: TDependItem[] = []
                while(it && it.type !== 'root') {
                    queue.unshift(it)
                    it = it.getParent()
                }
                queue.forEach((it, idx) => {
                    console.log(stringify(it, idx, true))
                })
            })
        }
    } else {
        console.log('')
        traverse(root, (item, depth) => {
            console.log(stringify(item, depth))
        })
    }
}

const main = (rootDir: string, router: string, options: TTravOptions) => {
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
    trav(jsRoot, options)
    console.log('')
    console.log(colors.brightWhite(`[wxml/wxs]`, { bold: true }))
    trav(wxmlRoot, options)
    console.log('')
    console.log(colors.brightWhite(`[scss/wxss]`, { bold: true }))
    trav(cssRoot, options)
    console.log('')
    console.log(colors.brightWhite(`[json]`, { bold: true }))
    trav(jsonRoot, options)
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

const parseBoolean = (val: string | undefined) => {
    if(typeof val === 'string') {
        return val.toLowerCase() === 'true'
    } else {
        return true
    }
}

const parseOptions = (params: string[]) => {
    const opt: TTravOptions = {}
    params.forEach(param => {
        if(/^\-{2}[a-z]/i.test(param)) {
            const [key, val] = param.substring(2).split(/[\=\s]+/)
            switch(key) {
                case 'errorOnly': {
                    opt.errorOnly = parseBoolean(val)
                    break
                }
            }
            
        }
    })
    return opt
}

const [,,root = '', router = '', ...params] = process.argv



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
        main(root, router, parseOptions(params))
    } catch(err) {
        console.log(colors.brightRed(`意外错误:\n${err}`))
    }
}
