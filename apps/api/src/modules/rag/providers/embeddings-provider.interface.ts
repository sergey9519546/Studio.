/**
 * Common interface for embeddings providers.
 * Allows swapping between Vertex AI, Ollama, or other embedding services.
 */
export interface EmbeddingsProvider {
    /**
     * Generate embedding vector for a single text
     */
    generateEmbedding(text: string): Promise<number[]>;

    /**
     * Generate embeddings for multiple texts in batch
     */
    generateBatchEmbeddings(texts: string[]): Promise<number[][]>;

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(a: number[], b: number[]): number;

    /**
     * Health check for the embeddings service
     */
    healthCheck(): Promise<{ status: string; model: string }>;
}

/**
 * Injection token for the embeddings provider
 */
export const EMBEDDINGS_PROVIDER = 'EMBEDDINGS_PROVIDER';
