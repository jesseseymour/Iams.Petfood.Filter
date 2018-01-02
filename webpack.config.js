var webpack = require('webpack') 

module.exports = {
    entry: ["./src/index.js"],
    output: {
        path: "dist/assets",
        filename: "bundle.min.js",
        publicPath: "/assets/"
    },
    //devtool: 'cheap-module-source-map',
    //debug: true,
    devServer: {
        inline: true,
        contentBase: './dist',
        historyApiFallback: true,
        port: 3000,
        hot: true,
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production") //comment out if running dev server
            }
        })
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