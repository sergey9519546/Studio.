import { Module } from '@nestjs/common';
import { AIModule } from '../../common/ai/ai.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ScriptsController } from './scripts.controller.js';
import { ScriptsService } from './scripts.service.js';

@Module({
  imports: [PrismaModule, AIModule],
  controllers: [ScriptsController],
  providers: [ScriptsService],
  exports: [ScriptsService],
})
export class ScriptsModule {}
