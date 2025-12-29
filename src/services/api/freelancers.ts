import { ApiResponse, CreateFreelancerData, Freelancer, PaginatedResponse } from '../types';
import { apiClient } from './index';
import { handleApiError } from './client';

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
    try {
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
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get a single freelancer by ID
  static async getFreelancer(id: string): Promise<Freelancer> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer> | Freelancer>(`/freelancers/${id}`);
      return normalizeFreelancer(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Create a new freelancer profile
  static async createFreelancer(freelancerData: CreateFreelancerData): Promise<Freelancer> {
    try {
      const response = await apiClient.post<ApiResponse<Freelancer> | Freelancer>(
        '/freelancers',
        freelancerData
      );
      return normalizeFreelancer(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Update an existing freelancer profile
  static async updateFreelancer(id: string, freelancerData: Partial<CreateFreelancerData>): Promise<Freelancer> {
    try {
      const response = await apiClient.patch<ApiResponse<Freelancer> | Freelancer>(
        `/freelancers/${id}`,
        freelancerData
      );
      return normalizeFreelancer(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }

  // Delete a freelancer profile
  static async deleteFreelancer(id: string): Promise<void> {
    try {
      await apiClient.delete(`/freelancers/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }
}
