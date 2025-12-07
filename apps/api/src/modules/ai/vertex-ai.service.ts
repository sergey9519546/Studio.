import { PredictionServiceClient, protos } from "@google-cloud/aiplatform";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ToolCall, ToolDefinition } from "./types";

type IValue = protos.google.protobuf.IValue;

@Injectable()
export class VertexAIService {
  private readonly logger = new Logger(VertexAIService.name);
  private client: PredictionServiceClient;
  private readonly project: string;
  private readonly location: string;
  private readonly publisher = "google";

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get<string>("GCP_PROJECT_ID");
    if (!projectId) {
      throw new Error("GCP_PROJECT_ID is required for Vertex AI");
    }
    this.project = projectId;
    this.location =
      this.configService.get<string>("GCP_LOCATION") || "us-central1";

    // Initialize Vertex AI client
    this.client = new PredictionServiceClient({
      apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
    });

    this.logger.log(
      `Vertex AI initialized: project=${this.project}, location=${this.location}`
    );
  }

  /**
   * Generate content using Gemini model via Vertex AI
   */
  async generateContent(
    prompt: string,
    model: string = "gemini-1.5-pro"
  ): Promise<string> {
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
        throw new Error("No predictions returned from Vertex AI");
      }

      const prediction = response.predictions[0];
      const textValue = prediction.structValue?.fields?.content?.stringValue;

      if (!textValue) {
        this.logger.warn("Unexpected response structure from Vertex AI");
        throw new Error("Unable to extract text from Vertex AI response");
      }

      return textValue;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Vertex AI error";
      this.logger.error(
        `Vertex AI generation failed: ${message}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Safely extract content from Vertex AI prediction response
   */
  private extractPredictionContent(prediction: Record<string, unknown>): string | { toolCalls: ToolCall[] } | null {
    try {
      const content = this.safeGet(prediction, [
        'structValue',
        'fields',
        'candidates',
        'listValue',
        'values',
        0,
        'structValue',
        'fields',
        'content',
        'structValue',
        'fields',
        'parts',
        'listValue',
        'values',
        0,
        'structValue'
      ]) as Record<string, unknown>;

      if (!content) return null;

      // Check for function calls
      const functionCall = this.safeGet(content, ['fields', 'functionCall', 'structValue', 'fields']) as Record<string, unknown>;
      if (functionCall) {
      return {
        toolCalls: [{
          name: (this.safeGet(functionCall, ['name', 'stringValue']) as string) || 'unknown_function',
          args: (this.safeGet(functionCall, ['args', 'structValue', 'fields']) as Record<string, unknown>) || {}
        }]
      };
      }

      // Check for text content
      const text = this.safeGet(content, ['fields', 'text', 'stringValue']);
      if (text) {
        return text as string;
      }

      return null;
    } catch {
      this.logger.warn('Failed to extract prediction content safely');
      return null;
    }
  }

  /**
   * Safely access deeply nested object properties
   */
  private safeGet(obj: Record<string, unknown>, path: (string | number)[]): unknown {
    return path.reduce((current: unknown, key) => {
      return current && typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined;
    }, obj as unknown);
  }

  /**
   * Generate content with conversation history and optional tools
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    tools?: ToolDefinition[]
  ): Promise<string | { toolCalls: ToolCall[] }> {
    const endpoint = `projects/${this.project}/locations/${this.location}/publishers/${this.publisher}/models/gemini-1.5-pro`;

    const instanceFields: Record<string, IValue> = {
      messages: {
        listValue: {
          values: messages.map((msg) => ({
            structValue: {
              fields: {
                role: { stringValue: msg.role },
                content: { stringValue: msg.content },
              },
            },
          })),
        },
      },
    };

    if (systemPrompt) {
      instanceFields.system_instruction = {
        stringValue: systemPrompt,
      } as IValue;
    }

    const instances: IValue[] = [
      {
        structValue: {
          fields: instanceFields,
        },
      },
    ];

    // Build parameters as IValue map to satisfy PredictionServiceClient typing
    const paramFields: Record<string, IValue> = {
      temperature: { numberValue: 0.7 },
      maxOutputTokens: { numberValue: 2048 },
      topP: { numberValue: 0.95 },
      topK: { numberValue: 40 },
    };

    if (tools) {
      // tools must be provided as IValue structures
      paramFields.tools = {
        listValue: {
          values: tools.map((tool) => ({
            structValue: {
              fields: {
                function_declarations: {
                  listValue: {
                    values: [
                      {
                        structValue: {
                          fields: {
                            name: { stringValue: tool.name as string },
                            description: { stringValue: tool.description as string },
                            parameters: {
                              structValue: {
                                fields: {
                                  type: { stringValue: tool.parameters.type },
                                  properties: {
                                    structValue: {
                                      fields: Object.entries(
                                        tool.parameters.properties
                                      ).reduce(
                                        (
                                          acc: Record<string, IValue>,
                                          [key, value]
                                        ) => {
                                          acc[key] = {
                                            structValue: {
                                              fields: {
                                                type: {
                                                  stringValue: value.type,
                                                },
                                                description: {
                                                  stringValue:
                                                    value.description,
                                                },
                                              },
                                            },
                                          } as IValue;
                                          return acc;
                                        },
                                        {} as Record<string, IValue>
                                      ),
                                    },
                                  },
                                  required: {
                                    listValue: {
                                      values: tool.parameters.required.map(
                                        (r) => ({ stringValue: r }) as IValue
                                      ),
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
      } as IValue;
    }

    const request = {
      endpoint,
      instances,
      parameters: {
        structValue: {
          fields: paramFields,
        },
      },
    };

    this.logger.debug(`Chatting with model: gemini-1.5-pro`);
    const [response] = await this.client.predict(request);

    if (!response.predictions || response.predictions.length === 0) {
      throw new Error("No predictions returned from Vertex AI");
    }

    const prediction = response.predictions[0];
    const content = this.extractPredictionContent(prediction as Record<string, unknown>);

    if (content) {
      return content;
    } else {
      this.logger.warn("Unexpected response structure from Vertex AI", prediction);
      throw new Error("Unable to extract text or tool calls from Vertex AI response");
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
      const jsonMatch = response.match(
        /```(?:json)?\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*```/
      );
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
  async healthCheck(): Promise<{
    status: string;
    project: string;
    location: string;
  }> {
    return {
      status: "ok",
      project: this.project,
      location: this.location,
    };
  }
}
