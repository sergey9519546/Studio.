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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageRole } from '@prisma/client';
import type { Response } from 'express';
import 'multer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { ConversationsService } from '../conversations/conversations.service.js';
import { RAGService } from '../rag/rag.service.js';
import { GeminiAnalystService } from './gemini-analyst.service.js';
import { StreamingService } from './streaming.service.js';

interface ChatRequest {
    userId?: string;
    projectId?: string;
    conversationId?: string;
    role?: 'owner' | 'guest';
    message: string;
    messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    context?: string;
}

interface ChatResponse {
    response: string;
    conversationId?: string;
    tokensUsed?: number;
    codeContext?: {
        chunks: number;
        files: string[];
    };
}

@Controller({ path: 'ai', version: '1' })
@UseGuards(JwtAuthGuard)
export class AIController {
    constructor(
        private readonly aiService: GeminiAnalystService,
        private readonly rag: RAGService,
        private readonly streaming: StreamingService,
        private readonly conversationsService: ConversationsService,
    ) { }

    /**
     * Main chat endpoint with full RAG integration and conversation persistence
     * 
     * POST /api/ai/chat
     * 
     * Features:
     * - Automatic code context retrieval via RAG
     * - Conversation history support with persistence
     * - File upload support
     * - Role-based context injection
     * - Smart conversation context loading
     */
    @Post('chat')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files', 10, {
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
    }))
    async chat(
        @Body() body: ChatRequest,
        @UploadedFiles() files?: Array<Express.Multer.File>,
    ): Promise<ChatResponse> {
        const { userId, projectId, conversationId, role = 'owner', message, messages = [], context = '{}' } = body;

        if (!message && (!files || files.length === 0)) {
            throw new BadRequestException('Message or files are required');
        }

        // Parse context
        let parsedContext: Record<string, unknown> = {};
        try {
            parsedContext = typeof context === 'string' ? JSON.parse(context) : context;
        } catch {
            parsedContext = {};
        }

        // Step 1: Build user context
        const userContext = this.buildUserContext(userId, projectId, role);

        // Step 2: Load conversation history if conversationId provided
        let conversationHistory = this.buildConversationHistory(messages);
        let actualConversationId = conversationId;

        if (conversationId) {
            try {
                const conversation = await this.conversationsService.findById(conversationId);
                if (conversation) {
                    // Get recent messages from database
                    const dbMessages = await this.conversationsService.getMessages(conversationId, 20);
                    const dbHistory = this.buildConversationHistory(
                        dbMessages.map(msg => ({ role: msg.role, content: msg.content }))
                    );
                    if (dbHistory !== '(No previous messages in this conversation)') {
                        conversationHistory = dbHistory;
                    }
                }
            } catch (error) {
                // Continue with provided messages if database lookup fails
                console.warn('Failed to load conversation history:', error.message);
            }
        }

        // Step 3: Retrieve relevant code context using RAG  
        const ragResponse = await this.rag.query(message, { topK: 5, projectId, includeContext: false });
        const codeContext = ragResponse.sources.map((s, i) => `// Source ${i + 1}\n${s.content}`).join('\n\n');
        const codeContextMetadata = {
            chunks: ragResponse.sources.length,
            files: ragResponse.sources.map((s: { metadata?: Record<string, unknown> }) =>
                (s.metadata?.source as string | undefined) || 'unknown'
            )
        };

        // Step 4: Assemble enhanced context
        const enhancedContext = `
${userContext}

### CONVERSATION HISTORY:
${conversationHistory}

### RELEVANT CODEBASE CONTEXT:
${codeContext}

### ADDITIONAL CONTEXT:
${JSON.stringify(parsedContext, null, 2)}
`;

        // Step 5: Generate Response
        const response = await this.aiService.chat(enhancedContext, messages);

        let finalResponse = response;
        const toolResults: Array<{ toolCall: unknown; result: unknown }> = [];

        if (typeof response === 'object' && response.toolCalls) {
            for (const toolCall of response.toolCalls) {
                const result = await this.aiService.executeTool(toolCall.name, toolCall.args);
                toolResults.push({
                    toolCall,
                    result,
                });
            }

            // Send the tool results back to the model to get a final response
            finalResponse = await this.aiService.chat(enhancedContext, [
                ...messages,
                { role: 'model', content: JSON.stringify(response) },
                { role: 'user', content: JSON.stringify(toolResults) },
            ]);
        }

        // Step 6: Persist conversation if needed
        if (userId || projectId) {
            try {
                // Create or get conversation
                if (!actualConversationId) {
                    const newConversation = await this.conversationsService.create({
                        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                        userId,
                        projectId,
                        metadata: {
                            role,
                            context: parsedContext,
                        }
                    });
                    actualConversationId = newConversation.id;
                }

                // Save user message
                await this.conversationsService.addMessage({
                    conversationId: actualConversationId,
                    role: MessageRole.USER,
                    content: message,
                    tokens: 0,
                    referencedSources: [],
                });

                // Save assistant response
                await this.conversationsService.addMessage({
                    conversationId: actualConversationId,
                    role: MessageRole.ASSISTANT,
                    content: finalResponse as string,
                    tokens: this.estimateTokens(finalResponse as string),
                    referencedSources: [],
                });

                // Generate context snapshot for RAG enhancement
                await this.conversationsService.generateContextSnapshot(actualConversationId);

            } catch (error) {
                console.warn('Failed to persist conversation:', error.message);
                // Continue without failing the request
            }
        }

        return {
            response: finalResponse as string,
            conversationId: actualConversationId || this.generateConversationId(userId, projectId),
            codeContext: codeContextMetadata
        };
    }

    /**
     * STREAMING CHAT (SSE)
     * POST /api/ai/chat-stream
     * 
     * Real-time AI responses using Server-Sent Events
     */
    @Post('chat-stream')
    @HttpCode(HttpStatus.OK)
    async chatStream(
        @Body() dto: ChatRequest,
        @Res() res: Response,
    ) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        try {
            const { message, context } = dto;

            // Build enhanced context
            const enhancedContext = context || 'No additional context provided';

            // Convert to conversation history
            const conversationHistory = dto.messages && dto.messages.length > 0
                ? dto.messages
                : [{ role: 'user', content: message }];

            // Get streaming response
            const stream = this.streaming.chatStreamEnhanced(enhancedContext, conversationHistory);

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
            res.write(`data: ${JSON.stringify({ error: (error as Error).message, done: true })}\n\n`);
            res.end();
        }
    }

    /**
     * Extract structured data from text/files
     *
     * POST /api/ai/extract
     */
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files', 5, {
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    }))
    async extract(
        @Body() body: { prompt: string; schema?: unknown },
        @UploadedFiles() files?: Array<Express.Multer.File>,
    ) {
        if (!body.prompt && (!files || files.length === 0)) {
            throw new BadRequestException('Prompt or files are required');
        }

        // Parse schema if it's a string (multipart/form-data often sends JSON as string)
        let schema = body.schema;
        if (typeof schema === 'string') {
            try {
                schema = JSON.parse(schema);
            } catch {
                // Keep as string or undefined if invalid
            }
        }

        return this.aiService.extractData(body.prompt, schema as Record<string, unknown>, files);
    }

    /**
     * Analyze image using Google Gemini Vision
     *
     * POST /api/ai/vision/analyze
     */
    @Post('vision/analyze')
    @HttpCode(HttpStatus.OK)
    async analyzeImage(
        @Body() body: { imageUrl: string },
    ) {
        if (!body.imageUrl) {
            throw new BadRequestException('Image URL is required');
        }

        return this.aiService.analyzeImage(body.imageUrl);
    }

    /**
     * Generate embeddings using Google Vertex AI
     *
     * POST /api/ai/embeddings/generate
     */
    @Post('embeddings/generate')
    @HttpCode(HttpStatus.OK)
    async generateEmbeddings(
        @Body() body: { text: string },
    ) {
        if (!body.text) {
            throw new BadRequestException('Text is required');
        }

        // Access the embeddings service through the RAG service's embeddings property
        return this.rag['embeddings'].generateEmbedding(body.text);
    }

    /**
     * Get RAG indexing status
     * 
     * GET /api/ai/status
     */
    @Get('status')
    async getStatus() {
        const stats = await this.rag.getStats();
        const vectorStore = stats.vectorStore as unknown as { totalDocuments?: number };
        return {
            ...stats,
            ready: (vectorStore?.totalDocuments || 0) > 0,
            message: (vectorStore?.totalDocuments || 0) > 0 ? 'Ready' : 'Not indexed',
        };
    }

    @Post('analyze/project/:id')
    @HttpCode(HttpStatus.OK)
    async analyzeProject(@Param('id') id: string) {
        return this.aiService.analyzeProjectProfitability(id);
    }

    @Post('analyze/freelancer/:id')
    @HttpCode(HttpStatus.OK)
    async analyzeFreelancer(@Param('id') id: string) {
        return this.aiService.analyzeFreelancerPerformance(id);
    }

    @Post('generate/project-brief/:id')
    @HttpCode(HttpStatus.OK)
    async generateProjectBrief(@Param('id') id: string) {
        // TODO: Implement generateProjectBrief in GeminiAnalystService
        throw new BadRequestException('generateProjectBrief not implemented yet');
    }

    /**
     * Build user-specific context string
     */
    private buildUserContext(
        userId?: string,
        projectId?: string,
        role?: string,
    ): string {
        const parts: string[] = [];

        parts.push('### USER CONTEXT:');

        if (userId) {
            parts.push(`- User ID: ${userId}`);
        }

        if (projectId) {
            parts.push(`- Project ID: ${projectId}`);
        }

        if (role) {
            parts.push(`- Role: ${role}`);
            if (role === 'guest') {
                parts.push(`- Access Level: Read-only (Guest users cannot modify data)`);
            } else {
                parts.push(`- Access Level: Full access`);
            }
        }

        // Add current workspace info
        parts.push(`- Current Workspace: Creative Agency Management App`);
        parts.push(`- Tech Stack: NestJS backend, React frontend, Prisma ORM, Cloud Run deployment`);

        return parts.join('\n');
    }

    /**
     * Build conversation history string from message array
     */
    private buildConversationHistory(messages: Array<{ role: string; content: string }>): string {
        if (!messages || messages.length === 0) {
            return '(No previous messages in this conversation)';
        }

        return messages
            .slice(-10) // Keep last 10 messages for context
            .map((msg, i) => `${i + 1}.[${msg.role}]: ${msg.content}`)
            .join('\n');
    }

    /**
     * Extract metadata from code context for response
     */
    private extractCodeContextMetadata(codeContext: string): { chunks: number; files: string[] } {
        const chunkMatches = codeContext.match(/\/\/ CONTEXT CHUNK/g);
        const fileMatches = codeContext.match(/\/\/ File: ([^\n]+)/g);

        const files = fileMatches
            ? Array.from(new Set(fileMatches.map(m => m.replace('// File: ', '').split(' ')[0])))
            : [];

        return {
            chunks: chunkMatches ? chunkMatches.length : 0,
            files,
        };
    }

    /**
     * Generate conversation ID for tracking
     */
    private generateConversationId(userId?: string, projectId?: string): string {
        const timestamp = Date.now();
        const userPart = userId ? userId.substring(0, 8) : 'anon';
        const projectPart = projectId ? projectId.substring(0, 8) : 'global';
        return `conv_${userPart}_${projectPart}_${timestamp}`;
    }

    /**
     * Estimate token count for response tracking
     */
    private estimateTokens(text: string): number {
        // Rough estimation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }
}
