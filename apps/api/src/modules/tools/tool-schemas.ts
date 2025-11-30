import { Type } from '@google/genai';

export const AI_TOOLS = [
    {
        name: 'scanRepository',
        description: 'Scans the codebase for specific patterns, files, or components. Returns matching file paths and line numbers.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                query: { type: Type.STRING, description: 'Search query (file name, function name, or code pattern)' },
                fileType: { type: Type.STRING, description: 'Optional file extension filter (e.g., "tsx", "ts")' },
                maxResults: { type: Type.INTEGER, description: 'Maximum number of results to return (default: 10)' },
            },
            required: ['query'],
        },
    },
    {
        name: 'runTests',
        description: 'Runs tests for a specific file or module. Returns test results and any failures.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                testPath: { type: Type.STRING, description: 'Path to test file or pattern (e.g., "components/AIChat.test.tsx")' },
                testName: { type: Type.STRING, description: 'Optional specific test name to run' },
            },
            required: ['testPath'],
        },
    },
    {
        name: 'getFileContent',
        description: 'Retrieves the full content of a specific file from the repository.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                filePath: { type: Type.STRING, description: 'Relative path to the file' },
                startLine: { type: Type.INTEGER, description: 'Optional starting line number' },
                endLine: { type: Type.INTEGER, description: 'Optional ending line number' },
            },
            required: ['filePath'],
        },
    },
    {
        name: 'listDirectory',
        description: 'Lists all files and subdirectories in a given directory path.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                directoryPath: { type: Type.STRING, description: 'Relative path to the directory' },
            },
            required: ['directoryPath'],
        },
    },
];
