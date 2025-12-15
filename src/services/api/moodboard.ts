import { apiClient } from './index';
import { MoodboardItem, CreateMoodboardItemData, ApiResponse, PaginatedResponse } from '../types';

export class MoodboardAPI {
  // Get all moodboard items for a project
  static async getMoodboardItems(
    projectId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<MoodboardItem>> {
    const params = new URLSearchParams({
      projectId,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get<PaginatedResponse<MoodboardItem>>(`/moodboard?${params}`);
    return response.data;
  }

  // Get a single moodboard item by ID
  static async getMoodboardItem(id: string): Promise<MoodboardItem> {
    const response = await apiClient.get<ApiResponse<MoodboardItem>>(`/moodboard/${id}`);
    return response.data.data;
  }

  // Add a new moodboard item
  static async createMoodboardItem(itemData: CreateMoodboardItemData): Promise<MoodboardItem> {
    const response = await apiClient.post<ApiResponse<MoodboardItem>>('/moodboard', itemData);
    return response.data.data;
  }

  // Update an existing moodboard item
  static async updateMoodboardItem(
    id: string, 
    itemData: Partial<CreateMoodboardItemData>
  ): Promise<MoodboardItem> {
    const response = await apiClient.put<ApiResponse<MoodboardItem>>(`/moodboard/${id}`, itemData);
    return response.data.data;
  }

  // Delete a moodboard item
  static async deleteMoodboardItem(id: string): Promise<void> {
    await apiClient.delete(`/moodboard/${id}`);
  }

  // Search moodboard items by tags
  static async searchMoodboardItems(query: string, projectId?: string): Promise<MoodboardItem[]> {
    const params = new URLSearchParams({ q: query });
    if (projectId) params.append('projectId', projectId);

    const response = await apiClient.get<ApiResponse<MoodboardItem[]>>(`/moodboard/search?${params}`);
    return response.data.data;
  }

  // Get moodboard items by mood
  static async getMoodboardItemsByMood(mood: string, projectId?: string): Promise<MoodboardItem[]> {
    const params = new URLSearchParams({ mood });
    if (projectId) params.append('projectId', projectId);

    const response = await apiClient.get<ApiResponse<MoodboardItem[]>>(`/moodboard/mood?${params}`);
    return response.data.data;
  }

  // Get moodboard items by tags
  static async getMoodboardItemsByTags(tags: string[], projectId?: string): Promise<MoodboardItem[]> {
    const params = new URLSearchParams({ tags: tags.join(',') });
    if (projectId) params.append('projectId', projectId);

    const response = await apiClient.get<ApiResponse<MoodboardItem[]>>(`/moodboard/tags?${params}`);
    return response.data.data;
  }

  // Upload moodboard item with file
  static async uploadMoodboardItem(
    projectId: string,
    file: File,
    metadata: {
      tags?: string[];
      moods?: string[];
      colors?: string[];
      shotType?: string;
    }
  ): Promise<MoodboardItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata.moods) formData.append('moods', JSON.stringify(metadata.moods));
    if (metadata.colors) formData.append('colors', JSON.stringify(metadata.colors));
    if (metadata.shotType) formData.append('shotType', metadata.shotType);

    const response = await apiClient.post<ApiResponse<MoodboardItem>>('/moodboard/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}
