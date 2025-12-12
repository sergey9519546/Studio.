import { Body, Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { RAGService } from "./rag.service";

@Controller({ path: "rag", version: "1" })
@UseGuards(JwtAuthGuard)
export class RAGController {
  private readonly logger = new Logger(RAGController.name);

  constructor(private ragService: RAGService) {}

  /**
   * Index a document for RAG
   */
  @Post("index")
  async indexDocument(
    @Body()
    data: {
      content: string;
      metadata?: {
        source?: string;
        projectId?: string;
        title?: string;
        type?: string;
      };
    }
  ) {
    this.logger.log(`Indexing document: ${data.metadata?.title || "Untitled"}`);

    const result = await this.ragService.indexDocument(
      data.content,
      data.metadata
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Query the RAG system
   */
  @Post("query")
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async query(
    @Body()
    data: {
      question: string;
      projectId?: string;
      topK?: number;
      includeContext?: boolean;
    }
  ) {
    this.logger.log(`RAG Query: "${data.question}"`);

    const result = await this.ragService.query(data.question, {
      projectId: data.projectId,
      topK: data.topK || 5,
      includeContext: data.includeContext !== false,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Chat with RAG (conversational)
   */
  @Post("chat")
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async chat(
    @Body()
    data: {
      message: string;
      conversationHistory?: Array<{ role: string; content: string }>;
      projectId?: string;
      topK?: number;
    }
  ) {
    this.logger.log(`RAG Chat: "${data.message}"`);

    const result = await this.ragService.chat(data.message, {
      conversationHistory: data.conversationHistory,
      projectId: data.projectId,
      topK: data.topK || 3,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Summarize documents
   */
  @Post("summarize")
  async summarize(@Body() data: { documentIds: string[]; maxLength?: number }) {
    this.logger.log(`Summarizing ${data.documentIds.length} documents`);

    const result = await this.ragService.summarizeDocuments(data.documentIds, {
      maxLength: data.maxLength,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get RAG statistics
   */
  @Get("stats")
  async getStats() {
    const stats = await this.ragService.getStats();

    return {
      success: true,
      data: stats,
    };
  }
}
