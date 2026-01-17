import { apiClient } from "./index";

export interface GenerateImageRequest {
  prompt: string;
  size?: '1024x1024' | '1280x1280' | '512x512';
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl: string;
  created: number;
  prompt: string;
  size: string;
}

export const AIAPI = {
  /**
   * Generate an image using GLM-Image model
   */
  async generateImage(request: GenerateImageRequest): Promise<{ data: GenerateImageResponse }> {
    const response = await apiClient.post<GenerateImageResponse>('/ai/generate-image', request);
    return { data: response.data };
  },
};
