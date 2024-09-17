import fs from 'fs'
import path from 'path'

export const resolveRouter = (router: string, options: TQueryOptions) => {
    const { alias = {}, extensions = [] } = options
    return resolveExtension(resolveAlias(router, alias), extensions)
}

const useAlias = (router: string, map: Record<string, string>) => {
    return Object.keys(map).some(a => router.startsWith(a))
}

export const resolveAlias = (router: string, map: Record<string, string>) => {
    const alias = Object.keys(map).find(a => router.startsWith(a))
    if(alias) {
        router = path.join(map[alias], router.substring(alias.length))
    }
    return router
}

const resolveIndex = (router: string) => {
    if(fs.existsSync(router) && fs.statSync(router).isDirectory()) {
        router = path.join(router, 'index')
    }
    return router
}

export const resolveDependRouter = (sourceFile: string, router: string, options: TQueryOptions) => {
    const { alias = {}, extensions = [] } = options
    if(useAlias(router, alias)) {
        return resolveRouter(router, options)
    } else {
        return resolveExtension(path.resolve(sourceFile, router), extensions)
    }
}

const resolveExtension = (file: string, exts: string[]) => {
    file = resolveIndex(file)
    if(!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        const ext = exts.find(x => fs.existsSync(`${file}${x}`))
        if(ext) {
            return `${file}${ext}`
        }
    }
    return file
}

export type TQueryOptions = {
    alias?: Record<string, string>,
    extensions?: string[]
}

export const cleanUpSurroundPath = (p: string): string => {
    p = p.replace(/^\s+|\s+$/g, '')
    const h = p.charAt(0) || '', t = p.charAt(p.length - 1) || ''
    if ((h === '"' && t === '"') || (h === "'" && t === "'")) {
        return p.substring(1, p.length - 1)
    } else if (h === '(' && t === ')') {
        return cleanUpSurroundPath(p.substring(1, p.length - 1))
    } else {
        return p
    }
}

const readCode = (file: string) => {
    if(fs.existsSync(file) && fs.statSync(file).isFile()) {
        return fs.readFileSync(file, 'utf-8')
    }
    return ''
}

export const createQueryDepends = (queryRelations: (code: string, file: string) => string[]) => {
    const qd = (file: string, options: TQueryOptions, result: string[]) => {
        if (result.includes(file)) {
            return
        }
        result.push(file)
        const code = readCode(file)
        const depends = queryRelations(code, file)
        const sourcePath = path.dirname(file)
        depends.forEach(relPath => {
            const fullpath = resolveDependRouter(sourcePath, relPath, options)
            qd(fullpath, options, result)
        })
    }

    return (router: string, options: TQueryOptions = {}) => {
        const files: string[] = []
        const file = resolveRouter(router, options)
        qd(file, options, files)
        return files
    }
}

export type TDependItem = {
    file: string;
    exists: boolean;
    router: string;
    type: string;
    depends: TDependItem[];
    getParent: () => TDependItem | null
}

const parseDependItem = (file: string, root: string, getParent: { (): TDependItem } | null = null): TDependItem => {
    let routerFile = path.relative(root, file)
    const type = path.extname(file)
    const router = routerFile.substring(0, routerFile.length - type.length)
    const exists = fs.existsSync(file) && fs.statSync(file).isFile()
    return {
        file,
        exists,
        router,
        type,
        depends: [],
        getParent: getParent ? getParent : () => null,
    }
}

export const createQueryDependsMap = (queryRelations: (code: string, file: string) => string[]) => {
    const qd = (file: string, options: TQueryOptions, result: string[], parent: TDependItem) => {
        if (result.includes(file)) {
            return
        }
        result.push(file)
        const { alias: { ['/']: root = '' } = {} } = options
        const getParent = () => parent
        const item = parseDependItem(file, root, getParent)
        parent.depends.push(item)
        const code = readCode(file)
        const depends = queryRelations(code, file)
        const sourcePath = path.dirname(file)
        depends.forEach(relPath => {
            const fullpath = resolveDependRouter(sourcePath, relPath, options)
            qd(fullpath, options, result, item)
        })
    }

    return (router: string, options: TQueryOptions = {}) => {
        const files: string[] = []
        const file = resolveRouter(router, options)
        const { alias: { ['/']: root = '' } = {} } = options
        const current: TDependItem = {
            file: root,
            exists: false,
            router: '/',
            type: 'root',
            depends: [],
            getParent: () => null,
        }
        qd(file, options, files, current)
        return current
    }
}

