import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { ConfigModule } from '@nestjs/config';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { RAGModule } from '../rag/rag.module';
import { VertexAIService } from './vertex-ai.service';

@Module({
    imports: [ConfigModule, IntelligenceModule, RAGModule],
    controllers: [AIController],
    providers: [GeminiAnalystService, VertexAIService],
    exports: [GeminiAnalystService, VertexAIService],
})
export class AIModule { }
