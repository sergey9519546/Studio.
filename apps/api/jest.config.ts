export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/*.spec.ts',
        '!main.ts',
    ],
    coverageDirectory: '../coverage',
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};
