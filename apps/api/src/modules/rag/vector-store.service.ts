import { Injectable, Logger } from '@nestjs/common';

export interface VectorDocument {
    id: string;
    content: string;
    embedding: number[];
    metadata: {
        filePath: string;
        lineStart: number;
        lineEnd: number;
        type: 'component' | 'service' | 'controller' | 'schema' | 'config';
    };
}

@Injectable()
export class VectorStoreService {
    private readonly logger = new Logger(VectorStoreService.name);
    private documents: VectorDocument[] = [];

    async addDocument(doc: VectorDocument): Promise<void> {
        this.documents.push(doc);
    }

    async addBatch(docs: VectorDocument[]): Promise<void> {
        this.documents.push(...docs);
        this.logger.log(`Added ${docs.length} documents. Total: ${this.documents.length}`);
    }

    async search(queryEmbedding: number[], topK: number = 5): Promise<VectorDocument[]> {
        if (this.documents.length === 0) {
            return [];
        }

        const scored = this.documents.map(doc => ({
            doc,
            score: this.cosineSimilarity(queryEmbedding, doc.embedding),
        }));

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK).map(s => s.doc);
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }

    getDocumentCount(): number {
        return this.documents.length;
    }

    clear(): void {
        this.documents = [];
    }
}
