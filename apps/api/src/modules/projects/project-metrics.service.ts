import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface ProjectMetrics {
  projectId: string;
  health: HealthMetrics;
  usage: UsageMetrics;
  storage: StorageMetrics;
  activity: ActivityMetrics;
  compliance: ComplianceMetrics;
}

export interface HealthMetrics {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  lastChecked: Date;
}

export interface UsageMetrics {
  aiTokensUsed: number;
  aiTokensCost: number;
  apiCallsToday: number;
  apiCallsMonth: number;
  activeUsers: number;
}

export interface StorageMetrics {
  documentsCount: number;
  assetsCount: number;
  embeddingsCount: number;
  totalStorageBytes: number;
  storageLimit: number;
}

export interface ActivityMetrics {
  lastActivity: Date | null;
  activeDays30: number;
  conversationsCount: number;
  messagesCount: number;
  auditsCount: number;
}

export interface ComplianceMetrics {
  encryptedContent: number;
  unencryptedContent: number;
  auditCoverage: number;
  complianceFlags: string[];
  lastAuditDate: Date | null;
}

@Injectable()
export class ProjectMetricsService {
  private readonly logger = new Logger(ProjectMetricsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get comprehensive metrics for a project
   */
  async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
    const [health, usage, storage, activity, compliance] = await Promise.all([
      this.getHealthMetrics(projectId),
      this.getUsageMetrics(projectId),
      this.getStorageMetrics(projectId),
      this.getActivityMetrics(projectId),
      this.getComplianceMetrics(projectId),
    ]);

    return {
      projectId,
      health,
      usage,
      storage,
      activity,
      compliance,
    };
  }

  /**
   * Get health metrics for a project
   */
  async getHealthMetrics(projectId: string): Promise<HealthMetrics> {
    const issues: string[] = [];
    let score = 100;

    // Check for recent activity
    const lastActivity = await this.getLastActivityDate(projectId);
    if (!lastActivity) {
      issues.push('No activity recorded');
      score -= 20;
    } else {
      const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > 30) {
        issues.push('Inactive for more than 30 days');
        score -= 15;
      } else if (daysSinceActivity > 7) {
        issues.push('Inactive for more than 7 days');
        score -= 5;
      }
    }

    // Check storage usage
    const storage = await this.getStorageMetrics(projectId);
    const storageUsagePercent = (storage.totalStorageBytes / storage.storageLimit) * 100;
    if (storageUsagePercent > 90) {
      issues.push('Storage usage above 90%');
      score -= 15;
    } else if (storageUsagePercent > 75) {
      issues.push('Storage usage above 75%');
      score -= 5;
    }

    // Check compliance
    const compliance = await this.getComplianceMetrics(projectId);
    if (compliance.unencryptedContent > 0 && compliance.encryptedContent === 0) {
      issues.push('No encrypted content despite having documents');
      score -= 10;
    }

    // Determine status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (score < 50) status = 'critical';
    else if (score < 75) status = 'warning';

