import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

type VectorMetadata = Prisma.JsonObject;

export interface VectorEntry {
  id: string;
  projectId: string;
  contentHash: string;
  vector: number[];
  metadata: VectorMetadata;
  shardId: string;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: VectorMetadata;
}

export interface ShardStats {
  shardId: string;
  vectorCount: number;
  projectCount: number;
  avgVectorDimension: number;
}

@Injectable()
export class ShardedVectorStoreService {
  private readonly logger = new Logger(ShardedVectorStoreService.name);
  private readonly SHARD_COUNT = 16; // Number of shards for distribution
  private readonly VECTOR_DIMENSION = 1536; // Default embedding dimension

  // In-memory shard storage (in production, use pgvector, Pinecone, Qdrant, etc.)
  private shards: Map<string, Map<string, VectorEntry>> = new Map();
  private shardStats: Map<string, ShardStats> = new Map();

  constructor(private prisma: PrismaService) {
    this.initializeShards();
  }

  /**
   * Initialize shard containers
   */
  private initializeShards(): void {
    for (let i = 0; i < this.SHARD_COUNT; i++) {
      const shardId = `shard_${i.toString().padStart(2, '0')}`;
      this.shards.set(shardId, new Map());
      this.shardStats.set(shardId, {
        shardId,
        vectorCount: 0,
        projectCount: 0,
        avgVectorDimension: 0,
      });
    }
    this.logger.log(`Initialized ${this.SHARD_COUNT} vector shards`);
  }

  /**
   * Store vector with project-based sharding
   */
  async storeVector(
    projectId: string,
    contentHash: string,
    vector: number[],
    metadata: VectorMetadata = {}
  ): Promise<string> {
    const shardId = this.getShardForProject(projectId);
    const entryId = this.generateEntryId(projectId, contentHash);

    const entry: VectorEntry = {
      id: entryId,
      projectId,
      contentHash,
      vector,
      metadata,
      shardId,
    };

    const shard = this.shards.get(shardId)!;
    shard.set(entryId, entry);

    // Update stats
    this.updateShardStats(shardId);

    // Persist to database
    await this.persistVector(entry);

    this.logger.debug(`Stored vector ${entryId} in shard ${shardId}`);
    return entryId;
  }

