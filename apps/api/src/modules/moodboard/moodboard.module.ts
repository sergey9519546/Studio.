
import { Module } from '@nestjs/common';
import { MoodboardController } from './moodboard.controller.js';
import { MoodboardService } from './moodboard.service.js';
import { AssetsModule } from '../assets/assets.module.js';

@Module({
  imports: [AssetsModule],
  controllers: [MoodboardController],
  providers: [MoodboardService],
  exports: [MoodboardService],
})
export class MoodboardModule { }
