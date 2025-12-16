import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { Prisma } from '@prisma/client';

type ProjectRole = 'owner' | 'editor' | 'viewer';
type HealthMetrics = {
  documentCount: number;
  conversationCount: number;
  storageUsed: number;
  aiTokensUsed: number;
  lastActivity: Date | null;
};
type CacheStoreWithKeys = {
  keys?: (pattern: string) => Promise<string[] | undefined> | string[] | undefined;
};

export interface ProjectContext {
  projectId: string;
  userId: string;
  role: ProjectRole;
  permissions: string[];
  encryptionKeyId?: string;
  accessLevel: 'private' | 'team' | 'public';
  complianceFlags: Record<string, boolean>;
  createdAt: Date;
  expiresAt: Date;
}

export interface CreateProjectContextDTO {
  projectId: string;
  userId: string;
  role: ProjectRole;
  permissions: string[];
  encryptionKeyId?: string;
  accessLevel?: 'private' | 'team' | 'public';
  complianceFlags?: Record<string, boolean>;
}

@Injectable()
export class ProjectContextService {
  private readonly CONTEXT_CACHE_TTL = 3600; // 1 hour
  private readonly CONTEXT_CACHE_PREFIX = 'project:context:';

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createProjectContext(dto: CreateProjectContextDTO): Promise<ProjectContext> {
    // Validate project access
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: { user: true }
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    // Check if user has access to this project
    const accessControl = await this.prisma.projectAccessControl.findUnique({
      where: {
        projectId_userId: {
          projectId: dto.projectId,
          userId: dto.userId,
        }
      }
    });

    if (!accessControl && project.userId !== dto.userId) {
      throw new ForbiddenException('User does not have access to this project');
    }

    // Generate project-specific encryption key if needed
    const encryptionKeyId = dto.encryptionKeyId || await this.generateProjectEncryptionKey(dto.projectId);

    // Create project context
    const context: ProjectContext = {
      projectId: dto.projectId,
      userId: dto.userId,
      role: dto.role,
      permissions: dto.permissions,
      encryptionKeyId,
      accessLevel: dto.accessLevel || 'private',
      complianceFlags: dto.complianceFlags || {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.CONTEXT_CACHE_TTL * 1000),
    };

    // Store in cache
    const cacheKey = `${this.CONTEXT_CACHE_PREFIX}${dto.projectId}:${dto.userId}`;
    await this.cacheManager.set(cacheKey, context, this.CONTEXT_CACHE_TTL);

    return context;
  }

  async switchProjectContext(userId: string, projectId: string): Promise<ProjectContext> {
    const cacheKey = `${this.CONTEXT_CACHE_PREFIX}${projectId}:${userId}`;
    
    // Try to get from cache first
    let context = await this.cacheManager.get<ProjectContext>(cacheKey);
    
    if (!context) {
      // If not in cache, get from database
      context = await this.getProjectContextFromDB(userId, projectId);
      
      if (context) {
        // Cache the context
        await this.cacheManager.set(cacheKey, context, this.CONTEXT_CACHE_TTL);
      }
    }

    if (!context) {
      throw new ForbiddenException('User does not have access to this project');
    }

    return context;
  }

