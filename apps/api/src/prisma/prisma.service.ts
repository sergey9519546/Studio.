import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private _pool?: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    
    if (connectionString) {
      // Prisma 7: Use pg driver adapter for direct PostgreSQL connection
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      super({ adapter });
      this.logger = new Logger(PrismaService.name);
      // Store pool reference for cleanup
      this._pool = pool;
    } else {
      // Fallback for environments without DATABASE_URL
      super();
      this.logger = new Logger(PrismaService.name);
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
    if (this._pool) {
      await this._pool.end();
    }
  }
}
