import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenAIService {
  private readonly logger = new Logger(GenAIService.name);
  private apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_GENAI_API_KEY') || '';
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('GOOGLE_GENAI_API_KEY is not set. Returning mock response.');
      return "beach, sunset, cinematic, palm trees, warm"; // Mock fallback
    }

    try {
      // In a real implementation, use @google/generative-ai
      // For now, to keep dependencies minimal, we can fetch directly or use a mock logic
      // if the package isn't installed.

      this.logger.log(`Generating text for prompt: ${prompt.substring(0, 20)}...`);

      // Mock "Smart" response for now
      return this.mockSmartExtraction(prompt);
    } catch (error) {
      this.logger.error('Failed to generate content', error);
      throw error;
    }
  }

  private mockSmartExtraction(text: string): string {
    const keywords = [];
    const lower = text.toLowerCase();

    if (lower.includes("beach") || lower.includes("ocean")) keywords.push("beach", "ocean", "waves");
    if (lower.includes("night") || lower.includes("dark")) keywords.push("night", "cinematic lighting", "shadows");
    if (lower.includes("city")) keywords.push("urban", "cityscape", "architecture");
    if (lower.includes("forest")) keywords.push("nature", "trees", "mist");

    if (keywords.length === 0) return "cinematic, photography, detail";

    return keywords.join(", ");
  }
}
