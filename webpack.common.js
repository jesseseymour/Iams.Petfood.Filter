module.exports = {
    entry: ["core-js/fn/promise", "core-js/fn/array/includes", "core-js/fn/array/from", "core-js/fn/set", "./src/index.js"],
    output: {
        path: "dist",
        filename: "productfilter.min.js",
        publicPath: "/"
    }
}