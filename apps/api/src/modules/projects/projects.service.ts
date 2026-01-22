import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service.js';
import { GenAIService } from '../../common/ai/gen-ai.service.js';
import { ZaiService } from '../../common/ai/zai.service.js';
import { ProjectsImportService } from './projects-import.service.js';
import { MulterFile, ProjectInput } from './projects-import.types.js';

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
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly assetsService: AssetsService,
    private readonly genAIService: GenAIService,
    private readonly zaiService: ZaiService,
    private readonly projectsImportService: ProjectsImportService,
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
    const { mapping, mappingErrors } = await this.resolveImportMapping(items);

    for (const item of items) {
      try {
        const mappedItem = this.applyImportMapping(item, mapping);
        const sanitized = this.sanitizeImportedRow(mappedItem);
        // Map import fields to expected DTO format
        const projectData = {
          title: (sanitized.name || sanitized.title) as string,
          description: sanitized.description as string | undefined,
          client: (sanitized.clientName || sanitized.client) as string | undefined,
          status: this.normalizeStatus(sanitized.status as string | undefined),
          budget: sanitized.budget as number | undefined,
          startDate: sanitized.startDate as string | Date | undefined,
          endDate: (sanitized.dueDate || sanitized.endDate) as string | Date | undefined,
          roleRequirements: sanitized.roleRequirements as { role: string; count?: number; skills: string[] }[] | undefined
        };
        await this.create(projectData);
        created++;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        errors.push({ item, error: message });
      }
    }
    if (mappingErrors.length > 0) {
      this.logger.warn(`Import mapping completed with ${mappingErrors.length} warnings`);
    }
    return { created, updated: 0, errors, mapping, mappingErrors };
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
      const importedRows = await this.projectsImportService.parseFile(file);
      if (importedRows.length === 0) {
        throw new BadRequestException('No rows found in the uploaded file.');
      }

      const result = await this.importBatch(importedRows);

      return {
        success: true,
        ...result,
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
      }

      throw new BadRequestException(
        `Failed to import project from file: ${errorMessage}`
      );
    }
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

  private async resolveImportMapping(items: Record<string, unknown>[]) {
    const headers = Array.from(new Set(items.flatMap(item => Object.keys(item))));
    const sampleRows = items.slice(0, 3);
    const targetFields = ['title', 'name', 'client', 'clientName', 'description', 'status', 'budget', 'startDate', 'endDate', 'dueDate', 'roleRequirements'];
    const errors: string[] = [];

    const fallbackMapping = this.getHeuristicMapping(headers);

    if (headers.length === 0) {
      errors.push('No headers found to map from import data.');
      return { mapping: fallbackMapping, mappingErrors: errors };
    }

    try {
      const aiMapping = await this.zaiService.mapImportHeaders({
        headers,
        rows: sampleRows,
        targetFields,
      });
      return {
        mapping: { ...fallbackMapping, ...aiMapping },
        mappingErrors: errors,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI mapping error';
      errors.push(`AI mapping failed: ${message}`);
      this.logger.warn(`AI mapping failed, using heuristic mapping. ${message}`);
      return { mapping: fallbackMapping, mappingErrors: errors };
    }
  }

  private getHeuristicMapping(headers: string[]) {
    const synonyms: Record<string, string[]> = {
      title: ['project name', 'project title', 'title', 'name', 'project'],
      client: ['client', 'client name', 'customer', 'customer name', 'account'],
      description: ['description', 'brief', 'summary', 'overview', 'details'],
      status: ['status', 'state', 'phase'],
      budget: ['budget', 'cost', 'price', 'amount', 'estimate'],
      startDate: ['start date', 'start', 'kickoff', 'begin date', 'begin'],
      endDate: ['end date', 'end', 'due date', 'deadline', 'delivery date', 'finish date'],
      roleRequirements: ['roles', 'role requirements', 'requirements', 'deliverables', 'team'],
    };

    const mapping: Record<string, string> = {};
    for (const header of headers) {
      const normalized = this.normalizeHeader(header);
      for (const [field, patterns] of Object.entries(synonyms)) {
        if (patterns.some(pattern => normalized === this.normalizeHeader(pattern))) {
          mapping[header] = field;
          break;
        }
      }
    }

    return mapping;
  }

  private normalizeHeader(header: string) {
    return header.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  private applyImportMapping(item: Record<string, unknown>, mapping: Record<string, string>) {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      const target = mapping[key];
      if (target) {
        mapped[target] = value;
      } else {
        mapped[key] = value;
      }
    }
    return mapped;
  }

  private sanitizeImportedRow(row: Record<string, unknown>) {
    const sanitized = { ...row };
    if (sanitized.budget !== undefined) {
      sanitized.budget = this.parseBudget(sanitized.budget);
    }
    if (sanitized.startDate) {
      sanitized.startDate = this.parseDate(sanitized.startDate);
    }
    if (sanitized.endDate) {
      sanitized.endDate = this.parseDate(sanitized.endDate);
    }
    if (sanitized.dueDate) {
      sanitized.dueDate = this.parseDate(sanitized.dueDate);
    }
    return sanitized;
  }

  private parseBudget(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const numeric = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return Number.isNaN(numeric) ? undefined : numeric;
    }
    return undefined;
  }

  private parseDate(value: unknown): string | Date | undefined {
    if (!value) {
      return undefined;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return undefined;
  }
}
