import { cleanUpSurroundPath, createQueryDepends } from './utils'

const queryRelations = (code: string): string[] => {
    const depends: string[] = []
    code.replace(/<(import|include|wxs)[\s\S]+?src=("[^"\{\}\s]+"|'[^'\{\}\s]+')/g, (m, _g1, g2) => {
        depends.push(cleanUpSurroundPath(g2))
        return m
    })
    return depends
}

export const queryDepends = createQueryDepends(queryRelations)