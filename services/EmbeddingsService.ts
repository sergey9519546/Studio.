import { PrismaClient } from '@prisma/client';
import OpenAIVisionService from './OpenAIVisionService';

interface EmbeddingData {
  type: string;
  sourceId: string;
  projectId: string;
  text: string;
  metadata?: Record<string, any>;
}

interface SemanticSearchResult {
  id: string;
  sourceId: string;
  text: string;
  similarity: number;
  metadata?: Record<string, any>;
}

/**
 * Embeddings Service
 * Manages vector embeddings for semantic search and RAG
 */
export class EmbeddingsService {
  private prisma: PrismaClient;
  private openAIService: typeof OpenAIVisionService;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
    this.openAIService = OpenAIVisionService;
  }

  /**
   * Store an embedding
   */
  async storeEmbedding(data: EmbeddingData): Promise<void> {
    try {
      // Generate embedding using OpenAI
      const embedding = await this.openAIService.generateEmbedding(data.text);

      // Store in database
      await this.prisma.embedding.create({
        data: {
          type: data.type,
          sourceId: data.sourceId,
          projectId: data.projectId,
          text: data.text,
          embedding: JSON.stringify(embedding),
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });
    } catch (error) {
      console.error('Error storing embedding:', error);
      throw error;
    }
  }

  /**
   * Update an embedding
   */
  async updateEmbedding(
    embeddingId: string,
    data: Partial<EmbeddingData>
  ): Promise<void> {
    try {
      let embedding: number[] | undefined;
      
      if (data.text) {
        embedding = await this.openAIService.generateEmbedding(data.text);
      }

      await this.prisma.embedding.update({
        where: { id: embeddingId },
        data: {
          ...(data.type && { type: data.type }),
          ...(data.text && { text: data.text }),
          ...(embedding && { embedding: JSON.stringify(embedding) }),
          ...(data.metadata && { metadata: JSON.stringify(data.metadata) }),
        },
      });
    } catch (error) {
      console.error('Error updating embedding:', error);
      throw error;
    }
  }

  /**
   * Semantic search using embeddings
   * Returns results sorted by similarity (cosine distance)
   */
  async semanticSearch(
    query: string,
    projectId: string,
    type?: string,
    limit = 10
  ): Promise<SemanticSearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.openAIService.generateEmbedding(query);

      // Get all embeddings for the project
      let embeddings = await this.prisma.embedding.findMany({
        where: {
          projectId,
          ...(type && { type }),
        },
      });

      // Calculate similarity (cosine distance) for each embedding
      const results: SemanticSearchResult[] = embeddings
        .map(emb => {
          const embeddingVector = JSON.parse(emb.embedding) as number[];
          const similarity = this.cosineSimilarity(queryEmbedding, embeddingVector);
          
          return {
            id: emb.id,
            sourceId: emb.sourceId,
            text: emb.text,
            similarity,
            metadata: emb.metadata ? JSON.parse(emb.metadata) : undefined,
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw error;
    }
  }

  /**
   * Get embeddings by type and source
   */
  async getEmbeddingsBySource(
    sourceId: string,
    type: string
  ): Promise<EmbeddingData[]> {
    try {
      const embeddings = await this.prisma.embedding.findMany({
        where: {
          sourceId,
          type,
        },
      });

      return embeddings.map(emb => ({
        type: emb.type,
        sourceId: emb.sourceId,
        projectId: emb.projectId,
        text: emb.text,
        metadata: emb.metadata ? JSON.parse(emb.metadata) : undefined,
      }));
    } catch (error) {
      console.error('Error getting embeddings:', error);
      throw error;
    }
  }

  /**
   * Delete embeddings
   */
  async deleteEmbedding(embeddingId: string): Promise<void> {
    try {
      await this.prisma.embedding.delete({
        where: { id: embeddingId },
      });
    } catch (error) {
      console.error('Error deleting embedding:', error);
      throw error;
    }
  }

  /**
   * Delete embeddings by source
   */
  async deleteEmbeddingsBySource(sourceId: string): Promise<void> {
    try {
      await this.prisma.embedding.deleteMany({
        where: { sourceId },
      });
    } catch (error) {
      console.error('Error deleting embeddings:', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      return 0;
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] * vec1[i];
      magnitude2 += vec2[i] * vec2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Index all moodboard items for a project
   */
  async indexMoodboardItems(projectId: string): Promise<void> {
    try {
      const moodboardItems = await this.prisma.moodboardItem.findMany({
        where: { projectId },
      });

      for (const item of moodboardItems) {
        const text = [item.caption, item.tags, item.moods]
          .filter(Boolean)
          .join(' ');

        await this.storeEmbedding({
          type: 'moodboard',
          sourceId: item.id,
          projectId,
          text,
          metadata: {
            caption: item.caption,
            shotType: item.shotType,
          },
        });
      }
    } catch (error) {
      console.error('Error indexing moodboard items:', error);
      throw error;
    }
  }

  /**
   * Index project brief
   */
  async indexProjectBrief(projectId: string, brief: string): Promise<void> {
    try {
      // Check if brief embedding exists
      const existing = await this.prisma.projectBrief.findUnique({
        where: { projectId },
      });

      if (existing) {
        // Update existing
        const embedding = await this.openAIService.generateEmbedding(brief);
        await this.prisma.projectBrief.update({
          where: { projectId },
          data: {
            content: brief,
            embedding: JSON.stringify(embedding),
          },
        });
      } else {
        // Create new
        const embedding = await this.openAIService.generateEmbedding(brief);
        await this.prisma.projectBrief.create({
          data: {
            projectId,
            content: brief,
            embedding: JSON.stringify(embedding),
          },
        });
      }
    } catch (error) {
      console.error('Error indexing project brief:', error);
      throw error;
    }
  }
}

export default EmbeddingsService;
