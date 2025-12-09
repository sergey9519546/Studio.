import { api } from './api';

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
 * Google Gemini Vision Service
 * Integrates Google Gemini Vision for multimodal vision analysis and content generation
 */
export class GoogleVisionService {
  constructor() {
    // No API key needed - uses backend API
  }

  /**
   * Analyze image using Google Gemini Vision
   * Generates tags, moods, colors, and shot type metadata
   */
  async analyzeImage(imageUrl: string): Promise<VisionAnalysisResult> {
    try {
      const token = localStorage.getItem('studio_roster_v1_auth_token');
      const response = await fetch('/api/v1/ai/vision/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Vision analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings using Google Vertex AI
   * Find similar images/content based on text query
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const token = localStorage.getItem('studio_roster_v1_auth_token');
      const response = await fetch('/api/v1/ai/embeddings/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate embedding');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }
}

export default new GoogleVisionService();
