// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    // All imported modules in your tests should be mocked automatically
    collectCoverage: true,
    coverageDirectory: `coverage`,
    coverageReporters: [`json`, `text-summary`, `lcov`],
    timers: `fake`,

    verbose: true,
    setupFiles: [
        "./__mocks__/client.ts"
    ],
};

module.exports = config;
