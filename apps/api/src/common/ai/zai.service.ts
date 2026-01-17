import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Z.ai API Service for GLM 4.7 integration
 * API documentation: https://open.bigmodel.cn/dev/api
 */

interface ZaiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZaiCompletionRequest {
  model: string;
  messages: ZaiMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ZaiCompletionResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ZaiVisionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: Array<{
      type: 'text' | 'image_url';
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
}

@Injectable()
export class ZaiService {
  private readonly logger = new Logger(ZaiService.name);
  private readonly apiKey: string;
  private readonly apiEndpoint: string;
  private readonly model = 'glm-4-flash'; // GLM 4.7 model

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ZAI_API_KEY') || '';
    this.apiEndpoint = this.configService.get<string>('ZAI_API_ENDPOINT') || 'https://open.bigmodel.cn/api/paas/v4';
    
    if (!this.apiKey) {
      this.logger.warn('ZAI_API_KEY is not configured. Z.ai features will use fallback responses.');
    }
  }

  /**
   * Generate text completion using Z.ai GLM 4.7
   */
  async generateText(
    prompt: string,
    systemInstruction?: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('Z.ai API key not configured, using mock response');
      return this.mockTextGeneration(prompt);
    }

    try {
      const messages: ZaiMessage[] = [];
      
      if (systemInstruction) {
        messages.push({
          role: 'system',
          content: systemInstruction,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const requestBody: ZaiCompletionRequest = {
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      };

      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Z.ai API error: ${response.status} - ${errorText}`);
        throw new Error(`Z.ai API error: ${response.statusText}`);
      }

      const data: ZaiCompletionResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Z.ai API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Failed to generate text with Z.ai', error);
      throw error;
    }
  }

  /**
   * Analyze image using Z.ai vision capabilities
   */
  async analyzeImage(
    imageUrl: string,
    prompt: string = 'Analyze this image and extract: style, color palette, mood, main subjects, and key visual elements. Provide tags separated by commas.'
  ): Promise<{
    description: string;
    tags: string[];
    metadata: {
      style?: string;
      mood?: string;
      colorPalette?: string[];
      subjects?: string[];
    };
  }> {
    if (!this.apiKey) {
      this.logger.warn('Z.ai API key not configured, using mock response');
      return this.mockImageAnalysis(imageUrl);
    }

    try {
      const requestBody: ZaiVisionRequest = {
        model: 'glm-4v', // Vision model
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      };

      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Z.ai Vision API error: ${response.status} - ${errorText}`);
        throw new Error(`Z.ai Vision API error: ${response.statusText}`);
      }

      const data: ZaiCompletionResponse = await response.json();
      const content = data.choices[0].message.content;

      // Parse the response to extract structured data
      return this.parseVisionResponse(content);
    } catch (error) {
      this.logger.error('Failed to analyze image with Z.ai', error);
      throw error;
    }
  }

  /**
   * Parse structured data from files (Excel, CSV, Documents)
   */
  async parseFile(
    fileContent: string,
    fileType: string,
    extractionPrompt?: string
  ): Promise<Record<string, unknown>> {
    const prompt = extractionPrompt || `Parse this ${fileType} file and extract project information including:
- Project name
- Start date and end date
- Client name
- Deliverables list
- Budget (if available)
- Description/brief

Return the data as a JSON object.`;

    const systemInstruction = 'You are a data extraction expert. Parse the provided content and return clean, structured JSON data. Only return valid JSON, no additional text.';

    try {
      const response = await this.generateText(
        `${prompt}\n\nFile content:\n${fileContent}`,
        systemInstruction,
        { temperature: 0.3 }
      );

      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { error: 'Could not parse structured data from response', raw: response };
    } catch (error) {
      this.logger.error('Failed to parse file', error);
      throw error;
    }
  }

