import { Module, forwardRef } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { ConfigModule } from '@nestjs/config';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { RAGModule } from '../rag/rag.module';
import { VertexAIService } from './vertex-ai.service';
import { VertexAIEmbeddingsService } from './vertex-ai-embeddings.service';
import { StreamingService } from './streaming.service';
import { VertexAIProvider } from './providers/vertex-ai.provider';
import { AIProviderManager } from './providers/ai-provider.manager';
import { OptimizationController } from './optimization.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { PromptTesterService } from './testing/prompt-tester.service';

@Module({
    imports: [ConfigModule, PrismaModule, IntelligenceModule, forwardRef(() => RAGModule), MonitoringModule],
    controllers: [AIController, OptimizationController],
    providers: [
        GeminiAnalystService,
        VertexAIService,
        VertexAIEmbeddingsService,
        StreamingService,
        VertexAIProvider,
        AIProviderManager,
        PromptTesterService,
    ],
    exports: [
        GeminiAnalystService,
        VertexAIService,
        VertexAIEmbeddingsService,
        StreamingService,
        AIProviderManager,
    ],
})
export class AIModule { }
