import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';

/**
 * Queue job status types
 */
export type QueueJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Queue job type definitions
 */
export type QueueJobType = 'ingestion' | 'embedding' | 'ai_processing' | 'cleanup';

/**
 * Base payload interface for queue jobs
 */
export interface BaseJobPayload {
  [key: string]: unknown;
}

/**
 * Ingestion job payload
 */
export interface IngestionJobPayload extends BaseJobPayload {
  documentId: string;
  action: 'ingest';
}

/**
 * Embedding job payload
 */
export interface EmbeddingJobPayload extends BaseJobPayload {
  sourceId: string;
  content: string;
}

/**
 * AI processing job payload
 */
export interface AIProcessingJobPayload extends BaseJobPayload {
  operation: string;
  input: unknown;
}

/**
 * Cleanup job payload
 */
export interface CleanupJobPayload extends BaseJobPayload {
  cleanupType: string;
}

/**
 * Union type for all job payloads
 */
export type JobPayload = IngestionJobPayload | EmbeddingJobPayload | AIProcessingJobPayload | CleanupJobPayload | BaseJobPayload;

/**
 * Queue job structure
 */
export interface QueueJob {
  id: string;
  projectId: string;
  userId: string;
  type: QueueJobType | string;
  payload: JobPayload;
  priority: number;
  status: QueueJobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Queue options for job configuration
 */
export interface QueueOptions {
  priority?: number;
  delay?: number;
  maxAttempts?: number;
}

/**
 * Queue statistics
 */
export interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
}

/**
 * Internal stats tracking
 */
interface StatsData {
  total: number;
  totalTime: number;
}

@Injectable()
export class ProjectQueueService {
  private readonly logger = new Logger(ProjectQueueService.name);

  // In-memory queue (in production, use Redis, Bull, or similar)
  private queues: Map<string, QueueJob[]> = new Map();
  private processing: Map<string, boolean> = new Map();
  private stats: Map<string, StatsData> = new Map();

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Add a job to the project queue
   * @param projectId Project identifier
   * @param userId User who initiated the job
   * @param type Job type
   * @param payload Job data
   * @param options Queue configuration options
   * @returns Job ID
   */
  async enqueue(
    projectId: string,
    userId: string,
    type: QueueJobType | string,
    payload: JobPayload,
    options: QueueOptions = {}
  ): Promise<string> {
    const job: QueueJob = {
      id: this.generateJobId(),
      projectId,
      userId,
      type,
      payload,
      priority: options.priority ?? 5,
      status: 'pending',
      attempts: 0,
      maxAttempts: options.maxAttempts ?? 3,
      createdAt: new Date(),
    };

    const queue = this.getProjectQueue(projectId);

    if (options.delay && options.delay > 0) {
      setTimeout(() => {
        queue.push(job);
        this.sortQueue(projectId);
        void this.processQueue(projectId);
      }, options.delay);
    } else {
      queue.push(job);
      this.sortQueue(projectId);
      void this.processQueue(projectId);
    }

    this.logger.log(`Job ${job.id} enqueued for project ${projectId}: ${type}`);
    this.eventEmitter.emit('queue.job.created', { projectId, job });

    return job.id;
  }

  /**
   * Add document ingestion job
   */
  async enqueueIngestion(
    projectId: string,
    userId: string,
    documentId: string,
    options: QueueOptions = {}
  ): Promise<string> {
    const payload: IngestionJobPayload = {
      documentId,
      action: 'ingest',
    };
    return this.enqueue(projectId, userId, 'ingestion', payload, {
      ...options,
      priority: options.priority ?? 3
    });
  }

  /**
   * Add embedding generation job
   */
  async enqueueEmbedding(
    projectId: string,
    userId: string,
    sourceId: string,
    content: string,
    options: QueueOptions = {}
  ): Promise<string> {
    const payload: EmbeddingJobPayload = {
      sourceId,
      content,
    };
    return this.enqueue(projectId, userId, 'embedding', payload, {
      ...options,
      priority: options.priority ?? 5
    });
  }

