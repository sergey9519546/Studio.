import { Injectable, Logger } from '@nestjs/common';
import { VertexAIService } from '../ai/vertex-ai.service';

@Injectable()
export class EmbeddingsService {
    private readonly logger = new Logger(EmbeddingsService.name);

    constructor(private vertexAI: VertexAIService) { }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            // Note: Vertex AI SDK doesn't have embedContent method yet
            // This is a placeholder - in production you would use Vertex AI Embeddings API
            // For now, returning mock embeddings
            this.logger.warn('Using mock embeddings - Vertex AI embeddings not yet implemented');

            // Mock embedding vector (768 dimensions)
            return Array.from({ length: 768 }, () => Math.random());
        } catch (error) {
            this.logger.error('Failed to generate embedding', error);
            throw error;
        }
    }

    async generateBatch(texts: string[]): Promise<number[][]> {
        return Promise.all(texts.map(t => this.generateEmbedding(t)));
    }
}
