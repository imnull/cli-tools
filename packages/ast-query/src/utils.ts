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
        let newPath = path.join(map[alias], router.substring(alias.length))
        if(fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
            newPath = path.join(newPath, 'index')
        }
        return newPath
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

type TDependItem = {
    file: string;
    router: string;
    type: string;
    depends: TDependItem[]
}

const parseDependItem = (file: string, root: string): TDependItem => {
    let routerFile = path.relative(root, file)
    const type = path.extname(file)
    const router = routerFile.substring(0, routerFile.length - type.length)
    return {
        file,
        router,
        type,
        depends: []
    }
}

export const createQueryDependsMap = (queryRelations: (code: string, file: string) => string[]) => {
    const qd = (file: string, options: TQueryOptions, result: string[], parent: TDependItem) => {
        if (result.includes(file)) {
            return
        }
        result.push(file)
        const { alias: { ['/']: root = '' } = {} } = options
        const item = parseDependItem(file, root)
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
        const current = {
            file: root,
            router: '/',
            type: '',
            depends: []
        }
        qd(file, options, files, current)
        return current
    }
}