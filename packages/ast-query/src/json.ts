import { createQueryDepends, createQueryDependsMap } from './utils'

const queryRelations = (code: string): string[] => {
    if(!code) {
        return []
    }
    const data: any = JSON.parse(code)
    const { usingComponents = {} } = data
    const depends: string[] = Object.values(usingComponents || {})
    return depends
}

export const queryDepends = createQueryDepends(queryRelations)
export const queryDependsMap = createQueryDependsMap(queryRelations)
