import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenAIService } from './gen-ai.service.js';

@Module({
  imports: [ConfigModule],
  providers: [GenAIService],
  exports: [GenAIService],
})
export class AIModule {}
