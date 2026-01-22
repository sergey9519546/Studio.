import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Script } from '@prisma/client';
import { GenAIService } from '../../common/ai/gen-ai.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateScriptDto, GenerateScriptDto, UpdateScriptDto } from './dto/script.dto.js';

interface ScriptResponse {
  id: string;
  projectId: string;
  title?: string | null;
  content?: string | null;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ScriptsService {
  private readonly logger = new Logger(ScriptsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly genAIService: GenAIService,
  ) {}

  private normalizeTags(tags?: unknown): string[] {
    if (!Array.isArray(tags)) return [];
    return tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  private applyTypeTag(tags: string[], type?: string): string[] {
    if (!type) return tags;
    const trimmedType = type.trim();
    if (!trimmedType) return tags;

    const filtered = tags.filter(tag => !tag.toLowerCase().startsWith('type:'));
    const normalized = new Set(filtered);
    normalized.add(`type:${trimmedType}`);
    return Array.from(normalized);
  }

  private extractType(tags: string[]): string | undefined {
    const typeTag = tags.find(tag => tag.toLowerCase().startsWith('type:'));
    return typeTag ? typeTag.substring('type:'.length) : undefined;
  }

  private toResponse(script: Script): ScriptResponse {
    const tags = this.normalizeTags(script.tags);
    return {
      id: script.id,
      projectId: script.projectId,
      title: script.title,
      content: script.content,
      type: this.extractType(tags),
      createdAt: script.createdAt,
      updatedAt: script.updatedAt,
    };
  }

  async findAll(projectId?: string): Promise<ScriptResponse[]> {
    const scripts = await this.prisma.script.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });

    return scripts.map(script => this.toResponse(script));
  }

  async findOne(id: string): Promise<ScriptResponse> {
    const script = await this.prisma.script.findUnique({ where: { id } });
    if (!script) {
      throw new NotFoundException(`Script ${id} not found`);
    }

    return this.toResponse(script);
  }

  async create(dto: CreateScriptDto): Promise<ScriptResponse> {
    const tags = this.applyTypeTag(this.normalizeTags(dto.tags), dto.type);
    const created = await this.prisma.script.create({
      data: {
        projectId: dto.projectId,
        title: dto.title ?? null,
        content: dto.content ?? null,
        tags,
      },
    });

    return this.toResponse(created);
  }

  async update(id: string, dto: UpdateScriptDto): Promise<ScriptResponse> {
    const existing = await this.prisma.script.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Script ${id} not found`);
    }

    const existingTags = this.normalizeTags(existing.tags);
    const mergedTags = this.applyTypeTag(
      dto.tags ? this.normalizeTags(dto.tags) : existingTags,
      dto.type
    );

    const updated = await this.prisma.script.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        content: dto.content ?? existing.content,
        tags: mergedTags,
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.script.delete({ where: { id } });
  }

  async generate(dto: GenerateScriptDto): Promise<{ content: string }> {
    const contextText = dto.context ? `\n\nContext:\n${JSON.stringify(dto.context, null, 2)}` : '';
    const prompt = `${dto.prompt}${contextText}`;
    const systemInstruction =
      'You are a senior screenwriter. Draft concise script content that matches the provided prompt and context.';

    this.logger.log(`Generating script content for project ${dto.projectId}`);

    const content = await this.genAIService.generateText(prompt, systemInstruction);

    return { content };
  }
}
