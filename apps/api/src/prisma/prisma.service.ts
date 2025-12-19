import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;

  constructor() {
    super({
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
