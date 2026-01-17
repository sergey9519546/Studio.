import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly _pool?: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    const isPostgres = databaseUrl?.startsWith('postgresql://') || databaseUrl?.includes('postgres');
    const pool = isPostgres && databaseUrl ? new Pool({ connectionString: databaseUrl }) : undefined;
    const adapter = pool ? new PrismaPg(pool) : undefined;

    super(
      adapter
        ? {
            adapter,
            log: ['query', 'info', 'warn', 'error'],
          }
        : {
            log: ['query', 'info', 'warn', 'error'],
          },
    );
    this.logger = new Logger(PrismaService.name);
    this._pool = pool;
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
    if (this._pool) {
      await this._pool.end();
    }
  }
}
