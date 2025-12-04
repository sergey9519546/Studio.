import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import 'multer';
import { GeminiAnalystService } from './gemini-analyst.service';
import { RAGService } from '../rag/rag.service';

interface ChatRequest {
    userId?: string;
    projectId?: string;
    role?: 'owner' | 'guest';
    message: string;
    messages?: Array<{ role: string; content: string }>;
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

@Controller('ai')
export class AIController {
    constructor(
        private readonly aiService: GeminiAnalystService,
        private readonly rag: RAGService,
    ) { }

    /**
     * Main chat endpoint with full RAG integration
     * 
     * POST /api/ai/chat
     * 
     * Features:
     * - Automatic code context retrieval via RAG
     * - Conversation history support
     * - File upload support
     * - Role-based context injection
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
        const { userId, projectId, role = 'owner', message, messages = [], context = '{}' } = body;

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
        const userContext = this.buildUserContext(userId, projectId, role, parsedContext);

        // Step 2: Retrieve relevant code context using RAG  
        const ragResponse = await this.rag.query(message, { topK: 5, projectId, includeContext: false });
        const codeContext = ragResponse.sources.map((s, i) => `// Source ${i + 1}\n${s.content}`).join('\n\n');
        const codeContextMetadata = {
            chunks: ragResponse.sources.length,
            files: ragResponse.sources.map((s: { metadata?: Record<string, unknown> }) => (s.metadata as any)?.source || 'unknown')
        };

        // Step 3: Build conversation history
        const conversationHistory = this.buildConversationHistory(messages);

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

        if (typeof response === 'object' && response.toolCalls) {
            const toolResults = [];
            for (const toolCall of response.toolCalls) {
                const result = await this.aiService.executeTool(toolCall.name, toolCall.args);
                toolResults.push({
                    toolCall,
                    result,
                });
            }

            // Send the tool results back to the model to get a final response
            const finalResponse = await this.aiService.chat(enhancedContext, [
                ...messages,
                { role: 'model', content: JSON.stringify(response) },
                { role: 'user', content: JSON.stringify(toolResults) },
            ]);

            return {
                response: finalResponse as string,
                conversationId: this.generateConversationId(userId, projectId),
                codeContext: codeContextMetadata,
            };
        }

        return {
            response: response as string,
            conversationId: this.generateConversationId(userId, projectId),
            codeContext: codeContextMetadata
        };
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
     * Get RAG indexing status
     * 
     * GET /api/ai/status
     */
    @Get('status')
    async getStatus() {
        const stats = await this.rag.getStats();
        return {
            ...stats,
            ready: (stats.vectorStore as any)?.totalDocuments > 0,
            message: (stats.vectorStore as any)?.totalDocuments > 0 ? 'Ready' : 'Not indexed',
        };
    }


    /**
     * Build user-specific context string
     */
    private buildUserContext(
        userId?: string,
        projectId?: string,
        role?: string,
        _additionalContext?: unknown,
    ): string {
        const parts: string[] = [];

        parts.push('### USER CONTEXT:');

        if (userId) {
            parts.push(`- User ID: ${userId}`);
        }

        if (projectId) {
            parts.push(`- Project ID: ${projectId} `);
        }

        if (role) {
            parts.push(`- Role: ${role} `);
            if (role === 'guest') {
                parts.push(`- Access Level: Read - only(Guest users cannot modify data)`);
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
            .map((msg, i) => `${i + 1}.[${msg.role}]: ${msg.content} `)
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
        return `conv_${userPart}_${projectPart}_${timestamp} `;
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
        return this.aiService.generateProjectBrief(id);
    }
}

