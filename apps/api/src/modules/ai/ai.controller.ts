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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(FilesInterceptor('files', 10))
    async chat(
        @Body() body: ChatRequest,
        @UploadedFiles() files?: Array<Express.Multer.File>,
    ): Promise<ChatResponse> {
        const { userId, projectId, role = 'owner', message, messages = [], context = '{}' } = body;

        if (!message && (!files || files.length === 0)) {
            throw new BadRequestException('Message or files are required');
        }

        // Parse context
        let parsedContext: any = {};
        try {
            parsedContext = typeof context === 'string' ? JSON.parse(context) : context;
        } catch (e) {
            parsedContext = {};
        }

        // Step 1: Build user context
        const userContext = this.buildUserContext(userId, projectId, role, parsedContext);

        // Step 2: Retrieve relevant code context using RAG
        const codeContext = await this.rag.retrieveContext(message, 5);
        const codeContextMetadata = this.extractCodeContextMetadata(codeContext);

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
`.trim();

        // Step 5: Call Gemini with all context
        const result = await this.aiService.analyzeContext(enhancedContext, message, files);

        // Step 6: Return structured response
        return {
            response: typeof result === 'string' ? result : JSON.stringify(result),
            conversationId: this.generateConversationId(userId, projectId),
            codeContext: codeContextMetadata,
        };
    }

    /**
     * Get RAG indexing status
     * 
     * GET /api/ai/status
     */
    @Get('status')
    async getStatus() {
        const status = this.rag.getIndexStatus();
        return {
            ...status,
            ready: status.indexed > 0 && !status.isIndexing,
            message: status.isIndexing
                ? 'Indexing in progress...'
                : status.indexed > 0
                    ? 'Ready'
                    : 'Not indexed',
        };
    }

    /**
     * Build user-specific context string
     */
    private buildUserContext(
        userId?: string,
        projectId?: string,
        role?: string,
        additionalContext?: any,
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
            .map((msg, i) => `${i + 1}. [${msg.role}]: ${msg.content}`)
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
}
