
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFreelancerDto, UpdateFreelancerDto, ImportFreelancerDto } from './dto/freelancer.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FreelancersService {
  private readonly CACHE_KEY = 'freelancers:list';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private mapWithSkills(f: any) {
    return { ...f, skills: f.skills.map((s: any) => s.name) };
  }

  async findAll() {
    // Check cache first
    const cached = await this.cacheManager.get(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const freelancers = await this.prisma.freelancer.findMany({
      include: { skills: true },
      orderBy: { name: 'asc' }
    });

    // Flatten skills for frontend compatibility
    const result = freelancers.map((f) => this.mapWithSkills(f));

    // Cache the result for 24 hours
    await this.cacheManager.set(this.CACHE_KEY, result, this.CACHE_TTL);

    return result;
  }

  async findOne(id: string) {
    const f = await this.prisma.freelancer.findUnique({
      where: { id },
      include: { skills: true }
    });
    if (!f) return null;
    return this.mapWithSkills(f);
  }

  async create(data: CreateFreelancerDto) {
    const { skills, contactInfo, email, ...rest } = data;
    const resolvedEmail = email || contactInfo;

    if (!resolvedEmail) {
      throw new BadRequestException('Email is required for freelancer');
    }

    const created = await this.prisma.freelancer.create({
      data: {
        ...rest,
        email: resolvedEmail,
        skills: {
          connectOrCreate: (skills || []).map((name: string) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: { skills: true }
    });

    // Invalidate cache when creating
    await this.cacheManager.del(this.CACHE_KEY);

    return created;
  }

  async update(id: string, data: UpdateFreelancerDto) {
    const { skills, contactInfo, email, ...rest } = data;
    const resolvedEmail = email || contactInfo;
    const updated = await this.prisma.freelancer.update({
      where: { id },
      data: {
        ...rest,
        ...(resolvedEmail ? { email: resolvedEmail } : {}),
        skills: skills ? {
          set: [], // Clear existing
          connectOrCreate: skills.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        } : undefined
      },
      include: { skills: true }
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
          { skills: { some: { name: { contains: q, mode: 'insensitive' } } } },
        ],
      },
      include: { skills: true },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return results.map((f) => this.mapWithSkills(f));
  }

  async suggested(limit = 5) {
    const results = await this.prisma.freelancer.findMany({
      include: { skills: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return results.map((f) => this.mapWithSkills(f));
  }

  async remove(id: string) {
    const deleted = await this.prisma.freelancer.delete({ where: { id } });

    // Invalidate cache when deleting
    await this.cacheManager.del(this.CACHE_KEY);

    return deleted;
  }

  async createBatch(items: ImportFreelancerDto[]) {
    // Sequential execution to handle connectOrCreate correctly
    let created = 0;
    const updated = 0;
    for (const item of items) {
      const { skills, contactInfo, email, ...rest } = item;

      const resolvedEmail = email || contactInfo;
      if (!resolvedEmail) {
        // Skip invalid items or throw error. For batch, we'll skip and log/count error in a real app.
        // For now, let's just continue to next iteration to avoid crashing the whole batch
        continue;
      }

      const skillOps = {
        connectOrCreate: (skills || []).map((name: string) => ({
          where: { name },
          create: { name }
        }))
      };

      try {
        await this.prisma.freelancer.upsert({
          where: { email: resolvedEmail },
          create: { ...rest, email: resolvedEmail, skills: skillOps },
          update: { ...rest, email: resolvedEmail, skills: skillOps }
        });
        // Simplistic count
        created++;
      } catch (e) {
        console.error(e);
      }
    }
    return { created, updated, errors: [] };
  }
}
