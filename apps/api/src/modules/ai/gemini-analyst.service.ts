import { Injectable } from '@nestjs/common';
import { VertexAIService } from './vertex-ai.service';

@Injectable()
export class GeminiAnalystService {
  constructor(private vertexAI: VertexAIService) { }

  /**
   * Chat with context
   */
  async chat(context: string, messages: Array<{ role: string; content: string }> = []): Promise<string> {
    // Build full conversation with context
    const systemPrompt = `You are an AI analyst for a creative agency management system.
        
Context:
${context}

Please provide helpful, accurate responses based on this context.`;

    return this.vertexAI.chat(messages, systemPrompt);
  }

  /**
   * Extract structured data
   */
  async extractData(prompt: string, schema?: Record<string, unknown>, files?: Express.Multer.File[]): Promise<unknown> {
    let fullPrompt = prompt;

    // Add file contents to prompt if provided
    if (files && files.length > 0) {
      fullPrompt += '\n\nAttached files:\n';
      for (const file of files) {
        fullPrompt += `\nFile: ${file.originalname}\n`;
        fullPrompt += `Content: ${file.buffer.toString('utf-8').substring(0, 5000)}\n`;
      }
    }

    return this.vertexAI.extractData(fullPrompt, schema);
  }

  /**
   * Generate content
   */
  async generateContent(prompt: string): Promise<string> {
    return this.vertexAI.generateContent(prompt);
  }
}