const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    debug: true,
    devServer: {
        inline: true,
        contentBase: './dist',
        historyApiFallback: true,
        port: 3000,
        hot: true,
        hotOnly: true,
        proxy: {
            "/api/**": {
                target: "http://localhost:49586",
                secure: false,
                logLevel: 'debug',
                changeOrigin: true
            },
            "/images/**": {
                target: "http://localhost:49586",
                secure: false,
                logLevel: 'error',
                changeOrigin: true
            }
        }
    }
});
