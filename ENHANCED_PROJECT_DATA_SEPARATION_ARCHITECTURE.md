# Enhanced Project-Based Data Separation Architecture

## Executive Summary

This document provides a comprehensive architectural improvement to the original project data separation design, addressing security, scalability, observability, and maintainability concerns while building upon the existing Studio Roster platform foundation.

## Current System Analysis

### Strengths Identified

- **Comprehensive Database Schema**: Well-designed Prisma schema with proper project relationships
- **Existing Project Module**: Functional ProjectsService with CRUD operations
- **RAG Implementation**: Working vector search and context management system
- **Authentication Foundation**: User management with Google OAuth support
- **Cloud Infrastructure**: Firebase deployment ready

### Critical Weaknesses

- **Incomplete Project Context Isolation**: RAG service doesn't enforce project boundaries
- **Missing Security Layer**: No row-level security for project data
- **No Data Lifecycle Management**: Lack of project deletion cascades and data archival
- **Limited Monitoring**: No project-specific metrics or audit trails
- **Scalability Bottlenecks**: Vector search lacks project-based indexing strategies

## Enhanced Architecture Overview

### Core Principles

1. **Zero-Trust Project Boundaries**: Every data access must be project-scoped
2. **Defense in Depth**: Multiple layers of project isolation
3. **Observable by Design**: Every operation is traceable to project context
4. **Performance-First**: Optimized for multi-tenant project scenarios
5. **Developer Experience**: Clear APIs and comprehensive tooling

## 🏗️ Improved Service Architecture

### 1. Project Context Service (Cloud Run)

```typescript
// Enhanced project management with security and observability
@Injectable()
export class ProjectContextService {
  async createProject(userId: string, projectData: CreateProjectDTO): Promise<ProjectResponse> {
    // 1. Validate user permissions
    // 2. Create project with encryption
    // 3. Initialize project-specific resources
    // 4. Setup monitoring and audit trails
    // 5. Return project context
  }

  async switchProjectContext(userId: string, projectId: string): Promise<ProjectContext> {
    // 1. Validate user access to project
    // 2. Generate project-specific JWT context
    // 3. Setup project-scoped cache
    // 4. Initialize project metrics
    // 5. Return enriched project context
  }

  async archiveProject(projectId: string, reason: string): Promise<void> {
    // 1. Soft delete with data retention policy
    // 2. Archive embeddings and vector data
    // 3. Update audit trails
    // 4. Notify all services
  }
}
```

### 2. Enhanced Ingestion Service

```typescript
@Injectable()
export class ProjectAwareIngestionService {
  async ingestDocument(
    file: UploadedFile, 
    projectId: string, 
    userId: string,
    options: IngestionOptions = {}
  ): Promise<IngestionResult> {
    // 1. Validate project access and quotas
    // 2. Encrypt sensitive content
    // 3. Create project-specific embeddings
    // 4. Store with project isolation
    // 5. Update project knowledge graph
    // 6. Track usage metrics
  }

  private async createProjectScopedEmbeddings(
    content: string, 
    metadata: DocumentMetadata
  ): Promise<EmbeddingBatch> {
    return {
      projectId: metadata.projectId,
      userId: metadata.userId,
      contentHash: await this.hashContent(content),
      embeddings: await this.generateEmbeddings(content),
      metadata: {
        ...metadata,
        ingestionTimestamp: new Date(),
        contentClassification: await this.classifyContent(content)
      }
    };
  }
}
```

### 3. Context-Aware AI Service

```typescript
@Injectable()
export class ProjectScopedAIService {
  async processQuery(
    query: string, 
    projectContext: ProjectContext,
    options: AIQueryOptions = {}
  ): Promise<AIResponse> {
    // 1. Validate project context and permissions
    // 2. Filter embeddings by project scope
    // 3. Apply project-specific AI prompts
    // 4. Generate response with project context
    // 5. Log usage with project attribution
    // 6. Return scoped response
  }

  private async filterEmbeddingsByProject(
    query: string, 
    projectId: string, 
    options: SearchOptions
  ): Promise<ProjectScopedDocument[]> {
    return this.vectorStore.hybridSearch(query, {
      ...options,
      filters: {
        projectId,
        accessLevel: await this.getUserAccessLevel(projectId),
        contentTypes: options.contentTypes || ['document', 'asset', 'conversation']
      }
    });
  }
}
```

## 🗄️ Enhanced Database Schema

### Project Isolation Tables

```sql
-- Project-scoped embeddings table
CREATE TABLE project_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content_hash VARCHAR(64) NOT NULL,
    embedding_vector vector(1536), -- OpenAI embedding dimension
    metadata JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Project-scoped indexes
    CONSTRAINT project_embeddings_project_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Unique constraints per project
    UNIQUE(project_id, content_hash)
);

-- Vector similarity search index
CREATE INDEX ON project_embeddings USING ivfflat (embedding_vector vector_cosine_ops)
WITH (lists = 100);

-- Project access control
CREATE TABLE project_access_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL, -- 'owner', 'editor', 'viewer'
    permissions JSONB NOT NULL, -- Granular permissions
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    
    UNIQUE(project_id, user_id)
);

-- Project audit trail
CREATE TABLE project_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enhanced Existing Tables

```sql
-- Add to existing projects table
ALTER TABLE projects ADD COLUMN:
    encryption_key_id VARCHAR(100), -- For encrypted content
    data_retention_days INTEGER DEFAULT 2555, -- 7 years default
    access_level VARCHAR(20) DEFAULT 'private', -- 'private', 'team', 'public'
    compliance_flags JSONB DEFAULT '{}', -- GDPR, HIPAA, etc.
    created_by UUID REFERENCES users(id),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    deletion_scheduled_at TIMESTAMP WITH TIME ZONE;