  private async getProjectContextFromDB(userId: string, projectId: string): Promise<ProjectContext | undefined> {
    const [project, accessControl] = await Promise.all([
      this.prisma.project.findUnique({ where: { id: projectId } }),
      this.prisma.projectAccessControl.findUnique({
        where: {
          projectId_userId: { projectId, userId }
        }
      })
    ]);

    if (!project) return undefined;

    // Determine user role and permissions
    let role: ProjectRole = 'viewer';
    let permissions: string[] = this.getDefaultPermissions(role);

    if (project.userId === userId) {
      role = 'owner';
      permissions = this.getDefaultPermissions(role);
    } else if (accessControl) {
      role = this.castRole(accessControl.role);
      permissions = this.parsePermissions(accessControl.permissions, role);
    } else {
      return undefined; // No access
    }

    return {
      projectId,
      userId,
      role,
      permissions,
      encryptionKeyId: project.encryptionKeyId ?? undefined,
      accessLevel: (project.accessLevel as 'private' | 'team' | 'public') || 'private',
      complianceFlags: this.parseComplianceFlags(project.complianceFlags),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.CONTEXT_CACHE_TTL * 1000),
    };
  }

  private parseComplianceFlags(flags: unknown): Record<string, boolean> {
    if (!flags || typeof flags !== 'object' || Array.isArray(flags)) return {};
    
    const result: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(flags as Record<string, unknown>)) {
      if (typeof value === 'boolean') {
        result[key] = value;
      } else if (typeof value === 'number') {
        result[key] = value !== 0;
      } else {
        result[key] = Boolean(value);
      }
    }
    return result;
  }

  private castRole(role?: string | null): ProjectRole {
    return role === 'owner' || role === 'editor' || role === 'viewer' ? role : 'viewer';
  }

  private parsePermissions(value: unknown, fallbackRole: ProjectRole): string[] {
    if (Array.isArray(value)) {
      return value.filter((permission): permission is string => typeof permission === 'string');
    }
    return this.getDefaultPermissions(fallbackRole);
  }

  private getDefaultPermissions(role: ProjectRole): string[] {
    switch (role) {
      case 'owner':
        return ['read', 'write', 'delete', 'manage_access', 'admin'];
      case 'editor':
        return ['read', 'write'];
      case 'viewer':
      default:
        return ['read'];
    }
  }

  async validateProjectAccess(userId: string, projectId: string, requiredPermission: string): Promise<boolean> {
    const context = await this.switchProjectContext(userId, projectId);
    return context.permissions.includes(requiredPermission) || context.permissions.includes('admin');
  }

  async archiveProject(projectId: string, reason: string, userId: string): Promise<void> {
    // Validate that user has admin permissions
    const hasPermission = await this.validateProjectAccess(userId, projectId, 'admin');
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to archive project');
    }

    // Soft delete with data retention policy
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'ARCHIVED',
        archivedAt: new Date(),
        deletionScheduledAt: new Date(Date.now() + 2555 * 24 * 60 * 60 * 1000), // 7 years
      }
    });

    // Log audit event
    await this.logProjectAuditEvent({
      projectId,
      userId,
      action: 'ARCHIVE_PROJECT',
      resourceType: 'project',
      resourceId: projectId,
      metadata: this.toJsonValue({ reason, timestamp: new Date() }),
    });

    // Clear cache
    await this.clearProjectContextCache(projectId);
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    // Validate owner permissions
    const hasPermission = await this.validateProjectAccess(userId, projectId, 'admin');
    if (!hasPermission) {
      throw new ForbiddenException('Only project owners can delete projects');
    }

    // Perform cascade delete
    await this.prisma.$transaction([
      // Delete project embeddings
      this.prisma.projectEmbedding.deleteMany({
        where: { projectId }
      }),
      
      // Delete audit logs
      this.prisma.projectAuditLog.deleteMany({
        where: { projectId }
      }),
      
      // Delete access control
      this.prisma.projectAccessControl.deleteMany({
        where: { projectId }
      }),
      
      // Finally delete the project (cascade will handle related data)
      this.prisma.project.delete({
        where: { id: projectId }
      })
    ]);

    // Log audit event
    await this.logProjectAuditEvent({
      projectId,
      userId,
      action: 'DELETE_PROJECT',
      resourceType: 'project',
      resourceId: projectId,
      metadata: this.toJsonValue({ timestamp: new Date() }),
    });
  }

  private async generateProjectEncryptionKey(projectId: string): Promise<string> {
    const keyId = crypto.createHash('sha256').update(projectId + Date.now().toString()).digest('hex').substring(0, 16);
    
    // Store encryption key reference (in production, this would be stored in HSM or secure key management)
    await this.prisma.project.update({
      where: { id: projectId },
      data: { encryptionKeyId: keyId }
    });

    return keyId;
  }

  private async clearProjectContextCache(projectId: string): Promise<void> {
    // Clear all cached contexts for this project
    // This is a simplified implementation - in production, you might want to use Redis patterns
    const pattern = `${this.CONTEXT_CACHE_PREFIX}${projectId}:*`;
    const store = (this.cacheManager as Cache & { store?: CacheStoreWithKeys }).store;
    const keysResult = store?.keys ? await store.keys(pattern) : [];
    const keys = Array.isArray(keysResult) ? keysResult : [];
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }

  private async logProjectAuditEvent(event: {
    projectId: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      const metadataValue = this.toJsonValue(event.metadata || {}) as Prisma.InputJsonValue;
      await this.prisma.projectAuditLog.create({
        data: {
          projectId: event.projectId,
          userId: event.userId,
          action: event.action,
          resourceType: event.resourceType,
          resourceId: event.resourceId,
          metadata: metadataValue,
          timestamp: new Date(),
        }
      });
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Failed to log audit event:', error);
    }
  }

  async getProjectHealth(projectId: string): Promise<{
    projectId: string;
    healthScore: number;
    metrics: {
      documentCount: number;
      conversationCount: number;
      storageUsed: number;
      aiTokensUsed: number;
      lastActivity: Date | null;
    };
    alerts: string[];
  }> {
    const [documentCount, conversationCount, storageUsed, aiUsage, lastActivity] = await Promise.all([
      this.prisma.knowledgeSource.count({ where: { projectId } }),
      this.prisma.conversation.count({ where: { projectId } }),
      this.calculateStorageUsage(projectId),
      this.getAIUsageMetrics(projectId),
      this.getLastActivity(projectId),
    ]);

    const healthScore = this.calculateHealthScore({
      documentCount,
      conversationCount,
      storageUsed,
      aiTokensUsed: aiUsage.tokens,
      lastActivity,
    });

    const alerts = await this.checkHealthAlerts(projectId, {
      documentCount,
      conversationCount,
      storageUsed,
      aiTokensUsed: aiUsage.tokens,
      lastActivity,
    });

    return {
      projectId,
      healthScore,
      metrics: {
        documentCount,
        conversationCount,
        storageUsed,
        aiTokensUsed: aiUsage.tokens,
        lastActivity,
      },
      alerts,
    };
  }

  private async calculateStorageUsage(projectId: string): Promise<number> {
    const assets = await this.prisma.asset.aggregate({
      where: { projectId },
      _sum: { sizeBytes: true }
    });

    const pageMedia = await this.prisma.pageMedia.aggregate({
      where: { projectId },
      _sum: { size: true }
    });

    return (assets._sum.sizeBytes || 0) + (pageMedia._sum.size || 0);
  }

  private async getAIUsageMetrics(projectId: string): Promise<{ tokens: number; cost: number }> {
    const aiUsage = await this.prisma.aIUsage.aggregate({
      where: { projectId },
      _sum: { tokens: true, cost: true }
    });

    return {
      tokens: aiUsage._sum.tokens || 0,
      cost: aiUsage._sum.cost || 0,
    };
  }

  private async getLastActivity(projectId: string): Promise<Date | null> {
    const [project, asset, knowledgeSource] = await Promise.all([
      this.prisma.project.findUnique({
        where: { id: projectId },
        select: { updatedAt: true }
      }),
      this.prisma.asset.findFirst({
        where: { projectId },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true }
      }),
      this.prisma.knowledgeSource.findFirst({
        where: { projectId },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true }
      })
    ]);

    const dates = [project?.updatedAt, asset?.updatedAt, knowledgeSource?.updatedAt]
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => b.getTime() - a.getTime());

    return dates[0] || null;
  }

  private calculateHealthScore(metrics: HealthMetrics): number {
    let score = 100;

    // Deduct points for inactivity
    if (!metrics.lastActivity) {
      score -= 30;
    } else {
      const daysSinceActivity = (Date.now() - metrics.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > 30) score -= 20;
      else if (daysSinceActivity > 7) score -= 10;
    }

    // Deduct points for excessive usage
    if (metrics.storageUsed > 100 * 1024 * 1024 * 1024) score -= 10; // 100GB
    if (metrics.aiTokensUsed > 1000000) score -= 10; // 1M tokens

    return Math.max(0, score);
  }

  private async checkHealthAlerts(projectId: string, metrics: HealthMetrics): Promise<string[]> {
    const alerts: string[] = [];

    if (!metrics.lastActivity) {
      alerts.push('No recent activity detected');
    } else {
      const daysSinceActivity = (Date.now() - metrics.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > 30) {
        alerts.push('Project has been inactive for over 30 days');
      }
    }

    if (metrics.storageUsed > 100 * 1024 * 1024 * 1024) {
      alerts.push('High storage usage detected');
    }

    if (metrics.aiTokensUsed > 1000000) {
      alerts.push('High AI usage detected');
    }

    return alerts;
  }

  private toJsonValue(data: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value instanceof Date ? value.toISOString() : value,
      ])
    );
  }
}
