import { ApiResponse, CreateProjectData, PaginatedResponse, Project, UpdateProjectData } from '../types';
import { apiClient } from './index';
import { handleApiError } from './client';

type ProjectsListPayload =
  | PaginatedResponse<Project>
  | { data?: Project[]; pagination?: PaginatedResponse<Project>['pagination']; meta?: { page?: number; limit?: number; total?: number; lastPage?: number } }
  | Project[];

const normalizeProjectsList = (
  payload: ProjectsListPayload,
  page: number,
  limit: number
): PaginatedResponse<Project> => {
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

  if (payload.pagination) {
    return {
      data,
      pagination: payload.pagination,
    };
  }

  if ('meta' in payload && payload.meta) {
    return {
      data,
      pagination: {
        page: payload.meta.page ?? page,
        limit: payload.meta.limit ?? limit,
        total: payload.meta.total ?? data.length,
        totalPages: payload.meta.lastPage ?? (data.length ? 1 : 0),
      },
    };
  }

  return {
    data,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: data.length ? 1 : 0,
    },
  };
};

const normalizeProject = (payload: ApiResponse<Project> | Project): Project => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<Project>).data;
  }
  return payload as Project;
};

export class ProjectsAPI {
  // Get all projects with optional pagination and filters
  static async getProjects(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string;
      client?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Project>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.status) params.append('status', filters.status);
      if (filters?.client) params.append('client', filters.client);
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get<ProjectsListPayload>(`/projects?${params}`);
      return normalizeProjectsList(response.data, page, limit);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get a single project by ID
  static async getProject(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project> | Project>(`/projects/${id}`);
      return normalizeProject(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Create a new project
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project> | Project>('/projects', projectData);
      return normalizeProject(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Update an existing project
  static async updateProject(id: string, projectData: Partial<UpdateProjectData>): Promise<Project> {
    try {
      const response = await apiClient.patch<ApiResponse<Project> | Project>(
        `/projects/${id}`,
        projectData
      );
      return normalizeProject(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Delete a project
  static async deleteProject(id: string): Promise<void> {
    try {
      // Delete the project itself
      await apiClient.delete(`/projects/${id}`);

      // Cascade delete related moodboard items
      try {
        await apiClient.delete(`/moodboard/project/${id}`);
      } catch (moodboardError) {
        // Log but do not block project deletion
        console.warn('Failed to delete related moodboard items:', moodboardError);
      }

      // Cascade delete related catalog assets
      try {
        await apiClient.delete(`/catalog/project/${id}`);
      } catch (catalogError) {
        console.warn('Failed to delete related catalog assets:', catalogError);
      }

      // TODO: Cascade delete related script references if API available
    } catch (error) {
      handleApiError(error);
    }
  }
}
