import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { IntelligenceModule } from "../intelligence/intelligence.module.js";
import { MonitoringModule } from "../monitoring/monitoring.module.js";
import { RAGModule } from "../rag/rag.module.js";
import { ToolsModule } from "../tools/tools.module.js";
import { AIController } from "./ai.controller.js";
import { GeminiAnalystService } from "./gemini-analyst.service.js";
import { GeminiService } from "./gemini.service.js";
import { OptimizationController } from "./optimization.controller.js";
import { AIProviderManager } from "./providers/ai-provider.manager.js";
import { VertexAIProvider } from "./providers/vertex-ai.provider.js";
import { StreamingService } from "./streaming.service.js";
import { PromptTesterService } from "./testing/prompt-tester.service.js";
import { VertexAIEmbeddingsService } from "./vertex-ai-embeddings.service.js";
import { VertexAIService } from "./vertex-ai.service.js";
import { MockAnalysisService } from "./mock-analysis.service.js";

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
    GeminiService,
    VertexAIService,
    VertexAIEmbeddingsService,
    StreamingService,
    VertexAIProvider,
    AIProviderManager,
    PromptTesterService,
    MockAnalysisService,
  ],
  exports: [
    GeminiAnalystService,
    GeminiService,
    VertexAIService,
    VertexAIEmbeddingsService,
    StreamingService,
    AIProviderManager,
    MockAnalysisService,
  ],
})
export class AIModule {}
