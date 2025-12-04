import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { VectorStoreService } from './vector-store.service';
import { ChunkingService, DocumentChunk } from './chunking.service';
import { VertexAIService } from '../ai/vertex-ai.service';

interface RAGContext {
    query: string;
    relevantChunks: Array<{
        content: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>;
    context: string;
}

interface RAGResponse {
    answer: string;
    sources: Array<{
        content: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>;
    context: RAGContext;
}

@Injectable()
export class RAGService {
    private readonly logger = new Logger(RAGService.name);

    constructor(
        private embeddings: EmbeddingsService,
        private vectorStore: VectorStoreService,
        private chunking: ChunkingService,
        private vertexAI: VertexAIService
    ) { }

    /**
     * Index a document for RAG retrieval
     */
    async indexDocument(
        content: string,
        metadata: {
            source?: string;
            projectId?: string;
            title?: string;
            type?: string;
        } = {}
    ): Promise<{ chunksIndexed: number; documentIds: string[] }> {
        this.logger.log(`Indexing document: ${metadata.title || 'Untitled'}`);

        // Chunk the document intelligently
        const chunks = this.chunking.chunkByParagraphs(content, {
            maxChunkSize: 800,
            source: metadata.source,
        });

        // Store chunks in vector store
        const documentIds = await this.vectorStore.storeBatch(
            chunks.map(chunk => ({
                content: chunk.content,
                metadata: {
                    ...metadata,
                    chunkIndex: chunk.metadata.chunkIndex,
                    totalChunks: chunk.metadata.totalChunks,
                },
            }))
        );

        this.logger.log(`Indexed ${chunks.length} chunks for document`);

        return {
            chunksIndexed: chunks.length,
            documentIds,
        };
    }

    /**
     * Query the RAG system
     */
    async query(
        question: string,
        options: {
            topK?: number;
            projectId?: string;
            includeContext?: boolean;
            temperature?: number;
        } = {}
    ): Promise<RAGResponse> {
        const {
            topK = 5,
            projectId,
            includeContext = true,
            temperature = 0.2,
        } = options;

        this.logger.log(`RAG Query: "${question}"`);

        // 1. Retrieve relevant documents using hybrid search
        const searchFilter = projectId ? { projectId } : undefined;
        const relevantDocs = await this.vectorStore.hybridSearch(question, {
            topK,

        });

        if (relevantDocs.length === 0) {
            this.logger.warn('No relevant documents found');
            return {
                answer: 'I could not find any relevant information to answer your question.',
                sources: [],
                context: {
                    query: question,
                    relevantChunks: [],
                    context: '',
                },
            };
        }

        this.logger.debug(`Found ${relevantDocs.length} relevant documents`);

        // 2. Build context from relevant documents
        const contextChunks = relevantDocs.map((doc, i) =>
            `[Source ${i + 1}] (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}\n`
        );

        const context = contextChunks.join('\n---\n\n');

        // 3. Generate answer using Vertex AI
        const prompt = this.buildRAGPrompt(question, context);

        try {
            const answer = await this.vertexAI.generateContent(prompt);

            const response: RAGResponse = {
                answer: answer.trim(),
                sources: relevantDocs.map(doc => ({
                    content: doc.content,
                    score: doc.score,
                    metadata: doc.metadata,
                })),
                context: includeContext ? {
                    query: question,
                    relevantChunks: relevantDocs,
                    context,
                } : undefined as any,
            };

            this.logger.log('RAG query completed successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to generate RAG answer', error);
            throw error;
        }
    }

    /**
     * Conversational RAG with chat history
     */
    async chat(
        message: string,
        options: {
            conversationHistory?: Array<{ role: string; content: string }>;
            projectId?: string;
            topK?: number;
        } = {}
    ): Promise<RAGResponse> {
        const { conversationHistory = [], projectId, topK = 3 } = options;

        // Retrieve relevant context
        const searchFilter = projectId ? { projectId } : undefined;
        const relevantDocs = await this.vectorStore.hybridSearch(message, {
            topK,
        });

        const context = relevantDocs
            .map((doc, i) => `[Context ${i + 1}]\n${doc.content}`)
            .join('\n\n---\n\n');

        // Build conversation with context
        const systemPrompt = `You are a helpful AI assistant with access to relevant context. ${context ? `\n\nRelevant Context:\n${context}` : ''
            }`;

        const messages = [
            ...conversationHistory,
            { role: 'user', content: message },
        ];

        const chatResponse = await this.vertexAI.chat(messages, systemPrompt);

        // Handle response - could be string or object with toolCalls
        const answer = typeof chatResponse === 'string'
            ? chatResponse
            : JSON.stringify(chatResponse);

        return {
            answer,
            sources: relevantDocs.map(doc => ({
                content: doc.content,
                score: doc.score,
                metadata: doc.metadata,
            })),
            context: {
                query: message,
                relevantChunks: relevantDocs,
                context,
            },
        };
    }

    /**
     * Summarize multiple documents
     */
    async summarizeDocuments(
        documentIds: string[],
        options: {
            maxLength?: number;
        } = {}
    ): Promise<{ summary: string; documentsProcessed: number }> {
        this.logger.log(`Summarizing ${documentIds.length} documents`);

        // Retrieve documents
        const contents = documentIds.map(id => {
            const vector = (this.vectorStore as any).vectorStore.get(id);
            return vector?.content || '';
        }).filter(c => c.length > 0);

        if (contents.length === 0) {
            throw new Error('No valid documents found');
        }

        // Combine and summarize
        const combinedText = contents.join('\n\n---\n\n');
        const prompt = `Please provide a comprehensive summary of the following documents. 
Focus on key points, main ideas, and important details.

Documents:
${combinedText}

Summary:`;

        const summary = await this.vertexAI.generateContent(prompt);

        return {
            summary: summary.trim(),
            documentsProcessed: contents.length,
        };
    }

    /**
     * Get RAG system statistics
     */
    async getStats(): Promise<{
        vectorStore: unknown;
        embeddingsCache: unknown;
    }> {
        return {
            vectorStore: this.vectorStore.getStats(),
            embeddingsCache: this.embeddings.getCacheStats(),
        };
    }

    /**
     * Build RAG prompt with context
     */
    private buildRAGPrompt(question: string, context: string): string {
        return `You are a knowledgeable AI assistant. Answer the question based on the provided context.

Context:
${context}

Question: ${question}

Instructions:
1. Answer based primarily on the provided context
2. Be specific and cite information from the sources when possible
3. If the context doesn't contain enough information, acknowledge this
4. Provide a clear, concise, and helpful answer

Answer:`;
    }
}

export { RAGResponse, RAGContext };
