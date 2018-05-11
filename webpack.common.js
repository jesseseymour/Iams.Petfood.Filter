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
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: "file-loader?name=Content/images/[name].[ext]"
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