import type { SafetySetting } from "@google/genai";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MessageRole } from "@prisma/client";
import type { Response } from "express";
import "multer";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ConversationsService } from "../conversations/conversations.service";
import { RAGService } from "../rag/rag.service";
import {
  GeminiAnalystService,
  type ImageAnalysisResult,
  type PerformanceAnalysisResult,
  type ProfitabilityAnalysisResult,
} from "./gemini-analyst.service";
import { GeminiService } from "./gemini.service";
import { StreamingService } from "./streaming.service";

/**
 * Chat request DTO
 */
interface ChatRequest {
  userId?: string;
  projectId?: string;
  conversationId?: string;
  role?: "owner" | "guest";
  message: string;
  messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  context?: string;
}

/**
 * Chat response DTO
 */
interface ChatResponse {
  response: string;
  conversationId?: string;
  tokensUsed?: number;
  codeContext?: {
    chunks: number;
    files: string[];
  };
}

/**
 * Tool definition for multi-tool interactions
 */
interface ToolDefinition {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/**
 * RAG source metadata
 */
interface RAGSourceMetadata {
  source?: string;
  [key: string]: unknown;
}

@Controller({ path: "ai", version: "1" })
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(
    private readonly aiService: GeminiAnalystService,
    private readonly geminiService: GeminiService,
    private readonly rag: RAGService,
    private readonly streaming: StreamingService,
    private readonly conversationsService: ConversationsService
  ) {}

