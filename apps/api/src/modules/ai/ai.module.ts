import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { ConfigModule } from '@nestjs/config';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { RAGModule } from '../rag/rag.module';
import { VertexAIService } from './vertex-ai.service';
import { VertexAIEmbeddingsService } from './vertex-ai-embeddings.service';
import { StreamingService } from './streaming.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [ConfigModule, PrismaModule, IntelligenceModule, RAGModule],
    controllers: [AIController],
    providers: [GeminiAnalystService, VertexAIService, VertexAIEmbeddingsService, StreamingService],
    exports: [GeminiAnalystService, VertexAIService, VertexAIEmbeddingsService],
})
export class AIModule { }
