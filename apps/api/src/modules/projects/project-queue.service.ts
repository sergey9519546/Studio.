import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface QueueJob {
  id: string;
  projectId: string;
  userId: string;
  type: string;
  payload: Record<string, any>;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface QueueOptions {
  priority?: number;
  delay?: number;
  maxAttempts?: number;
}

export interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
}

@Injectable()
export class ProjectQueueService {
  private readonly logger = new Logger(ProjectQueueService.name);
  
  // In-memory queue (in production, use Redis, Bull, or similar)
  private queues: Map<string, QueueJob[]> = new Map();
  private processing: Map<string, boolean> = new Map();
  private stats: Map<string, { total: number; totalTime: number }> = new Map();

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Add a job to the project queue
   */
  async enqueue(
    projectId: string,
    userId: string,
    type: string,
    payload: Record<string, any>,
    options: QueueOptions = {}
  ): Promise<string> {
    const job: QueueJob = {
      id: this.generateJobId(),
      projectId,
      userId,
      type,
      payload,
      priority: options.priority || 5,
      status: 'pending',
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
    };

    // Get or create project queue
    const queue = this.getProjectQueue(projectId);
    
    // Add job with delay if specified
    if (options.delay && options.delay > 0) {
      setTimeout(() => {
        queue.push(job);
        this.sortQueue(projectId);
        this.processQueue(projectId);
      }, options.delay);
    } else {
      queue.push(job);
      this.sortQueue(projectId);
      this.processQueue(projectId);
    }

    this.logger.log(`Job ${job.id} enqueued for project ${projectId}: ${type}`);
    
    // Emit event
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
    return this.enqueue(projectId, userId, 'ingestion', {
      documentId,
      action: 'ingest',
    }, { ...options, priority: options.priority || 3 });
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
    return this.enqueue(projectId, userId, 'embedding', {
      sourceId,
      content,
    }, { ...options, priority: options.priority || 5 });
  }

  /**
   * Add AI processing job
   */
  async enqueueAIProcessing(
    projectId: string,
    userId: string,
    operation: string,
    input: any,
    options: QueueOptions = {}
  ): Promise<string> {
    return this.enqueue(projectId, userId, 'ai_processing', {
      operation,
      input,
    }, { ...options, priority: options.priority || 7 });
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
    return this.enqueue(projectId, userId, 'cleanup', {
      cleanupType,
    }, { ...options, priority: options.priority || 10 });
  }

  /**
   * Get job status
   */
  getJobStatus(projectId: string, jobId: string): QueueJob | null {
    const queue = this.getProjectQueue(projectId);
    return queue.find(job => job.id === jobId) || null;
  }

  /**
   * Get all jobs for a project
   */
  getProjectJobs(projectId: string, status?: string): QueueJob[] {
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
    const stats = this.stats.get(projectId) || { total: 0, totalTime: 0 };
    
    return {
      pending: queue.filter(j => j.status === 'pending').length,
      processing: queue.filter(j => j.status === 'processing').length,
      completed: queue.filter(j => j.status === 'completed').length,
      failed: queue.filter(j => j.status === 'failed').length,
      avgProcessingTime: stats.total > 0 ? stats.totalTime / stats.total : 0,
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
      this.processQueue(projectId);
      return true;
    }
    
    return false;
  }

  /**
   * Process queue for a project
   */
  private async processQueue(projectId: string): Promise<void> {
    // Check if already processing
    if (this.processing.get(projectId)) {
      return;
    }

    this.processing.set(projectId, true);

    try {
      const queue = this.getProjectQueue(projectId);
      
      while (true) {
        const job = queue.find(j => j.status === 'pending');
        
        if (!job) {
          break;
        }

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
      // Route to appropriate handler
      await this.handleJob(job);
      
      job.status = 'completed';
      job.completedAt = new Date();
      
      // Track stats
      const processingTime = job.completedAt.getTime() - job.startedAt.getTime();
      this.trackProcessingTime(projectId, processingTime);
      
      this.logger.log(`Job ${job.id} completed in ${processingTime}ms`);
      this.eventEmitter.emit('queue.job.completed', { projectId, job });
      
    } catch (error: any) {
      job.error = error.message;
      
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
        this.logger.error(`Job ${job.id} failed permanently: ${error.message}`);
        this.eventEmitter.emit('queue.job.failed', { projectId, job, error });
      } else {
        job.status = 'pending';
        this.logger.warn(`Job ${job.id} failed, will retry: ${error.message}`);
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

  private async handleIngestionJob(job: QueueJob): Promise<void> {
    // Placeholder - integrate with ProjectAwareIngestionService
    this.logger.log(`Processing ingestion job: ${job.payload.documentId}`);
    await this.delay(100); // Simulate processing
  }

  private async handleEmbeddingJob(job: QueueJob): Promise<void> {
    // Placeholder - integrate with embedding service
    this.logger.log(`Processing embedding job: ${job.payload.sourceId}`);
    await this.delay(200); // Simulate processing
  }

  private async handleAIProcessingJob(job: QueueJob): Promise<void> {
    // Placeholder - integrate with AI service
    this.logger.log(`Processing AI job: ${job.payload.operation}`);
    await this.delay(500); // Simulate processing
  }

  private async handleCleanupJob(job: QueueJob): Promise<void> {
    // Placeholder - integrate with cleanup service
    this.logger.log(`Processing cleanup job: ${job.payload.cleanupType}`);
    await this.delay(100); // Simulate processing
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
      // Sort by status (pending first)
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      // Then by priority (lower is higher priority)
      return a.priority - b.priority;
    });
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackProcessingTime(projectId: string, time: number): void {
    const stats = this.stats.get(projectId) || { total: 0, totalTime: 0 };
    stats.total++;
    stats.totalTime += time;
    this.stats.set(projectId, stats);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
