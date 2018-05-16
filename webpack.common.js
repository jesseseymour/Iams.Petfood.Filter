var webpack = require('webpack') 

module.exports = {
    entry: ["core-js/fn/promise", "core-js/fn/array/includes", "core-js/fn/array/from", "core-js/fn/set", "./src/index.js"],
    output: {
        path: "dist",
        filename: "productfilter.min.js",
        publicPath: "/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
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
}