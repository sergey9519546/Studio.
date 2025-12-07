import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfluenceController } from './confluence.controller';
import { ConfluenceService } from './confluence.service';

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
