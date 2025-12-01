
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

  async create(data: ProjectInput) {
    const { roleRequirements, knowledgeBase, name, clientName, budget, startDate, dueDate, ...rest } = data;

    // Map frontend fields to database schema
    const projectData = {
      ...rest,
      title: name,
      client: clientName,
      budget: budget ? parseFloat(budget.toString()) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: dueDate ? new Date(dueDate) : undefined,
      // Remove unknown fields
      priority: undefined,
      tags: undefined,
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
          create: roleRequirements || []
        },
        // KnowledgeBase items usually come via knowledge module, but simple text items here:
        knowledgeSources: {
          create: (knowledgeBase || []).map((kb) => ({
            type: 'text',
            title: kb.title,
            originalContent: kb.content,
            status: 'indexed',
            summary: kb.category,
            projectId: undefined // Will be connected automatically
          }))
        }
      },
      include: { roleRequirements: true }
    });
    return this.toDto(created);
  }

  async update(id: string, data: ProjectInput) {
    const { name, clientName, ...rest } = data;

    // Map frontend fields to database schema for update
    const updateData: Record<string, unknown> = { ...rest };
    if (name) updateData.title = name;
    if (clientName) updateData.client = clientName;

    // Simple update strategy: Update primitives directly
    const updated = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: { roleRequirements: true }
    });

    // Handle Roles (Naive replacement or upsert needed for complex logic, keeping simple for now)
    // In a real app, we'd diff the roles.

    return this.toDto(updated);
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async removeBatch(ids: string[]) {
    return this.prisma.project.deleteMany({ where: { id: { in: ids } } });
  }

  async importBatch(items: ProjectInput[]) {
    let created = 0;
    const errors: { item: ProjectInput, error: string }[] = [];

    for (const item of items) {
      try {
        await this.create(item);
        created++;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        errors.push({ item, error: message });
      }
    }
    return { created, updated: 0, errors };
  }
}
