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
    // FAST STARTUP: Don't await connection here to avoid blocking app bootstrap
    // Prisma connects lazily on first query
    this.$connect()
      .then(() => this.logger.log('Database connected successfully'))
      .catch((e) => {
        this.logger.warn(`Database connection failed on startup (will retry on first query): ${e.message}`);
        // Don't throw error here, let the app start
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // Clean up pool if exists
    if ((this as any)._pool) {
      await (this as any)._pool.end();
    }
  }
}
