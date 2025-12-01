
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDto(project: any) { // Keep explicit any here as it maps from Prisma raw result which can be complex
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
        skip,
        take: limit,
        include: { roleRequirements: true, knowledgeBase: true },
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
      include: { roleRequirements: true, knowledgeBase: true, scripts: true, assignments: true }
    });
    return this.toDto(project);
  }

  async create(data: { title: string; description?: string; client?: string; status?: string; budget?: number; startDate?: string | Date; endDate?: string | Date; roleRequirements?: { role: string; count?: number; skills: string[] }[] }) {
    const { roleRequirements, title: name, client: clientName, budget, startDate, endDate, ...rest } = data as any;

    // Map frontend fields to database schema
    const projectData = {
      ...rest,
      title: name || data.title,
      client: clientName || data.client,
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
          create: (roleRequirements || []).map((rr: any) => ({
            role: rr.role,
            count: rr.count || 1,
            skills: Array.isArray(rr.skills) ? rr.skills.join(',') : rr.skills // Convert array to CSV
          }))
        },
      },
      include: { roleRequirements: true }
    });
    return this.toDto(created);
  }

  async update(id: string, data: { title?: string; description?: string; client?: string; status?: string; budget?: number; startDate?: string | Date; endDate?: string | Date }) {
    const updateData: Record<string, unknown> = {};
    if (data.title) updateData.title = data.title;
    if (data.client) updateData.client = data.client;
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

  async importBatch(items: any[]) {
    let created = 0;
    const errors: { item: any, error: string }[] = [];

    for (const item of items) {
      try {
        // Map import fields to expected DTO format
        const projectData = {
          title: item.name || item.title,
          description: item.description,
          client: item.clientName || item.client,
          status: item.status || 'PLANNED',
          budget: item.budget,
          startDate: item.startDate,
          endDate: item.dueDate || item.endDate,
          roleRequirements: item.roleRequirements
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
