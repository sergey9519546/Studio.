import { createClient } from '@libsql/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;

  constructor() {
    // Create libsql client for SQLite
    const libsql = createClient({
      url: 'file:./dev.db',
    });

    // Create the adapter
    const adapter = new PrismaLibSQL(libsql);

    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
    this.logger = new Logger(PrismaService.name);
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
  }
}
