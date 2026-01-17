import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GenAIService {
  private readonly logger = new Logger(GenAIService.name);
  private apiKey: string;
  private readonly ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ZHIPU_API_KEY') || '51ef2cddc4d442c2a106134ae79800f1.GwVaPB7xVKTTjyP5';
  }

  private generateToken(): string {
    if (!this.apiKey || !this.apiKey.includes('.')) return '';

    try {
      const [id, secret] = this.apiKey.split('.');
      const now = Date.now();

      const payload = {
        api_key: id,
        exp: now + 3600 * 1000, // 1 hour expiry
        timestamp: now,
      };

      // Force header type casting to avoid TS errors with strict checking
      return jwt.sign(payload, secret, { algorithm: 'HS256', header: { sign_type: 'SIGN' } as any });
    } catch (e) {
      this.logger.error('Failed to generate token', e);
      return '';
    }
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('API Key is not set. Returning mock response.');
      return this.mockSmartExtraction(prompt);
    }

    try {
      this.logger.log(`Generating text for prompt: ${prompt.substring(0, 20)}...`);

      const token = this.generateToken();
      if (!token) {
          throw new Error('Invalid API Key format');
      }

      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(
        this.ZHIPU_API_URL,
        {
          model: 'glm-4',
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Zhipu response format is OpenAI compatible
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Failed to generate content', error);
      if (axios.isAxiosError(error)) {
        this.logger.error('Axios error details:', error.response?.data);
      }
      return this.mockSmartExtraction(prompt);
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
