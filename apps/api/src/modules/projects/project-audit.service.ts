import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface AuditEvent {
  projectId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilter {
  projectId?: string;
  userId?: string;
  action?: string;
  resourceType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

type AuditLogEntry = {
  id?: string;
  projectId: string;
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  timestamp: Date;
  user?: { id: string; name: string; email: string } | null;
};

@Injectable()
export class ProjectAuditService {
  private readonly logger = new Logger(ProjectAuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event for a project
   */
  async logEvent(event: AuditEvent): Promise<void> {
    try {
      await this.prisma.projectAuditLog.create({
        data: {
          projectId: event.projectId,
          userId: event.userId,
          action: event.action,
          resourceType: event.resourceType,
          resourceId: event.resourceId,
          metadata: event.metadata || {},
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Don't fail operations due to audit logging errors
      this.logger.error('Failed to log audit event', { error, event });
    }
  }

  /**
   * Log document ingestion event
   */
  async logDocumentIngestion(
    projectId: string,
    userId: string,
    documentId: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    await this.logEvent({
      projectId,
      userId,
      action: 'DOCUMENT_INGEST',
      resourceType: 'knowledge_source',
      resourceId: documentId,
      metadata,
    });
  }

  /**
   * Log access control change
   */
  async logAccessControlChange(
    projectId: string,
    userId: string,
    targetUserId: string,
    action: 'GRANT' | 'REVOKE' | 'UPDATE',
    role: string
  ): Promise<void> {
    await this.logEvent({
      projectId,
      userId,
      action: `ACCESS_${action}`,
      resourceType: 'access_control',
      resourceId: targetUserId,
      metadata: { role, targetUserId },
    });
  }

  /**
   * Log project status change
   */
  async logProjectStatusChange(
    projectId: string,
    userId: string,
    previousStatus: string,
    newStatus: string
  ): Promise<void> {
    await this.logEvent({
      projectId,
      userId,
      action: 'STATUS_CHANGE',
      resourceType: 'project',
      resourceId: projectId,
      metadata: { previousStatus, newStatus },
    });
  }

  /**
   * Log data export event
   */
  async logDataExport(
    projectId: string,
    userId: string,
    exportType: string,
    resourceCount: number
  ): Promise<void> {
    await this.logEvent({
      projectId,
      userId,
      action: 'DATA_EXPORT',
      resourceType: 'export',
      metadata: { exportType, resourceCount },
    });
  }

  /**
   * Log sensitive data access
   */
  async logSensitiveAccess(
    projectId: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    accessType: 'READ' | 'WRITE' | 'DELETE'
  ): Promise<void> {
    await this.logEvent({
      projectId,
      userId,
      action: `SENSITIVE_${accessType}`,
      resourceType,
      resourceId,
      metadata: { accessType, sensitiveAccess: true },
    });
  }

  /**
   * Get audit logs for a project with filtering
   */
  async getAuditLogs(filter: AuditLogFilter): Promise<{
    logs: AuditLogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    const where: Record<string, unknown> = {};

    if (filter.projectId) where.projectId = filter.projectId;
    if (filter.userId) where.userId = filter.userId;
    if (filter.action) where.action = filter.action;
    if (filter.resourceType) where.resourceType = filter.resourceType;
    if (filter.startDate || filter.endDate) {
      const timestampRange: Record<string, Date> = {};
      if (filter.startDate) timestampRange.gte = filter.startDate;
      if (filter.endDate) timestampRange.lte = filter.endDate;
      where.timestamp = timestampRange;
    }

    const [logs, total] = await Promise.all([
      this.prisma.projectAuditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filter.limit || 50,
        skip: filter.offset || 0,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.projectAuditLog.count({ where }),
    ]);

    return {
      logs: logs as AuditLogEntry[],
      total,
      hasMore: (filter.offset || 0) + logs.length < total,
    };
  }

  /**
   * Get audit summary for a project
   */
  async getAuditSummary(projectId: string, days: number = 30): Promise<{
    totalEvents: number;
    byAction: Record<string, number>;
    byUser: Record<string, number>;
    recentActivity: AuditLogEntry[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.projectAuditLog.findMany({
      where: {
        projectId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'desc' },
    });

    const byAction: Record<string, number> = {};
    const byUser: Record<string, number> = {};

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      if (log.userId) {
        byUser[log.userId] = (byUser[log.userId] || 0) + 1;
      }
    }

    return {
      totalEvents: logs.length,
      byAction,
      byUser,
      recentActivity: logs.slice(0, 10),
    };
  }

  /**
   * Check for compliance violations
   */
  async checkComplianceViolations(projectId: string): Promise<{
    violations: string[];
    warnings: string[];
    lastAudit: Date | null;
  }> {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check for sensitive data access without proper authorization
    const sensitiveAccessCount = await this.prisma.projectAuditLog.count({
      where: {
        projectId,
        action: { startsWith: 'SENSITIVE_' },
        timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      },
    });

    if (sensitiveAccessCount > 100) {
      warnings.push(`High volume of sensitive data access: ${sensitiveAccessCount} events in 24 hours`);
    }

    // Check for data export events
    const exportCount = await this.prisma.projectAuditLog.count({
      where: {
        projectId,
        action: 'DATA_EXPORT',
        timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
      },
    });

    if (exportCount > 10) {
      warnings.push(`Multiple data exports detected: ${exportCount} in the last 7 days`);
    }

    // Check for access control changes
    const accessChanges = await this.prisma.projectAuditLog.count({
      where: {
        projectId,
        action: { startsWith: 'ACCESS_' },
        timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (accessChanges > 20) {
      warnings.push(`Unusual access control activity: ${accessChanges} changes in 24 hours`);
    }

    // Get last audit timestamp
    const lastAuditLog = await this.prisma.projectAuditLog.findFirst({
      where: { projectId },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true },
    });

    return {
      violations,
      warnings,
      lastAudit: lastAuditLog?.timestamp || null,
    };
  }

  /**
   * Purge old audit logs based on retention policy
   */
  async purgeOldLogs(projectId: string, retentionDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.prisma.projectAuditLog.deleteMany({
      where: {
        projectId,
        timestamp: { lt: cutoffDate },
      },
    });

    this.logger.log(`Purged ${result.count} audit logs for project ${projectId}`);
    return result.count;
  }
}
