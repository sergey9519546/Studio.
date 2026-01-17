import { apiClient } from './index';
import { MoodboardItem, CreateMoodboardItemData, ApiResponse, PaginatedResponse } from '../types';
import type { UnsplashImage } from '../unsplash';
import { handleApiError } from './client';

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

export interface MoodboardCollection {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  items?: Array<{ id: string; moodboardItemId: string; collectionId: string }>;
}

export class MoodboardAPI {
  // Get all moodboard items for a project
  static async getMoodboardItems(
    projectId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<MoodboardItem>> {
    try {
      const response = await apiClient.get<MoodboardListPayload>(`/moodboard/${projectId}`);
      return normalizeMoodboardList(response.data, page, limit);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Add a new moodboard item
  static async createMoodboardItem(itemData: CreateMoodboardItemData): Promise<MoodboardItem> {
    try {
      const response = await apiClient.post<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${itemData.projectId}`,
        itemData
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Update an existing moodboard item
  static async updateMoodboardItem(
    id: string,
    itemData: Partial<CreateMoodboardItemData>
  ): Promise<MoodboardItem> {
    try {
      const response = await apiClient.patch<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${id}`,
        itemData
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Delete a moodboard item
  static async deleteMoodboardItem(id: string): Promise<void> {
    try {
      await apiClient.delete(`/moodboard/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Save Unsplash image to moodboard
  static async createFromUnsplash(projectId: string, image: UnsplashImage): Promise<MoodboardItem> {
    const payload = {
      projectId,
      unsplashId: image.id,
      imageUrl: image.urls.regular,
      photographerName: image.user.name,
      photographerUrl: image.user.links.html,
      description: image.description,
      altDescription: image.alt_description,
      color: image.color,
      width: image.width,
      height: image.height,
    };

    try {
      const response = await apiClient.post<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${projectId}/from-unsplash`,
        payload
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Toggle favorite status for an item
  static async toggleFavorite(id: string, isFavorite: boolean): Promise<MoodboardItem> {
    try {
      const response = await apiClient.patch<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${id}/favorite`,
        { isFavorite }
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get all favorites for a project
  static async getFavorites(projectId: string): Promise<MoodboardItem[]> {
    try {
      const response = await apiClient.get<MoodboardListPayload>(`/moodboard/${projectId}/favorites`);
      return normalizeMoodboardList(response.data, 1, 200).data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Create a new collection
  static async createCollection(
    projectId: string,
    payload: { name: string; description?: string }
  ): Promise<MoodboardCollection> {
    try {
      const response = await apiClient.post<MoodboardCollection>(
        `/moodboard/${projectId}/collections`,
        payload
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get all collections for a project
  static async getCollections(projectId: string): Promise<MoodboardCollection[]> {
    try {
      const response = await apiClient.get<MoodboardCollection[]>(
        `/moodboard/${projectId}/collections`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Add a moodboard item to a collection
  static async addToCollection(itemId: string, collectionId: string): Promise<MoodboardItem> {
    try {
      const response = await apiClient.patch<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${itemId}/collection/${collectionId}`
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Remove a moodboard item from a collection
  static async removeFromCollection(itemId: string): Promise<MoodboardItem> {
    try {
      const response = await apiClient.delete<ApiResponse<MoodboardItem> | MoodboardItem>(
        `/moodboard/${itemId}/collection`
      );
      return normalizeMoodboardItem(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Delete a collection
  static async deleteCollection(id: string): Promise<void> {
    try {
      await apiClient.delete(`/moodboard/collections/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Search moodboard items by tags
  static async searchMoodboardItems(query: string, projectId?: string): Promise<MoodboardItem[]> {
    if (!projectId) {
      return [];
    }

    try {
      const params = new URLSearchParams({ q: query });
      const response = await apiClient.get<MoodboardListPayload>(`/moodboard/${projectId}/search?${params}`);
      return normalizeMoodboardList(response.data, 1, 50).data;
    } catch (error) {
      handleApiError(error);
    }
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
      caption?: string;
    }
  ): Promise<MoodboardItem> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata.moods) formData.append('moods', JSON.stringify(metadata.moods));
    if (metadata.colors) formData.append('colors', JSON.stringify(metadata.colors));
    if (metadata.shotType) formData.append('shotType', metadata.shotType);
    if (metadata.caption) formData.append('caption', metadata.caption);

    try {
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
    } catch (error) {
      handleApiError(error);
    }
  }
}
