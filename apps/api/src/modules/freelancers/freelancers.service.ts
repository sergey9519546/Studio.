
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFreelancerDto, UpdateFreelancerDto, ImportFreelancerDto } from './dto/freelancer.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FreelancersService {
  private readonly CACHE_KEY = 'freelancers:list';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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
      include: { skills: true },
      orderBy: { name: 'asc' }
    });

    // Flatten skills for frontend compatibility
    const result = freelancers.map(f => ({
      ...f,
      skills: f.skills.map(s => s.name)
    }));

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
    return { ...f, skills: f.skills.map(s => s.name) };
  }

  async create(data: CreateFreelancerDto) {
    const { skills, ...rest } = data;
    const created = await this.prisma.freelancer.create({
      data: {
        ...rest,
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
    const { skills, ...rest } = data;
    const updated = await this.prisma.freelancer.update({
      where: { id },
      data: {
        ...rest,
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

  async remove(id: string) {
    const deleted = await this.prisma.freelancer.delete({ where: { id } });

    // Invalidate cache when deleting
    await this.cacheManager.del(this.CACHE_KEY);

    return deleted;
  }

  async createBatch(items: ImportFreelancerDto[]) {
    // Sequential execution to handle connectOrCreate correctly
    const created = 0;
    const updated = 0;
    for (const item of items) {
      const { skills, ...rest } = item;

      if (!rest.email) {
        // Skip invalid items or throw error. For batch, we'll skip and log/count error in a real app.
        // For now, let's just continue to next iteration to avoid crashing the whole batch
        continue;
      }
      const email = rest.email;

      const skillOps = {
        connectOrCreate: (skills || []).map((name: string) => ({
          where: { name },
          create: { name }
        }))
      };

      try {
        await this.prisma.freelancer.upsert({
          where: { email },
          create: { ...rest, email, skills: skillOps },
          update: { ...rest, skills: skillOps }
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
