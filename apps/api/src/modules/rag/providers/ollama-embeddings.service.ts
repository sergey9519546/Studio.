import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { EmbeddingsProvider } from './embeddings-provider.interface.js';

@Injectable()
export class OllamaEmbeddingsService implements EmbeddingsProvider, OnModuleInit {
    private readonly logger = new Logger(OllamaEmbeddingsService.name);
    private client: Ollama;
    private readonly model: string;
    private readonly baseUrl: string;

    constructor(private configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
        this.model = this.configService.get<string>('OLLAMA_EMBEDDING_MODEL') || 'nomic-embed-text:1.5';

        this.client = new Ollama({ host: this.baseUrl });

        this.logger.log(`Ollama Embeddings initialized: ${this.model} at ${this.baseUrl}`);
    }

    async onModuleInit(): Promise<void> {
        try {
            // Verify the model is available
            const models = await this.client.list();
            const modelExists = models.models.some(m =>
                m.name === this.model || m.name.startsWith(this.model.split(':')[0])
            );

            if (!modelExists) {
                this.logger.warn(`Model ${this.model} not found locally. Available models: ${models.models.map(m => m.name).join(', ')}`);
                this.logger.warn(`Run 'ollama pull ${this.model}' to download the model.`);
            } else {
                this.logger.log(`✓ Model ${this.model} is available`);
            }
        } catch (error) {
            this.logger.warn(`Could not verify Ollama model availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate embedding for a single text using Ollama
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            this.logger.debug(`Generating embedding for text (${text.length} chars)`);

            const response = await this.client.embeddings({
                model: this.model,
                prompt: text,
            });

            const embedding = response.embedding;

            if (!embedding || embedding.length === 0) {
                throw new Error('No embedding returned from Ollama');
            }

            this.logger.debug(`Generated embedding vector of length ${embedding.length}`);
            return embedding;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown embedding error';
            this.logger.error(`Failed to generate embedding: ${message}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts
     * Note: Ollama doesn't have a native batch API, so we process sequentially with concurrency limit
     */
    async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            this.logger.debug(`Batch generating ${texts.length} embeddings`);

            // Process in batches of 5 for reasonable parallelism without overwhelming Ollama
            const batchSize = 5;
            const results: number[][] = [];

            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(text => this.generateEmbedding(text))
                );
                results.push(...batchResults);
            }

            this.logger.log(`Successfully generated ${results.length} embeddings`);
            return results;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown batch embedding error';
            this.logger.error(`Batch embedding failed: ${message}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) {
            throw new Error('Vectors must have same length for cosine similarity');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }

    /**
     * Health check for Ollama embeddings service
     */
    async healthCheck(): Promise<{ status: string; model: string }> {
        try {
            // Try to list models to verify connection
            await this.client.list();
            return {
                status: 'ok',
                model: this.model,
            };
        } catch {
            return {
                status: 'error',
                model: this.model,
            };
        }
    }
}
