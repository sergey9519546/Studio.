import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { ServeStaticModule } from "@nestjs/serve-static";
import { existsSync } from "fs";
import { dirname, join } from "path";

import { CacheModule } from "./common/cache/cache.module.js";
import { CommonModule } from "./common/guards/common.module.js";
import { LoggerModule } from './common/logger/logger.module.js';
import { validate } from "./config/env.validation.js";
import { HealthModule } from "./health/health.module.js";
import { AIModule } from "./modules/ai/ai.module.js";
import { AnalysisModule } from "./modules/analysis/analysis.module.js";
import { AssetsModule } from "./modules/assets/assets.module.js";
import { AssignmentsModule } from "./modules/assignments/assignments.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { AvailabilityModule } from "./modules/availability/availability.module.js";
import { FreelancersModule } from "./modules/freelancers/freelancers.module.js";
import { GoogleModule } from "./modules/google/google.module.js";
import { IntegrationsModule } from "./modules/integrations/integrations.module.js";
import { IntelligenceModule } from "./modules/intelligence/intelligence.module.js";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module.js";
import { MonitoringModule } from "./modules/monitoring/monitoring.module.js";
import { MoodboardModule } from "./modules/moodboard/moodboard.module.js";
import { ProjectsModule } from "./modules/projects/projects.module.js";
import { RAGModule } from "./modules/rag/rag.module.js";
import { RealtimeModule } from "./modules/realtime/realtime.module.js";
import { ScriptsModule } from "./modules/scripts/scripts.module.js";
import { StorageModule } from "./modules/storage/storage.module.js";
import { TranscriptsModule } from "./modules/transcripts/transcripts.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
const moduleDir = dirname(__filename);

const appLogger = new Logger("AppModule");

// Resolve the frontend build directory robustly across build outputs (dist/build)
// In production (Docker), the path is always /app/build/client
const staticRoot =
  process.env.NODE_ENV === "production"
    ? join(process.cwd(), "build/client")
    : (() => {
        const staticCandidates = [
          join(process.cwd(), "build/client"),
          join(process.cwd(), "dist/client"),
          join(moduleDir, "../../../client"),
          join(moduleDir, "../../client"),
        ];
        return staticCandidates.find((p) => existsSync(p));
      })();

appLogger.log(
  `Static root: ${staticRoot ?? "not-found"} | cwd: ${process.cwd()} | __dirname: ${moduleDir}`
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      validate,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    // STRENGTHENED RATE LIMITING: Progressive tiers for different auth levels
    ThrottlerModule.forRoot([
      {
        // Global fallback: strict limits for unauthenticated users
        name: "global",
        ttl: 60000, // 60 seconds
        limit: 30, // 30 requests per minute (from 100)
      },
      {
        // Tier 1: Registered users get higher limits
        name: "authenticated",
        ttl: 60000,
        limit: 50, // 50 requests per minute
      },
      {
        // Tier 2: Premium users (if implemented later)
        name: "premium",
        ttl: 60000,
        limit: 100,
      },
      {
        // Special tier: Very restrictive for AI operations
        name: "ai-operations",
        ttl: 60000,
        limit: 20, // Very restrictive for costly AI calls
      },
    ]),
    ...(staticRoot
      ? [
          ServeStaticModule.forRoot({
            rootPath: staticRoot,
            serveRoot: "/",
            renderPath: "/*", // SPA fallback so client routes don't 404
            exclude: ["/api/(.*)", "/v1/(.*)"], // Exclude API traffic
          }),
        ]
      : []),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "60m" },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    CacheModule,
    LoggerModule,
    PrismaModule,
    StorageModule,
    // ENABLED MODULES
    GoogleModule,
    // TESTING MODULE RE-ENABLEMENT - One at a time
    KnowledgeModule,
    IntelligenceModule,
    MoodboardModule,
    AssignmentsModule,
    ScriptsModule,
    AvailabilityModule,
    RealtimeModule,
    MonitoringModule,
    IntegrationsModule,
    RAGModule,
    AssetsModule,
    AnalysisModule,
    AIModule,
    HealthModule,
    AuthModule,
    ProjectsModule,
    FreelancersModule,
    TranscriptsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
