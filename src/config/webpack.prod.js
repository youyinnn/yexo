const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '../font/[name].[ext]',
                    // 解决css文件引用和浏览器引用的相对问题
                    publicPath: 'src'
                }
            }
        }]
    }
})