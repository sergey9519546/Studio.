
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";

import { ServeStaticModule } from "@nestjs/serve-static";
import { existsSync } from "fs";
import { join } from "path";
import { CacheModule } from "./common/cache/cache.module";
import { CommonModule } from "./common/guards/common.module";
import { LoggerModule } from './common/logger/logger.module';
import { validate } from "./config/env.validation";
import { HealthModule } from "./health/health.module";
import { AIModule } from "./modules/ai/ai.module";
import { AnalysisModule } from "./modules/analysis/analysis.module";
import { AssetsModule } from "./modules/assets/assets.module";
import { AssignmentsModule } from "./modules/assignments/assignments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { FreelancersModule } from "./modules/freelancers/freelancers.module";
import { GoogleModule } from "./modules/google/google.module";
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { MonitoringModule } from "./modules/monitoring/monitoring.module";
import { MoodboardModule } from "./modules/moodboard/moodboard.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { ScriptsModule } from "./modules/scripts/scripts.module";
import { StorageModule } from "./modules/storage/storage.module";
import { PrismaModule } from "./prisma/prisma.module";

// Resolve the frontend build directory robustly across build outputs (dist/build)
const staticCandidates = [
  join(process.cwd(), 'build/client'),
  join(process.cwd(), 'dist/client'),
  join(__dirname, '../../../client'),
  join(__dirname, '../../client'),
];
const staticRoot = staticCandidates.find(p => existsSync(p));

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
            exclude: ["/api/(.*)"],
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
    GoogleModule,
    AssetsModule,
    KnowledgeModule,
    IntelligenceModule,
    MoodboardModule,
    AnalysisModule,
    AIModule,
    FreelancersModule,
    ProjectsModule,
    AssignmentsModule,
    ScriptsModule,
    AvailabilityModule,
    HealthModule,
    AuthModule,
    MonitoringModule,
    IntegrationsModule,
  ],
  providers: [],
})
export class AppModule {}
