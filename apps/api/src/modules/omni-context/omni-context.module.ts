import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module.js';

import { OmniContextService } from './omni-context.service.js';
import { OmniContextController } from './omni-context.controller.js';

/**
 * Omni-Context AI Module
 * 
 * Provides persistent, project-spanning AI context that maintains deep
 * understanding of brand voice, client preferences, and creative patterns
 * across all agency projects.
 * 
 * Key Capabilities:
 * - Dynamic context graph construction
 * - Semantic vector search for relevant knowledge
 * - Real-time context updates from approvals
 * - Redis caching for performance
 * - Confidence scoring for context relevance
 */
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
  ],
  controllers: [OmniContextController],
  providers: [OmniContextService],
  exports: [OmniContextService],
})
export class OmniContextModule {}