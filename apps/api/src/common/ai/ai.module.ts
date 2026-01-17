import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenAIService } from './gen-ai.service.js';
import { ZaiService } from './zai.service.js';

@Module({
  imports: [ConfigModule],
  providers: [GenAIService, ZaiService],
  exports: [GenAIService, ZaiService],
})
export class AIModule {}