    return {
      score: Math.max(0, score),
      status,
      issues,
      lastChecked: new Date(),
    };
  }

  /**
   * Get usage metrics for a project
   */
  async getUsageMetrics(projectId: string): Promise<UsageMetrics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [aiUsage, apiCallsToday, apiCallsMonth, activeUsersResult] = await Promise.all([
      this.prisma.aIUsage.aggregate({
        where: { projectId },
        _sum: { tokens: true, cost: true },
      }),
      this.prisma.projectAuditLog.count({
        where: {
          projectId,
          timestamp: { gte: today },
        },
      }),
      this.prisma.projectAuditLog.count({
        where: {
          projectId,
          timestamp: { gte: monthStart },
        },
      }),
      this.prisma.projectAuditLog.groupBy({
        by: ['userId'],
        where: {
          projectId,
          timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          userId: { not: null },
        },
      }),
    ]);

    return {
      aiTokensUsed: aiUsage._sum.tokens || 0,
      aiTokensCost: aiUsage._sum.cost || 0,
      apiCallsToday,
      apiCallsMonth,
      activeUsers: activeUsersResult.length,
    };
  }

  /**
   * Get storage metrics for a project
   */
  async getStorageMetrics(projectId: string): Promise<StorageMetrics> {
    const [documentsCount, assetsCount, embeddingsCount, assetStorage, pageMediaStorage] = await Promise.all([
      this.prisma.knowledgeSource.count({ where: { projectId } }),
      this.prisma.asset.count({ where: { projectId } }),
      this.prisma.projectEmbedding.count({ where: { projectId } }),
      this.prisma.asset.aggregate({
        where: { projectId },
        _sum: { sizeBytes: true },
      }),
      this.prisma.pageMedia.aggregate({
        where: { projectId },
        _sum: { size: true },
      }),
    ]);

    const totalStorageBytes = (assetStorage._sum.sizeBytes || 0) + (pageMediaStorage._sum.size || 0);
    const storageLimit = 10 * 1024 * 1024 * 1024; // 10GB default limit

    return {
      documentsCount,
      assetsCount,
      embeddingsCount,
      totalStorageBytes,
      storageLimit,
    };
  }

  /**
   * Get activity metrics for a project
   */
  async getActivityMetrics(projectId: string): Promise<ActivityMetrics> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      lastActivity,
      activeDaysResult,
      conversationsCount,
      messagesCount,
      auditsCount,
    ] = await Promise.all([
      this.getLastActivityDate(projectId),
      this.prisma.projectAuditLog.groupBy({
        by: ['timestamp'],
        where: {
          projectId,
          timestamp: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.conversation.count({ where: { projectId } }),
      this.prisma.message.count({
        where: {
          conversation: { projectId },
        },
      }),
      this.prisma.projectAuditLog.count({ where: { projectId } }),
    ]);

    // Count unique active days
    const uniqueDays = new Set(
      activeDaysResult.map(r => r.timestamp.toDateString())
    );

    return {
      lastActivity,
      activeDays30: uniqueDays.size,
      conversationsCount,
      messagesCount,
      auditsCount,
    };
  }

  /**
   * Get compliance metrics for a project
   */
  async getComplianceMetrics(projectId: string): Promise<ComplianceMetrics> {
    const [encryptedContent, unencryptedContent, project, lastAudit] = await Promise.all([
      this.prisma.knowledgeSource.count({
        where: {
          projectId,
          encryptionStatus: { not: 'unencrypted' },
        },
      }),
      this.prisma.knowledgeSource.count({
        where: {
          projectId,
          encryptionStatus: 'unencrypted',
        },
      }),
      this.prisma.project.findUnique({
        where: { id: projectId },
        select: { complianceFlags: true },
      }),
      this.prisma.projectAuditLog.findFirst({
        where: { projectId },
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true },
      }),
    ]);

    const totalContent = encryptedContent + unencryptedContent;
    const auditCoverage = totalContent > 0 
      ? (encryptedContent / totalContent) * 100 
      : 100;

    const complianceFlags = project?.complianceFlags 
      ? Object.keys(project.complianceFlags as object).filter(
          key => (project.complianceFlags as Record<string, boolean>)[key]
        )
      : [];

    return {
      encryptedContent,
      unencryptedContent,
      auditCoverage,
      complianceFlags,
      lastAuditDate: lastAudit?.timestamp || null,
    };
  }

  /**
   * Get metrics trend over time
   */
  async getMetricsTrend(
    projectId: string,
    metric: 'usage' | 'storage' | 'activity',
    days: number = 30
  ): Promise<Array<{ date: string; value: number }>> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const trend: Array<{ date: string; value: number }> = [];

    switch (metric) {
      case 'usage':
        const usageData = await this.prisma.aIUsage.groupBy({
          by: ['createdAt'],
          where: {
            projectId,
            createdAt: { gte: startDate },
          },
          _sum: { tokens: true },
        });
        
        // Group by date
        const usageByDate: Record<string, number> = {};
        for (const data of usageData) {
          const dateStr = data.createdAt.toISOString().split('T')[0];
          usageByDate[dateStr] = (usageByDate[dateStr] || 0) + (data._sum.tokens || 0);
        }
        
        for (const [date, value] of Object.entries(usageByDate)) {
          trend.push({ date, value });
        }
        break;

      case 'storage':
        const storageData = await this.prisma.asset.groupBy({
          by: ['createdAt'],
          where: {
            projectId,
            createdAt: { gte: startDate },
          },
          _count: { id: true },
        });
        
        for (const data of storageData) {
          trend.push({
            date: data.createdAt.toISOString().split('T')[0],
            value: data._count.id,
          });
        }
        break;

      case 'activity':
        const activityData = await this.prisma.projectAuditLog.groupBy({
          by: ['timestamp'],
          where: {
            projectId,
            timestamp: { gte: startDate },
          },
          _count: { id: true },
        });
        
        // Group by date
        const activityByDate: Record<string, number> = {};
        for (const data of activityData) {
          const dateStr = data.timestamp.toISOString().split('T')[0];
          activityByDate[dateStr] = (activityByDate[dateStr] || 0) + data._count.id;
        }
        
        for (const [date, value] of Object.entries(activityByDate)) {
          trend.push({ date, value });
        }
        break;
    }

    return trend.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get real-time project statistics
   */
  async getRealTimeStats(projectId: string): Promise<{
    activeConversations: number;
    pendingIngestions: number;
    recentErrors: number;
    uptime: number;
  }> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [activeConversations, pendingIngestions, recentErrors] = await Promise.all([
      this.prisma.conversation.count({
        where: {
          projectId,
          status: 'ACTIVE',
          updatedAt: { gte: fiveMinutesAgo },
        },
      }),
      this.prisma.transcript.count({
        where: {
          projectId,
          status: 'PENDING',
        },
      }),
      this.prisma.projectAuditLog.count({
        where: {
          projectId,
          action: { contains: 'ERROR' },
          timestamp: { gte: oneHourAgo },
        },
      }),
    ]);

    return {
      activeConversations,
      pendingIngestions,
      recentErrors,
      uptime: 99.9, // Placeholder - implement actual uptime tracking
    };
  }

  // Private helper methods

  private async getLastActivityDate(projectId: string): Promise<Date | null> {
    const [project, asset, knowledgeSource, auditLog] = await Promise.all([
      this.prisma.project.findUnique({
        where: { id: projectId },
        select: { updatedAt: true },
      }),
      this.prisma.asset.findFirst({
        where: { projectId },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      this.prisma.knowledgeSource.findFirst({
        where: { projectId },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      this.prisma.projectAuditLog.findFirst({
        where: { projectId },
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true },
      }),
    ]);

    const dates = [
      project?.updatedAt,
      asset?.updatedAt,
      knowledgeSource?.updatedAt,
      auditLog?.timestamp,
    ].filter((d): d is Date => d !== null && d !== undefined);

    if (dates.length === 0) return null;

    return new Date(Math.max(...dates.map(d => d.getTime())));
  }
}
