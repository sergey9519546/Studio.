import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ConfluenceController } from './confluence.controller.js';
import { ConfluenceService } from './confluence.service.js';

/**
 * Module for Confluence integration
 */
@Module({
  imports: [PrismaModule],
  controllers: [ConfluenceController],
  providers: [ConfluenceService],
  exports: [ConfluenceService],
})
export class ConfluenceModule {}
