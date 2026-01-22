import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly _pool?: Pool;
  private readonly _db?: Database.Database;

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
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    this.logger = new Logger(PrismaService.name);
    this._pool = pool;
    this._db = db;
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
    if (this._db) {
      this._db.close();
    }
  }
}
