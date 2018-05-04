var webpack = require('webpack') 

module.exports = {
    entry: ["core-js/fn/promise", "core-js/fn/array/includes", "./src/index.js"],
    output: {
        path: "dist/assets",
        filename: "productfilter.min.js",
        publicPath: "/assets/"
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
}