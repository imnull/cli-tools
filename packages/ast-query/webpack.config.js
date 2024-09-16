const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = () => {
    return {
        mode: 'production',
        entry: {
            'index': path.resolve(__dirname, './src/index.ts'),
            // 'cli-mpchk': path.resolve(__dirname, './src/cli-mpchk.ts'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            // library: {
            //     name: 'MyLibrary', // 输出库的名称
            //     type: 'commonjs2' // 输出格式为 CommonJS
            // },
            libraryTarget: 'commonjs2' // 设置 CommonJS 模块输出
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        "useBuiltIns": "entry",
                                        "corejs": "3",
                                    },

                                ],
                                '@babel/preset-typescript',
                            ],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.ts'],
        },
        target: 'node',
        plugins: [
            new CleanWebpackPlugin(),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    minify: TerserPlugin.uglifyJsMinify,
                }),
            ],
        }
    }
}