import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * Service for interacting with Google's Gemini API via OpenAI-compatible endpoint
 * This provides an alternative to the Vertex AI implementation
 */
@Injectable()
export class GeminiOpenAIService {
  private readonly logger = new Logger(GeminiOpenAIService.name);
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY not configured. Service will not be functional.'
      );
    }

    this.client = new OpenAI({
      apiKey: apiKey || 'placeholder',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    this.logger.log('GeminiOpenAIService initialized');
  }

  /**
   * Generate a chat completion using Gemini
   * @param messages Array of chat messages with role and content
   * @param systemPrompt Optional system prompt to guide the AI
   * @param model Gemini model to use (default: gemini-2.0-flash-exp)
   * @returns The AI's response message
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    model: string = 'gemini-2.0-flash-exp'
  ): Promise<string> {
    try {
      const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system prompt if provided
      if (systemPrompt) {
        chatMessages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      // Add user messages
      chatMessages.push(
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }))
      );

      this.logger.debug(
        `Sending chat request to Gemini with ${chatMessages.length} messages`
      );

      const response = await this.client.chat.completions.create({
        model,
        messages: chatMessages,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in response');
      }

      this.logger.debug('Successfully received chat response from Gemini');
      return content;
    } catch (error) {
      this.logger.error('Error calling Gemini chat API:', error);
      throw error;
    }
  }

  /**
   * Generate content from a simple prompt
   * @param prompt The text prompt
   * @param model Gemini model to use (default: gemini-2.0-flash-exp)
   * @returns The AI's generated content
   */
  async generateContent(
    prompt: string,
    model: string = 'gemini-2.0-flash-exp'
  ): Promise<string> {
    try {
      this.logger.debug(`Generating content with prompt: ${prompt.substring(0, 100)}...`);

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in response');
      }

      this.logger.debug('Successfully generated content from Gemini');
      return content;
    } catch (error) {
      this.logger.error('Error generating content from Gemini:', error);
      throw error;
    }
  }

  /**
   * Generate content with streaming support
   * @param prompt The text prompt
   * @param model Gemini model to use
   * @returns AsyncGenerator that yields content chunks
   */
  async *streamContent(
    prompt: string,
    model: string = 'gemini-2.0-flash-exp'
  ): AsyncGenerator<string> {
    try {
      this.logger.debug(`Streaming content with prompt: ${prompt.substring(0, 100)}...`);

      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }

      this.logger.debug('Successfully completed streaming from Gemini');
    } catch (error) {
      this.logger.error('Error streaming content from Gemini:', error);
      throw error;
    }
  }

  /**
   * Chat with streaming support
   * @param messages Array of chat messages
   * @param systemPrompt Optional system prompt
   * @param model Gemini model to use
   * @returns AsyncGenerator that yields content chunks
   */
  async *streamChat(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    model: string = 'gemini-2.0-flash-exp'
  ): AsyncGenerator<string> {
    try {
      const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (systemPrompt) {
        chatMessages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      chatMessages.push(
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }))
      );

      this.logger.debug(
        `Streaming chat with ${chatMessages.length} messages`
      );

      const stream = await this.client.chat.completions.create({
        model,
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }

      this.logger.debug('Successfully completed streaming chat from Gemini');
    } catch (error) {
      this.logger.error('Error streaming chat from Gemini:', error);
      throw error;
    }
  }

  /**
   * Health check for the Gemini OpenAI service
   * @returns Service status information
   */
  async healthCheck(): Promise<{
    status: string;
    configured: boolean;
    endpoint: string;
  }> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const configured = !!apiKey;

    return {
      status: configured ? 'operational' : 'not_configured',
      configured,
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    };
  }
}