  /**
   * Add AI processing job
   */
  async enqueueAIProcessing(
    projectId: string,
    userId: string,
    operation: string,
    input: unknown,
    options: QueueOptions = {}
  ): Promise<string> {
    const payload: AIProcessingJobPayload = {
      operation,
      input,
    };
    return this.enqueue(projectId, userId, 'ai_processing', payload, {
      ...options,
      priority: options.priority ?? 7
    });
  }

  /**
   * Add cleanup job
   */
  async enqueueCleanup(
    projectId: string,
    userId: string,
    cleanupType: string,
    options: QueueOptions = {}
  ): Promise<string> {
    const payload: CleanupJobPayload = {
      cleanupType,
    };
    return this.enqueue(projectId, userId, 'cleanup', payload, {
      ...options,
      priority: options.priority ?? 10
    });
  }

  /**
   * Get job status
   */
  getJobStatus(projectId: string, jobId: string): QueueJob | null {
    const queue = this.getProjectQueue(projectId);
    return queue.find(job => job.id === jobId) ?? null;
  }

  /**
   * Get all jobs for a project
   */
  getProjectJobs(projectId: string, status?: QueueJobStatus): QueueJob[] {
    const queue = this.getProjectQueue(projectId);

    if (status) {
      return queue.filter(job => job.status === status);
    }

    return queue;
  }

  /**
   * Cancel a pending job
   */
  cancelJob(projectId: string, jobId: string): boolean {
    const queue = this.getProjectQueue(projectId);
    const index = queue.findIndex(job => job.id === jobId && job.status === 'pending');

    if (index > -1) {
      queue.splice(index, 1);
      this.logger.log(`Job ${jobId} cancelled`);
      this.eventEmitter.emit('queue.job.cancelled', { projectId, jobId });
      return true;
    }

    return false;
  }

  /**
   * Get queue statistics for a project
   */
  getQueueStats(projectId: string): QueueStats {
    const queue = this.getProjectQueue(projectId);
    const projectStats = this.stats.get(projectId) ?? { total: 0, totalTime: 0 };

    return {
      pending: queue.filter(j => j.status === 'pending').length,
      processing: queue.filter(j => j.status === 'processing').length,
      completed: queue.filter(j => j.status === 'completed').length,
      failed: queue.filter(j => j.status === 'failed').length,
      avgProcessingTime: projectStats.total > 0 ? projectStats.totalTime / projectStats.total : 0,
    };
  }

  /**
   * Clear completed jobs older than specified age
   */
  clearOldJobs(projectId: string, maxAgeMs: number = 86400000): number {
    const queue = this.getProjectQueue(projectId);
    const cutoff = Date.now() - maxAgeMs;

    const initialLength = queue.length;
    const filtered = queue.filter(job => {
      if (job.status !== 'completed' && job.status !== 'failed') {
        return true;
      }
      return job.createdAt.getTime() > cutoff;
    });

    this.queues.set(projectId, filtered);

    return initialLength - filtered.length;
  }

  /**
   * Retry failed job
   */
  async retryJob(projectId: string, jobId: string): Promise<boolean> {
    const queue = this.getProjectQueue(projectId);
    const job = queue.find(j => j.id === jobId && j.status === 'failed');

    if (job && job.attempts < job.maxAttempts) {
      job.status = 'pending';
      job.error = undefined;
      this.sortQueue(projectId);
      void this.processQueue(projectId);
      return true;
    }

    return false;
  }

  /**
   * Process queue for a project
   */
  private async processQueue(projectId: string): Promise<void> {
    if (this.processing.get(projectId)) {
      return;
    }

    this.processing.set(projectId, true);

    try {
      const queue = this.getProjectQueue(projectId);

      let job: QueueJob | undefined;
      while ((job = queue.find(j => j.status === 'pending'))) {
        await this.processJob(projectId, job);
      }
    } finally {
      this.processing.set(projectId, false);
    }
  }