-- Add to existing knowledge_sources table
ALTER TABLE knowledge_sources ADD COLUMN:
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    access_level VARCHAR(20) DEFAULT 'private',
    encryption_status VARCHAR(20) DEFAULT 'unencrypted',
    compliance_flags JSONB DEFAULT '{}',
    classification_confidence FLOAT,
    retention_policy VARCHAR(50) DEFAULT 'standard';

-- Add to existing conversations table
ALTER TABLE conversations ADD COLUMN:
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sensitivity_level VARCHAR(20) DEFAULT 'standard', -- 'public', 'internal', 'confidential'
    encryption_key_id VARCHAR(100),
    auto_delete_at TIMESTAMP WITH TIME ZONE;
```

## 🔐 Security Enhancements

### 1. Row-Level Security (RLS)

```sql
-- Enable RLS on all project-scoped tables
ALTER TABLE project_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their project embeddings" ON project_embeddings
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_access_control 
            WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );

CREATE POLICY "Project owners can manage access control" ON project_access_control
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_access_control 
            WHERE user_id = current_setting('app.current_user_id')::UUID 
            AND role = 'owner'
        )
    );
```

### 2. Content Encryption Strategy

```typescript
@Injectable()
export class ProjectEncryptionService {
  async encryptSensitiveContent(
    content: string, 
    projectId: string, 
    sensitivityLevel: 'standard' | 'confidential' | 'restricted'
  ): Promise<EncryptedContent> {
    const encryptionKey = await this.getProjectEncryptionKey(projectId);
    
    if (sensitivityLevel === 'restricted') {
      // Use hardware security module (HSM)
      return this.hsmEncrypt(content, encryptionKey);
    } else {
      // Use application-level encryption
      return this.aesEncrypt(content, encryptionKey);
    }
  }

  private async getProjectEncryptionKey(projectId: string): Promise<CryptoKey> {
    // Retrieve project-specific encryption key from secure key management
    const keyId = await this.getProjectKeyId(projectId);
    return this.keyManager.retrieveKey(keyId);
  }
}
```

### 3. API Security Middleware

```typescript
@Injectable()
export class ProjectContextMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // 1. Extract project context from JWT
    const projectContext = await this.validateProjectContext(req);
    
    // 2. Set project-scoped request context
    req.projectContext = projectContext;
    
    // 3. Add project-specific headers
    res.setHeader('X-Project-ID', projectContext.projectId);
    res.setHeader('X-Project-Access-Level', projectContext.accessLevel);
    
    // 4. Log access attempt
    await this.auditService.logAccess(projectContext, req);
    
    next();
  }
}
```

## 📊 Monitoring & Observability

### 1. Project Metrics Dashboard

```typescript
@Injectable()
export class ProjectMetricsService {
  async getProjectHealth(projectId: string): Promise<ProjectHealthMetrics> {
    const [
      documentCount,
      conversationCount,
      storageUsed,
      aiUsage,
      lastActivity
    ] = await Promise.all([
      this.countDocuments(projectId),
      this.countConversations(projectId),
      this.calculateStorageUsage(projectId),
      this.getAIUsageMetrics(projectId),
      this.getLastActivity(projectId)
    ]);

    return {
      projectId,
      healthScore: this.calculateHealthScore({
        documentCount,
        conversationCount,
        storageUsed,
        aiUsage,
        lastActivity
      }),
      metrics: {
        documents: documentCount,
        conversations: conversationCount,
        storageBytes: storageUsed,
        aiTokensUsed: aiUsage.tokens,
        lastActivity: lastActivity
      },
      alerts: await this.checkHealthAlerts(projectId)
    };
  }
}
```

### 2. Distributed Tracing

```typescript
@Injectable()
export class ProjectTracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.projectContext?.projectId;
    const traceId = generateTraceId();

    // Add project context to tracing span
    const span = this.tracer.startSpan(`${request.method} ${request.path}`);
    span.setTag('project.id', projectId);
    span.setTag('user.id', request.user?.id);
    span.setTag('trace.id', traceId);

    return next.handle().pipe(
      tap(() => span.finish()),
      catchError((error) => {
        span.setTag('error', true);
        span.log({ error: error.message });
        span.finish();
        throw error;
      })
    );
  }
}
```

### 3. Audit & Compliance Logging

```typescript
@Injectable()
export class ProjectAuditService {
  async logDataAccess(
    projectId: string,
    userId: string,
    action: DataAccessAction,
    resource: AuditResource
  ): Promise<void> {
    const auditEvent = {
      projectId,
      userId,
      action,
      resource,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      complianceFlags: await this.getProjectComplianceFlags(projectId)
    };

    // Store in audit log
    await this.auditRepository.create(auditEvent);

    // Real-time monitoring for sensitive operations
    if (this.isSensitiveAction(action, resource)) {
      await this.securityMonitor.alert(auditEvent);
    }
  }
}
```

## 🚀 Scalability Optimizations

### 1. Project-Based Vector Sharding

```typescript
@Injectable()
export class ShardedVectorStoreService {
  private getShardKey(projectId: string): string {
    // Shard by project ID hash for even distribution
    const hash = crypto.createHash('sha256').update(projectId).digest('hex');
    return `shard_${parseInt(hash.substr(0, 8), 16) % this.shardCount}`;
  }

