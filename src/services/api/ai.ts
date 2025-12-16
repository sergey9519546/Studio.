import { apiClient } from './index';
import type { VisionAnalysisResult } from '../../components/ai/VisionAIComponent';
import type { DocumentAnalysisResult } from '../../components/ai/DocumentAIComponent';
import type { AudioAnalysisResult } from '../../components/ai/AudioAIComponent';

interface AnalysisConfig {
  projectId?: string;
  projectContext?: string;
  [key: string]: unknown;
}

const multipartHeaders = { 'Content-Type': 'multipart/form-data' };

export const AIAPI = {
  async analyzeVisionFile(file: File, config?: AnalysisConfig): Promise<VisionAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (config) {
      formData.append('config', JSON.stringify(config));
    }

    const response = await apiClient.post<VisionAnalysisResult>('/ai/vision/analyze-file', formData, {
      headers: multipartHeaders,
    });
    return response.data;
  },

  async analyzeDocumentFile(file: File, config?: AnalysisConfig): Promise<DocumentAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (config) {
      formData.append('config', JSON.stringify(config));
    }

    const response = await apiClient.post<DocumentAnalysisResult>('/ai/document/analyze-file', formData, {
      headers: multipartHeaders,
    });
    return response.data;
  },

  async analyzeAudioFile(file: File, config?: AnalysisConfig): Promise<AudioAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (config) {
      formData.append('config', JSON.stringify(config));
    }

    const response = await apiClient.post<AudioAnalysisResult>('/ai/audio/analyze-file', formData, {
      headers: multipartHeaders,
    });
    return response.data;
  },
};
