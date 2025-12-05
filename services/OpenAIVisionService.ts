import axios from 'axios';

interface VisionAnalysisResult {
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  description: string;
}

interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * OpenAI Vision Service
 * Integrates OpenAI GPT-4o for multimodal vision analysis and content generation
 */
export class OpenAIVisionService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'gpt-4o';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not provided');
    }
  }

  /**
   * Analyze image using GPT-4o Vision
   * Generates tags, moods, colors, and shot type metadata
   */
  async analyzeImage(imageUrl: string): Promise<VisionAnalysisResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: imageUrl },
                },
                {
                  type: 'text',
                  text: `Analyze this image for creative and design purposes. Respond in JSON format with the following fields:
                  {
                    "tags": ["visual tag 1", "visual tag 2", ...],
                    "moods": ["mood 1", "mood 2", ...],
                    "colors": ["hex color 1", "hex color 2", ...],
                    "shotType": "shot type or framing style (optional)",
                    "description": "2-3 sentence creative description"
                  }
                  Be specific and creative in your analysis. Tags should describe visual elements. Moods should capture emotional tone.`,
                },
              ],
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0]?.message?.content || '{}';
      
      // Extract JSON from response (it might be wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      const result = JSON.parse(jsonContent) as VisionAnalysisResult;
      return result;
    } catch (error) {
      console.error('Vision analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate creative content with project context
   * Used for scripts, copy, and other creative generation
   */
  async generateContent(
    prompt: string,
    context: {
      projectTitle: string;
      brief?: string;
      guidelines?: string;
      assetTags?: string[];
    },
    options?: GenerationOptions
  ): Promise<string> {
    try {
      const systemPrompt = `You are a creative AI assistant specializing in content generation for creative agencies.
      
Project: ${context.projectTitle}
${context.brief ? `Brief: ${context.brief}` : ''}
${context.guidelines ? `Guidelines: ${context.guidelines}` : ''}
${context.assetTags?.length ? `Visual References: ${context.assetTags.join(', ')}` : ''}

Generate creative, professional content that adheres to the brief and guidelines.`;

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 2048,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Content generation error:', error);
      throw error;
    }
  }

  /**
   * Semantic search using embeddings
   * Find similar images/content based on text query
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/embeddings`,
        {
          model: 'text-embedding-3-small',
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0]?.embedding || [];
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }

  /**
   * Extract structured data from documents
   * Used for project ingest from uploaded files
   */
  async extractProjectMetadata(text: string): Promise<{
    projectName?: string;
    client?: string;
    deliverables: string[];
    tone?: string;
    summary?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: `Extract project metadata from the following document and return as JSON:
              
${text}

Response format:
{
  "projectName": "project name if mentioned",
  "client": "client/brand name if mentioned",
  "deliverables": ["deliverable 1", "deliverable 2", ...],
  "tone": "overall tone/aesthetic",
  "summary": "brief summary of the project"
}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 800,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Metadata extraction error:', error);
      throw error;
    }
  }

  /**
   * Check API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return !!response.data.choices?.[0];
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default new OpenAIVisionService();
