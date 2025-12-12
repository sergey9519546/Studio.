import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { IntelligenceModule } from "../intelligence/intelligence.module.js";
import { MonitoringModule } from "../monitoring/monitoring.module.js";
import { RAGModule } from "../rag/rag.module.js";
import { ToolsModule } from "../tools/tools.module.js";
import { AIController } from "./ai.controller.js";
import { GeminiAnalystService } from "./gemini-analyst.service.js";
import { GeminiOpenAIService } from "./gemini-openai.service.js";
import { OptimizationController } from "./optimization.controller.js";
import { AIProviderManager } from "./providers/ai-provider.manager.js";
import { VertexAIProvider } from "./providers/vertex-ai.provider.js";
import { StreamingService } from "./streaming.service.js";
import { PromptTesterService } from "./testing/prompt-tester.service.js";
import { VertexAIEmbeddingsService } from "./vertex-ai-embeddings.service.js";
import { VertexAIService } from "./vertex-ai.service.js";
import { VertexAiEmbeddingsService } from './Users/serge/OneDrive/Documents/Sergey-Avetisyan-main/apps/api/src/modules/ai/vertex-ai-embeddings.service.js';
import { VertexAiService } from './Users/serge/OneDrive/Documents/Sergey-Avetisyan-main/apps/api/src/modules/ai/vertex-ai.service.js';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    IntelligenceModule,
    forwardRef(() => RAGModule),
    MonitoringModule,
    ToolsModule,
  ],
  controllers: [AIController, OptimizationController],
  providers: [
    GeminiAnalystService,
    GeminiOpenAIService,
    VertexAIService,
    VertexAIEmbeddingsService,
    StreamingService,
    VertexAIProvider,
    AIProviderManager,
    PromptTesterService,
    VertexAiEmbeddingsService,
    VertexAiService,
  ],
  exports: [
    GeminiAnalystService,
    GeminiOpenAIService,
    VertexAIService,
    VertexAIEmbeddingsService,
    StreamingService,
    AIProviderManager,
  ],
})
export class AIModule {}
