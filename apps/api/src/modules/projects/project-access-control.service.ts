import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProjectAuditService } from './project-audit.service.js';

export interface GrantAccessDTO {
  projectId: string;
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions?: string[];
  grantedBy: string;
}

export interface AccessControlEntry {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  permissions: string[];
  grantedAt: Date;
  grantedBy: string | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

@Injectable()
export class ProjectAccessControlService {
  private readonly logger = new Logger(ProjectAccessControlService.name);

  private readonly DEFAULT_PERMISSIONS: Record<string, string[]> = {
    owner: ['read', 'write', 'delete', 'manage_access', 'admin', 'export', 'archive'],
    editor: ['read', 'write', 'export'],
    viewer: ['read'],
  };

  constructor(
    private prisma: PrismaService,
    private auditService: ProjectAuditService,
  ) {}

  /**
   * Grant access to a user for a project
   */
  async grantAccess(dto: GrantAccessDTO): Promise<AccessControlEntry> {
    // Verify the granter has permission to manage access
    const hasPermission = await this.hasPermission(dto.projectId, dto.grantedBy, 'manage_access');
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to manage access');
    }

    // Determine permissions based on role
    const permissions = dto.permissions || this.DEFAULT_PERMISSIONS[dto.role] || ['read'];

    // Create or update access control entry
    const accessControl = await this.prisma.projectAccessControl.upsert({
      where: {
        projectId_userId: {
          projectId: dto.projectId,
          userId: dto.userId,
        },
      },
      create: {
        projectId: dto.projectId,
        userId: dto.userId,
        role: dto.role,
        permissions: permissions,
        grantedBy: dto.grantedBy,
        grantedAt: new Date(),
      },
      update: {
        role: dto.role,
        permissions: permissions,
        grantedBy: dto.grantedBy,
        grantedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log the access grant
    await this.auditService.logAccessControlChange(
      dto.projectId,
      dto.grantedBy,
      dto.userId,
      'GRANT',
      dto.role
    );

    return {
      ...accessControl,
      permissions: accessControl.permissions as string[],
    };
  }

  /**
   * Revoke access for a user from a project
   */
  async revokeAccess(projectId: string, userId: string, revokedBy: string): Promise<void> {
    // Verify the revoker has permission
    const hasPermission = await this.hasPermission(projectId, revokedBy, 'manage_access');
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to manage access');
    }

    // Prevent revoking owner's access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (project?.userId === userId) {
      throw new ForbiddenException('Cannot revoke access from project owner');
    }

    // Delete access control entry
    await this.prisma.projectAccessControl.delete({
      where: {
        projectId_userId: { projectId, userId },
      },
    }).catch(() => {
      throw new NotFoundException('Access control entry not found');
    });

    // Log the access revocation
    await this.auditService.logAccessControlChange(
      projectId,
      revokedBy,
      userId,
      'REVOKE',
      'none'
    );
  }

  /**
   * Update user's role and permissions
   */
  async updateAccess(
    projectId: string,
    userId: string,
    role: string,
    permissions: string[],
    updatedBy: string
  ): Promise<AccessControlEntry> {
    // Verify the updater has permission
    const hasPermission = await this.hasPermission(projectId, updatedBy, 'manage_access');
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to manage access');
    }

    const accessControl = await this.prisma.projectAccessControl.update({
      where: {
        projectId_userId: { projectId, userId },
      },
      data: {
        role,
        permissions,
        grantedBy: updatedBy,
        grantedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log the update
    await this.auditService.logAccessControlChange(
      projectId,
      updatedBy,
      userId,
      'UPDATE',
      role
    );

    return {
      ...accessControl,
      permissions: accessControl.permissions as string[],
    };
  }

  /**
   * Check if user has specific permission on a project
   */
  async hasPermission(projectId: string, userId: string, permission: string): Promise<boolean> {
    // Check if user is project owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, accessLevel: true },
    });

    if (!project) return false;

    // Project owner has all permissions
    if (project.userId === userId) return true;

    // Check access control entry
    const accessControl = await this.prisma.projectAccessControl.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (!accessControl) {
      // If project is public and permission is read-only
      if (project.accessLevel === 'public' && permission === 'read') {
        return true;
      }
      return false;
    }

    const permissions = accessControl.permissions as string[];
    return permissions.includes(permission) || permissions.includes('admin');
  }

  /**
   * Get user's role for a project
   */
  async getUserRole(projectId: string, userId: string): Promise<string | null> {
    // Check if user is project owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (project?.userId === userId) return 'owner';

    const accessControl = await this.prisma.projectAccessControl.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    return accessControl?.role || null;
  }

  /**
   * Get all access control entries for a project
   */
  async getProjectAccess(projectId: string, requesterId: string): Promise<AccessControlEntry[]> {
    // Verify the requester has permission to view access
    const hasPermission = await this.hasPermission(projectId, requesterId, 'read');
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to view access');
    }

    const accessControls = await this.prisma.projectAccessControl.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { grantedAt: 'desc' },
    });

    // Include project owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const entries: AccessControlEntry[] = accessControls.map(ac => ({
      ...ac,
      permissions: ac.permissions as string[],
    }));

    // Add owner as first entry if they exist
    if (project?.user) {
      entries.unshift({
        id: 'owner',
        projectId,
        userId: project.userId!,
        role: 'owner',
        permissions: this.DEFAULT_PERMISSIONS.owner,
        grantedAt: project.createdAt,
        grantedBy: null,
        user: project.user,
      });
    }

    return entries;
  }

  /**
   * Get all projects a user has access to
   */
  async getUserProjects(userId: string): Promise<{
    owned: string[];
    shared: { projectId: string; role: string }[];
  }> {
    const [ownedProjects, sharedAccess] = await Promise.all([
      this.prisma.project.findMany({
        where: { userId },
        select: { id: true },
      }),
      this.prisma.projectAccessControl.findMany({
        where: { userId },
        select: { projectId: true, role: true },
      }),
    ]);

    return {
      owned: ownedProjects.map(p => p.id),
      shared: sharedAccess.map(a => ({
        projectId: a.projectId,
        role: a.role,
      })),
    };
  }

  /**
   * Transfer project ownership
   */
  async transferOwnership(
    projectId: string,
    newOwnerId: string,
    currentOwnerId: string
  ): Promise<void> {
    // Verify current owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (project?.userId !== currentOwnerId) {
      throw new ForbiddenException('Only project owner can transfer ownership');
    }

    // Update project owner
    await this.prisma.$transaction([
      // Update project owner
      this.prisma.project.update({
        where: { id: projectId },
        data: { userId: newOwnerId },
      }),
      // Remove new owner from access control (they're now the owner)
      this.prisma.projectAccessControl.deleteMany({
        where: {
          projectId,
          userId: newOwnerId,
        },
      }),
      // Add previous owner as editor
      this.prisma.projectAccessControl.create({
        data: {
          projectId,
          userId: currentOwnerId,
          role: 'editor',
          permissions: this.DEFAULT_PERMISSIONS.editor,
          grantedBy: newOwnerId,
          grantedAt: new Date(),
        },
      }),
    ]);

    // Log the transfer
    await this.auditService.logEvent({
      projectId,
      userId: currentOwnerId,
      action: 'OWNERSHIP_TRANSFER',
      resourceType: 'project',
      resourceId: projectId,
      metadata: {
        previousOwner: currentOwnerId,
        newOwner: newOwnerId,
      },
    });
  }
}
