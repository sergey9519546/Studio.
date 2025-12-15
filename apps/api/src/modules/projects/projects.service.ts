import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service.js';
import { create } from 'domain';
import { number } from 'framer-motion';
import { ids } from 'googleapis/build/src/apis/ids/index.js';
import { take, async } from 'rxjs';
import { string, unknown } from 'zod/v3';
import { id } from 'zod/v4/locales';
import { limit } from 'firebase/firestore';

export interface ProjectInput {
  name?: string;
  clientName?: string;
  roleRequirements?: Prisma.RoleRequirementCreateWithoutProjectInput[];
  knowledgeBase?: { title: string; content: string; category: string }[];
  budget?: string | number;
  startDate?: string | Date;
  dueDate?: string | Date;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Type definition for Prisma project result
 */
interface PrismaProjectResult {
  id: string;
  title: string;
  client?: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  roleRequirements?: Array<{
    id: string;
    role: string;
    count: number;
    skills: string[];
    projectId: string;
  }>;
  knowledgeBase?: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    projectId: string;
  }>;
  moodboardItems?: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    tags: string[];
    projectId: string;
  }>;
  scripts?: Array<unknown>;
  assignments?: Array<unknown>;
}

/**
 * Type definition for DTO output
 */
interface ProjectDto {
  id: string;
  name: string;
  title: string;
  clientName?: string;
  client?: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: Date;
  dueDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  roleRequirements: Array<{
    id: string;
    role: string;
    count: number;
    skills: string[];
    projectId: string;
  }>;
  knowledgeBase: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    projectId: string;
  }>;
  moodboardItems: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    tags: string[];
    projectId: string;
  }>;
  scripts?: Array<unknown>;
  assignments?: Array<unknown>;
}

@Injectable()
export class ProjectsService {
  private readonly CACHE_KEY = 'projects:list';
  private readonly CACHE_TTL = 2 * 60 * 60; // 2 hours in seconds

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private toDto(project: PrismaProjectResult | null): ProjectDto | null {
    if (!project) return null;
    return {
      ...project,
      name: project.title,
      clientName: project.client,
      dueDate: project.endDate,
      // Ensure arrays are present
      roleRequirements: project.roleRequirements || [],
      knowledgeBase: project.knowledgeBase || [],
      moodboardItems: project.moodboardItems || []
    };
  }

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [total, projects] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.findMany({
       : limit,
        skip,
        take include: { roleRequirements: true },
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    return {
      data: projects.map(p => this.toDto(p)),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit
      }
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { roleRequirements: true, scripts: true, assignments: true }
    });
    return this.toDto(project);
  }

  async create(data: { title?: string; name?: string; description?: string; client?: string; clientName?: string; status?: string; budget?: number; startDate?: string | Date; endDate?: string | Date; roleRequirements?: { role: string; count?: number; skills: string[] }[] }) {
    const { roleRequirements, title, name, client, clientName, budget, startDate, endDate, ...rest } = data;

    const resolvedTitle = title || name;
    const resolvedClient = client || clientName;

    if (!resolvedTitle) {
      throw new BadRequestException('Project title/name is required');
    }

    // Map frontend fields to database schema
    const projectData = {
      ...rest,
      title: resolvedTitle,
      client: resolvedClient,
      budget: budget ? parseFloat(budget.toString()) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: rest.status || 'PLANNED'
    };

    const created = await this.prisma.project.create({
      data: {
        title: projectData.title,
        client: projectData.client,
        description: projectData.description,
        status: projectData.status,
        budget: projectData.budget,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        roleRequirements: {
          create: (roleRequirements || []).map((rr: { role: string; count?: number; skills: string[] | string }) => ({
            role: rr.role,
            count: rr.count || 1,
            skills: Array.isArray(rr.skills) ? rr.skills : [rr.skills].filter(Boolean)
          }))
        },
      },
      include: { roleRequirements: true }
    });
    return this.toDto(created);
  }

  async update(id: string, data: { title?: string; name?: string; description?: string; client?: string; clientName?: string; status?: string; budget?: number; startDate?: string | Date; endDate?: string | Date }) {
    const updateData: Record<string, unknown> = {};
    const resolvedTitle = data.title || data.name;
    const resolvedClient = data.client || data.clientName;

    if (resolvedTitle) updateData.title = resolvedTitle;
    if (resolvedClient) updateData.client = resolvedClient;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const updated = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: { roleRequirements: true }
    });

    return this.toDto(updated);
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async removeBatch(ids: string[]) {
    return this.prisma.project.deleteMany({ where: { id: { in: ids } } });
  }

  async importBatch(items: Record<string, unknown>[]) {
    let created = 0;
    const errors: { item: Record<string, unknown>; error: string }[] = [];

    for (const item of items) {
      try {
        // Map import fields to expected DTO format
        const projectData = {
          title: (item.name || item.title) as string,
          description: item.description as string | undefined,
          client: (item.clientName || item.client) as string | undefined,
          status: (item.status || 'PLANNED') as string,
          budget: item.budget as number | undefined,
          startDate: item.startDate as string | Date | undefined,
          endDate: (item.dueDate || item.endDate) as string | Date | undefined,
          roleRequirements: item.roleRequirements as { role: string; count?: number; skills: string[] }[] | undefined
        };
        await this.create(projectData);
        created++;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        errors.push({ item, error: message });
      }
    }
    return { created, updated: 0, errors };
  }
}