/**
 * 节点位置状态：
 * - 0: 所在队列元素数多于1个，且本身位于第一；
 * - 1: 所在队列元素数多于1个，且本身不是第一也不是最后；
 * - 2: 所在队列元素数多于1个，且本身位于最后；
 * - 3: 所在队列元素只有1个
 */
type TDependItemTraverseCallbackStatus = 0 | 1 | 2 | 3
type TDependItemTraverseCallback = (item: TDependItem, depth: number, status: TDependItemTraverseCallbackStatus) => void

const calTraverseStatus = (idx: number, len: number): TDependItemTraverseCallbackStatus => {
    if(len <= 1) {
        return 3
    } else {
        return idx >= len - 1 ? 2 : idx === 0 ? 0 : 1
    }
}

const _traverse = (item: TDependItem, callback: TDependItemTraverseCallback, depth: number, status: TDependItemTraverseCallbackStatus) => {
    callback(item, depth, status)
    if(Array.isArray(item.depends) && item.depends.length > 0) {
        const len = item.depends.length
        item.depends.forEach((it, idx) => {
            _traverse(it, callback, depth + 1, calTraverseStatus(idx, len))
        })
    }
}

export const traverse = (item: TDependItem, callback: TDependItemTraverseCallback) => {
    if(item.type === 'root') {
        if(Array.isArray(item.depends) && item.depends.length > 0) {
            const len = item.depends.length
            item.depends.forEach((it, idx) => {
                _traverse(it, callback, 0, calTraverseStatus(idx, len))
            })
        }
    } else {
        _traverse(item, callback, 0, 3)
    }
}

type TMinipProjectConfig = {
    appid: string;
    miniprogramRoot?: string;
}

export const getMinipProjectConfig = (rootDir: string): TMinipProjectConfig => {
    const dir = path.resolve(process.cwd(), rootDir)
    if(!fs.existsSync(dir)) {
        throw new Error(`[getMinipProjectConfig] dir '${dir}' is not exists.`)
    }
    if(!fs.statSync(dir).isDirectory()) {
        throw new Error(`[getMinipProjectConfig] dir '${dir}' is not a directory.`)
    }
    const projPath = path.join(dir, 'project.config.json')
    if(!fs.existsSync(projPath) || !fs.statSync(projPath).isFile()) {
        throw new Error(`[getMinipProjectConfig] config file '${projPath}' is not exists.`)
    }

    const code = fs.readFileSync(projPath, 'utf-8')
    try {
        const conf = JSON.parse(code)
        return conf
    } catch(err) {
        throw new Error(`[getMinipProjectConfig] parse config file failed:\n${err}`)
    }
}

type TMinipApp = {
    pages: string[];
    subPackages?: {
        root: string;
        pages: string[];
    }[];
    resolveAlias?: Record<string, string>;
}

export const getMinipAppConfig = (rootDir: string): { root: string; app: TMinipApp } => {
    const { miniprogramRoot = '' } = getMinipProjectConfig(rootDir)
    const dir = path.resolve(process.cwd(), rootDir)
    const root = path.resolve(dir, miniprogramRoot)
    const appFile = path.join(root, 'app.json')
    if(!fs.existsSync(appFile) || !fs.statSync(appFile).isFile()) {
        throw new Error(`[getMinipApp] app.json '${appFile}' is not exists.`)
    }
    const code = fs.readFileSync(appFile, 'utf-8')
    try {
        const app = JSON.parse(code)
        return { root, app }
    } catch(err) {
        throw new Error(`[getMinipApp] parse app.json failed:\n${err}`)
    }
}

export const parseMinipAppAlias = (rootDir: string) => {
    const dir = path.resolve(process.cwd(), rootDir)
    const appConfig = getMinipAppConfig(rootDir)
    const { root, app: { resolveAlias = {} } } = appConfig
    const alias: Record<string, string> = { '/': root }
    Object.entries(resolveAlias).forEach(([key, val]) => {
        alias[key.replace(/\*+$/, '')] = path.join(root, val.replace(/\*+$/, '').replace(/^\//, ''))
    })
    return alias
}