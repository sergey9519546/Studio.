import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { VectorStoreService, VectorDocument } from './vector-store.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class RAGService implements OnModuleInit {
    private readonly logger = new Logger(RAGService.name);
    private isIndexing = false;

    constructor(
        private embeddings: EmbeddingsService,
        private vectorStore: VectorStoreService,
    ) { }

    async onModuleInit() {
        // Index codebase on startup (async, don't block)
        this.indexCodebase().catch(e => {
            this.logger.error(`Codebase indexing failed: ${e.message}`);
        });
    }

    async indexCodebase(): Promise<void> {
        if (this.isIndexing) {
            this.logger.warn('Indexing already in progress');
            return;
        }

        this.isIndexing = true;
        const startTime = Date.now();
        this.logger.log('Starting codebase indexing...');

        try {
            const filesToIndex = await this.scanRepository();
            this.logger.log(`Found ${filesToIndex.length} files to index`);

            // Index files in batches to avoid overwhelming the API
            const batchSize = 5;
            for (let i = 0; i < filesToIndex.length; i += batchSize) {
                const batch = filesToIndex.slice(i, i + batchSize);
                await Promise.all(batch.map(f => this.indexFile(f).catch(e => {
                    this.logger.warn(`Failed to index ${f}: ${e.message}`);
                })));
                this.logger.debug(`Indexed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(filesToIndex.length / batchSize)}`);
            }

            const duration = Date.now() - startTime;
            this.logger.log(`✅ Indexed ${this.vectorStore.getDocumentCount()} chunks in ${duration}ms`);
        } catch (e) {
            this.logger.error(`Indexing error: ${e.message}`);
        } finally {
            this.isIndexing = false;
        }
    }

    private async scanRepository(): Promise<string[]> {
        const rootDir = process.cwd();
        const files: string[] = [];

        const walk = async (dir: string) => {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);

                    // Skip node_modules, build dirs, etc.
                    if (entry.isDirectory()) {
                        if (!['node_modules', 'build', 'dist', '.git', '.next', 'coverage'].includes(entry.name)) {
                            await walk(fullPath);
                        }
                    } else if (entry.isFile()) {
                        const ext = path.extname(entry.name);
                        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (e) {
                this.logger.debug(`Skipping directory ${dir}: ${e.message}`);
            }
        };

        // Index key directories
        const dirsToIndex = [
            path.join(rootDir, 'apps/api/src'),
            path.join(rootDir, 'components'),
            path.join(rootDir, 'services'),
        ];

        for (const dir of dirsToIndex) {
            await walk(dir).catch(() => { });
        }

        return files;
    }

    private async indexFile(filePath: string): Promise<void> {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        // Only index files with meaningful content
        if (lines.length < 10) {
            return;
        }

        const chunks = this.chunkFile(lines, filePath);

        for (const chunk of chunks) {
            const embedding = await this.embeddings.generateEmbedding(chunk.content);
            const doc: VectorDocument = {
                id: `${chunk.filePath}:${chunk.lineStart}-${chunk.lineEnd}`,
                content: chunk.content,
                embedding,
                metadata: {
                    filePath: chunk.filePath,
                    lineStart: chunk.lineStart,
                    lineEnd: chunk.lineEnd,
                    type: this.detectFileType(filePath),
                },
            };
            await this.vectorStore.addDocument(doc);
        }
    }

    private chunkFile(lines: string[], filePath: string): Array<{ content: string; lineStart: number; lineEnd: number; filePath: string }> {
        const chunks: Array<{ content: string; lineStart: number; lineEnd: number; filePath: string }> = [];
        const chunkSize = 50; // lines per chunk
        const overlap = 10; // lines overlap

        for (let i = 0; i < lines.length; i += chunkSize - overlap) {
            const chunkLines = lines.slice(i, i + chunkSize);
            const content = chunkLines.join('\n').trim();

            if (content.length > 100) { // Skip tiny chunks
                chunks.push({
                    content,
                    lineStart: i + 1,
                    lineEnd: Math.min(i + chunkSize, lines.length),
                    filePath: path.relative(process.cwd(), filePath),
                });
            }
        }

        return chunks;
    }

    private detectFileType(filePath: string): VectorDocument['metadata']['type'] {
        const normalized = filePath.toLowerCase();
        if (normalized.includes('component')) return 'component';
        if (normalized.includes('controller')) return 'controller';
        if (normalized.includes('service')) return 'service';
        if (normalized.includes('schema') || normalized.includes('prisma')) return 'schema';
        return 'config';
    }

    async retrieveContext(query: string, topK: number = 5): Promise<string> {
        const queryEmbedding = await this.embeddings.generateEmbedding(query);
        const results = await this.vectorStore.search(queryEmbedding, topK);

        if (results.length === 0) {
            return '// No relevant code context found in the repository.';
        }

        const contextParts = results.map((doc, i) => `
// CONTEXT CHUNK ${i + 1}
// File: ${doc.metadata.filePath} (Lines ${doc.metadata.lineStart}-${doc.metadata.lineEnd})
// Type: ${doc.metadata.type}

\`\`\`typescript
${doc.content}
\`\`\`
`);

        return contextParts.join('\n');
    }

    getIndexStatus(): { indexed: number; isIndexing: boolean } {
        return {
            indexed: this.vectorStore.getDocumentCount(),
            isIndexing: this.isIndexing,
        };
    }
}
