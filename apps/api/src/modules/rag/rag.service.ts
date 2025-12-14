import { Injectable, Logger } from "@nestjs/common";
import { VertexAIService } from "../ai/vertex-ai.service.js";
import { ChunkingService } from "./chunking.service.js";
import { EmbeddingsService } from "./embeddings.service.js";
import { VectorStoreService } from "./vector-store.service.js";

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

interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    score: number;
    metadata?: Record<string, unknown>;
  }>;
  context?: RAGContext;
  confidence?: number;
  memory?: {
    relatedQueries?: string[];
    contextSnapshots?: Array<{
      id: string;
      content: string;
      relevance: number;
      timestamp: string;
    }>;
  };
}

interface ContextSnapshot {
  id: string;
  content: string;
  briefContext?: Record<string, unknown>;
  brandTensor?: Record<string, unknown>;
  assetIntelligence?: Record<string, unknown>;
  knowledgeSourceIds?: string[];
  conversationId?: string;
  projectId?: string;
  capturedAt: Date;
  embedding?: number[];
}

interface SmartMemory {
  conversationId: string;
  projectId?: string;
  recentQueries: Array<{
    query: string;
    timestamp: Date;
    result: RAGResponse;
    contextUsed: string[];
  }>;
  contextSnapshots: ContextSnapshot[];
  relatedEntities: Array<{
    type: 'freelancer' | 'project' | 'asset' | 'concept';
    id: string;
    name: string;
    relevance: number;
    lastAccessed: Date;
  }>;
}

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);
  private memoryStore: Map<string, SmartMemory> = new Map();

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
      useMemory?: boolean;
    } = {}
  ): Promise<RAGResponse> {
    const { conversationId, projectId, topK = 5, includeContext = true, useMemory = true } = options;

    this.logger.log(`Smart RAG Query: "${question}" (Conversation: ${conversationId || 'none'})`);

    // Step 1: Get related context from memory if available
    let memoryContext = '';
    let relatedQueries: string[] = [];
    
    if (useMemory && conversationId) {
      const memoryData = this.getMemory(conversationId);
      if (memoryData) {
        const recentContext = this.extractRecentContext(memoryData, question);
        memoryContext = recentContext.context;
        relatedQueries = recentContext.relatedQueries;
      }
    }

    // Step 2: Hybrid search with enhanced query understanding
    const enhancedQuery = this.enhanceQuery(question, relatedQueries);
    const relevantDocs = await this.vectorStore.hybridSearch(enhancedQuery, {
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
          context: memoryContext,
        },
        memory: {
          relatedQueries,
        },
      };
    }

    // Step 3: Build enhanced context with memory
    const contextChunks = relevantDocs.map(
      (doc, i) =>
        `[Source ${i + 1}] (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}\n`
    );

    const enhancedContext = [memoryContext, ...contextChunks]
      .filter(c => c.length > 0)
      .join("\n---\n\n");

    // Step 4: Generate answer with context awareness
    const prompt = this.buildSmartRAGPrompt(question, enhancedContext, relatedQueries);

    try {
      const answer = await this.vertexAI.generateContent(prompt);
      
      // Step 5: Calculate confidence score
      const confidence = this.calculateConfidence(relevantDocs, answer);

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
              context: enhancedContext,
            }
          : undefined,
        confidence,
        memory: {
          relatedQueries,
          contextSnapshots: useMemory && conversationId 
            ? this.generateContextSnapshots(relevantDocs, conversationId)
            : [],
        },
      };

      // Step 6: Update memory
      if (useMemory && conversationId) {
        this.updateMemory(conversationId, question, response, relevantDocs);
      }

      this.logger.log("Smart RAG query completed successfully");
      return response;
    } catch (error) {
      this.logger.error("Failed to generate smart RAG answer", error);
      throw error;
    }
  }

  /**
   * Enhanced conversational RAG with full memory integration
   */
  async conversationalRAG(
    message: string,
    options: {
      conversationId?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
      projectId?: string;
      topK?: number;
      maxHistory?: number;
    } = {}
  ): Promise<RAGResponse> {
    const { 
      conversationId, 
      conversationHistory = [], 
      projectId, 
      topK = 3,
      maxHistory = 10 
    } = options;

    // Initialize memory if conversation ID provided
    let memory: SmartMemory | null = null;
    if (conversationId) {
      memory = this.getMemory(conversationId) || this.initializeMemory(conversationId, projectId);
    }

    // Get memory-enhanced context
    let memoryContext = '';
    let enhancedHistory = conversationHistory;
    
    if (memory) {
      const recentContext = this.extractRecentContext(memory, message);
      memoryContext = recentContext.context;
      
      // Enhance history with relevant past queries
      if (recentContext.relatedQueries.length > 0) {
        const relevantHistory = recentContext.relatedQueries
          .slice(0, Math.min(3, maxHistory - conversationHistory.length))
          .map(q => ({ role: 'user', content: q }));
        
        enhancedHistory = [...conversationHistory, ...relevantHistory];
      }
    }

    // Perform hybrid search with enhanced query
    const enhancedQuery = this.enhanceQuery(message, memory?.recentQueries.map(q => q.query) || []);
    const relevantDocs = await this.vectorStore.hybridSearch(enhancedQuery, {
      topK,
      projectId,
    });

    const context = relevantDocs
      .map((doc, i) => `[Context ${i + 1}] (${(doc.score * 100).toFixed(1)}%)\n${doc.content}`)
      .join("\n\n---\n\n");

    // Build enhanced system prompt
    const systemPrompt = this.buildConversationalPrompt(message, context, memoryContext, enhancedHistory);

    const messages = [
      ...enhancedHistory,
      { role: "user", content: message },
    ];

    try {
      const chatResponse = await this.vertexAI.chat(messages, systemPrompt);
      
      const answer = typeof chatResponse === "string" 
        ? chatResponse 
        : JSON.stringify(chatResponse);

      const response: RAGResponse = {
        answer,
        sources: relevantDocs.map((doc) => ({
          content: doc.content,
          score: doc.score,
          metadata: doc.metadata,
        })),
        context: {
          query: message,
          relevantChunks: relevantDocs,
          context: [memoryContext, context].filter(c => c.length > 0).join("\n---\n\n"),
        },
        confidence: this.calculateConfidence(relevantDocs, answer),
        memory: {
          relatedQueries: memory?.recentQueries.map(q => q.query).slice(-5) || [],
        },
      };

      // Update memory with new interaction
      if (memory) {
        this.updateMemory(conversationId!, message, response, relevantDocs);
      }

      return response;
    } catch (error) {
      this.logger.error("Failed conversational RAG query", error);
      throw error;
    }
  }

  /**
   * Capture context snapshot for RAG enhancement
   */
  async captureContextSnapshot(
    conversationId: string,
    snapshot: Omit<ContextSnapshot, 'id' | 'capturedAt'>
  ): Promise<string> {
    const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullSnapshot: ContextSnapshot = {
      id: snapshotId,
      content: snapshot.content,
      briefContext: snapshot.briefContext,
      brandTensor: snapshot.brandTensor,
      assetIntelligence: snapshot.assetIntelligence,
      knowledgeSourceIds: snapshot.knowledgeSourceIds || [],
      conversationId: snapshot.conversationId,
      projectId: snapshot.projectId,
      capturedAt: new Date(),
      embedding: await this.embeddings.generateEmbedding(snapshot.content),
    };

    // Store in vector store for retrieval
    await this.vectorStore.storeBatch([{
      content: fullSnapshot.content,
      metadata: {
        type: 'contextSnapshot',
        snapshotId: fullSnapshot.id,
        conversationId: fullSnapshot.conversationId,
        projectId: fullSnapshot.projectId,
        briefContext: fullSnapshot.briefContext,
        brandTensor: fullSnapshot.brandTensor,
        assetIntelligence: fullSnapshot.assetIntelligence,
      },
      embedding: fullSnapshot.embedding,
    }]);

    // Update memory
    if (conversationId) {
      const memory = this.getMemory(conversationId);
      if (memory) {
        memory.contextSnapshots.push(fullSnapshot);
        // Keep only last 10 snapshots
        if (memory.contextSnapshots.length > 10) {
          memory.contextSnapshots = memory.contextSnapshots.slice(-10);
        }
      }
    }

    this.logger.log(`Captured context snapshot: ${snapshotId}`);
    return snapshotId;
  }

  /**
   * Get conversation memory
   */
  getMemory(conversationId: string): SmartMemory | null {
    return this.memoryStore.get(conversationId) || null;
  }

  /**
   * Clear conversation memory
   */
  clearMemory(conversationId: string): void {
    this.memoryStore.delete(conversationId);
    this.logger.log(`Cleared memory for conversation: ${conversationId}`);
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
    const { topK = 5, projectId, includeContext = true } = options;

    this.logger.log(`RAG Query: "${question}"`);

    // 1. Retrieve relevant documents using hybrid search
    const relevantDocs = await this.vectorStore.hybridSearch(question, {
      topK,
      projectId,
    });

    if (relevantDocs.length === 0) {
      this.logger.warn("No relevant documents found");
      return {
        answer:
          "I could not find any relevant information to answer your question.",
        sources: [],
        context: {
          query: question,
          relevantChunks: [],
          context: "",
        },
      };
    }

    this.logger.debug(`Found ${relevantDocs.length} relevant documents`);

    // 2. Build context from relevant documents
    const contextChunks = relevantDocs.map(
      (doc, i) =>
        `[Source ${i + 1}] (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}\n`
    );

    const context = contextChunks.join("\n---\n\n");

    // 3. Generate answer using Vertex AI
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
      };

      this.logger.log("RAG query completed successfully");
      return response;
    } catch (error) {
      this.logger.error("Failed to generate RAG answer", error);
      throw error;
    }
  }

  /**
   * Conversational RAG with chat history (legacy method)
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
    memoryStats?: {
      totalConversations: number;
      totalQueries: number;
      totalSnapshots: number;
    };
  }> {
    const memoryStats = {
      totalConversations: this.memoryStore.size,
      totalQueries: Array.from(this.memoryStore.values())
        .reduce((sum, memory) => sum + memory.recentQueries.length, 0),
      totalSnapshots: Array.from(this.memoryStore.values())
        .reduce((sum, memory) => sum + memory.contextSnapshots.length, 0),
    };

    return {
      vectorStore: this.vectorStore.getStats(),
      embeddingsCache: this.embeddings.getCacheStats(),
      memoryStats,
    };
  }

  /**
   * Private helper methods for smart context and memory
   */
  private initializeMemory(conversationId: string, projectId?: string): SmartMemory {
    const memory: SmartMemory = {
      conversationId,
      projectId,
      recentQueries: [],
      contextSnapshots: [],
      relatedEntities: [],
    };
    
    this.memoryStore.set(conversationId, memory);
    return memory;
  }

  private extractRecentContext(memory: SmartMemory, currentQuery: string): {
    context: string;
    relatedQueries: string[];
  } {
    const recentQueries = memory.recentQueries
      .slice(-5)
      .map(q => q.query);

    const relevantContext = memory.recentQueries
      .filter(q => {
        // Simple relevance check - could be improved with embeddings
        const queryWords = q.query.toLowerCase().split(' ');
        const currentWords = currentQuery.toLowerCase().split(' ');
        const commonWords = queryWords.filter(word => currentWords.includes(word));
        return commonWords.length > Math.min(queryWords.length, currentWords.length) * 0.3;
      })
      .slice(-3); // Take last 3 relevant queries

    return {
      context: relevantContext.map(q => `${q.query}: ${q.result.answer}`).join('\n'),
      relatedQueries,
    };
  }

  /**
   * Generate context snapshots from search results
   */
  private generateContextSnapshots(relevantDocs: any[], conversationId: string): Array<{
    id: string;
    content: string;
    relevance: number;
    timestamp: string;
  }> {
    return relevantDocs.slice(0, 3).map((doc, index) => ({
      id: `snapshot_${conversationId}_${Date.now()}_${index}`,
      content: doc.content.substring(0, 500), // Limit content length
      relevance: doc.score,
      timestamp: new Date().toISOString(),
    }));
  }

  /**
   * Update conversation memory with new interaction
   */
  private updateMemory(conversationId: string, query: string, result: RAGResponse, relevantDocs: any[]): void {
    const memory = this.memoryStore.get(conversationId);
    if (!memory) return;

    // Add new query to memory
    memory.recentQueries.push({
      query,
      timestamp: new Date(),
      result,
      contextUsed: relevantDocs.map(doc => doc.content.substring(0, 200)),
    });

    // Keep only last 10 queries
    if (memory.recentQueries.length > 10) {
      memory.recentQueries = memory.recentQueries.slice(-10);
    }

    // Update related entities based on query analysis
    this.updateRelatedEntities(memory, query, relevantDocs);
  }

  /**
   * Update related entities in memory
   */
  private updateRelatedEntities(memory: SmartMemory, query: string, relevantDocs: any[]): void {
    const queryLower = query.toLowerCase();

    // Simple entity extraction from query and documents
    const entities = this.extractEntitiesFromText(query + ' ' + relevantDocs.map(d => d.content).join(' '));

    entities.forEach(entity => {
      const existingEntity = memory.relatedEntities.find(e => e.id === entity.id);
      if (existingEntity) {
        existingEntity.relevance = Math.min(existingEntity.relevance + 0.1, 1.0);
        existingEntity.lastAccessed = new Date();
      } else {
        memory.relatedEntities.push({
          ...entity,
          relevance: 0.5,
          lastAccessed: new Date(),
        });
      }
    });

    // Keep only top 20 entities
    memory.relatedEntities.sort((a, b) => b.relevance - a.relevance);
    memory.relatedEntities = memory.relatedEntities.slice(0, 20);
  }

  /**
   * Extract entities from text (simple implementation)
   */
  private extractEntitiesFromText(text: string): Array<{
    type: 'freelancer' | 'project' | 'asset' | 'concept';
    id: string;
    name: string;
  }> {
    const entities = [];
    const textLower = text.toLowerCase();

    // Extract project mentions
    const projectMatches = textLower.match(/project\s+(\w+)/g);
    if (projectMatches) {
      projectMatches.forEach(match => {
        const projectName = match.replace('project ', '');
        entities.push({
          type: 'project' as const,
          id: `project_${projectName}`,
          name: projectName,
        });
      });
    }

    // Extract freelancer mentions
    const freelancerMatches = textLower.match(/freelancer\s+(\w+)/g);
    if (freelancerMatches) {
      freelancerMatches.forEach(match => {
        const freelancerName = match.replace('freelancer ', '');
        entities.push({
          type: 'freelancer' as const,
          id: `freelancer_${freelancerName}`,
          name: freelancerName,
        });
      });
    }

    // Extract asset mentions
    const assetMatches = textLower.match(/asset\s+(\w+)/g);
    if (assetMatches) {
      assetMatches.forEach(match => {
        const assetName = match.replace('asset ', '');
        entities.push({
          type: 'asset' as const,
          id: `asset_${assetName}`,
          name: assetName,
        });
      });
    }

    return entities;
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
   * Build enhanced RAG prompt with context
   */
  private buildSmartRAGPrompt(question: string, context: string, relatedQueries: string[]): string {
    let prompt = `You are an expert AI assistant with access to relevant context information.

QUESTION: ${question}

`;

    if (context) {
      prompt += `RELEVANT CONTEXT:
${context}

`;
    }

    if (relatedQueries.length > 0) {
      prompt += `RELATED PREVIOUS QUERIES:
${relatedQueries.map(q => `- ${q}`).join('\n')}

`;
    }

    prompt += `INSTRUCTIONS:
- Answer the question based on the provided context
- If the context doesn't contain enough information, say so clearly
- Be concise but comprehensive
- Cite specific information from the context when possible
- If you need to make assumptions, state them clearly

ANSWER:`;

    return prompt;
  }

  /**
   * Build conversational RAG prompt
   */
  private buildConversationalPrompt(
    message: string,
    context: string,
    memoryContext: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): string {
    let prompt = `You are a helpful AI assistant engaged in a conversation. Use the following context to inform your responses:

`;

    if (context) {
      prompt += `RELEVANT DOCUMENTS:
${context}

`;
    }

    if (memoryContext) {
      prompt += `CONVERSATION MEMORY:
${memoryContext}

`;
    }

    prompt += `CURRENT MESSAGE: ${message}

Respond naturally and helpfully, using the context when relevant.`;

    return prompt;
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

  /**
   * Enhance query with context from related queries
   */
  private enhanceQuery(query: string, relatedQueries: string[]): string {
    if (relatedQueries.length === 0) return query;

    // Simple enhancement - could be improved with NLP
    const queryLower = query.toLowerCase();
    const enhancements = relatedQueries
      .filter(q => {
        const qLower = q.toLowerCase();
        // Find queries that share significant keywords
        const queryWords = queryLower.split(' ').filter(word => word.length > 3);
        const commonWords = queryWords.filter(word => qLower.includes(word));
        return commonWords.length > queryWords.length * 0.3;
      })
      .slice(0, 2); // Take up to 2 related queries

    if (enhancements.length === 0) return query;

    // Combine original query with context from related queries
    return `${query} [Context: ${enhancements.join(' | ')}]`;
  }
}
