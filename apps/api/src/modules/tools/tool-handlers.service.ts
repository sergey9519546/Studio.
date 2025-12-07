import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

interface ScanRepositoryResult {
    matches: string[];
    count: number;
    error?: string;
}

interface RunTestsResult {
    success: boolean;
    output: string;
    errors: string;
}

interface GetFileContentResult {
    content?: string;
    totalLines?: number;
    filePath?: string;
    error?: string;
}

interface ListDirectoryResult {
    path?: string;
    files?: string[];
    directories?: string[];
    totalCount?: number;
    error?: string;
}

@Injectable()
export class ToolHandlersService {
    private readonly logger = new Logger(ToolHandlersService.name);

    async scanRepository(args: { query: string; fileType?: string; maxResults?: number }): Promise<ScanRepositoryResult> {
        const { query, fileType = '*', maxResults = 10 } = args;
        const rootDir = process.cwd();

        try {
            // Use basic filesystem search as fallback if ripgrep not available
            const files: string[] = [];
            await this.searchFiles(rootDir, query, fileType, files, maxResults);

            return {
                matches: files.slice(0, maxResults),
                count: files.length,
            };
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown scan error';
            this.logger.error(`Scan error: ${message}`);
            return { matches: [], count: 0, error: message };
        }
    }

    private async searchFiles(dir: string, query: string, fileType: string, results: string[], maxResults: number): Promise<void> {
        if (results.length >= maxResults) return;

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (results.length >= maxResults) break;

                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    if (!['node_modules', 'build', 'dist', '.git'].includes(entry.name)) {
                        await this.searchFiles(fullPath, query, fileType, results, maxResults);
                    }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).slice(1);
                    const matchesType = fileType === '*' || ext === fileType || entry.name.includes(fileType);
                    const matchesQuery = entry.name.toLowerCase().includes(query.toLowerCase()) ||
                        fullPath.toLowerCase().includes(query.toLowerCase());

                    if (matchesType && matchesQuery) {
                        results.push(path.relative(process.cwd(), fullPath));
                    }
                }
            }
        } catch {
            // Skip directories we can't read
        }
    }

    async runTests(args: { testPath: string; testName?: string }): Promise<RunTestsResult> {
        const { testPath, testName } = args;

        try {
            const cmd = testName
                ? `npm test -- ${testPath} -t "${testName}"`
                : `npm test -- ${testPath}`;

            const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd(), timeout: 30000 });

            return {
                success: true,
                output: stdout,
                errors: stderr,
            };
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown test execution error';
            return {
                success: false,
                output: '',
                errors: message,
            };
        }
    }

    async getFileContent(args: { filePath: string; startLine?: number; endLine?: number }): Promise<GetFileContentResult> {
        const { filePath, startLine, endLine } = args;
        const fullPath = path.join(process.cwd(), filePath);

        try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split('\n');

            if (startLine !== undefined && endLine !== undefined) {
                return {
                    content: lines.slice(startLine - 1, endLine).join('\n'),
                    totalLines: lines.length,
                    filePath,
                };
            }

            return {
                content,
                totalLines: lines.length,
                filePath,
            };
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown file read error';
            return {
                error: `Failed to read file: ${message}`,
            };
        }
    }

    async listDirectory(args: { directoryPath: string }): Promise<ListDirectoryResult> {
        const { directoryPath } = args;
        const fullPath = path.join(process.cwd(), directoryPath);

        try {
            const entries = await fs.readdir(fullPath, { withFileTypes: true });

            const files = entries
                .filter(e => e.isFile())
                .map(e => e.name);

            const directories = entries
                .filter(e => e.isDirectory())
                .map(e => e.name);

            return {
                path: directoryPath,
                files,
                directories,
                totalCount: entries.length,
            };
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown directory listing error';
            return {
                error: `Failed to list directory: ${message}`,
            };
        }
    }
}

