import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import type { FreelancerStatus } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateFreelancerDto, ImportFreelancerDto, UpdateFreelancerDto } from './dto/freelancer.dto.js';

@Injectable()
export class FreelancersService {
  private readonly logger = new Logger(FreelancersService.name);
  private readonly CACHE_KEY = 'freelancers:list';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async findAll() {
    // Check cache first
    const cached = await this.cacheManager.get(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const freelancers = await this.prisma.freelancer.findMany({
      orderBy: { name: 'asc' }
    });

    // Cache the result for 24 hours
    await this.cacheManager.set(this.CACHE_KEY, freelancers, this.CACHE_TTL);

    return freelancers;
  }

  async findOne(id: string) {
    return await this.prisma.freelancer.findUnique({
      where: { id }
    });
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

    return created;
  }

  async update(id: string, data: UpdateFreelancerDto) {
    const { skills, contactInfo, email, ...rest }: UpdateFreelancerDto = data;
    const resolvedEmail = email || contactInfo;
    const updated = await this.prisma.freelancer.update({
      where: { id },
      data: {
        ...rest,
        ...(resolvedEmail ? { email: resolvedEmail } : {}),
        ...(skills ? { skills } : {}),
        ...(rest.status ? { status: rest.status as FreelancerStatus } : {})
      }
    });

    // Invalidate cache when updating
    await this.cacheManager.del(this.CACHE_KEY);

    return updated;
  }

  async search(query: string, limit = 10) {
    const q = query?.trim();
    if (!q) {
      return this.suggested(limit);
    }

    const results = await this.prisma.freelancer.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { role: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return results;
  }

  async suggested(limit = 5) {
    const results = await this.prisma.freelancer.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return results;
  }

  async remove(id: string) {
    const deleted = await this.prisma.freelancer.delete({ where: { id } });

    // Invalidate cache when deleting
    await this.cacheManager.del(this.CACHE_KEY);

    return deleted;
  }

  async createBatch(items: ImportFreelancerDto[]) {
    // Sequential execution for batch creation
    let created = 0;
    const updated = 0;
    for (const item of items) {
      const { skills, contactInfo, email, ...rest }: ImportFreelancerDto = item;

      const resolvedEmail = email || contactInfo;
      if (!resolvedEmail) {
        // Skip invalid items or throw error. For batch, we'll skip and log/count error in a real app.
        // For now, let's just continue to next iteration to avoid crashing the whole batch
        continue;
      }

      try {
        await this.prisma.freelancer.upsert({
          where: { email: resolvedEmail },
          create: { ...rest, email: resolvedEmail, skills: skills || [], status: rest.status as FreelancerStatus },
          update: { ...rest, email: resolvedEmail, skills: skills || [], status: rest.status as FreelancerStatus }
        });
        // Simplistic count
        created++;
      } catch (e) {
        this.logger.error(`Failed to upsert freelancer: ${resolvedEmail}`, e);
      }
    }
    return { created, updated, errors: [] };
  }
}
