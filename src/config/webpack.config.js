const path = require('path');

module.exports = {
    target: 'electron-renderer',
    // JavaScript 执行入口文件
    entry: path.resolve(__dirname, '..', 'js', 'wp.main.js'),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, '..', 'js'),
    },
    mode: 'development'
};