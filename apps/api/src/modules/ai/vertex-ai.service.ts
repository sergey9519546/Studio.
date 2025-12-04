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
     * Generate content with conversation history and optional tools
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        systemPrompt?: string,
        tools?: any[],
    ): Promise<string | { toolCalls: any[] }> {
        const endpoint = `projects/${this.project}/locations/${this.location}/publishers/${this.publisher}/models/gemini-1.5-pro`;

        const instances = [
            {
                structValue: {
                    fields: {
                        messages: {
                            listValue: {
                                values: messages.map(msg => ({
                                    structValue: {
                                        fields: {
                                            role: { stringValue: msg.role },
                                            content: { stringValue: msg.content },
                                        },
                                    },
                                })),
                            },
                        },
                        system_instruction: systemPrompt ? { stringValue: systemPrompt } : undefined,
                    },
                },
            },
        ];

        // Note: SDK requires dynamic IValue structure that doesn't fit standard TypeScript interfaces
        const parameters: any = {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40,
        };

        if (tools) {
            parameters.tools = {
                listValue: {
                    values: tools.map(tool => ({
                        structValue: {
                            fields: {
                                function_declarations: {
                                    listValue: {
                                        values: [
                                            {
                                                structValue: {
                                                    fields: {
                                                        name: { stringValue: tool.name },
                                                        description: { stringValue: tool.description },
                                                        parameters: {
                                                            structValue: {
                                                                fields: {
                                                                    type: { stringValue: tool.parameters.type },
                                                                    properties: {
                                                                        structValue: {
                                                                            fields: Object.entries(tool.parameters.properties).reduce((acc, [key, value]: [string, any]) => {
                                                                                acc[key] = {
                                                                                    structValue: {
                                                                                        fields: {
                                                                                            type: { stringValue: value.type },
                                                                                            description: { stringValue: value.description },
                                                                                        },
                                                                                    },
                                                                                };
                                                                                return acc;
                                                                            }, {}),
                                                                        },
                                                                    },
                                                                    required: {
                                                                        listValue: {
                                                                            values: tool.parameters.required.map(r => ({ stringValue: r })),
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    })),
                },
            };
        }

        const request = {
            endpoint,
            instances,
            parameters: {
                structValue: {
                    fields: parameters,
                },
            },
        };

        this.logger.debug(`Chatting with model: gemini-1.5-pro`);
        const [response] = await this.client.predict(request);

        if (!response.predictions || response.predictions.length === 0) {
            throw new Error('No predictions returned from Vertex AI');
        }

        const prediction = response.predictions[0];
        const content = prediction.structValue?.fields?.candidates?.listValue?.values[0]?.structValue?.fields?.content?.structValue?.fields?.parts?.listValue?.values[0]?.structValue;

        if (content?.fields?.functionCall) {
            return {
                toolCalls: [
                    {
                        name: content.fields.functionCall.structValue?.fields?.name?.stringValue,
                        args: content.fields.functionCall.structValue?.fields?.args?.structValue?.fields,
                    },
                ],
            };
        } else if (content?.fields?.text) {
            return content.fields.text.stringValue;
        } else {
            this.logger.warn('Unexpected response structure from Vertex AI', prediction);
            throw new Error('Unable to extract text or tool calls from Vertex AI response');
        }
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
