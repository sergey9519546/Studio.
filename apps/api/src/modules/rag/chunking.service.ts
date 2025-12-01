import { Injectable, Logger } from '@nestjs/common';

interface DocumentChunk {
    content: string;
    metadata: {
        source?: string;
        chunkIndex: number;
        totalChunks: number;
        startChar: number;
        endChar: number;
    };
}

@Injectable()
export class ChunkingService {
    private readonly logger = new Logger(ChunkingService.name);

    /**
     * Split text into chunks with overlap
     */
    chunkText(
        text: string,
        options: {
            chunkSize?: number;
            overlap?: number;
            source?: string;
        } = {}
    ): DocumentChunk[] {
        const {
            chunkSize = 1000,
            overlap = 200,
            source,
        } = options;

        if (chunkSize <= overlap) {
            throw new Error('Chunk size must be greater than overlap');
        }

        const chunks: DocumentChunk[] = [];
        let startChar = 0;
        let chunkIndex = 0;

        while (startChar < text.length) {
            const endChar = Math.min(startChar + chunkSize, text.length);
            let chunkText = text.substring(startChar, endChar);

            // Try to break at sentence boundary if not at the end
            if (endChar < text.length) {
                const lastPeriod = chunkText.lastIndexOf('.');
                const lastNewline = chunkText.lastIndexOf('\n');
                const breakPoint = Math.max(lastPeriod, lastNewline);

                if (breakPoint > chunkSize / 2) {
                    // Found a good break point
                    chunkText = text.substring(startChar, startChar + breakPoint + 1);
                }
            }

            chunks.push({
                content: chunkText.trim(),
                metadata: {
                    source,
                    chunkIndex,
                    totalChunks: 0, // Will update after loop
                    startChar,
                    endChar: startChar + chunkText.length,
                },
            });

            // Move forward by (chunkSize - overlap)
            startChar += Math.max(chunkText.length - overlap, 1);
            chunkIndex++;
        }

        // Update total chunks
        chunks.forEach(chunk => {
            chunk.metadata.totalChunks = chunks.length;
        });

        this.logger.debug(`Chunked text into ${chunks.length} chunks`);
        return chunks;
    }

    /**
     * Smart chunking that preserves paragraphs
     */
    chunkByParagraphs(
        text: string,
        options: {
            maxChunkSize?: number;
            source?: string;
        } = {}
    ): DocumentChunk[] {
        const { maxChunkSize = 1000, source } = options;

        const paragraphs = text.split(/\n\n+/);
        const chunks: DocumentChunk[] = [];
        let currentChunk = '';
        let startChar = 0;
        let chunkIndex = 0;

        for (const paragraph of paragraphs) {
            const paragraphTrimmed = paragraph.trim();
            if (!paragraphTrimmed) continue;

            if (currentChunk.length + paragraphTrimmed.length > maxChunkSize && currentChunk.length > 0) {
                // Save current chunk
                chunks.push({
                    content: currentChunk.trim(),
                    metadata: {
                        source,
                        chunkIndex,
                        totalChunks: 0,
                        startChar,
                        endChar: startChar + currentChunk.length,
                    },
                });

                chunkIndex++;
                startChar += currentChunk.length;
                currentChunk = '';
            }

            currentChunk += (currentChunk ? '\n\n' : '') + paragraphTrimmed;
        }

        // Add remaining chunk
        if (currentChunk.trim()) {
            chunks.push({
                content: currentChunk.trim(),
                metadata: {
                    source,
                    chunkIndex,
                    totalChunks: 0,
                    startChar,
                    endChar: startChar + currentChunk.length,
                },
            });
        }

        // Update total chunks
        chunks.forEach(chunk => {
            chunk.metadata.totalChunks = chunks.length;
        });

        this.logger.debug(`Created ${chunks.length} paragraph-aware chunks`);
        return chunks;
    }

    /**
     * Chunk with semantic boundaries (sentences)
     */
    chunkBySentences(
        text: string,
        options: {
            maxChunkSize?: number;
            minChunkSize?: number;
            source?: string;
        } = {}
    ): DocumentChunk[] {
        const { maxChunkSize = 1000, minChunkSize = 200, source } = options;

        // Simple sentence splitter (can be enhanced with NLP library)
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks: DocumentChunk[] = [];
        let currentChunk = '';
        let startChar = 0;
        let chunkIndex = 0;

        for (const sentence of sentences) {
            const sentenceTrimmed = sentence.trim();
            if (!sentenceTrimmed) continue;

            if (currentChunk.length + sentenceTrimmed.length > maxChunkSize && currentChunk.length >= minChunkSize) {
                // Save current chunk
                chunks.push({
                    content: currentChunk.trim(),
                    metadata: {
                        source,
                        chunkIndex,
                        totalChunks: 0,
                        startChar,
                        endChar: startChar + currentChunk.length,
                    },
                });

                chunkIndex++;
                startChar += currentChunk.length;
                currentChunk = '';
            }

            currentChunk += ' ' + sentenceTrimmed;
        }

        // Add remaining chunk
        if (currentChunk.trim()) {
            chunks.push({
                content: currentChunk.trim(),
                metadata: {
                    source,
                    chunkIndex,
                    totalChunks: 0,
                    startChar,
                    endChar: startChar + currentChunk.length,
                },
            });
        }

        // Update total chunks
        chunks.forEach(chunk => {
            chunk.metadata.totalChunks = chunks.length;
        });

        this.logger.debug(`Created ${chunks.length} sentence-aware chunks`);
        return chunks;
    }
}

export { DocumentChunk };
