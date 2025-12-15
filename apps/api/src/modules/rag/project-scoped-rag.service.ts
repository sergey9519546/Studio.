import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProjectAccessControlService } from '../projects/project-access-control.service.js';

export interface RAGSearchOptions {
  projectId: string;
  userId: string;
  query: string;
  limit?: number;
  threshold?: number;
  includeMetadata?: boolean;
  sourceTypes?: string[];
}

export interface RAGSearchResult {
  id: string;
  content: string;
  score: number;
  sourceType: string;
  sourceId?: string;
  title?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface RAGContextOptions {
  projectId: string;
  userId: string;
  conversationId?: string;
  maxTokens?: number;
  includeRecentMessages?: boolean;
  includeProjectBrief?: boolean;
  includeKnowledgeSources?: boolean;
}

export interface RAGContext {
  projectId: string;
  projectBrief?: string;
  recentMessages?: Array<{ role: string; content: string }>;
  knowledgeSources: RAGSearchResult[];
  tokenCount: number;
}

@Injectable()
export class ProjectScopedRAGService {
  private readonly logger = new Logger(ProjectScopedRAGService.name);

  constructor(
    private prisma: PrismaService,
    private accessControlService: ProjectAccessControlService,
  ) {}

  /**
   * Search knowledge sources with project isolation
   */
  async search(options: RAGSearchOptions): Promise<RAGSearchResult[]> {
    // Validate project access
    const hasAccess = await this.accessControlService.hasPermission(
      options.projectId,
      options.userId,
      'read'
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }

    // Build search query with project filter
    const where: any = {
      projectId: options.projectId,
      status: 'indexed',
    };

    if (options.sourceTypes && options.sourceTypes.length > 0) {
      where.sourceType = { in: options.sourceTypes };
    }

    // Get knowledge sources for the project
    const knowledgeSources = await this.prisma.knowledgeSource.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        sourceType: true,
        sourceId: true,
        metadata: true,
        embedding: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit || 10,
    });

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(options.query);

