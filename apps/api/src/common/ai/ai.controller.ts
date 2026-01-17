import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ZaiService } from './zai.service.js';

interface GenerateImageDto {
  prompt: string;
  size?: '1024x1024' | '1280x1280' | '512x512';
}

@Controller({ path: 'ai', version: '1' })
export class AIController {
  constructor(private readonly zaiService: ZaiService) {}

  /**
   * Generate image using GLM-Image model
   * POST /api/v1/ai/generate-image
   */
  @Post('generate-image')
  async generateImage(@Body() dto: GenerateImageDto) {
    if (!dto.prompt || dto.prompt.trim().length === 0) {
      throw new BadRequestException('Prompt is required');
    }

    try {
      const result = await this.zaiService.generateImage(dto.prompt, {
        size: dto.size || '1280x1280',
      });

      return {
        success: true,
        imageUrl: result.url,
        created: result.created,
        prompt: dto.prompt,
        size: dto.size || '1280x1280',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
