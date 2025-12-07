import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module";
import { IntelligenceModule } from "../intelligence/intelligence.module";
import { MonitoringModule } from "../monitoring/monitoring.module";
import { RAGModule } from "../rag/rag.module";
import { ToolsModule } from "../tools/tools.module";
import { AIController } from "./ai.controller";
import { GeminiAnalystService } from "./gemini-analyst.service";
import { GeminiOpenAIService } from "./gemini-openai.service";
import { OptimizationController } from "./optimization.controller";
import { AIProviderManager } from "./providers/ai-provider.manager";
import { VertexAIProvider } from "./providers/vertex-ai.provider";
import { StreamingService } from "./streaming.service";
import { PromptTesterService } from "./testing/prompt-tester.service";
import { VertexAIEmbeddingsService } from "./vertex-ai-embeddings.service";
import { VertexAIService } from "./vertex-ai.service";

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
