import { BadRequestException, ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface ProjectContextRequest extends Request {
  projectContext?: {
    projectId: string;
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    permissions: string[];
    encryptionKeyId?: string;
    accessLevel: string;
    complianceFlags: Record<string, boolean>;
  };
}

@Injectable()
export class ProjectContextMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: ProjectContextRequest, res: Response, next: NextFunction) {
    // Extract project ID from various sources
    const projectId = this.extractProjectId(req);
    const userId = this.extractUserId(req);

    // Skip if no project context needed
    if (!projectId) {
      return next();
    }

    if (!userId) {
      throw new ForbiddenException('Authentication required for project access');
    }

    try {
      // Validate and build project context
      const projectContext = await this.buildProjectContext(projectId, userId);
      
      // Attach context to request
      req.projectContext = projectContext;

      // Log access for audit
      await this.logProjectAccess(projectId, userId, req.method, req.path);

      next();
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new ForbiddenException('Access denied to project');
    }
  }

  private extractProjectId(req: Request): string | null {
    // From URL params
    if (req.params?.projectId) {
      return req.params.projectId;
    }

    // From query params
    if (req.query?.projectId) {
      return req.query.projectId as string;
    }

    // From body
    if (req.body?.projectId) {
      return req.body.projectId;
    }

    // From headers
    if (req.headers['x-project-id']) {
      return req.headers['x-project-id'] as string;
    }

    return null;
  }

  private extractUserId(req: Request): string | null {
    // From JWT payload (set by auth middleware)
    const user = (req as any).user;
    if (user?.id || user?.sub) {
      return user.id || user.sub;
    }

    // From headers (for internal services)
    if (req.headers['x-user-id']) {
      return req.headers['x-user-id'] as string;
    }

    return null;
  }

  private async buildProjectContext(projectId: string, userId: string) {
    // Get project with access control
    const [project, accessControl] = await Promise.all([
      this.prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          userId: true,
          encryptionKeyId: true,
          accessLevel: true,
          complianceFlags: true,
          status: true,
        }
      }),
      this.prisma.projectAccessControl.findUnique({
        where: {
          projectId_userId: { projectId, userId }
        }
      })
    ]);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (project.status === 'ARCHIVED') {
      throw new ForbiddenException('Project is archived');
    }

    // Determine role and permissions
    let role: 'owner' | 'editor' | 'viewer' = 'viewer';
    let permissions: string[] = ['read'];

    if (project.userId === userId) {
      role = 'owner';
      permissions = ['read', 'write', 'delete', 'manage_access', 'admin'];
    } else if (accessControl) {
      role = accessControl.role as 'owner' | 'editor' | 'viewer';
      permissions = (accessControl.permissions as string[]) || this.getDefaultPermissions(role);
    } else {
      // Check if project is public
      if (project.accessLevel !== 'public') {
        throw new ForbiddenException('User does not have access to this project');
      }
      permissions = ['read'];
    }

    return {
      projectId,
      userId,
      role,
      permissions,
      encryptionKeyId: project.encryptionKeyId || undefined,
      accessLevel: project.accessLevel || 'private',
      complianceFlags: (project.complianceFlags as Record<string, boolean>) || {},
    };
  }

  private getDefaultPermissions(role: string): string[] {
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

  private async logProjectAccess(projectId: string, userId: string, method: string, path: string): Promise<void> {
    try {
      // Non-blocking audit log
      this.prisma.projectAuditLog.create({
        data: {
          projectId,
          userId,
          action: 'ACCESS',
          resourceType: 'project',
          resourceId: projectId,
          metadata: {
            method,
            path,
            timestamp: new Date(),
          },
        }
      }).catch(err => console.error('Audit log error:', err));
    } catch (error) {
      // Don't fail request for audit log errors
      console.error('Failed to log project access:', error);
    }
  }
}