  /**
   * Search vectors within a project
   */
  async searchProject(
    projectId: string,
    queryVector: number[],
    limit: number = 10,
    threshold: number = 0.5
  ): Promise<SearchResult[]> {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;

    const results: SearchResult[] = [];

    for (const [, entry] of shard) {
      if (entry.projectId !== projectId) continue;

      const score = this.cosineSimilarity(queryVector, entry.vector);
      if (score >= threshold) {
        results.push({
          id: entry.id,
          score,
          metadata: entry.metadata,
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Search vectors across multiple projects
   */
  async searchMultiProject(
    projectIds: string[],
    queryVector: number[],
    limit: number = 10,
    threshold: number = 0.5
  ): Promise<Map<string, SearchResult[]>> {
    const results = new Map<string, SearchResult[]>();

    for (const projectId of projectIds) {
      const projectResults = await this.searchProject(
        projectId,
        queryVector,
        limit,
        threshold
      );
      results.set(projectId, projectResults);
    }

    return results;
  }

  /**
   * Delete vector by ID
   */
  async deleteVector(projectId: string, entryId: string): Promise<boolean> {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;

    if (shard.has(entryId)) {
      shard.delete(entryId);
      this.updateShardStats(shardId);

      // Remove from database
      await this.removePersistedVector(entryId);

      return true;
    }

    return false;
  }

  /**
   * Delete all vectors for a project
   */
  async deleteProjectVectors(projectId: string): Promise<number> {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;

    let deletedCount = 0;
    const entriesToDelete: string[] = [];

    for (const [entryId, entry] of shard) {
      if (entry.projectId === projectId) {
        entriesToDelete.push(entryId);
      }
    }

    for (const entryId of entriesToDelete) {
      shard.delete(entryId);
      deletedCount++;
    }

    this.updateShardStats(shardId);

    // Remove from database
    await this.prisma.projectEmbedding.deleteMany({
      where: { projectId },
    });

    this.logger.log(`Deleted ${deletedCount} vectors for project ${projectId}`);
    return deletedCount;
  }

  /**
   * Get vector by ID
   */
  getVector(projectId: string, entryId: string): VectorEntry | null {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;

    const entry = shard.get(entryId);
    return entry?.projectId === projectId ? entry : null;
  }

  /**
   * Count vectors for a project
   */
  countProjectVectors(projectId: string): number {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;

    let count = 0;
    for (const [, entry] of shard) {
      if (entry.projectId === projectId) {
        count++;
      }
    }

    return count;
  }

  /**
   * Get shard statistics
   */
  getShardStats(): ShardStats[] {
    return Array.from(this.shardStats.values());
  }

  /**
   * Get shard for a specific project
   */
  getShardForProject(projectId: string): string {
    // Consistent hashing for project distribution
    const hash = crypto.createHash('md5').update(projectId).digest();
    const shardIndex = hash.readUInt32BE(0) % this.SHARD_COUNT;
    return `shard_${shardIndex.toString().padStart(2, '0')}`;
  }

  /**
   * Rebalance shards (for maintenance)
   */
  async rebalanceShards(): Promise<{ movedVectors: number; duration: number }> {
    const startTime = Date.now();
    let movedVectors = 0;

    // Check each entry and move if necessary
    for (const [shardId, shard] of this.shards) {
      const entriesToMove: VectorEntry[] = [];

    for (const [, entry] of shard) {
      const correctShardId = this.getShardForProject(entry.projectId);
      if (correctShardId !== shardId) {
        entriesToMove.push(entry);
      }
    }

      for (const entry of entriesToMove) {
        shard.delete(entry.id);
        const correctShard = this.shards.get(this.getShardForProject(entry.projectId))!;
        correctShard.set(entry.id, {
          ...entry,
          shardId: this.getShardForProject(entry.projectId),
        });
        movedVectors++;
      }
    }

    // Update all shard stats
    for (const shardId of this.shards.keys()) {
      this.updateShardStats(shardId);
    }

    const duration = Date.now() - startTime;
    this.logger.log(`Rebalanced shards: moved ${movedVectors} vectors in ${duration}ms`);

    return { movedVectors, duration };
  }

  /**
   * Load vectors from database for a project
   */
  async loadProjectVectors(projectId: string): Promise<number> {
    const embeddings = await this.prisma.projectEmbedding.findMany({
      where: { projectId },
    });

    for (const embedding of embeddings) {
      const shardId = this.getShardForProject(projectId);
      const shard = this.shards.get(shardId)!;

      shard.set(embedding.id, {
        id: embedding.id,
        projectId: embedding.projectId,
        contentHash: embedding.contentHash,
        vector: this.parseVector(embedding.embedding),
        metadata: this.parseMetadata(embedding.metadata),
        shardId,
      });
    }

    this.updateShardStats(this.getShardForProject(projectId));
    return embeddings.length;
  }

  /**
   * Batch store vectors for efficiency
   */
  async batchStoreVectors(
    projectId: string,
    vectors: Array<{
      contentHash: string;
      vector: number[];
      metadata?: VectorMetadata;
    }>
  ): Promise<string[]> {
    const shardId = this.getShardForProject(projectId);
    const shard = this.shards.get(shardId)!;
    const entryIds: string[] = [];

    for (const item of vectors) {
      const entryId = this.generateEntryId(projectId, item.contentHash);

      const entry: VectorEntry = {
        id: entryId,
        projectId,
        contentHash: item.contentHash,
        vector: item.vector,
        metadata: item.metadata || {},
        shardId,
      };

      shard.set(entryId, entry);
      entryIds.push(entryId);
    }

    this.updateShardStats(shardId);

    // Batch persist to database
    await this.batchPersistVectors(projectId, vectors.map((v, i) => ({
      id: entryIds[i],
      ...v,
    })));

    this.logger.debug(`Batch stored ${vectors.length} vectors for project ${projectId}`);
    return entryIds;
  }

  // Private helper methods

  private generateEntryId(projectId: string, contentHash: string): string {
    return `vec_${crypto.createHash('sha256')
      .update(`${projectId}:${contentHash}`)
      .digest('hex')
      .substring(0, 16)}`;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

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

  private updateShardStats(shardId: string): void {
    const shard = this.shards.get(shardId)!;
    const projects = new Set<string>();
    let totalDimension = 0;

    for (const [, entry] of shard) {
      projects.add(entry.projectId);
      totalDimension += entry.vector.length;
    }

    this.shardStats.set(shardId, {
      shardId,
      vectorCount: shard.size,
      projectCount: projects.size,
      avgVectorDimension: shard.size > 0 ? totalDimension / shard.size : 0,
    });
  }

  private async persistVector(entry: VectorEntry): Promise<void> {
    const metadataWithShard: VectorMetadata = {
      ...entry.metadata,
      shardId: entry.shardId,
    };

    await this.prisma.projectEmbedding.upsert({
      where: {
        projectId_contentHash: {
          projectId: entry.projectId,
          contentHash: entry.contentHash,
        },
      },
      create: {
        id: entry.id,
        projectId: entry.projectId,
        contentHash: entry.contentHash,
        embedding: entry.vector,
        metadata: metadataWithShard,
      },
      update: {
        embedding: entry.vector,
        metadata: metadataWithShard,
      },
    });
  }

  private async removePersistedVector(entryId: string): Promise<void> {
    await this.prisma.projectEmbedding.deleteMany({
      where: { id: entryId },
    });
  }

  private async batchPersistVectors(
    projectId: string,
    vectors: Array<{
      id: string;
      contentHash: string;
      vector: number[];
      metadata?: VectorMetadata;
    }>
  ): Promise<void> {
    // Use transaction for batch operations
    await this.prisma.$transaction(
      vectors.map(v =>
        this.prisma.projectEmbedding.upsert({
          where: {
            projectId_contentHash: {
              projectId,
              contentHash: v.contentHash,
            },
          },
          create: {
            id: v.id,
            projectId,
            contentHash: v.contentHash,
            embedding: v.vector,
            metadata: v.metadata ?? {},
          },
          update: {
            embedding: v.vector,
            metadata: v.metadata ?? {},
          },
        })
      )
    );
  }

  private parseVector(value: Prisma.JsonValue | null): number[] {
    if (Array.isArray(value) && value.every(item => typeof item === 'number')) {
      return value as number[];
    }
    return [];
  }

  private parseMetadata(value: Prisma.JsonValue | null): VectorMetadata {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Prisma.JsonObject;
    }
    return {};
  }
}
