import { ApiResponse, CreateProjectData, PaginatedResponse, Project, UpdateProjectData } from '../types';
import { apiClient } from './index';
import { MOCK_PROJECTS, addRandomDelay } from './mockData';

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
  // Helper method to use mock data when API is unavailable
  private static async getMockProjects(page: number, limit: number, filters?: any): Promise<PaginatedResponse<Project>> {
    await addRandomDelay();
    
    let filteredProjects = [...MOCK_PROJECTS];
    
    // Apply filters
    if (filters?.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }
    if (filters?.client) {
      filteredProjects = filteredProjects.filter(p => p.client?.toLowerCase().includes(filters.client.toLowerCase()));
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.client?.toLowerCase().includes(search)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredProjects.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredProjects.length,
        totalPages: Math.ceil(filteredProjects.length / limit),
      },
    };
  }

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
      console.warn('API unavailable, using mock data for projects:', error);
      return this.getMockProjects(page, limit, filters);
    }
  }

  // Get a single project by ID
  static async getProject(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project> | Project>(`/projects/${id}`);
      return normalizeProject(response.data);
    } catch (error) {
      console.warn('API unavailable, using mock data for project:', error);
      await addRandomDelay();
      const project = MOCK_PROJECTS.find(p => p.id === id);
      if (!project) {
        throw new Error(`Project with id ${id} not found`);
      }
      return project;
    }
  }

  // Create a new project (mock implementation)
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    console.warn('API unavailable, project creation simulated');
    await addRandomDelay();
    
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title,
      client: projectData.client,
      description: projectData.description,
      status: 'Active',
      budget: projectData.budget,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tone: projectData.tone,
    };
    
    // In a real implementation, this would be added to the database
    MOCK_PROJECTS.unshift(newProject);
    return newProject;
  }

  // Update an existing project (mock implementation)
  static async updateProject(id: string, projectData: Partial<UpdateProjectData>): Promise<Project> {
    console.warn('API unavailable, project update simulated');
    await addRandomDelay();
    
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject = {
      ...MOCK_PROJECTS[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_PROJECTS[projectIndex] = updatedProject;
    return updatedProject;
  }

  // Delete a project (mock implementation)
  static async deleteProject(id: string): Promise<void> {
    console.warn('API unavailable, project deletion simulated');
    await addRandomDelay();
    
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    MOCK_PROJECTS.splice(projectIndex, 1);
  }

  // Get projects by status
  static async getProjectsByStatus(status: string): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/status/${status}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for projects by status:', error);
      await addRandomDelay();
      return MOCK_PROJECTS.filter(p => p.status === status);
    }
  }

  // Get projects by client
  static async getProjectsByClient(client: string): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/client/${client}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for projects by client:', error);
      await addRandomDelay();
      return MOCK_PROJECTS.filter(p => 
        p.client?.toLowerCase().includes(client.toLowerCase())
      );
    }
  }

  // Search projects
  static async searchProjects(query: string): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for project search:', error);
      await addRandomDelay();
      const search = query.toLowerCase();
      return MOCK_PROJECTS.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.client?.toLowerCase().includes(search)
      );
    }
  }

  // Get project statistics (mock implementation)
  static async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    blocked: number;
  }> {
    console.warn('API unavailable, using mock data for project stats');
    await addRandomDelay();
    
    const stats = {
      total: MOCK_PROJECTS.length,
      active: MOCK_PROJECTS.filter(p => p.status === 'Active').length,
      completed: MOCK_PROJECTS.filter(p => p.status === 'Completed').length,
      blocked: MOCK_PROJECTS.filter(p => p.status === 'Blocked').length,
    };
    
    return stats;
  }
}
