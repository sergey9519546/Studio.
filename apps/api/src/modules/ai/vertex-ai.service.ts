import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { protos } from '@google-cloud/aiplatform';

type IValue = protos.google.protobuf.IValue;

@Injectable()
export class VertexAIService {
    private readonly logger = new Logger(VertexAIService.name);
    private client: PredictionServiceClient;
    private readonly project: string;
    private readonly location: string;
    private readonly publisher = 'google';

    constructor(private configService: ConfigService) {
        this.project = this.configService.get<string>('GCP_PROJECT_ID');
        this.location = this.configService.get<string>('GCP_LOCATION') || 'us-central1';

        // Initialize Vertex AI client
        this.client = new PredictionServiceClient({
            apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
        });

        this.logger.log(`Vertex AI initialized: project=${this.project}, location=${this.location}`);
    }

    /**
     * Generate content using Gemini model via Vertex AI
     */
    async generateContent(prompt: string, model: string = 'gemini-1.5-pro'): Promise<string> {
        try {
            const endpoint = `projects/${this.project}/locations/${this.location}/publishers/${this.publisher}/models/${model}`;

            // Convert prompt to Value format expected by Vertex AI
            const instance: IValue = {
                structValue: {
                    fields: {
                        prompt: {
                            stringValue: prompt,
                        },
                    },
                },
            };

            const parameter: IValue = {
                structValue: {
                    fields: {
                        temperature: { numberValue: 0.7 },
                        maxOutputTokens: { numberValue: 2048 },
                        topP: { numberValue: 0.95 },
                        topK: { numberValue: 40 },
                    },
                },
            };

            const request = {
                endpoint,
                instances: [instance],
                parameters: parameter,
            };

            this.logger.debug(`Generating content with model: ${model}`);
            const [response] = await this.client.predict(request);

            // Extract text from response
            if (!response.predictions || response.predictions.length === 0) {
                throw new Error('No predictions returned from Vertex AI');
            }

            const prediction = response.predictions[0];
            const textValue = prediction.structValue?.fields?.content?.stringValue;

            if (!textValue) {
                this.logger.warn('Unexpected response structure from Vertex AI', prediction);
                throw new Error('Unable to extract text from Vertex AI response');
            }

            return textValue;
        } catch (error) {
            this.logger.error(`Vertex AI generation failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Generate content with conversation history
     */
    async chat(messages: Array<{ role: string; content: string }>, systemPrompt?: string): Promise<string> {
        // Construct full prompt from conversation history
        let fullPrompt = '';

        if (systemPrompt) {
            fullPrompt += `System: ${systemPrompt}\n\n`;
        }

        fullPrompt += messages
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n\n');

        fullPrompt += '\n\nAssistant:';

        return this.generateContent(fullPrompt);
    }

    /**
     * Extract structured data from text using Gemini
     */
    async extractData(prompt: string, schema?: unknown): Promise<unknown> {
        let enhancedPrompt = prompt;

        if (schema) {
            enhancedPrompt += `\n\nPlease extract the data and format it as JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`;
        }

        const response = await this.generateContent(enhancedPrompt);

        // Try to parse JSON from response
        try {
            // Look for JSON in markdown code blocks
            const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }

            // Try to parse the entire response as JSON
            return JSON.parse(response);
        } catch {
            // If not JSON, return raw response
            return { text: response };
        }
    }

    /**
     * Health check for Vertex AI service
     */
    async healthCheck(): Promise<{ status: string; project: string; location: string }> {
        return {
            status: 'ok',
            project: this.project,
            location: this.location,
        };
    }
}
