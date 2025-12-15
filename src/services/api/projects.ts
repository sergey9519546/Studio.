import { ApiResponse, CreateProjectData, PaginatedResponse, Project, UpdateProjectData } from '../types';
import { apiClient } from './index';

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
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) params.append('status', filters.status);
    if (filters?.client) params.append('client', filters.client);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<PaginatedResponse<Project>>(`/projects?${params}`);
    return response.data;
  }

  // Get a single project by ID
  static async getProject(id: string): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  }

  // Create a new project
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', projectData);
    return response.data.data;
  }

  // Update an existing project
  static async updateProject(id: string, projectData: Partial<UpdateProjectData>): Promise<Project> {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
    return response.data.data;
  }

  // Delete a project
  static async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }

  // Get projects by status
  static async getProjectsByStatus(status: string): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/status/${status}`);
    return response.data.data;
  }

  // Get projects by client
  static async getProjectsByClient(client: string): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/client/${client}`);
    return response.data.data;
  }

  // Search projects
  static async searchProjects(query: string): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }

  // Get project statistics
  static async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    blocked: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/projects/stats');
    return response.data.data;
  }
}
