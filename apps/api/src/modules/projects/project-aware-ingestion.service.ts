import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProjectContextService } from './project-context.service.js';
import { file } from 'zod/v4';

export interface IngestionOptions {
  sensitivityLevel?: 'standard' | 'confidential' | 'restricted';
  encryptContent?: boolean;
  classifyContent?: boolean;
  retentionPolicy?: 'standard' | 'extended' | 'indefinite';
}

export interface IngestionResult {
  id: string;
  projectId: string;
  userId: string;
  contentHash: string;
  embeddingId?: string;
  status: 'processed' | 'encrypted' | 'archived';
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface DocumentMetadata extends Record<string, any> {
  projectId: string;
  userId: string;
  sourceType: string;
  sourceId?: string;
  title?: string;
  category: string;
  tags?: string[];
  sensitivityLevel: 'standard' | 'confidential' | 'restricted';
  encryptionStatus?: 'unencrypted' | 'encrypted' | 'hsm_encrypted';
  classificationConfidence?: number;
  ingestionTimestamp?: Date;
  contentClassification?: string;
  model?: string;
  dimension?: number;
}

export interface FileLike {
  buffer?: Buffer;
  text?: string;
  originalname?: string;
  name?: string;
  size?: number;
  mimetype?: string;
  type?: string;
}

@Injectable()
export class ProjectAwareIngestionService {
  private readonly CONTENT_HASH_ALGORITHM = 'sha256';

  constructor(
    private prisma: PrismaService,
    private projectContextService: ProjectContextService,
  ) {}

  async ingestDocument(
    file: FileLike, 
    projectId: string, 
    userId: string,
    options: IngestionOptions = {}
  ): Promise<IngestionResult> {
    // 1. Validate project access and quotas
    await this.validateProjectAccess(projectId, userId, 'write');
    await this.validateProjectQuotas(projectId, userId);

    // 2. Extract and process content
    const content = await this.extractContent(file);
    const metadata = this.extractMetadata(file, projectId, userId, options);

    // 3. Encrypt sensitive content if required
    let processedContent = content;
    let encryptionStatus = 'unencrypted';

    if (options.encryptContent || metadata.sensitivityLevel !== 'standard') {
      const encryptionResult = await this.encryptSensitiveContent(
        content,
        projectId,
        metadata.sensitivityLevel
      );
      processedContent = encryptionResult.encryptedContent;
      encryptionStatus = encryptionResult.encryptionStatus;
    }

    // 4. Create content hash for deduplication
    const contentHash = await this.hashContent(processedContent);

    // 5. Check for duplicate content
    const existingEmbedding = await this.prisma.projectEmbedding.findUnique({
      where: {
        projectId_contentHash: {
          projectId,
          contentHash
        }
      }
    });

    if (existingEmbedding) {
      throw new BadRequestException('Content already exists in this project');
    }

    // 6. Classify content if requested
    if (options.classifyContent) {
      metadata.classificationConfidence = await this.classifyContent(processedContent);
    }

    // 7. Generate project-scoped embeddings
    const embeddingBatch = await this.createProjectScopedEmbeddings(
      processedContent,
      metadata
    );

    // 8. Store with project isolation
    const ingestionResult = await this.prisma.$transaction(async (tx) => {
      // Create knowledge source with project isolation
      const knowledgeSource = await tx.knowledgeSource.create({
        data: {
          title: metadata.title || 'Untitled Document',
          content: processedContent,
          category: metadata.category,
          sourceType: metadata.sourceType,
          sourceId: metadata.sourceId,
          projectId,
          userId,
          metadata,
          embedding: embeddingBatch.embeddings,
          status: 'indexed',
          type: 'document',
          originalContent: content,
          accessLevel: metadata.sensitivityLevel === 'restricted' ? 'private' : 'team',
          encryptionStatus,
          complianceFlags: this.getComplianceFlags(metadata.sensitivityLevel),
          classificationConfidence: metadata.classificationConfidence,
          retentionPolicy: options.retentionPolicy || 'standard',
        }
      });

      // Create project-scoped embedding
      const projectEmbedding = await tx.projectEmbedding.create({
        data: {
          projectId,
          userId,
          contentHash,
          embedding: embeddingBatch.embeddings,
          metadata: {
            ...metadata,
            knowledgeSourceId: knowledgeSource.id,
            ingestionTimestamp: new Date(),
            encryptionStatus,
          }
        }
      });

      // Log audit event
      await tx.projectAuditLog.create({
        data: {
          projectId,
          userId,
          action: 'INGEST_DOCUMENT',
          resourceType: 'knowledge_source',
          resourceId: knowledgeSource.id,
          metadata: {
            fileName: file.originalname || file.name,
            fileSize: file.size,
            sensitivityLevel: metadata.sensitivityLevel,
            encryptionStatus,
            contentHash,
          }
        }
      });

      // Update project metrics
      await this.updateProjectMetrics(projectId, 'document_ingested');

      const finalStatus: 'processed' | 'encrypted' | 'archived' = 
        encryptionStatus === 'unencrypted' ? 'processed' : 'encrypted';

      return {
        id: knowledgeSource.id,
        projectId,
        userId,
        contentHash,
        embeddingId: projectEmbedding.id,
        status: finalStatus,
        metadata: {
          ...metadata,
          knowledgeSourceId: knowledgeSource.id,
          embeddingId: projectEmbedding.id,
        },
        createdAt: new Date(),
      };
    });

    // 9. Update project knowledge graph
    await this.updateProjectKnowledgeGraph(projectId, ingestionResult.id);

    // 10. Track usage metrics
    await this.trackIngestionMetrics(projectId, userId, options);

    return ingestionResult;
  }

