
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { validate } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/guards/common.module';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from './common/logger/logger.module';
import { AssetsModule } from './modules/assets/assets.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { MoodboardModule } from './modules/moodboard/moodboard.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { FreelancersModule } from './modules/freelancers/freelancers.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { StorageModule } from './modules/storage/storage.module';
import { HealthModule } from './health/health.module';
import { GoogleModule } from './modules/google/google.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AIModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per ttl window
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../client'),
      exclude: ['/api/(.*)'],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
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
  ],
  providers: [],
})
export class AppModule { }
