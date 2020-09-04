const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    target: 'electron-renderer',
    node: {
        __dirname: false,
    },
    // JavaScript 执行入口文件
    entry: path.resolve(__dirname, '..', 'js', 'wp.main.js'),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, '..', 'js'),
    },
    mode: 'development',
    resolve: {
        alias: {
            'vue$': path.resolve(__dirname, '..', '..', 'node_modules', 'vue/dist/vue.common.js'),
            'component': '../component'
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^7.0.0
                        options: {
                            implementation: require('sass'),
                            fiber: require('fibers'),
                            indentedSyntax: true // optional
                        },
                        // Requires sass-loader@^8.0.0
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true // optional
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '../img/[name].[ext]',
                        // 解决css文件引用和浏览器引用的相对问题
                        publicPath: 'src',
                        emitFile: false
                    }
                }
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ]
    },
    plugins: [
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ]
};