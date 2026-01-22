import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createZhipuJwt } from './zhipu-jwt.js';

@Injectable()
export class GenAIService {
  private readonly logger = new Logger(GenAIService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly apiEndpoint: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ZHIPU_API_KEY') || '';
    this.apiSecret = this.configService.get<string>('ZHIPU_API_SECRET') || '';
    this.apiEndpoint =
      this.configService.get<string>('ZHIPU_API_ENDPOINT') ||
      'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.model = this.configService.get<string>('ZHIPU_MODEL') || 'glm-4.7';
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      const missingKeys = [
        !this.apiKey ? 'ZHIPU_API_KEY' : null,
        !this.apiSecret ? 'ZHIPU_API_SECRET' : null,
      ]
        .filter(Boolean)
        .join(', ');
      const message = `Zhipu credentials are not configured (${missingKeys}). Configure these environment variables to enable AI-assisted imports.`;
      this.logger.error(message);
      throw new Error(message);
    }

    try {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const requestBody = {
        model: this.model,
        messages,
        temperature: 0.2,
      };

      const authToken = createZhipuJwt(this.apiKey, this.apiSecret);

      this.logger.log(`Requesting Zhipu GLM-4.7 completion for prompt: ${prompt.substring(0, 20)}...`);

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const message = `Zhipu GLM-4.7 request failed (${response.status}). ${errorText || response.statusText}`;
        this.logger.error(message);
        throw new Error(
          `${message} Verify ZHIPU_API_KEY, ZHIPU_API_SECRET, and network access for import generation.`
        );
      }

      const data = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        const message = 'Zhipu GLM-4.7 returned an empty response. Try refining the prompt or check the account quota.';
        this.logger.error(message);
        throw new Error(message);
      }

      return content;
    } catch (error) {
      this.logger.error('Failed to generate content with Zhipu GLM-4.7', error);
      throw error;
    }
  }
}
