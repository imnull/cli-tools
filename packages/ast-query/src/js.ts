import { parseSync, traverse, types } from '@babel/core'
import { createQueryDepends, createQueryDependsMap } from './utils'

const readFileAst = (code: string, filename: string): types.File => {
    const ast = parseSync(code, {
        filename,
        presets: [
            '@babel/preset-typescript'
        ]
    })
    if (!ast) {
        throw new Error(`Unknown error: AST is null`)
    }
    return ast
}

const queryRelations = (code: string, file: string) => {
    const depends: string[] = []
    const ast = readFileAst(code, file)
    traverse(ast, {
        ImportDeclaration(path) {
            const { node } = path
            depends.push(node.source.value)
        },
        CallExpression(path) {
            const { node } = path
            if (types.isIdentifier(node.callee)
                && ['require', 'import'].includes(node.callee.name)
                && node.arguments.length > 0
                && types.isStringLiteral(node.arguments[0])
            ) {
                depends.push(node.arguments[0].value)
            }
        }
    })
    return depends
}

export const queryDepends = createQueryDepends(queryRelations)
export const queryDependsMap = createQueryDependsMap(queryRelations)