    // Calculate similarity scores and rank results
    const results: RAGSearchResult[] = knowledgeSources
      .map(source => {
        const sourceEmbedding = source.embedding as number[] | null;
        const score = sourceEmbedding 
          ? this.cosineSimilarity(queryEmbedding, sourceEmbedding)
          : 0;

        return {
          id: source.id,
          content: source.content,
          score,
          sourceType: source.sourceType,
          sourceId: source.sourceId || undefined,
          title: source.title,
          metadata: options.includeMetadata 
            ? (source.metadata as Record<string, any>) || {} 
            : undefined,
          createdAt: source.createdAt,
        };
      })
      .filter(result => result.score >= (options.threshold || 0.5))
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10);

    return results;
  }

  /**
   * Build context for AI conversations with project isolation
   */
  async buildContext(options: RAGContextOptions): Promise<RAGContext> {
    // Validate project access
    const hasAccess = await this.accessControlService.hasPermission(
      options.projectId,
      options.userId,
      'read'
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }

    const context: RAGContext = {
      projectId: options.projectId,
      knowledgeSources: [],
      tokenCount: 0,
    };

    const maxTokens = options.maxTokens || 4000;
    let currentTokens = 0;

    // Include project brief if requested
    if (options.includeProjectBrief) {
      const project = await this.prisma.project.findUnique({
        where: { id: options.projectId },
        select: {
          title: true,
          description: true,
          client: true,
          status: true,
        },
      });

      if (project) {
        const briefText = `Project: ${project.title || 'Untitled'}\n` +
          `Client: ${project.client || 'N/A'}\n` +
          `Status: ${project.status}\n` +
          `Description: ${project.description || 'No description'}`;
        
        context.projectBrief = briefText;
        currentTokens += this.estimateTokens(briefText);
      }
    }

    // Include recent messages if requested
    if (options.includeRecentMessages && options.conversationId) {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: options.conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (conversation && conversation.projectId === options.projectId) {
        const recentMessages = conversation.messages
          .reverse()
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));

        const messagesText = recentMessages
          .map(m => `${m.role}: ${m.content}`)
          .join('\n');
        
        const messageTokens = this.estimateTokens(messagesText);
        
        if (currentTokens + messageTokens <= maxTokens) {
          context.recentMessages = recentMessages;
          currentTokens += messageTokens;
        }
      }
    }

    // Include relevant knowledge sources
    if (options.includeKnowledgeSources !== false) {
      const remainingTokens = maxTokens - currentTokens;
      
      const knowledgeSources = await this.prisma.knowledgeSource.findMany({
        where: {
          projectId: options.projectId,
          status: 'indexed',
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      });

      for (const source of knowledgeSources) {
        const sourceTokens = this.estimateTokens(source.content);
        
        if (currentTokens + sourceTokens > maxTokens) {
          // Truncate content to fit
          const availableTokens = maxTokens - currentTokens;
          if (availableTokens > 100) {
            const truncatedContent = this.truncateToTokens(source.content, availableTokens);
            context.knowledgeSources.push({
              id: source.id,
              content: truncatedContent,
              score: 1,
              sourceType: source.sourceType,
              sourceId: source.sourceId || undefined,
              title: source.title,
              createdAt: source.createdAt,
            });
            currentTokens += availableTokens;
          }
          break;
        }

        context.knowledgeSources.push({
          id: source.id,
          content: source.content,
          score: 1,
          sourceType: source.sourceType,
          sourceId: source.sourceId || undefined,
          title: source.title,
          createdAt: source.createdAt,
        });
        currentTokens += sourceTokens;
      }
    }

    context.tokenCount = currentTokens;
    return context;
  }

  /**
   * Search with semantic similarity across project embeddings
   */
  async semanticSearch(
    projectId: string,
    userId: string,
    query: string,
    limit: number = 10
  ): Promise<RAGSearchResult[]> {
    // Validate access
    const hasAccess = await this.accessControlService.hasPermission(projectId, userId, 'read');
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);

    // Get project embeddings
    const embeddings = await this.prisma.projectEmbedding.findMany({
      where: { projectId },
      select: {
        id: true,
        embedding: true,
        metadata: true,
        createdAt: true,
      },
    });

    // Calculate similarities and get top results
    const scoredEmbeddings = embeddings
      .map(emb => {
        const embVector = emb.embedding as number[];
        const score = this.cosineSimilarity(queryEmbedding, embVector);
        const metadata = emb.metadata as Record<string, any>;
        
        return {
          id: emb.id,
          knowledgeSourceId: metadata?.knowledgeSourceId,
          score,
          metadata,
          createdAt: emb.createdAt,
        };
      })
      .filter(e => e.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Fetch full knowledge source data for top results
    const knowledgeSourceIds = scoredEmbeddings
      .map(e => e.knowledgeSourceId)
      .filter(Boolean);

    if (knowledgeSourceIds.length === 0) {
      return [];
    }

    const knowledgeSources = await this.prisma.knowledgeSource.findMany({
      where: {
        id: { in: knowledgeSourceIds },
        projectId, // Double-check project isolation
      },
    });

    const knowledgeSourceMap = new Map(
      knowledgeSources.map(ks => [ks.id, ks])
    );

    return scoredEmbeddings
      .filter(e => knowledgeSourceMap.has(e.knowledgeSourceId))
      .map(e => {
        const ks = knowledgeSourceMap.get(e.knowledgeSourceId)!;
        return {
          id: ks.id,
          content: ks.content,
          score: e.score,
          sourceType: ks.sourceType,
          sourceId: ks.sourceId || undefined,
          title: ks.title,
          metadata: ks.metadata as Record<string, any>,
          createdAt: ks.createdAt,
        };
      });
  }

  /**
   * Get context snapshot for conversation persistence
   */
  async createContextSnapshot(
    conversationId: string,
    projectId: string,
    userId: string
  ): Promise<string> {
    const hasAccess = await this.accessControlService.hasPermission(projectId, userId, 'write');
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }

    // Get current project state
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        description: true,
        status: true,
      },
    });

    // Get active knowledge source IDs
    const knowledgeSources = await this.prisma.knowledgeSource.findMany({
      where: {
        projectId,
        status: 'indexed',
      },
      select: { id: true },
    });

    // Create snapshot
    const snapshot = await this.prisma.contextSnapshot.create({
      data: {
        conversationId,
        projectId,
        briefContext: project ? JSON.parse(JSON.stringify(project)) : undefined,
        knowledgeSourceIds: knowledgeSources.map(ks => ks.id),
        capturedAt: new Date(),
      },
    });

    return snapshot.id;
  }

  // Helper methods
  private async generateEmbedding(text: string): Promise<number[]> {
    // Placeholder - integrate with actual embedding service
    // This would use OpenAI, Vertex AI, or local models
    const hash = this.hashString(text);
    return new Array(1536).fill(0).map((_, i) => 
      Math.sin(hash + i) * Math.cos(hash * i)
    );
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private truncateToTokens(text: string, maxTokens: number): string {
    const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars - 3) + '...';
  }
}
