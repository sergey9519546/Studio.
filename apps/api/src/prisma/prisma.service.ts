import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly _pool?: Pool;
  private readonly _db?: BetterSqlite3.Database;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    const isPostgres = databaseUrl?.startsWith('postgresql://') || databaseUrl?.includes('postgres');
    const isSqlite = databaseUrl?.startsWith('file:');

    let adapter;
    let pool;
    let db;

    if (isPostgres && databaseUrl) {
      pool = new Pool({ connectionString: databaseUrl });
      adapter = new PrismaPg(pool);
    } else if (isSqlite && databaseUrl) {
      const dbPath = databaseUrl.replace('file:', '');
      db = new BetterSqlite3(dbPath);
      adapter = new PrismaBetterSqlite3(db);
    }

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