  async storeEmbedding(
    embedding: VectorEmbedding, 
    projectId: string
  ): Promise<string> {
    const shardKey = this.getShardKey(projectId);
    const vectorStore = this.getShardStore(shardKey);
    
    // Store with project isolation
    return vectorStore.store({
      ...embedding,
      projectId,
      shardKey,
      createdAt: new Date()
    });
  }
}
```

### 2. Project-Scoped Caching Strategy

```typescript
@Injectable()
export class ProjectCacheService {
  private readonly CACHE_PREFIX = 'project';
  
  async get<T>(
    key: string, 
    projectId: string, 
    fallback: () => Promise<T>
  ): Promise<T> {
    const cacheKey = `${this.CACHE_PREFIX}:${projectId}:${key}`;
    
    let cached = await this.cacheManager.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const result = await fallback();
    await this.cacheManager.set(cacheKey, result, this.getTTLForProject(projectId));
    
    return result;
  }

  private getTTLForProject(projectId: string): number {
    // Different TTLs based on project tier
    const project = this.getProjectTier(projectId);
    switch (project.tier) {
      case 'enterprise': return 3600; // 1 hour
      case 'professional': return 1800; // 30 minutes
      default: return 300; // 5 minutes
    }
  }
}
```

### 3. Async Processing with Project Queues

```typescript
@Injectable()
export class ProjectQueueService {
  async enqueueProjectTask<T>(
    projectId: string,
    taskType: ProjectTaskType,
    payload: T
  ): Promise<void> {
    // Use project-specific queue to maintain order and isolation
    const queue = this.getProjectQueue(projectId);
    
    await queue.add(`project:${projectId}:${taskType}`, payload, {
      priority: this.getTaskPriority(taskType),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }
}
```

## 🛠️ Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Implement project context middleware
- [ ] Add RLS policies to database
- [ ] Create project audit service
- [ ] Update RAG service with project filtering

### Phase 2: Security & Encryption (Weeks 3-4)

- [ ] Implement content encryption service
- [ ] Add project access control management
- [ ] Create secure key management
- [ ] Update all services with security middleware

### Phase 3: Monitoring & Observability (Weeks 5-6)

- [ ] Implement project metrics service
- [ ] Add distributed tracing
- [ ] Create audit dashboard
- [ ] Setup compliance monitoring

### Phase 4: Performance & Scalability (Weeks 7-8)

- [ ] Implement vector sharding
- [ ] Add project-scoped caching
- [ ] Create async processing queues
- [ ] Performance testing and optimization

### Phase 5: Migration & Testing (Weeks 9-10)

- [ ] Create migration scripts
- [ ] Comprehensive testing suite
- [ ] Performance benchmarking
- [ ] Security audit

## 📋 API Enhancement Examples

### Enhanced Project Management API

```typescript
@Controller('projects')
@UseGuards(ProjectContextGuard)
export class ProjectsController {
  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentProject() projectContext: ProjectContext
  ): Promise<ProjectResponse> {
    // Validate project creation permissions
    // Create with encryption and monitoring
    // Initialize project resources
    // Return enriched project data
  }

  @Get(':id/context')
  async getProjectContext(
    @Param('id') projectId: string,
    @CurrentUser() user: User
  ): Promise<ProjectContextResponse> {
    // Generate project-specific JWT
    // Setup project-scoped resources
    // Return context for client
  }

  @Post(':id/archive')
  async archiveProject(
    @Param('id') projectId: string,
    @Body() archiveRequest: ArchiveProjectRequest
  ): Promise<ArchiveResponse> {
    // Validate ownership
    // Archive all project data
    // Update audit trails
    // Notify relevant services
  }
}
```

### Enhanced RAG API

```typescript
@Controller('ai')
@UseGuards(ProjectContextGuard)
export class AI Controller {
  @Post('query')
  async query(
    @Body() queryRequest: AIQueryRequest,
    @CurrentProject() projectContext: ProjectContext
  ): Promise<AIQueryResponse> {
    // Enforce project boundaries
    // Filter embeddings by project
    // Apply project-specific prompts
    // Track usage with project attribution
  }

  @Post('chat')
  async chat(
    @Body() chatRequest: AIChatRequest,
    @CurrentProject() projectContext: ProjectContext
  ): Promise<AI
