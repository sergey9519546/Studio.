// RAG Service Type Definitions

export interface DocumentMetadata {
    source?: string;
    title?: string;
    fileType?: string;
    uploadedAt?: string;
    category?: string;
    tags?: string[];
    [key: string]: unknown; // Allow additional metadata
}

export interface DocumentChunk {
    content: string;
    score: number;
    metadata: DocumentMetadata;
}

export interface RAGSource {
    content: string;
    score: number;
    metadata: DocumentMetadata;
}

export interface RAGContext {
    query: string;
    relevantChunks: DocumentChunk[];
    context: string;
}

export interface RAGResponse {
    answer: string;
    sources: RAGSource[];
    context: RAGContext;
}

export interface VectorStoreStats {
    vectorStore: {
        documentCount: number;
        chunkCount: number;
        lastUpdated: Date | null;
    };
    embeddingsCache: {
        size: number;
        hitRate: number;
    };
}
