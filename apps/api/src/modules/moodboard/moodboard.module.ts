
import { Module } from '@nestjs/common';
import { MoodboardController } from './moodboard.controller';
import { MoodboardService } from './moodboard.service';
import { AssetsModule } from '../assets/assets.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AssetsModule, AIModule],
  controllers: [MoodboardController],
  providers: [MoodboardService],
  exports: [MoodboardService],
})
export class MoodboardModule { }
