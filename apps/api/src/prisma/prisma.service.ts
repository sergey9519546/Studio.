import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly _db: Database.Database;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
    const dbPath = databaseUrl.replace('file:', '');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const db = new Database(dbPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaBetterSqlite3(db as any);

    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });

    this.logger = new Logger(PrismaService.name);
    this._db = db;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
        if (error instanceof Error) {
            this.logger.error('Failed to connect to the database', error.stack);
        } else {
            this.logger.error('Failed to connect to the database', error);
        }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this._db.close();
  }
}
