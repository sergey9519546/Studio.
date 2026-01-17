import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { ServeStaticModule } from "@nestjs/serve-static";
import { existsSync } from "fs";
import { dirname, join } from "path";

import { CacheModule } from "./common/cache/cache.module.js";
import { LoggerModule } from './common/logger/logger.module.js';
import { validate } from "./config/env.validation.js";
import { HealthModule } from "./health/health.module.js";
import { FreelancersModule } from "./modules/freelancers/freelancers.module.js";
import { MoodboardModule } from "./modules/moodboard/moodboard.module.js";
import { ProjectsModule } from "./modules/projects/projects.module.js";
import { StorageModule } from "./modules/storage/storage.module.js";
import { CollaborationModule } from "./modules/collaboration/collaboration.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
const moduleDir = dirname(__filename);

const appLogger = new Logger("AppModule");

// Resolve the frontend build directory robustly across build outputs (dist/build)
const staticCandidates = [
  join(process.cwd(), "build/client"),
  join(process.cwd(), "dist/client"),
  join(moduleDir, "../../../client"),
  join(moduleDir, "../../client"),
];

const staticRoot = staticCandidates.find((p) => existsSync(p));

appLogger.log(
  `Static root: ${staticRoot ?? "not-found"} | cwd: ${process.cwd()} | __dirname: ${moduleDir}`
);
if (!staticRoot && process.env.NODE_ENV === "production") {
  appLogger.warn(`Static root not found. Checked: ${staticCandidates.join(", ")}`);
}

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
    CacheModule,
    LoggerModule,
    PrismaModule,
    StorageModule,
    HealthModule,
    ProjectsModule,
    FreelancersModule,
    MoodboardModule,
    CollaborationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
