import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class EmbeddingsService {
    private readonly logger = new Logger(EmbeddingsService.name);
    private ai: GoogleGenAI | null = null;

    constructor() {
        try {
            if (process.env.API_KEY) {
                this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            } else {
                this.logger.warn('API_KEY not set. Embeddings service disabled.');
            }
        } catch (e) {
            this.logger.error('Failed to initialize embeddings client', e);
        }
    }

    async generateEmbedding(text: string): Promise<number[]> {
        if (!this.ai) {
            throw new Error('Embeddings service not configured');
        }

        const model = 'text-embedding-004';
        const result = await this.ai.models.embedContent({
            model,
            contents: [{ parts: [{ text }] }],
        });

        return result.embeddings[0].values;
    }

    async generateBatch(texts: string[]): Promise<number[][]> {
        return Promise.all(texts.map(t => this.generateEmbedding(t)));
    }
}
