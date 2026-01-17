import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenAIService } from './gen-ai.service.js';
import { ZaiService } from './zai.service.js';
import { AIController } from './ai.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [GenAIService, ZaiService],
  exports: [GenAIService, ZaiService],
})
export class AIModule {}
