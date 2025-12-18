import { Injectable, Logger } from '@nestjs/common';
import { VertexAIService } from './vertex-ai.service';

export interface StreamChunk {
    text: string;
    done: boolean;
    error?: string;
}

@Injectable()
export class StreamingService {
    private readonly logger = new Logger(StreamingService.name);

    constructor(private vertexAI: VertexAIService) { }

    /**
     * Stream AI responses with Server-Sent Events
     */
    async *chatStream(
        messages: Array<{ role: string; content: string }>,
        systemPrompt: string,
    ): AsyncGenerator<StreamChunk> {
        try {
            // Use Real Vertex AI streaming
            const stream = this.vertexAI.chatStream(messages, systemPrompt);

            for await (const chunk of stream) {
                yield { text: chunk, done: false };
            }

            yield { text: '', done: true };
            // Legacy simulation removed

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown streaming error';
            this.logger.error(`Streaming error: ${message}`);
            yield { text: '', done: true, error: message };
        }
    }

    /**
     * Stream with enhanced prompt (for better quality)
     */
    async *chatStreamEnhanced(
        context: string,
        messages: Array<{ role: string; content: string }>,
    ): AsyncGenerator<StreamChunk> {
        const systemPrompt = `You are an expert AI analyst for a creative agency management system.

ROLE: Analyze freelancers, projects, workload, and provide data-driven insights.

GUIDELINES:
- Be concise and actionable
- Cite specific data points from context
- Use bullet points for clarity
- Provide concrete recommendations

Context:
${context}

Respond based on the provided context.`;

        yield* this.chatStream(messages, systemPrompt);
    }
}
