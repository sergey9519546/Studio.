import { ApiResponse, CreateFreelancerData, Freelancer, PaginatedResponse } from '../types';
import { apiClient } from './index';

type FreelancersListPayload =
  | PaginatedResponse<Freelancer>
  | { data?: Freelancer[]; pagination?: PaginatedResponse<Freelancer>['pagination'] }
  | Freelancer[];

const normalizeFreelancersList = (
  payload: FreelancersListPayload,
  page: number,
  limit: number
): PaginatedResponse<Freelancer> => {
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

const normalizeFreelancer = (
  payload: ApiResponse<Freelancer> | Freelancer
): Freelancer => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<Freelancer>).data;
  }
  return payload as Freelancer;
};

export class FreelancersAPI {
  // Get all freelancers with optional pagination and filters
  static async getFreelancers(
    page: number = 1,
    limit: number = 10,
    filters?: {
      availability?: string;
      role?: string;
      skills?: string[];
      location?: string;
      search?: string;
      minRate?: number;
      maxRate?: number;
    }
  ): Promise<PaginatedResponse<Freelancer>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.availability) params.append('availability', filters.availability);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minRate) params.append('minRate', filters.minRate.toString());
    if (filters?.maxRate) params.append('maxRate', filters.maxRate.toString());

    const response = await apiClient.get<FreelancersListPayload>(`/freelancers?${params}`);
    return normalizeFreelancersList(response.data, page, limit);
  }

  // Get a single freelancer by ID
  static async getFreelancer(id: string): Promise<Freelancer> {
    const response = await apiClient.get<ApiResponse<Freelancer> | Freelancer>(`/freelancers/${id}`);
    return normalizeFreelancer(response.data);
  }

  // Create a new freelancer profile
  static async createFreelancer(freelancerData: CreateFreelancerData): Promise<Freelancer> {
    const response = await apiClient.post<ApiResponse<Freelancer> | Freelancer>('/freelancers', freelancerData);
    return normalizeFreelancer(response.data);
  }

  // Update an existing freelancer profile
  static async updateFreelancer(id: string, freelancerData: Partial<CreateFreelancerData>): Promise<Freelancer> {
    const response = await apiClient.patch<ApiResponse<Freelancer> | Freelancer>(`/freelancers/${id}`, freelancerData);
    return normalizeFreelancer(response.data);
  }

  // Delete a freelancer profile
  static async deleteFreelancer(id: string): Promise<void> {
    await apiClient.delete(`/freelancers/${id}`);
  }

  // Get freelancers by availability status
  static async getFreelancersByAvailability(availability: string): Promise<Freelancer[]> {
    const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/availability/${availability}`);
    return response.data.data;
  }

  // Get freelancers by role
  static async getFreelancersByRole(role: string): Promise<Freelancer[]> {
    const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/role/${role}`);
    return response.data.data;
  }

  // Search freelancers
  static async searchFreelancers(query: string): Promise<Freelancer[]> {
    const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }

  // Get freelancers by skills
  static async getFreelancersBySkills(skills: string[]): Promise<Freelancer[]> {
    const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/skills?skills=${skills.join(',')}`);
    return response.data.data;
  }

  // Get freelancer statistics
  static async getFreelancerStats(): Promise<{
    total: number;
    available: number;
    limited: number;
    unavailable: number;
    averageRate: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      total: number;
      available: number;
      limited: number;
      unavailable: number;
      averageRate: number;
    }>>('/freelancers/stats');
    return response.data.data;
  }

  // Get popular skills
  static async getPopularSkills(): Promise<{ skill: string; count: number }[]> {
    const response = await apiClient.get<ApiResponse<Array<{ skill: string; count: number }>>>('/freelancers/skills/popular');
    return response.data.data;
  }

  // Get freelancers by location
  static async getFreelancersByLocation(location: string): Promise<Freelancer[]> {
    const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/location/${encodeURIComponent(location)}`);
    return response.data.data;
  }

  // Rate a freelancer
  static async rateFreelancer(id: string, rating: number, review?: string): Promise<Freelancer> {
    const response = await apiClient.post<ApiResponse<Freelancer>>(`/freelancers/${id}/rate`, {
      rating,
      review,
    });
    return response.data.data;
  }
}
