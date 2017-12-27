var webpack = require('webpack') 

module.exports = {
    entry: ["./src/index.js"],
    output: {
        path: "dist/assets",
        filename: "bundle.min.js",
        publicPath: "/assets/"
    },
    devtool: 'source-map',
    debug: true,
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000,
        hot: true,
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
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
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
            }
        ]
    }
}