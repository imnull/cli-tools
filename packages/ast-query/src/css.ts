import { cleanUpSurroundPath, createQueryDepends } from './utils'

const queryRelations = (code: string): string[] => {
    const depends: string[] = []
    code.replace(/\@import\s*("[^"]+"|'[^']+'|\([^\(\)]+\))/g, (_m, g1) => {
        depends.push(cleanUpSurroundPath(g1))
        return _m
    })
    return depends
}

export const queryDepends = createQueryDepends(queryRelations)