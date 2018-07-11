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
        port: 3002,
        hot: true,
        hotOnly: true,
        proxy: [{
            context: ["/api", "/Content", "/Sitefinity", "/images"],
            target: "http://localhost:51879",
            secure: false,
            changeOrigin: true
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: ['babel'],
                query: {
                    presets: ['latest', 'stage-0', 'react', 'react-hmre']
                }
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                loader: 'json-loader'
            }
        ]
    }
});
