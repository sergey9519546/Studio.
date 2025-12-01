import { Injectable, Logger } from '@nestjs/common';
import { VertexAIEmbeddingsService } from '../ai/vertex-ai-embeddings.service';

interface CachedEmbedding {
    text: string;
    embedding: number[];
    timestamp: number;
}

@Injectable()
export class EmbeddingsService {
    private readonly logger = new Logger(EmbeddingsService.name);
    private cache: Map<string, CachedEmbedding> = new Map();
    private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour
    private readonly MAX_CACHE_SIZE = 1000;

    constructor(private vertexEmbeddings: VertexAIEmbeddingsService) { }

    /**
     * Generate embedding with caching
     */
    async generateEmbedding(text: string): Promise<number[]> {
        // Check cache first
        const cached = this.cache.get(text);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            this.logger.debug('Using cached embedding');
            return cached.embedding;
        }

        try {
            const embedding = await this.vertexEmbeddings.generateEmbedding(text);

            // Cache the result
            this.cacheEmbedding(text, embedding);

            return embedding;
        } catch (error) {
            this.logger.error('Failed to generate embedding', error);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts
     */
    async generateBatch(texts: string[]): Promise<number[][]> {
        // Check which texts are already cached
        const uncachedTexts: string[] = [];
        const cachedResults: Map<number, number[]> = new Map();

        texts.forEach((text, index) => {
            const cached = this.cache.get(text);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                cachedResults.set(index, cached.embedding);
            } else {
                uncachedTexts.push(text);
            }
        });

        this.logger.debug(`Cache hit: ${cachedResults.size}/${texts.length}, generating ${uncachedTexts.length} new embeddings`);

        // Generate embeddings for uncached texts
        let newEmbeddings: number[][] = [];
        if (uncachedTexts.length > 0) {
            newEmbeddings = await this.vertexEmbeddings.generateBatchEmbeddings(uncachedTexts);

            // Cache new embeddings
            uncachedTexts.forEach((text, i) => {
                this.cacheEmbedding(text, newEmbeddings[i]);
            });
        }

        // Merge cached and new embeddings in correct order
        const results: number[][] = [];
        let newEmbeddingIndex = 0;

        texts.forEach((text, index) => {
            if (cachedResults.has(index)) {
                results.push(cachedResults.get(index)!);
            } else {
                results.push(newEmbeddings[newEmbeddingIndex++]);
            }
        });

        return results;
    }

    /**
     * Calculate similarity between query and documents
     */
    async findSimilar(query: string, documents: string[], topK: number = 5): Promise<Array<{ text: string; score: number; index: number }>> {
        const queryEmbedding = await this.generateEmbedding(query);
        const docEmbeddings = await this.generateBatch(documents);

        const similarities = docEmbeddings.map((docEmb, index) => ({
            text: documents[index],
            score: this.vertexEmbeddings.cosineSimilarity(queryEmbedding, docEmb),
            index,
        }));

        // Sort by similarity score (descending) and return top K
        return similarities
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Cache an embedding
     */
    private cacheEmbedding(text: string, embedding: number[]): void {
        // Implement LRU-like behavior: remove oldest if cache is full
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        this.cache.set(text, {
            text,
            embedding,
            timestamp: Date.now(),
        });
    }

    /**
     * Clear expired cache entries
     */
    clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp >= this.CACHE_TTL) {
                this.cache.delete(key);
            }
        }
        this.logger.debug(`Cache cleared, ${this.cache.size} entries remaining`);
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): { size: number; maxSize: number; ttl: number } {
        return {
            size: this.cache.size,
            maxSize: this.MAX_CACHE_SIZE,
            ttl: this.CACHE_TTL,
        };
    }
}
