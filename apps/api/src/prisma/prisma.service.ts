import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool | null = null;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    
    if (connectionString) {
      // Prisma 7: Use pg driver adapter for direct PostgreSQL connection
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      // @ts-ignore - Prisma 7 adapter type
      super({ adapter });
      // Store pool reference for cleanup
      (this as any)._pool = pool;
    } else {
      // Fallback for environments without DATABASE_URL
      super();
    }
  }

  async onModuleInit() {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Database connected successfully');
        return;
      } catch (e: any) {
        attempts++;
        this.logger.error(`Database connection failed (Attempt ${attempts}/${maxRetries}): ${e.message}`);
        if (attempts >= maxRetries) throw e;
        await new Promise(r => setTimeout(r, 2000)); // Wait 2s
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // Clean up pool if exists
    if ((this as any)._pool) {
      await (this as any)._pool.end();
    }
  }
}