  /**
   * Main chat endpoint with full RAG integration and conversation persistence
   */
  @Post("chat")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  async chat(
    @Body() body: ChatRequest,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<ChatResponse> {
    const {
      userId,
      projectId,
      conversationId,
      role = "owner",
      message,
      messages = [],
      context = "{}",
    } = body;

    if (!message && (!files || files.length === 0)) {
      throw new BadRequestException("Message or files are required");
    }

    let parsedContext: Record<string, unknown> = {};
    try {
      parsedContext =
        typeof context === "string" ? JSON.parse(context) : context;
    } catch {
      parsedContext = {};
    }

    const userContext = this.buildUserContext(userId, projectId, role);

    let conversationHistory = this.buildConversationHistory(messages);
    let actualConversationId = conversationId;

    if (conversationId) {
      try {
        const conversation =
          await this.conversationsService.findById(conversationId);
        if (conversation) {
          const dbMessages = await this.conversationsService.getMessages(
            conversationId,
            20
          );
          const dbHistory = this.buildConversationHistory(
            dbMessages.map((msg) => ({ role: msg.role, content: msg.content }))
          );
          if (dbHistory !== "(No previous messages in this conversation)") {
            conversationHistory = dbHistory;
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.warn("Failed to load conversation history:", errorMessage);
      }
    }

    const ragResponse = await this.rag.query(message, {
      topK: 5,
      projectId,
      includeContext: false,
    });
    const codeContext = ragResponse.sources
      .map((s, i) => `// Source ${i + 1}\n${s.content}`)
      .join("\n\n");
    const codeContextMetadata = {
      chunks: ragResponse.sources.length,
      files: ragResponse.sources.map(
        (s: { metadata?: RAGSourceMetadata }) => s.metadata?.source ?? "unknown"
      ),
    };

    const enhancedContext = `
${userContext}

### CONVERSATION HISTORY:
${conversationHistory}

### RELEVANT CODEBASE CONTEXT:
${codeContext}

### ADDITIONAL CONTEXT:
${JSON.stringify(parsedContext, null, 2)}
`;

    const response = await this.aiService.chat(enhancedContext, messages);

    let finalResponse = response;
    const toolResults: Array<{ toolCall: unknown; result: unknown }> = [];

    if (
      typeof response === "object" &&
      "toolCalls" in response &&
      response.toolCalls
    ) {
      for (const toolCall of response.toolCalls) {
        const result = await this.aiService.executeTool(
          toolCall.name,
          toolCall.args
        );
        toolResults.push({ toolCall, result });
      }

      finalResponse = await this.aiService.chat(enhancedContext, [
        ...messages,
        { role: "model", content: JSON.stringify(response) },
        { role: "user", content: JSON.stringify(toolResults) },
      ]);
    }

    if (userId || projectId) {
      try {
        if (!actualConversationId) {
          const newConversation = await this.conversationsService.create({
            title:
              message.substring(0, 50) + (message.length > 50 ? "..." : ""),
            userId,
            projectId,
            metadata: { role, context: parsedContext },
          });
          actualConversationId = newConversation.id;
        }

        await this.conversationsService.addMessage({
          conversationId: actualConversationId,
          role: MessageRole.USER,
          content: message,
          tokens: 0,
          referencedSources: [],
        });

        await this.conversationsService.addMessage({
          conversationId: actualConversationId,
          role: MessageRole.ASSISTANT,
          content: finalResponse as string,
          tokens: this.estimateTokens(finalResponse as string),
          referencedSources: [],
        });

        await this.conversationsService.generateContextSnapshot(
          actualConversationId
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.warn("Failed to persist conversation:", errorMessage);
      }
    }

    return {
      response: finalResponse as string,
      conversationId:
        actualConversationId ?? this.generateConversationId(userId, projectId),
      codeContext: codeContextMetadata,
    };
  }

  /**
   * Streaming chat endpoint using Server-Sent Events
   */
  @Post("chat-stream")
  @HttpCode(HttpStatus.OK)
  async chatStream(
    @Body() dto: ChatRequest,
    @Res() res: Response
  ): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    try {
      const { message, context } = dto;
      const enhancedContext = context ?? "No additional context provided";

      const conversationHistory =
        dto.messages && dto.messages.length > 0
          ? dto.messages
          : [{ role: "user" as const, content: message }];

      const stream = this.streaming.chatStreamEnhanced(
        enhancedContext,
        conversationHistory
      );

      for await (const chunk of stream) {
        if (chunk.error) {
          res.write(`data: ${JSON.stringify({ error: chunk.error })}\n\n`);
          break;
        }

        res.write(`data: ${JSON.stringify(chunk)}\n\n`);

        if (chunk.done) {
          break;
        }
      }

      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ error: (error as Error).message, done: true })}\n\n`
      );
      res.end();
    }
  }

  /**
   * Extract structured data from text/files
   */
  @Post("extract")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor("files", 5, {
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  async extract(
    @Body() body: { prompt: string; schema?: unknown },
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<unknown> {
    if (!body.prompt && (!files || files.length === 0)) {
      throw new BadRequestException("Prompt or files are required");
    }

    let schema = body.schema;
    if (typeof schema === "string") {
      try {
        schema = JSON.parse(schema);
      } catch {
        // Keep as undefined if invalid
        schema = undefined;
      }
    }

    return this.aiService.extractData(
      body.prompt,
      schema as Record<string, unknown>,
      files
    );
  }

  /**
   * Analyze document upload (replaces frontend mock usage)
   */
  @Post("document/analyze-file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor("file", 1, {
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  )
  async analyzeDocumentFile(
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<Record<string, unknown>> {
    if (!files || files.length === 0) {
      throw new BadRequestException("File is required");
    }

    const file = files[0];
    return this.aiService.analyzeDocumentFile(file);
  }

  /**
   * Analyze audio upload (replaces frontend mock usage)
   */
  @Post("audio/analyze-file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor("file", 1, {
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  )
  async analyzeAudioFile(
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<Record<string, unknown>> {
    if (!files || files.length === 0) {
      throw new BadRequestException("File is required");
    }

    const file = files[0];
    return this.aiService.analyzeAudioFile(file);
  }

  /**
   * Analyze image using Gemini Vision
   */
  @Post("vision/analyze")
  @HttpCode(HttpStatus.OK)
  async analyzeImage(
    @Body() body: { imageUrl: string }
  ): Promise<ImageAnalysisResult> {
    if (!body.imageUrl) {
      throw new BadRequestException("Image URL is required");
    }

    return this.aiService.analyzeImage(body.imageUrl);
  }

  /**
   * Analyze vision file upload (replaces frontend mock usage)
   */
  @Post("vision/analyze-file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor("file", 1, {
      limits: { fileSize: 20 * 1024 * 1024 },
    })
  )
  async analyzeVisionFile(
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<ImageAnalysisResult> {
    if (!files || files.length === 0) {
      throw new BadRequestException("File is required");
    }

    const file = files[0];
    return this.aiService.analyzeVisionFile(file);
  }

  /**
   * Generate embeddings using Vertex AI
   */
  @Post("embeddings/generate")
  @HttpCode(HttpStatus.OK)
  async generateEmbeddings(@Body() body: { text: string }): Promise<unknown> {
    if (!body.text) {
      throw new BadRequestException("Text is required");
    }

    return (
      this.rag as unknown as {
        embeddings: { generateEmbedding: (text: string) => Promise<unknown> };
      }
    ).embeddings.generateEmbedding(body.text);
  }

  /**
   * Get RAG indexing status
   */
  @Get("status")
  async getStatus(): Promise<Record<string, unknown>> {
    const stats = await this.rag.getStats();
    const vectorStore = stats.vectorStore as
      | { totalDocuments?: number }
      | undefined;
    return {
      ...stats,
      ready: (vectorStore?.totalDocuments ?? 0) > 0,
      message: (vectorStore?.totalDocuments ?? 0) > 0 ? "Ready" : "Not indexed",
    };
  }

  @Post("analyze/project/:id")
  @HttpCode(HttpStatus.OK)
  async analyzeProject(
    @Param("id") _id: string
  ): Promise<ProfitabilityAnalysisResult> {
    return this.aiService.analyzeProjectProfitability(_id);
  }

  @Post("analyze/freelancer/:id")
  @HttpCode(HttpStatus.OK)
  async analyzeFreelancer(
    @Param("id") _id: string
  ): Promise<PerformanceAnalysisResult> {
    return this.aiService.analyzeFreelancerPerformance(_id);
  }

  @Post("generate/project-brief/:id")
  @HttpCode(HttpStatus.OK)
  async generateProjectBrief(
    @Param("id") projectId: string
  ): Promise<{ projectId: string; brief: string }> {
    const prompt = [
      "Create a concise project brief for a creative agency project.",
      `Project ID: ${projectId}`,
      "Include sections: Overview, Goals, Deliverables, Timeline, Risks, Next Steps.",
      "Keep it under 250 words and use bullet points where appropriate.",
    ].join("\n");

    const brief = await this.geminiService.generateContent(prompt);

    return {
      projectId,
      brief,
    };
  }

  /**
   * Generate content with Google Search grounding
   */
  @Post("search")
  @HttpCode(HttpStatus.OK)
  async search(
    @Body() body: { query: string; model?: string }
  ): Promise<{ query: string; response: string; provider: string }> {
    if (!body.query) {
      throw new BadRequestException("Query is required");
    }

    const result = await this.geminiService.generateWithGoogleSearch(
      body.query,
      body.model
    );

    return {
      query: body.query,
      response: result,
      provider: "Google Gemini with Search",
    };
  }

  /**
   * Execute code using AI-powered code execution
   */
  @Post("execute-code")
  @HttpCode(HttpStatus.OK)
  async executeCode(
    @Body() body: { code: string; language?: string; model?: string }
  ): Promise<{ output: string; error?: string; executionTime?: number }> {
    if (!body.code) {
      throw new BadRequestException("Code is required");
    }

    return this.geminiService.executeCode(body.code, body.language, {
      model: body.model,
    });
  }

  /**
   * Generate images using AI
   */
  @Post("generate-image")
  @HttpCode(HttpStatus.OK)
  async generateImage(
    @Body()
    body: {
      prompt: string;
      style?: "natural" | "vivid" | "artistic";
      model?: string;
      savePath?: string;
    }
  ): Promise<{
    imageUrl?: string;
    savePath?: string;
    prompt: string;
    metadata?: Record<string, unknown>;
  }> {
    if (!body.prompt) {
      throw new BadRequestException("Prompt is required");
    }

    return this.geminiService.generateImage(body.prompt, {
      style: body.style,
      model: body.model,
      savePath: body.savePath,
    });
  }

  /**
   * Perform deep research using specialized agent
   */
  @Post("deep-research")
  @HttpCode(HttpStatus.OK)
  async deepResearch(
    @Body() body: { query: string; background?: boolean; maxWaitTime?: number }
  ): Promise<{
    query: string;
    results: string;
    sources: string[];
    confidence: number;
  }> {
    if (!body.query) {
      throw new BadRequestException("Query is required");
    }

    return this.geminiService.performDeepResearch(body.query, {
      background: body.background,
      maxWaitTime: body.maxWaitTime,
    });
  }

  /**
   * Create multi-tool interaction
   */
  @Post("multi-tool")
  @HttpCode(HttpStatus.OK)
  async multiTool(
    @Body()
    body: {
      input: string;
      tools: Array<"google_search" | "code_execution" | ToolDefinition>;
      model?: string;
      agent?: string;
      background?: boolean;
    }
  ): Promise<{
    input: string;
    response: string;
    toolsUsed: string[];
    results: unknown[];
  }> {
    if (!body.input) {
      throw new BadRequestException("Input is required");
    }

    if (!body.tools || body.tools.length === 0) {
      throw new BadRequestException("At least one tool is required");
    }

    return this.geminiService.createMultiToolInteraction(
      body.input,
      body.tools,
      {
        model: body.model,
        agent: body.agent,
        background: body.background,
      }
    );
  }

  /**
   * Create advanced conversation with memory management
   */
  @Post("conversation/advanced")
  @HttpCode(HttpStatus.OK)
  async createAdvancedConversation(
    @Body()
    body: {
      initialPrompt: string;
      systemPrompt?: string;
      memorySize?: number;
      model?: string;
      tools?: Array<ToolDefinition>;
    }
  ): Promise<{ conversationId: string; response: string; memoryUsed: number }> {
    if (!body.initialPrompt) {
      throw new BadRequestException("Initial prompt is required");
    }

    return this.geminiService.createAdvancedConversation({
      initialPrompt: body.initialPrompt,
      systemPrompt: body.systemPrompt,
      memorySize: body.memorySize,
      model: body.model,
      tools: body.tools,
    });
  }

  /**
   * Continue advanced conversation
   */
  @Post("conversation/continue")
  @HttpCode(HttpStatus.OK)
  async continueAdvancedConversation(
    @Body()
    body: {
      conversationId: string;
      userMessage: string;
      conversationHistory: Array<{ role: string; content: string }>;
      memorySize?: number;
      model?: string;
      tools?: Array<ToolDefinition>;
    }
  ): Promise<{ conversationId: string; response: string; memoryUsed: number }> {
    if (!body.conversationId) {
      throw new BadRequestException("Conversation ID is required");
    }

    if (!body.userMessage) {
      throw new BadRequestException("User message is required");
    }

    if (!body.conversationHistory) {
      throw new BadRequestException("Conversation history is required");
    }

    return this.geminiService.continueAdvancedConversation(
      body.conversationId,
      body.userMessage,
      body.conversationHistory,
      {
        memorySize: body.memorySize,
        model: body.model,
        tools: body.tools,
      }
    );
  }

  /**
   * Batch process multiple prompts
   */
  @Post("batch")
  @HttpCode(HttpStatus.OK)
  async batchProcess(
    @Body()
    body: {
      prompts: Array<{
        prompt: string;
        model?: string;
        temperature?: number;
      }>;
      concurrency?: number;
      delay?: number;
    }
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{
      prompt: string;
      success: boolean;
      result?: string;
      error?: string;
      processingTime?: number;
    }>;
  }> {
    if (!body.prompts || body.prompts.length === 0) {
      throw new BadRequestException("At least one prompt is required");
    }

    const results = await this.geminiService.batchGenerateContent(
      body.prompts,
      {
        concurrency: body.concurrency,
        delay: body.delay,
      }
    );

    return {
      total: body.prompts.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  /**
   * Generate content with custom model parameters
   */
  @Post("custom-config")
  @HttpCode(HttpStatus.OK)
  async customConfig(
    @Body()
    body: {
      prompt: string;
      config: {
        model?: string;
        temperature?: number;
        maxOutputTokens?: number;
        topP?: number;
        topK?: number;
        stopSequences?: string[];
        candidateCount?: number;
        safetySettings?: SafetySetting[];
      };
    }
  ): Promise<string> {
    if (!body.prompt) {
      throw new BadRequestException("Prompt is required");
    }

    return this.geminiService.generateWithCustomConfig(
      body.prompt,
      body.config ?? {}
    );
  }

  /**
   * Analyze content quality with AI feedback
   */
  @Post("analyze-quality")
  @HttpCode(HttpStatus.OK)
  async analyzeQuality(
    @Body()
    body: {
      content: string;
      criteria?: {
        checkGrammar?: boolean;
        checkClarity?: boolean;
        checkEngagement?: boolean;
        checkOriginality?: boolean;
        targetAudience?: string;
      };
    }
  ): Promise<{
    overallScore: number;
    grammar: number;
    clarity: number;
    engagement: number;
    originality: number;
    feedback: string[];
    suggestions: string[];
  }> {
    if (!body.content) {
      throw new BadRequestException("Content is required");
    }

    return this.geminiService.analyzeContentQuality(
      body.content,
      body.criteria ?? {}
    );
  }

  /**
   * Generate a comprehensive moodboard for creative projects
   */
  @Post("moodboard/generate")
  @HttpCode(HttpStatus.OK)
  async generateMoodboard(
    @Body()
    body: {
      theme: string;
      style?:
        | "minimalist"
        | "vibrant"
        | "elegant"
        | "modern"
        | "vintage"
        | "industrial"
        | "organic"
        | "futuristic";
      colors?: string[];
      targetAudience?: string;
      projectType?:
        | "website"
        | "branding"
        | "product"
        | "interior"
        | "fashion"
        | "marketing";
      mood?: string[];
      generateImages?: boolean;
      imageCount?: number;
    }
  ): Promise<{
    theme: string;
    concept: string;
    colors: string[];
    typography: string[];
    imagery: string[];
    layout: string;
    generatedImages?: Array<{
      url: string;
      description: string;
      style: string;
    }>;
    metadata: {
      style: string;
      projectType: string;
      targetAudience: string;
      mood: string[];
    };
  }> {
    if (!body.theme) {
      throw new BadRequestException("Theme is required");
    }

    return this.geminiService.generateMoodboard({
      theme: body.theme,
      style: body.style,
      colors: body.colors,
      targetAudience: body.targetAudience,
      projectType: body.projectType,
      mood: body.mood,
      generateImages: body.generateImages,
      imageCount: body.imageCount,
    });
  }

  /**
   * Get Gemini service health check
   */
  @Get("health")
  async getHealth(): Promise<{
    status: string;
    configured: boolean;
    provider: string;
    mode: string;
  }> {
    return this.geminiService.healthCheck();
  }

  /**
   * Build user-specific context string
   */
  private buildUserContext(
    userId?: string,
    projectId?: string,
    role?: string
  ): string {
    const parts: string[] = ["### USER CONTEXT:"];

    if (userId) {
      parts.push(`- User ID: ${userId}`);
    }

    if (projectId) {
      parts.push(`- Project ID: ${projectId}`);
    }

    if (role) {
      parts.push(`- Role: ${role}`);
      parts.push(
        role === "guest"
          ? `- Access Level: Read-only (Guest users cannot modify data)`
          : `- Access Level: Full access`
      );
    }

    parts.push(`- Current Workspace: Creative Agency Management App`);
    parts.push(
      `- Tech Stack: NestJS backend, React frontend, Prisma ORM, Cloud Run deployment`
    );

    return parts.join("\n");
  }

  /**
   * Build conversation history string from message array
   */
  private buildConversationHistory(
    messages: Array<{ role: string; content: string }>
  ): string {
    if (!messages || messages.length === 0) {
      return "(No previous messages in this conversation)";
    }

    return messages
      .slice(-10)
      .map((msg, i) => `${i + 1}.[${msg.role}]: ${msg.content}`)
      .join("\n");
  }

  /**
   * Generate conversation ID for tracking
   */
  private generateConversationId(userId?: string, projectId?: string): string {
    const timestamp = Date.now();
    const userPart = userId ? userId.substring(0, 8) : "anon";
    const projectPart = projectId ? projectId.substring(0, 8) : "global";
    return `conv_${userPart}_${projectPart}_${timestamp}`;
  }

  /**
   * Estimate token count for response tracking
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
