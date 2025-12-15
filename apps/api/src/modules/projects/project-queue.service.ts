import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    const payload = job.payload as IngestionJobPayload;
    this.logger.log(`Processing ingestion job: ${payload.documentId}`);
    
    // TODO: Integrate with actual ProjectAwareIngestionService
    // For now, simulate processing
    await this.delay(100);
    
    // In production, this would:
    // 1. Fetch document from storage
    // 2. Parse and chunk content
    // 3. Generate embeddings
    // 4. Store in vector database
    // 5. Update document status
  }

  /**
   * Handle embedding job - integrates with embedding service
   */
  private async handleEmbeddingJob(job: QueueJob): Promise<void> {
    const payload = job.payload as EmbeddingJobPayload;
    this.logger.log(`Processing embedding job: ${payload.sourceId}`);
    
    // TODO: Integrate with actual EmbeddingsService
    await this.delay(200);
    
    // In production, this would:
    // 1. Generate embeddings for content
    // 2. Store embeddings in vector store
    // 3. Update source metadata
  }

  /**
   * Handle AI processing job - integrates with AI service
   */
  private async handleAIProcessingJob(job: QueueJob): Promise<void> {
    const payload = job.payload as AIProcessingJobPayload;
    this.logger.log(`Processing AI job: ${payload.operation}`);
    
    // TODO: Integrate with actual AI service (GeminiService/VertexAI)
    await this.delay(500);
    
    // In production, this would:
    // 1. Route to appropriate AI operation
    // 2. Process request
    // 3. Store results
    // 4. Handle token tracking
  }

  /**
   * Handle cleanup job - integrates with cleanup service
   */
  private async handleCleanupJob(job: QueueJob): Promise<void> {
    const payload = job.payload as CleanupJobPayload;
    this.logger.log(`Processing cleanup job: ${payload.cleanupType}`);
    
    // TODO: Integrate with cleanup services
    await this.delay(100);
    
    // In production, this would:
    // 1. Remove stale embeddings
    // 2. Clean up temporary files
    // 3. Archive old conversations
    // 4. Update indexes
  }

  // Helper methods

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
