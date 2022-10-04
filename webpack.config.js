const path = require('path');
const config = require("./waitlyst.json");


module.exports = (env) => {
    return {
        entry: './dist/webpack.js',
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'waitlyst.js',
            library: "Waitlyst",   // Important
            libraryTarget: 'umd',   // Important
            globalObject: 'this',
        },
        module: {
            rules: [{
                    test: /\.ts$/,
                    exclude: /node_module/,
                    use: 'ts-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.json']
        },
        mode: 'production'
    }
};
