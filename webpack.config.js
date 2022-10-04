const path = require('path');

module.exports = {
    entry: './dist/webpack.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'waitlyst.js',
        library: "Waitlyst",   // Important
        libraryTarget: 'umd',   // Important
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_module/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    mode: 'production'
};
