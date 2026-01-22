import { Module } from '@nestjs/common';
import { CacheModule } from '../../common/cache/cache.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ProjectAccessControlService } from './project-access-control.service.js';
import { ProjectAuditService } from './project-audit.service.js';
import { ProjectAwareIngestionService } from './project-aware-ingestion.service.js';
import { ProjectCacheService } from './project-cache.service.js';
import { ProjectContextService } from './project-context.service.js';
import { ProjectEncryptionService } from './project-encryption.service.js';
import { ProjectMetricsService } from './project-metrics.service.js';
import { ProjectQueueService } from './project-queue.service.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsImportService } from './projects-import.service.js';
import { ProjectsService } from './projects.service.js';
import { ShardedVectorStoreService } from './sharded-vector-store.service.js';
import { AssetsModule } from '../assets/assets.module.js';
import { AIModule } from '../../common/ai/ai.module.js';

@Module({
  imports: [PrismaModule, CacheModule, AssetsModule, AIModule],
  controllers: [ProjectsController],
  providers: [
    // Core services
    ProjectsService,
    ProjectsImportService,
    ProjectContextService,

    // Security services
    ProjectAuditService,
    ProjectAccessControlService,
    ProjectEncryptionService,

    // Data services
    ProjectAwareIngestionService,
    ShardedVectorStoreService,

    // Performance services
    ProjectCacheService,
    ProjectQueueService,

    // Monitoring services
    ProjectMetricsService,
  ],
  exports: [
    // Core services
    ProjectsService,
    ProjectsImportService,
    ProjectContextService,

    // Security services
    ProjectAuditService,
    ProjectAccessControlService,
    ProjectEncryptionService,

    // Data services
    ProjectAwareIngestionService,
    ShardedVectorStoreService,

    // Performance services
    ProjectCacheService,
    ProjectQueueService,

    // Monitoring services
    ProjectMetricsService,
  ],
})
export class ProjectsModule {}
