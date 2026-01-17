import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import type { FreelancerStatus } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { ZaiService } from '../../common/ai/zai.service.js';
import { CreateFreelancerDto, ImportFreelancerDto, UpdateFreelancerDto } from './dto/freelancer.dto.js';

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

@Injectable()
export class FreelancersService {
  private readonly logger = new Logger(FreelancersService.name);
  private readonly CACHE_KEY = 'freelancers:list';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly zaiService: ZaiService,
  ) { }

  async findAll() {
    // Check cache first
    const cached = await this.cacheManager.get(this.CACHE_KEY);
    if (cached) {
      return this.normalizeFreelancers(cached as unknown[]);
    }

    // Fetch from database
    const freelancers = await this.prisma.freelancer.findMany({
      orderBy: { name: 'asc' }
    });

    // Cache the result for 24 hours
    await this.cacheManager.set(this.CACHE_KEY, freelancers, this.CACHE_TTL);

    return this.normalizeFreelancers(freelancers);
  }

  async findOne(id: string) {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id }
    });
    return freelancer ? this.normalizeFreelancer(freelancer) : null;
  }

  async create(data: CreateFreelancerDto) {
    const { skills, contactInfo, email, ...rest }: CreateFreelancerDto = data;
    const resolvedEmail = email || contactInfo;

    if (!resolvedEmail) {
      throw new BadRequestException('Email is required for freelancer');
    }

    const created = await this.prisma.freelancer.create({
      data: {
        ...rest,
        email: resolvedEmail,
        skills: skills || [],
        status: rest.status as FreelancerStatus
      }
    });

    // Invalidate cache when creating
    await this.cacheManager.del(this.CACHE_KEY);

    return this.normalizeFreelancer(created);
  }

  async update(id: string, data: UpdateFreelancerDto) {
    const { skills, contactInfo, email, status, ...rest } = data;
    const resolvedEmail = email || contactInfo;

    const updateData: Record<string, unknown> = {
      ...rest,
    };

    if (resolvedEmail) updateData.email = resolvedEmail;
    if (skills) updateData.skills = skills;
    if (status) updateData.status = status as FreelancerStatus;

    const updated = await this.prisma.freelancer.update({
      where: { id },
      data: updateData
    });

    // Invalidate cache when updating
    await this.cacheManager.del(this.CACHE_KEY);

    return this.normalizeFreelancer(updated);
  }

  async search(query: string, limit = 10) {
    const q = query?.trim();
    if (!q) {
      return this.suggested(limit);
    }

    const results = await this.prisma.freelancer.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { role: { contains: q } },
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return this.normalizeFreelancers(results);
  }

  async suggested(limit = 5) {
    const results = await this.prisma.freelancer.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return this.normalizeFreelancers(results);
  }

  async remove(id: string) {
    const deleted = await this.prisma.freelancer.delete({ where: { id } });

    // Invalidate cache when deleting
    await this.cacheManager.del(this.CACHE_KEY);

    return this.normalizeFreelancer(deleted);
  }

  async createBatch(items: ImportFreelancerDto[]) {
    // Sequential execution for batch creation
    let created = 0;
    const updated = 0;
    for (const item of items) {
      const { skills, contactInfo, email, status, ...rest } = item;

      const resolvedEmail = email || contactInfo;
      if (!resolvedEmail) {
        // Skip invalid items or throw error. For batch, we'll skip and log/count error in a real app.
        // For now, let's just continue to next iteration to avoid crashing the whole batch
        continue;
      }

      try {
        await this.prisma.freelancer.upsert({
          where: { email: resolvedEmail },
          create: { ...rest, email: resolvedEmail, skills: skills || [], status: status as FreelancerStatus },
          update: { ...rest, email: resolvedEmail, skills: skills || [], status: status as FreelancerStatus }
        });
        // Simplistic count
        created++;
      } catch (e) {
        this.logger.error(`Failed to upsert freelancer: ${resolvedEmail}`, e);
      }
    }
    return { created, updated, errors: [] };
  }

  /**
   * Parse CV/resume file and create freelancer profile
   */
  async parseCVAndCreate(file: MulterFile) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Convert file to text
      const fileContent = file.buffer.toString('utf-8');
      
      // Use Z.ai to parse the resume
      const parsed = await this.zaiService.parseResume(fileContent);
      
      if (!parsed.name) {
        throw new BadRequestException('Could not extract name from CV/resume');
      }

      if (!parsed.email) {
        throw new BadRequestException('Could not extract email from CV/resume');
      }

      // Create freelancer profile from parsed data
      const createDto: CreateFreelancerDto = {
        name: parsed.name,
        email: parsed.email,
        contactInfo: parsed.phone || parsed.email,
        skills: parsed.skills || [],
        bio: this.buildBioFromParsedData(parsed),
        status: 'AVAILABLE' as FreelancerStatus,
      };

      const freelancer = await this.create(createDto);

      return {
        success: true,
        freelancer,
        parsedData: parsed,
        message: 'CV/Resume parsed and freelancer profile created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to parse CV', error);
      throw new BadRequestException(
        `Failed to parse CV/resume: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Build bio text from parsed resume data
   */
  private buildBioFromParsedData(parsed: {
    name?: string;
    experience?: string;
    education?: string;
    skills?: string[];
    availability?: string;
  }): string {
    const parts: string[] = [];

    if (parsed.experience) {
      parts.push(`Experience: ${parsed.experience}`);
    }

    if (parsed.education) {
      parts.push(`Education: ${parsed.education}`);
    }

    if (parsed.skills && parsed.skills.length > 0) {
      parts.push(`Skills: ${parsed.skills.join(', ')}`);
    }

    if (parsed.availability) {
      parts.push(`Availability: ${parsed.availability}`);
    }

    return parts.join('\n\n') || 'No bio information available';
  }

  private normalizeFreelancers(items: unknown[]): unknown[] {
    return items.map(item => this.normalizeFreelancer(item));
  }

  private normalizeFreelancer(item: unknown): Record<string, unknown> | unknown {
    if (!item || typeof item !== 'object') return item;
    const freelancer = item as { skills?: unknown[] };
    const skills = Array.isArray(freelancer.skills)
      ? freelancer.skills.map(s => (typeof s === 'string' ? s : (s as { name?: string }).name || '')).filter(Boolean)
      : [];
    return { ...(item as Record<string, unknown>), skills };
  }
}
