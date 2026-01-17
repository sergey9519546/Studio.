
import { Module } from '@nestjs/common';
import { MoodboardController } from './moodboard.controller.js';
import { MoodboardService } from './moodboard.service.js';
import { AssetsModule } from '../assets/assets.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AIModule } from '../../common/ai/ai.module.js';

@Module({
  imports: [AssetsModule, PrismaModule, AIModule],
  controllers: [MoodboardController],
  providers: [MoodboardService],
  exports: [MoodboardService],
})
export class MoodboardModule { }
