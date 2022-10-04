module.exports = {
    plugins: [
        ["@babel/plugin-transform-modules-umd", {
            exactGlobals: true,
            globals: {
                index: 'Waitlyst'
            }
        }]
    ],
    presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
],
}
;
