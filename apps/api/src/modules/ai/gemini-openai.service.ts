import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';

/**
 * OpenAI-compatible service using Google Gemini as the backend
 * Provides OpenAI-like API interface for seamless integration
 */
@Injectable()
export class GeminiOpenAIService {
  private readonly logger = new Logger(GeminiOpenAIService.name);

  constructor(
    private geminiService: GeminiService,
    private configService: ConfigService
  ) {}

  /**
   * Create a chat completion using OpenAI-compatible interface
   */
  async createChatCompletion(options: {
    model?: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }) {
    try {
      const {
        model = 'gpt-3.5-turbo',
        messages,
        stream = false
      } = options;

      // Convert OpenAI format to Gemini format
      const geminiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const systemPrompt = messages.find(msg => msg.role === 'system')?.content;

      if (stream) {
        // Return async generator for streaming
        return this.createStreamingChatCompletion(geminiMessages, systemPrompt, model);
      }

      // Get response from Gemini (temperature/max_tokens not yet supported in chat method)
      const response = await this.geminiService.chat(geminiMessages, systemPrompt, model);

      // Return in OpenAI format
      return {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: response,
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: this.estimateTokens(messages.map(m => m.content).join(' ')),
          completion_tokens: this.estimateTokens(response),
          total_tokens: 0 // Will be calculated by usage estimator
        }
      };
    } catch (error) {
      this.logger.error('Error in createChatCompletion:', error);
      throw error;
    }
  }

  /**
   * Create a streaming chat completion
   */
  async *createStreamingChatCompletion(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    model: string = 'gpt-3.5-turbo'
  ) {
    try {
      const stream = this.geminiService.streamChat(messages, systemPrompt, model);

      let chunkIndex = 0;
      for await (const chunk of stream) {
        yield {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            index: chunkIndex,
            delta: {
              content: chunk
            },
            finish_reason: null
          }]
        };
        chunkIndex++;
      }

      // Send final chunk with finish reason
      yield {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }]
      };
    } catch (error) {
      this.logger.error('Error in createStreamingChatCompletion:', error);
      throw error;
    }
  }

  /**
   * Create a completion using OpenAI-compatible interface
   */
  async createCompletion(options: {
    model?: string;
    prompt: string | string[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }) {
    try {
      const {
        model = 'text-davinci-003',
        prompt,
        stream = false
      } = options;

      const promptText = Array.isArray(prompt) ? prompt.join('\n') : prompt;

      if (stream) {
        return this.createStreamingCompletion(promptText, model);
      }

      const response = await this.geminiService.generateContent(promptText);

      return {
        id: `cmpl-${Date.now()}`,
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          text: response,
          index: 0,
          logprobs: null,
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: this.estimateTokens(promptText),
          completion_tokens: this.estimateTokens(response),
          total_tokens: 0
        }
      };
    } catch (error) {
      this.logger.error('Error in createCompletion:', error);
      throw error;
    }
  }

  /**
   * Create a streaming completion
   */
  async *createStreamingCompletion(
    prompt: string,
    model: string = 'text-davinci-003'
  ) {
    try {
      const stream = this.geminiService.streamContent(prompt, model);

      for await (const chunk of stream) {
        yield {
          id: `cmpl-${Date.now()}`,
          object: 'text_completion',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            text: chunk,
            index: 0,
            logprobs: null,
            finish_reason: null
          }]
        };
      }

      // Send final chunk
      yield {
        id: `cmpl-${Date.now()}`,
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          text: '',
          index: 0,
          logprobs: null,
          finish_reason: 'stop'
        }]
      };
    } catch (error) {
      this.logger.error('Error in createStreamingCompletion:', error);
      throw error;
    }
  }

  /**
   * List available models (OpenAI-compatible response)
   */
  async listModels() {
    return {
      object: 'list',
      data: [
        {
          id: 'gpt-3.5-turbo',
          object: 'model',
          created: Date.now(),
          owned_by: 'openai',
          permission: [],
          root: 'gpt-3.5-turbo',
          parent: null
        },
        {
          id: 'gpt-4',
          object: 'model',
          created: Date.now(),
          owned_by: 'openai',
          permission: [],
          root: 'gpt-4',
          parent: null
        },
        {
          id: 'text-davinci-003',
          object: 'model',
          created: Date.now(),
          owned_by: 'openai',
          permission: [],
          root: 'text-davinci-003',
          parent: null
        }
      ]
    };
  }

  /**
   * Get model information
   */
  async retrieveModel(model: string) {
    const models = await this.listModels();
    const foundModel = models.data.find(m => m.id === model);

    if (!foundModel) {
      throw new Error(`Model ${model} not found`);
    }

    return foundModel;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Health check for the OpenAI-compatible service
   */
  async healthCheck() {
    try {
      const health = await this.geminiService.healthCheck();
      return {
        ...health,
        compatibleWith: 'OpenAI API',
        version: '1.0.0'
      };
    } catch (error) {
      return {
        status: 'error',
        configured: false,
        provider: 'Google Gemini AI (OpenAI Compatible)',
        mode: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
