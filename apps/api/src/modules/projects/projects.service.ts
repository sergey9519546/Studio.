import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service.js';
import { GenAIService } from '../../common/ai/gen-ai.service.js';
import { ZaiService } from '../../common/ai/zai.service.js';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

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
  title: string | null;
  client: string | null;
  description: string | null;
  status: string;
  budget: number | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roleRequirements?: Array<{
    id: string;
    role: string;
    count: number | null;
    skills: unknown; // Json field in database
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
    description: string | null;
    imageUrl: string | null;
    tags: string[];
    projectId: string;
  }>;
  scripts?: Array<unknown>;
  assignments?: Array<unknown>;
}

/**
 * Type definition for DTO output
 */
export interface ProjectDto {
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
    private readonly assetsService: AssetsService,
    private readonly genAIService: GenAIService,
    private readonly zaiService: ZaiService,
  ) { }

  async scriptAssist(id: string, scriptText: string) {
    if (!scriptText || scriptText.length < 5) {
      return [];
    }

    // 1. Intelligence
    const systemPrompt = "You are a visual researcher for a film studio. Analyze the provided script line. Extract 3-5 distinct, comma-separated visual keywords that describe the setting, lighting, or objects. Output ONLY the keywords.";

    try {
      const rawResponse = await this.genAIService.generateText(scriptText, systemPrompt);
      // Keywords would be processed here for asset search
      void rawResponse;
    } catch {
      // Fallback logic placeholder
    }

    // TODO: Implement asset search functionality
    // The AssetsService needs a search method to find relevant assets by keyword
    // For now, returning empty array until search is implemented
    const candidates: unknown[] = [];

    return candidates.slice(0, 10);
  }

  private toDto(project: PrismaProjectResult | null): ProjectDto | null {
    if (!project) return null;
    return {
      ...project,
      name: project.title || '',
      title: project.title || '',
      clientName: project.client || undefined,
      client: project.client || undefined,
      description: project.description || undefined,
      status: project.status,
      budget: project.budget || undefined,
      startDate: project.startDate || undefined,
      dueDate: project.endDate || undefined,
      endDate: project.endDate || undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Ensure arrays are present and handle nullable count, parse Json skills
      roleRequirements: (project.roleRequirements || []).map(rr => ({
        ...rr,
        count: rr.count || 0,
        skills: this.parseJsonArray(rr.skills)
      })),
      knowledgeBase: project.knowledgeBase || [],
      moodboardItems: (project.moodboardItems || []).map(item => ({
        ...item,
        description: item.description || undefined,
        imageUrl: item.imageUrl || undefined
      })),
      scripts: project.scripts,
      assignments: project.assignments
    };
  }

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [total, projects] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.findMany({
        skip,
        take: limit,
        include: { roleRequirements: true },
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
    const { roleRequirements, title, name, client, clientName, budget, startDate, endDate, status, ...rest } = data;

    const resolvedTitle = title || name;
    const resolvedClient = client || clientName;
    const normalizedStatus = this.normalizeStatus(status);

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
      status: normalizedStatus
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
    if (data.status) updateData.status = this.normalizeStatus(data.status);
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
          status: this.normalizeStatus(item.status as string | undefined),
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

  /**
   * Import project from uploaded file (Excel, CSV, JSON, or text document)
   * Uses Z.ai to parse and extract project data
   */
  async importFromFile(file: MulterFile) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Convert buffer to string
      const fileContent = file.buffer.toString('utf-8');
      
      // Determine file type from mime type or extension
      const fileType = this.getFileType(file);
      
      // Use Z.ai to parse the file content
      const parsedData = await this.zaiService.parseFile(fileContent, fileType);
      
      // Validate and normalize the parsed data
      const projectData = this.normalizeImportedProject(parsedData);
      
      // Create the project
      const created = await this.create(projectData);
      
      return {
        success: true,
        project: created,
        message: 'Project imported successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide more specific error messages
      if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        throw new BadRequestException(
          'Failed to parse file content. Please ensure the file is properly formatted and contains valid project data.'
        );
      } else if (errorMessage.includes('title') || errorMessage.includes('name')) {
        throw new BadRequestException(
          'Could not extract project name from file. Please ensure your file contains a project name or title field.'
        );
      } else if (errorMessage.includes('Z.ai') || errorMessage.includes('API')) {
        throw new BadRequestException(
          'AI parsing service is temporarily unavailable. Please try again later or check your Z.ai API configuration.'
        );
      }
      
      throw new BadRequestException(
        `Failed to import project from file: ${errorMessage}`
      );
    }
  }

  /**
   * Determine file type from mime type or extension
   */
  private getFileType(file: MulterFile): string {
    const mimeType = file.mimetype.toLowerCase();
    const filename = file.originalname.toLowerCase();
    
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return 'Excel';
    } else if (mimeType.includes('csv') || filename.endsWith('.csv')) {
      return 'CSV';
    } else if (mimeType.includes('json') || filename.endsWith('.json')) {
      return 'JSON';
    } else if (mimeType.includes('document') || filename.endsWith('.docx') || filename.endsWith('.doc')) {
      return 'Document';
    } else {
      return 'Text';
    }
  }

  /**
   * Normalize imported project data to match our schema
   */
  private normalizeImportedProject(data: Record<string, unknown>): {
    title: string;
    description?: string;
    client?: string;
    status?: ProjectStatus;
    budget?: number;
    startDate?: Date;
    endDate?: Date;
    roleRequirements?: { role: string; count?: number; skills: string[] }[];
  } {
    // Extract project name/title
    const title = (data.projectName || data.name || data.title || 'Imported Project') as string;
    
    // Extract description/brief
    const description = (data.description || data.brief || data.summary) as string | undefined;
    
    // Extract client
    const client = (data.client || data.clientName || data.customer) as string | undefined;
    
    // Extract budget
    let budget: number | undefined;
    if (data.budget) {
      if (typeof data.budget === 'number') {
        budget = data.budget;
      } else if (typeof data.budget === 'string') {
        // Try to parse budget string (e.g., "$10,000" -> 10000)
        const numericBudget = parseFloat(data.budget.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(numericBudget)) {
          budget = numericBudget;
        }
      }
    }
    
    // Extract dates
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (data.startDate || data.start || data.beginDate) {
      const dateStr = (data.startDate || data.start || data.beginDate) as string;
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        startDate = parsed;
      }
    }
    
    if (data.endDate || data.dueDate || data.deadline || data.end) {
      const dateStr = (data.endDate || data.dueDate || data.deadline || data.end) as string;
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        endDate = parsed;
      }
    }
    
    // Extract deliverables as role requirements
    let roleRequirements: { role: string; count?: number; skills: string[] }[] | undefined;
    if (data.deliverables && Array.isArray(data.deliverables)) {
      roleRequirements = (data.deliverables as string[]).map(deliverable => ({
        role: typeof deliverable === 'string' ? deliverable : String(deliverable),
        count: 1,
        skills: [],
      }));
    }
    
    return {
      title,
      description,
      client,
      status: this.normalizeStatus(data.status as string | undefined),
      budget,
      startDate,
      endDate,
      roleRequirements,
    };
  }

  private normalizeStatus(status?: string): ProjectStatus {
    if (!status) {
      return ProjectStatus.PLANNED;
    }

    const normalized = status.toUpperCase().replace(/\s+/g, '_');
    const allowedStatuses = Object.values(ProjectStatus) as string[];
    return allowedStatuses.includes(normalized) ? normalized as ProjectStatus : ProjectStatus.PLANNED;
  }

  /**
   * Helper: Parse Json field to ensure it's a string array
   */
  private parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter(item => typeof item === 'string') as string[];
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === 'string');
        }
      } catch {
        // If parsing fails, treat as single string
        return [value];
      }
    }
    return [];
  }
}
