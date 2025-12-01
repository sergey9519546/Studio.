// Type definitions for tool schemas
// Using string constants instead of @google/genai Type enum

export const AI_TOOLS = [
    {
        name: 'scanRepository',
        description: 'Scans the codebase for specific patterns, files, or components. Returns matching file paths and line numbers.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query (file name, function name, or code pattern)' },
                fileType: { type: 'string', description: 'Optional file extension filter (e.g., "tsx", "ts")' },
                maxResults: { type: 'integer', description: 'Maximum number of results to return (default: 10)' },
            },
            required: ['query'],
        },
    },
    {
        name: 'runTests',
        description: 'Runs tests for a specific file or module. Returns test results and any failures.',
        parameters: {
            type: 'object',
            properties: {
                testPath: { type: 'string', description: 'Path to test file or pattern (e.g., "components/AIChat.test.tsx")' },
                testName: { type: 'string', description: 'Optional specific test name to run' },
            },
            required: ['testPath'],
        },
    },
    {
        name: 'getFileContent',
        description: 'Retrieves the full content of a specific file from the repository.',
        parameters: {
            type: 'object',
            properties: {
                filePath: { type: 'string', description: 'Relative path to the file' },
                startLine: { type: 'integer', description: 'Optional starting line number' },
                endLine: { type: 'integer', description: 'Optional ending line number' },
            },
            required: ['filePath'],
        },
    },
    {
        name: 'listDirectory',
        description: 'Lists all files and subdirectories in a given directory path.',
        parameters: {
            type: 'object',
            properties: {
                directoryPath: { type: 'string', description: 'Relative path to the directory' },
            },
            required: ['directoryPath'],
        },
    },
];
