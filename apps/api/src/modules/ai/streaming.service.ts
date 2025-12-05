import { Injectable, Logger } from '@nestjs/common';
import { VertexAIService } from './vertex-ai.service';

interface StreamChunk {
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

            // For now, simulate streaming by chunking the response
            // TODO: Replace with actual Vertex AI streaming API when available
            if (typeof response === 'string') {
                const words = response.split(' ');
                const chunkSize = 5; // Words per chunk

                for (let i = 0; i < words.length; i += chunkSize) {
                    const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
                    yield { text: chunk, done: false };

                    // Small delay to simulate streaming
                    await new Promise(resolve => setTimeout(resolve, 50));
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