  async ingestConversation(
    conversationId: string,
    projectId: string,
    userId: string,
    options: IngestionOptions = {}
  ): Promise<IngestionResult> {
    // Validate access
    await this.validateProjectAccess(projectId, userId, 'write');

    // Get conversation data
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true }
    });

    if (!conversation || conversation.projectId !== projectId) {
      throw new BadRequestException('Conversation not found in project');
    }

    // Process conversation content
    const content = this.extractConversationContent(conversation);
    const metadata: DocumentMetadata = {
      projectId,
      userId,
      sourceType: 'conversation',
      sourceId: conversationId,
      title: conversation.title || 'Conversation',
      category: 'conversation',
      sensitivityLevel: (conversation.sensitivityLevel as 'standard' | 'confidential' | 'restricted') || 'standard',
      encryptionStatus: conversation.encryptionKeyId ? 'encrypted' : 'unencrypted',
    };

    // Create embeddings and store
    return this.ingestTextContent(content, metadata, options);
  }

  async ingestTextContent(
    content: string,
    metadata: DocumentMetadata,
    options: IngestionOptions = {}
  ): Promise<IngestionResult> {
    await this.validateProjectAccess(metadata.projectId, metadata.userId, 'write');

    const contentHash = await this.hashContent(content);
    
    // Check for duplicates
    const existing = await this.prisma.projectEmbedding.findUnique({
      where: {
        projectId_contentHash: {
          projectId: metadata.projectId,
          contentHash
        }
      }
    });

    if (existing) {
      throw new BadRequestException('Content already exists in this project');
    }

    // Create embeddings
    const embeddingBatch = await this.createProjectScopedEmbeddings(content, metadata);

    // Store with transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const knowledgeSource = await tx.knowledgeSource.create({
        data: {
          title: metadata.title || 'Text Content',
          content,
          category: metadata.category,
          sourceType: metadata.sourceType,
          sourceId: metadata.sourceId,
          projectId: metadata.projectId,
          userId: metadata.userId,
          metadata,
          embedding: embeddingBatch.embeddings,
          status: 'indexed',
          type: 'text',
          accessLevel: metadata.sensitivityLevel === 'restricted' ? 'private' : 'team',
          encryptionStatus: metadata.encryptionStatus || 'unencrypted',
          complianceFlags: this.getComplianceFlags(metadata.sensitivityLevel),
          retentionPolicy: options.retentionPolicy || 'standard',
        }
      });

      await tx.projectEmbedding.create({
        data: {
          projectId: metadata.projectId,
          userId: metadata.userId,
          contentHash,
          embedding: embeddingBatch.embeddings,
          metadata: {
            ...metadata,
            knowledgeSourceId: knowledgeSource.id,
            ingestionTimestamp: new Date(),
          }
        }
      });

      return {
        id: knowledgeSource.id,
        projectId: metadata.projectId,
        userId: metadata.userId,
        contentHash,
        status: 'processed' as const,
        metadata: {
          ...metadata,
          knowledgeSourceId: knowledgeSource.id,
        },
        createdAt: new Date(),
      };
    });

    return result;
  }

  private async createProjectScopedEmbeddings(
    content: string,
    metadata: DocumentMetadata
  ) {
    // Generate embeddings (this would integrate with your actual embedding service)
    const embeddings = await this.generateEmbeddings(content);
    
    return {
      projectId: metadata.projectId,
      userId: metadata.userId,
      contentHash: await this.hashContent(content),
      embeddings,
      metadata: {
        ...metadata,
        ingestionTimestamp: new Date(),
        contentClassification: await this.classifyContent(content),
        model: 'text-embedding-004', // Example model
        dimension: embeddings.length,
      }
    };
  }

  private async generateEmbeddings(content: string): Promise<number[]> {
    // Placeholder for actual embedding generation
    // This would integrate with OpenAI, Vertex AI, or local embedding models
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  private async encryptSensitiveContent(
    content: string,
    projectId: string,
    sensitivityLevel: 'standard' | 'confidential' | 'restricted'
  ): Promise<{ encryptedContent: string; encryptionStatus: string }> {
    // Get project encryption key
    const encryptionKey = await this.getProjectEncryptionKey(projectId);

    if (sensitivityLevel === 'restricted') {
      // Use HSM encryption for restricted content
      return {
        encryptedContent: await this.hsmEncrypt(content, encryptionKey),
        encryptionStatus: 'hsm_encrypted'
      };
    } else {
      // Use application-level encryption
      return {
        encryptedContent: await this.aesEncrypt(content, encryptionKey),
        encryptionStatus: 'encrypted'
      };
    }
  }

  private async getProjectEncryptionKey(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { encryptionKeyId: true }
    });

    if (!project?.encryptionKeyId) {
      // Generate new encryption key for project
      const keyId = crypto.randomBytes(32).toString('hex');
      await this.prisma.project.update({
        where: { id: projectId },
        data: { encryptionKeyId: keyId }
      });
      return keyId;
    }

    return project.encryptionKeyId;
  }

  private async aesEncrypt(content: string, key: string): Promise<string> {
    // Simplified AES encryption - replace with proper implementation
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private async hsmEncrypt(content: string, key: string): Promise<string> {
    // Placeholder for HSM encryption
    // In production, this would integrate with AWS KMS, GCP KMS, or Azure Key Vault
    return `HSM_ENCRYPTED_${content.length}_${Date.now()}`;
  }

  private async hashContent(content: string): Promise<string> {
    return crypto.createHash(this.CONTENT_HASH_ALGORITHM)
      .update(content)
      .digest('hex');
  }

  private async classifyContent(content: string): Promise<number> {
    // Placeholder for content classification
    // This would use ML models to classify content sensitivity
    return Math.random(); // Returns confidence score 0-1
  }

  private getComplianceFlags(sensitivityLevel: string): Record<string, boolean> {
    const flags: Record<string, boolean> = {};
    
    if (sensitivityLevel === 'restricted') {
      flags.gdpr = true;
      flags.hipaa = true;
      flags.sox = true;
    } else if (sensitivityLevel === 'confidential') {
      flags.gdpr = true;
      flags.sox = true;
    }
    
    return flags;
  }

  private async extractContent(file: FileLike): Promise<string> {
    // Placeholder for content extraction from various file types
    if (file.buffer) {
      return file.buffer.toString('utf8');
    }
    if (file.text) {
      return file.text;
    }
    return '';
  }

  private extractMetadata(file: FileLike, projectId: string, userId: string, options: IngestionOptions): DocumentMetadata {
    return {
      projectId,
      userId,
      sourceType: 'file',
      title: file.originalname || file.name,
      category: this.inferCategory(file.mimetype || file.type),
      sensitivityLevel: options.sensitivityLevel || 'standard',
      encryptionStatus: options.encryptContent ? 'encrypted' : 'unencrypted',
      tags: [],
    };
  }

  private inferCategory(mimeType?: string): string {
    if (!mimeType) return 'unknown';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('audio')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('text')) return 'text';
    return 'unknown';
  }

  private extractConversationContent(conversation: any): string {
    return conversation.messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  private async validateProjectAccess(projectId: string, userId: string, permission: string): Promise<void> {
    const hasAccess = await this.projectContextService.validateProjectAccess(
      userId,
      projectId,
      permission
    );

    if (!hasAccess) {
      throw new ForbiddenException(`Insufficient permissions: ${permission}`);
    }
  }

  private async validateProjectQuotas(projectId: string, _userId: string): Promise<void> {
    // Check storage quotas, API limits, etc.
    // This would integrate with your quota management system
    const currentUsage = await this.getCurrentUsage(projectId);
    const limits = await this.getProjectLimits(projectId);

    if (currentUsage.documents >= limits.maxDocuments) {
      throw new BadRequestException('Project document limit exceeded');
    }
  }

  private async getCurrentUsage(projectId: string): Promise<{ documents: number; storage: number }> {
    const [documents, storage] = await Promise.all([
      this.prisma.knowledgeSource.count({ where: { projectId } }),
      this.prisma.projectEmbedding.aggregate({
        where: { projectId },
        _count: { id: true }
      })
    ]);

    return {
      documents,
      storage: storage._count.id
    };
  }

  private async getProjectLimits(_projectId: string): Promise<{ maxDocuments: number; maxStorage: number }> {
    // Get limits based on project tier/plan
    return {
      maxDocuments: 10000,
      maxStorage: 1024 * 1024 * 1024 // 1GB
    };
  }

  private async updateProjectMetrics(_projectId: string, _metric: string): Promise<void> {
    // Update project health metrics
    await this.projectContextService.getProjectHealth(_projectId);
  }

  private async updateProjectKnowledgeGraph(_projectId: string, _knowledgeSourceId: string): Promise<void> {
    // Update knowledge graph relationships
    // This would integrate with your graph database or knowledge graph service
  }

  private async trackIngestionMetrics(projectId: string, userId: string, options: IngestionOptions): Promise<void> {
    await this.prisma.aIUsage.create({
      data: {
        projectId,
        userId,
        model: 'ingestion-service',
        tokens: 0,
        operation: 'document_ingestion',
        metadata: {
          sensitivityLevel: options.sensitivityLevel,
          encryptContent: options.encryptContent,
          classifyContent: options.classifyContent,
        }
      }
    });
  }
}
