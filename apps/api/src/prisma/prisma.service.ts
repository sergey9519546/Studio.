import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      accelerateUrl: process.env.DATABASE_URL,
    });
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
  }
}
