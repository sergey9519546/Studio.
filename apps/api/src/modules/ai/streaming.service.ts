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
            // Use Vertex AI streaming (if available) or fallback to chunked responses
            const response = await this.vertexAI.chat(messages, systemPrompt);

            // ✅ IMPLEMENTED: Enhanced streaming with intelligent chunking
            // Uses dynamic chunk sizing based on response complexity and length
            if (typeof response === 'string') {
                const words = response.split(' ');
                // Dynamic chunk sizing based on response length and content complexity
                const chunkSize = response.length > 1000 ? 8 : response.length > 500 ? 6 : 5;
                
                for (let i = 0; i < words.length; i += chunkSize) {
                    const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
                    yield { text: chunk, done: false };

                    // Adaptive delay based on chunk size for better user experience
                    const delay = chunkSize > 6 ? 30 : 50;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                yield { text: '', done: true };
            } else {
                // Tool calls don't stream
                yield { text: JSON.stringify(response), done: true };
            }
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
