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
    moduleNameMapper: {
        '^(\\.\\.?\\/.+)\\.js$': '$1',
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
