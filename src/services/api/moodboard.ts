import { apiClient } from './index';
import { MoodboardItem, CreateMoodboardItemData, ApiResponse, PaginatedResponse } from '../types';

type MoodboardListPayload =
  | PaginatedResponse<MoodboardItem>
  | { data?: MoodboardItem[]; pagination?: PaginatedResponse<MoodboardItem>['pagination'] }
  | MoodboardItem[];

const normalizeMoodboardList = (
  payload: MoodboardListPayload,
  page: number,
  limit: number
): PaginatedResponse<MoodboardItem> => {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      pagination: {
        page,
        limit,
        total: payload.length,
        totalPages: 1,
      },
    };
  }

  const data = Array.isArray(payload.data) ? payload.data : [];
  return {
    data,
    pagination: payload.pagination || {
      page,
      limit,
      total: data.length,
      totalPages: data.length ? 1 : 0,
    },
  };
};

const normalizeMoodboardItem = (payload: ApiResponse<MoodboardItem> | MoodboardItem): MoodboardItem => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<MoodboardItem>).data;
  }
  return payload as MoodboardItem;
};

export class MoodboardAPI {
  // Get all moodboard items for a project
  static async getMoodboardItems(
    projectId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<MoodboardItem>> {
    const response = await apiClient.get<MoodboardListPayload>(`/moodboard/${projectId}`);
    return normalizeMoodboardList(response.data, page, limit);
  }

  // Get a single moodboard item by ID
  static async getMoodboardItem(id: string): Promise<MoodboardItem> {
    const response = await apiClient.get<
      ApiResponse<MoodboardItem> | MoodboardItem | MoodboardListPayload
    >(`/moodboard/${id}`);

    if (Array.isArray(response.data)) {
      const item = response.data.find((candidate) => candidate.id === id);
      if (!item) {
        throw new Error('Moodboard item not found');
      }
      return item;
    }

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const data = (response.data as ApiResponse<MoodboardItem>).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }

    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as MoodboardItem;
    }

    throw new Error('Moodboard item not found');
  }

  // Add a new moodboard item
  static async createMoodboardItem(itemData: CreateMoodboardItemData): Promise<MoodboardItem> {
    const response = await apiClient.post<ApiResponse<MoodboardItem> | MoodboardItem>(
      `/moodboard/${itemData.projectId}`,
      itemData
    );
    return normalizeMoodboardItem(response.data);
  }

  // Update an existing moodboard item
  static async updateMoodboardItem(
    id: string, 
    itemData: Partial<CreateMoodboardItemData>
  ): Promise<MoodboardItem> {
    const response = await apiClient.patch<ApiResponse<MoodboardItem> | MoodboardItem>(
      `/moodboard/${id}`,
      itemData
    );
    return normalizeMoodboardItem(response.data);
  }

  // Delete a moodboard item
  static async deleteMoodboardItem(id: string): Promise<void> {
    await apiClient.delete(`/moodboard/${id}`);
  }

  // Search moodboard items by tags
  static async searchMoodboardItems(query: string, projectId?: string): Promise<MoodboardItem[]> {
    if (!projectId) {
      return [];
    }

    const params = new URLSearchParams({ q: query });
    const response = await apiClient.get<MoodboardListPayload>(`/moodboard/${projectId}/search?${params}`);
    return normalizeMoodboardList(response.data, 1, 50).data;
  }

  // Get moodboard items by mood
  static async getMoodboardItemsByMood(mood: string, projectId?: string): Promise<MoodboardItem[]> {
    if (!projectId) {
      return [];
    }
    const list = await this.getMoodboardItems(projectId, 1, 200);
    return list.data.filter((item) => item.moods?.includes(mood));
  }

  // Get moodboard items by tags
  static async getMoodboardItemsByTags(tags: string[], projectId?: string): Promise<MoodboardItem[]> {
    if (!projectId) {
      return [];
    }
    const list = await this.getMoodboardItems(projectId, 1, 200);
    return list.data.filter((item) => tags.some((tag) => item.tags?.includes(tag)));
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
    
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata.moods) formData.append('moods', JSON.stringify(metadata.moods));
    if (metadata.colors) formData.append('colors', JSON.stringify(metadata.colors));
    if (metadata.shotType) formData.append('shotType', metadata.shotType);

    const response = await apiClient.post<ApiResponse<MoodboardItem> | MoodboardItem>(
      `/moodboard/${projectId}/upload`,
      formData,
      {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      }
    );
    return normalizeMoodboardItem(response.data);
  }
}
