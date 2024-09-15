import { createQueryDepends } from './utils'

const queryRelations = (code: string): string[] => {
    const data: any = JSON.parse(code)
    const { usingComponents = {} } = data
    const depends: string[] = Object.values(usingComponents || {})
    return depends
}

export const queryDepends = createQueryDepends(queryRelations)
