import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly _pool?: Pool;
  private readonly _db?: Database.Database;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const isPostgres = databaseUrl.startsWith('postgresql://') || databaseUrl.includes('postgres');
    const isSqlite = databaseUrl.startsWith('file:');

    let adapter;
    let pool;
    let db;

    if (isPostgres) {
      pool = new Pool({ connectionString: databaseUrl });
      adapter = new PrismaPg(pool);
    } else if (isSqlite) {
      const dbPath = databaseUrl.replace('file:', '');
      db = new Database(dbPath);
      adapter = new PrismaBetterSqlite3(db);
    }

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
