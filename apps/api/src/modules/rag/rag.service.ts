import { Injectable, Logger } from "@nestjs/common";
import { VertexAIService } from "../ai/vertex-ai.service";
import { ChunkingService } from "./chunking.service";
import { EmbeddingsService } from "./embeddings.service";
import { VectorStoreService } from "./vector-store.service";

interface RAGContext {
  query: string;
  relevantChunks: Array<{
    id: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }>;
  context: string;
}

export interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    score: number;
    metadata?: Record<string, unknown>;
  }>;
  context?: RAGContext;
  confidence?: number;
}

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);

  constructor(
    private embeddings: EmbeddingsService,
    private vectorStore: VectorStoreService,
    private chunking: ChunkingService,
    private vertexAI: VertexAIService
  ) {}

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
    this.logger.log(`Indexing document: ${metadata.title || "Untitled"}`);

    // Chunk the document intelligently
    const chunks = this.chunking.chunkByParagraphs(content, {
      maxChunkSize: 800,
      source: metadata.source,
    });

    // Store chunks in vector store
    const documentIds = await this.vectorStore.storeBatch(
      chunks.map((chunk) => ({
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
   * Smart contextual RAG query with memory enhancement
   */
  async smartQuery(
    question: string,
    options: {
      conversationId?: string;
      projectId?: string;
      topK?: number;
      includeContext?: boolean;
    } = {}
  ): Promise<RAGResponse> {
    const { projectId, topK = 5, includeContext = true } = options;

    this.logger.log(`Smart RAG Query: "${question}"`);

    // Perform hybrid search
    const relevantDocs = await this.vectorStore.hybridSearch(question, {
      topK,
      projectId,
    });

    if (relevantDocs.length === 0) {
      this.logger.warn("No relevant documents found");
      return {
        answer: "I could not find any relevant information to answer your question.",
        sources: [],
        context: {
          query: question,
          relevantChunks: [],
          context: "",
        },
      };
    }

    // Build context from relevant documents
    const contextChunks = relevantDocs.map(
      (doc, i) =>
        `[Source ${i + 1}] (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}\n`
    );

    const context = contextChunks.join("\n---\n\n");

    // Generate answer using Vertex AI
    const prompt = this.buildRAGPrompt(question, context);

    try {
      const answer = await this.vertexAI.generateContent(prompt);

      const response: RAGResponse = {
        answer: answer.trim(),
        sources: relevantDocs.map((doc) => ({
          content: doc.content,
          score: doc.score,
          metadata: doc.metadata,
        })),
        context: includeContext
          ? {
              query: question,
              relevantChunks: relevantDocs,
              context,
            }
          : undefined,
        confidence: this.calculateConfidence(relevantDocs, answer),
      };

      this.logger.log("Smart RAG query completed successfully");
      return response;
    } catch (error) {
      this.logger.error("Failed to generate smart RAG answer", error);
      throw error;
    }
  }

  /**
   * Query the RAG system (legacy method)
   */
  async query(
    question: string,
    options: {
      topK?: number;
      projectId?: string;
      includeContext?: boolean;
    } = {}
  ): Promise<RAGResponse> {
    return this.smartQuery(question, options);
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
    const relevantDocs = await this.vectorStore.hybridSearch(message, {
      topK,
      projectId,
    });

    const context = relevantDocs
      .map((doc, i) => `[Context ${i + 1}]\n${doc.content}`)
      .join("\n\n---\n\n");

    // Build conversation with context
    const systemPrompt = `You are a helpful AI assistant with access to relevant context. ${
      context ? `\n\nRelevant Context:\n${context}` : ""
    }`;

    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const chatResponse = await this.vertexAI.chat(messages, systemPrompt);

    // Handle response - could be string or object with toolCalls
    const answer =
      typeof chatResponse === "string"
        ? chatResponse
        : JSON.stringify(chatResponse);

    return {
      answer,
      sources: relevantDocs.map((doc) => ({
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
    options: { maxLength?: number } = {}
  ): Promise<{ summary: string; documentsProcessed: number }> {
    this.logger.log(`Summarizing ${documentIds.length} documents`);

    // Retrieve documents
    const contents = documentIds
      .map((id) => {
        return this.vectorStore.getDocumentContent(id) || "";
      })
      .filter((c) => c.length > 0);

    if (contents.length === 0) {
      throw new Error("No valid documents found");
    }

    // Combine and summarize
    const combinedText = contents.join("\n\n---\n\n");
    const lengthHint = options.maxLength
      ? ` Please keep the summary under ${options.maxLength} tokens.`
      : '';

    const prompt = `Please provide a comprehensive summary of the following documents.
Focus on key points, main ideas, and important details.${lengthHint}

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
   * Calculate confidence score for RAG response
   */
  private calculateConfidence(relevantDocs: any[], answer: string): number {
    if (relevantDocs.length === 0) return 0;

    // Base confidence on number of relevant docs and their scores
    const avgScore = relevantDocs.reduce((sum, doc) => sum + doc.score, 0) / relevantDocs.length;
    const docCountBonus = Math.min(relevantDocs.length * 0.1, 0.3);

    // Answer quality bonus (simple heuristic)
    const answerQualityBonus = answer.length > 100 && !answer.includes('could not find') ? 0.2 : 0;

    return Math.min(avgScore + docCountBonus + answerQualityBonus, 1.0);
  }

  /**
   * Build standard RAG prompt
   */
  private buildRAGPrompt(question: string, context: string): string {
    return `Answer the following question based on the provided context. If the context doesn't contain enough information to fully answer the question, acknowledge this limitation.

QUESTION: ${question}

CONTEXT:
${context}

ANSWER:`;
  }
}