  /**
   * Parse resume/CV to extract candidate information
   */
  async parseResume(
    resumeText: string
  ): Promise<{
    name?: string;
    email?: string;
    phone?: string;
    skills: string[];
    experience?: string;
    education?: string;
    availability?: string;
  }> {
    const systemInstruction = 'You are an HR data extraction expert. Parse resumes and CVs to extract structured information. Return only valid JSON.';
    
    const prompt = `Extract the following information from this resume/CV:
- name: Full name
- email: Email address
- phone: Phone number
- skills: Array of skills (technologies, tools, soft skills)
- experience: Brief summary of work experience
- education: Education background
- availability: If mentioned, when they are available

Return as JSON only.

Resume content:
${resumeText}`;

    try {
      const response = await this.generateText(prompt, systemInstruction, { temperature: 0.2 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experience: parsed.experience,
          education: parsed.education,
          availability: parsed.availability,
        };
      }

      throw new Error('Could not parse resume data');
    } catch (error) {
      this.logger.error('Failed to parse resume', error);
      throw error;
    }
  }

  /**
   * Parse vision response to extract structured metadata
   */
  private parseVisionResponse(content: string): {
    description: string;
    tags: string[];
    metadata: {
      style?: string;
      mood?: string;
      colorPalette?: string[];
      subjects?: string[];
    };
  } {
    // Extract tags from comma-separated values or bullet points
    const tagPattern = /(?:tags:|keywords:)\s*([^\n]+)/i;
    const tagMatch = content.match(tagPattern);
    const tags = tagMatch 
      ? tagMatch[1].split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : [];

    // Extract style
    const stylePattern = /(?:style:|aesthetic:)\s*([^\n]+)/i;
    const styleMatch = content.match(stylePattern);
    const style = styleMatch ? styleMatch[1].trim() : undefined;

    // Extract mood
    const moodPattern = /(?:mood:|tone:|atmosphere:)\s*([^\n]+)/i;
    const moodMatch = content.match(moodPattern);
    const mood = moodMatch ? moodMatch[1].trim() : undefined;

    // Extract colors
    const colorPattern = /(?:colors?:|palette:)\s*([^\n]+)/i;
    const colorMatch = content.match(colorPattern);
    const colorPalette = colorMatch 
      ? colorMatch[1].split(',').map(c => c.trim()).filter(Boolean)
      : undefined;

    return {
      description: content,
      tags: tags.length > 0 ? tags : this.extractDefaultTags(content),
      metadata: {
        style,
        mood,
        colorPalette,
      },
    };
  }

  /**
   * Extract default tags from content if specific tags aren't found
   */
  private extractDefaultTags(content: string): string[] {
    const lower = content.toLowerCase();
    const tags: string[] = [];

    // Common visual descriptors
    const descriptors = [
      'portrait', 'landscape', 'urban', 'nature', 'architecture', 
      'cinematic', 'minimal', 'dramatic', 'soft', 'vibrant',
      'dark', 'light', 'colorful', 'monochrome', 'vintage',
      'modern', 'abstract', 'detailed', 'macro', 'aerial'
    ];

    for (const desc of descriptors) {
      if (lower.includes(desc)) {
        tags.push(desc);
      }
    }

    return tags.slice(0, 10); // Limit to 10 tags
  }

  /**
   * Mock text generation for development/fallback
   */
  private mockTextGeneration(prompt: string): string {
    this.logger.log('Using mock text generation');
    return `Based on your request: "${prompt.substring(0, 50)}..."

This is a mock response. Please configure ZAI_API_KEY for actual AI generation.`;
  }

  /**
   * Mock image analysis for development/fallback
   */
  private mockImageAnalysis(imageUrl: string): {
    description: string;
    tags: string[];
    metadata: {
      style?: string;
      mood?: string;
      colorPalette?: string[];
      subjects?: string[];
    };
  } {
    this.logger.log('Using mock image analysis');
    return {
      description: 'Mock analysis - please configure ZAI_API_KEY for actual image analysis',
      tags: ['cinematic', 'photography', 'professional', 'detailed'],
      metadata: {
        style: 'professional photography',
        mood: 'neutral',
        colorPalette: ['#FFFFFF', '#1D1D1F', '#86868B'],
        subjects: ['subject'],
      },
    };
  }
}
