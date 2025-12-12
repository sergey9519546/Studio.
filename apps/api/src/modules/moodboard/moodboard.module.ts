
import { Module } from '@nestjs/common';
import { MoodboardController } from './moodboard.controller.js';
import { MoodboardService } from './moodboard.service.js';
import { AssetsModule } from '../assets/assets.module.js';
import { AIModule } from '../ai/ai.module.js';

@Module({
  imports: [AssetsModule, AIModule],
  controllers: [MoodboardController],
  providers: [MoodboardService],
  exports: [MoodboardService],
})
export class MoodboardModule { }