  /**
   * Process a single job
   */
  private async processJob(projectId: string, job: QueueJob): Promise<void> {
    job.status = 'processing';
    job.startedAt = new Date();
    job.attempts++;

    this.logger.log(`Processing job ${job.id}: ${job.type}`);
    this.eventEmitter.emit('queue.job.started', { projectId, job });

    try {
      await this.handleJob(job);

      job.status = 'completed';
      job.completedAt = new Date();

      const processingTime = job.completedAt.getTime() - job.startedAt.getTime();
      this.trackProcessingTime(projectId, processingTime);

      this.logger.log(`Job ${job.id} completed in ${processingTime}ms`);
      this.eventEmitter.emit('queue.job.completed', { projectId, job });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      job.error = errorMessage;

      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
        this.logger.error(`Job ${job.id} failed permanently: ${errorMessage}`);
        this.eventEmitter.emit('queue.job.failed', { projectId, job, error });
      } else {
        job.status = 'pending';
        this.logger.warn(`Job ${job.id} failed, will retry: ${errorMessage}`);
        this.eventEmitter.emit('queue.job.retrying', { projectId, job, error });

        // Exponential backoff
        await this.delay(Math.pow(2, job.attempts) * 1000);
      }
    }
  }

  /**
   * Handle job based on type
   */
  private async handleJob(job: QueueJob): Promise<void> {
    switch (job.type) {
      case 'ingestion':
        await this.handleIngestionJob(job);
        break;
      case 'embedding':
        await this.handleEmbeddingJob(job);
        break;
      case 'ai_processing':
        await this.handleAIProcessingJob(job);
        break;
      case 'cleanup':
        await this.handleCleanupJob(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  /**
   * Handle ingestion job - integrates with ProjectAwareIngestionService
   */
  private async handleIngestionJob(job: QueueJob): Promise<void> {
    const payload = this.validateIngestionPayload(job.payload);
    this.logger.log(`Processing ingestion job: ${payload.documentId}`);

    const knowledgeSource = await this.prisma.knowledgeSource.findUnique({
      where: { id: payload.documentId }
    });

    if (!knowledgeSource) {
      throw new NotFoundException(`Knowledge source ${payload.documentId} not found`);
    }

    if (knowledgeSource.projectId && knowledgeSource.projectId !== job.projectId) {
      throw new BadRequestException('Job project does not match knowledge source project');
    }

    const content = knowledgeSource.originalContent || knowledgeSource.content;
    if (!content) {
      throw new BadRequestException('Knowledge source has no content to ingest');
    }

    const contentHash = this.hashContent(content);
    const embeddings = this.buildDeterministicEmbedding(content);
    const metadata = (knowledgeSource.metadata as Record<string, unknown> | null) ?? {};

    await this.prisma.$transaction(async (tx) => {
      await tx.knowledgeSource.update({
        where: { id: payload.documentId },
        data: {
          status: 'indexed',
          embedding: embeddings,
          metadata: {
            ...metadata,
            queueJobId: job.id,
            contentHash,
            lastIngestedAt: new Date().toISOString(),
          }
        }
      });

      const existingEmbedding = await tx.projectEmbedding.findUnique({
        where: { projectId_contentHash: { projectId: job.projectId, contentHash } }
      });

      const baseMetadata = (existingEmbedding?.metadata as Record<string, unknown> | null) ?? {};

      await tx.projectEmbedding.upsert({
        where: { projectId_contentHash: { projectId: job.projectId, contentHash } },
        create: {
          projectId: job.projectId,
          userId: job.userId,
          contentHash,
          embedding: embeddings,
          metadata: {
            ...baseMetadata,
            knowledgeSourceId: payload.documentId,
            sourceType: knowledgeSource.sourceType,
            ingestedAt: new Date().toISOString(),
          }
        },
        update: {
          embedding: embeddings,
          metadata: {
            ...baseMetadata,
            knowledgeSourceId: payload.documentId,
            sourceType: knowledgeSource.sourceType,
            ingestedAt: new Date().toISOString(),
          }
        }
      });

      await tx.projectAuditLog.create({
        data: {
          projectId: job.projectId,
          userId: job.userId,
          action: 'INGESTION_JOB_COMPLETED',
          resourceType: 'knowledge_source',
          resourceId: payload.documentId,
          metadata: {
            jobId: job.id,
            contentHash,
            type: job.type,
          }
        }
      });
    });

    this.eventEmitter.emit('queue.ingestion.completed', { projectId: job.projectId, jobId: job.id, knowledgeSourceId: payload.documentId });
  }

  /**
   * Handle embedding job - integrates with embedding service
   */
  private async handleEmbeddingJob(job: QueueJob): Promise<void> {
    const payload = this.validateEmbeddingPayload(job.payload);
    this.logger.log(`Processing embedding job: ${payload.sourceId}`);

    const embeddings = this.buildDeterministicEmbedding(payload.content);
    const contentHash = this.hashContent(payload.content);

    const existingEmbedding = await this.prisma.projectEmbedding.findUnique({
      where: { projectId_contentHash: { projectId: job.projectId, contentHash } }
    });
    const baseMetadata = (existingEmbedding?.metadata as Record<string, unknown> | null) ?? {};

    const knowledgeSource = payload.sourceId
      ? await this.prisma.knowledgeSource.findUnique({ where: { id: payload.sourceId } })
      : null;

    await this.prisma.$transaction(async (tx) => {
      await tx.projectEmbedding.upsert({
        where: { projectId_contentHash: { projectId: job.projectId, contentHash } },
        create: {
          projectId: job.projectId,
          userId: job.userId,
          contentHash,
          embedding: embeddings,
          metadata: {
            ...baseMetadata,
            knowledgeSourceId: payload.sourceId,
            contentLength: payload.content.length,
            generatedAt: new Date().toISOString(),
          }
        },
        update: {
          embedding: embeddings,
          metadata: {
            ...baseMetadata,
            knowledgeSourceId: payload.sourceId,
            contentLength: payload.content.length,
            generatedAt: new Date().toISOString(),
          }
        }
      });

      if (knowledgeSource) {
        const currentMetadata = (knowledgeSource.metadata as Record<string, unknown> | null) ?? {};
        await tx.knowledgeSource.update({
          where: { id: knowledgeSource.id },
          data: {
            embedding: embeddings,
            metadata: {
              ...currentMetadata,
              embeddingId: contentHash,
              lastEmbeddedAt: new Date().toISOString(),
            }
          }
        });
      }

      await tx.projectAuditLog.create({
        data: {
          projectId: job.projectId,
          userId: job.userId,
          action: 'EMBEDDING_JOB_COMPLETED',
          resourceType: payload.sourceId ? 'knowledge_source' : 'project',
          resourceId: payload.sourceId ?? job.projectId,
          metadata: {
            jobId: job.id,
            contentHash,
            type: job.type,
          }
        }
      });
    });

    this.eventEmitter.emit('queue.embedding.completed', { projectId: job.projectId, jobId: job.id, sourceId: payload.sourceId });
  }

  /**
   * Handle AI processing job - integrates with AI service
   */
  private async handleAIProcessingJob(job: QueueJob): Promise<void> {
    const payload = this.validateAIProcessingPayload(job.payload);
    this.logger.log(`Processing AI job: ${payload.operation}`);

    const tokens = this.estimateTokens(payload.input);

    await this.prisma.aIUsage.create({
      data: {
        projectId: job.projectId,
        userId: job.userId,
        model: 'queue-ai-router',
        tokens,
        operation: payload.operation,
        endpoint: 'queue-job',
        metadata: {
          jobId: job.id,
          inputPreview: this.safeTruncate(
            typeof payload.input === 'string' ? payload.input : JSON.stringify(payload.input),
            500
          ),
        }
      }
    });

    await this.prisma.projectAuditLog.create({
      data: {
        projectId: job.projectId,
        userId: job.userId,
        action: 'AI_JOB_PROCESSED',
        resourceType: 'queue_job',
        resourceId: job.id,
        metadata: {
          operation: payload.operation,
          tokens,
        }
      }
    });

    this.eventEmitter.emit('queue.ai.completed', { projectId: job.projectId, jobId: job.id, operation: payload.operation });
  }

  /**
   * Handle cleanup job - integrates with cleanup service
   */
  private async handleCleanupJob(job: QueueJob): Promise<void> {
    const payload = this.validateCleanupPayload(job.payload);
    this.logger.log(`Processing cleanup job: ${payload.cleanupType}`);

    switch (payload.cleanupType) {
      case 'queue': {
        this.clearOldJobs(job.projectId);
        break;
      }
      case 'embeddings': {
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await this.prisma.projectEmbedding.deleteMany({
          where: { projectId: job.projectId, updatedAt: { lt: cutoff } }
        });
        break;
      }
      case 'audit': {
        const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        await this.prisma.projectAuditLog.deleteMany({
          where: { projectId: job.projectId, timestamp: { lt: cutoff } }
        });
        break;
      }
      default: {
        this.logger.warn(`No cleanup handler for type ${payload.cleanupType}`);
      }
    }

    this.eventEmitter.emit('queue.cleanup.completed', { projectId: job.projectId, jobId: job.id, type: payload.cleanupType });
  }

  // Helper methods

  private validateIngestionPayload(payload: JobPayload): IngestionJobPayload {
    if (
      payload &&
      typeof payload === 'object' &&
      typeof (payload as IngestionJobPayload).documentId === 'string' &&
      (payload as IngestionJobPayload).action === 'ingest'
    ) {
      return payload as IngestionJobPayload;
    }
    throw new BadRequestException('Invalid ingestion job payload');
  }

  private validateEmbeddingPayload(payload: JobPayload): EmbeddingJobPayload {
    if (
      payload &&
      typeof payload === 'object' &&
      typeof (payload as EmbeddingJobPayload).sourceId === 'string' &&
      typeof (payload as EmbeddingJobPayload).content === 'string' &&
      (payload as EmbeddingJobPayload).content.length > 0
    ) {
      return payload as EmbeddingJobPayload;
    }
    throw new BadRequestException('Invalid embedding job payload');
  }

  private validateAIProcessingPayload(payload: JobPayload): AIProcessingJobPayload {
    if (
      payload &&
      typeof payload === 'object' &&
      typeof (payload as AIProcessingJobPayload).operation === 'string' &&
      (payload as AIProcessingJobPayload).operation.length > 0
    ) {
      return payload as AIProcessingJobPayload;
    }
    throw new BadRequestException('Invalid AI processing job payload');
  }

  private validateCleanupPayload(payload: JobPayload): CleanupJobPayload {
    if (
      payload &&
      typeof payload === 'object' &&
      typeof (payload as CleanupJobPayload).cleanupType === 'string'
    ) {
      return payload as CleanupJobPayload;
    }
    throw new BadRequestException('Invalid cleanup job payload');
  }

  private hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private buildDeterministicEmbedding(content: string, dimension = 128): number[] {
    const seed = crypto.createHash('sha256').update(content).digest();
    const embeddings: number[] = [];
    let counter = 0;

    while (embeddings.length < dimension) {
      const hash = crypto.createHash('sha256');
      hash.update(seed);
      hash.update(Buffer.from(counter.toString()));
      const chunk = hash.digest();

      for (let i = 0; i < chunk.length && embeddings.length < dimension; i += 2) {
        const value = (chunk[i] << 8) + chunk[i + 1];
        embeddings.push((value / 65535) * 2 - 1);
      }

      counter++;
    }

    return embeddings;
  }

  private estimateTokens(input: unknown): number {
    const serialized = typeof input === 'string' ? input : JSON.stringify(input ?? {});
    return Math.max(1, Math.ceil(serialized.length / 4));
  }

  private safeTruncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
  }

  private getProjectQueue(projectId: string): QueueJob[] {
    if (!this.queues.has(projectId)) {
      this.queues.set(projectId, []);
    }
    return this.queues.get(projectId)!;
  }

  private sortQueue(projectId: string): void {
    const queue = this.getProjectQueue(projectId);
    queue.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      return a.priority - b.priority;
    });
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private trackProcessingTime(projectId: string, time: number): void {
    const projectStats = this.stats.get(projectId) ?? { total: 0, totalTime: 0 };
    projectStats.total++;
    projectStats.totalTime += time;
    this.stats.set(projectId, projectStats);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
