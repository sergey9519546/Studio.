import { ApiResponse, CreateFreelancerData, Freelancer, PaginatedResponse } from '../types';
import { apiClient } from './index';
import { MOCK_FREELANCERS, addRandomDelay } from './mockData';

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
  // Helper method to use mock data when API is unavailable
  private static async getMockFreelancers(page: number, limit: number, filters?: any): Promise<PaginatedResponse<Freelancer>> {
    await addRandomDelay();
    
    let filteredFreelancers = [...MOCK_FREELANCERS];
    
    // Apply filters
    if (filters?.availability) {
      filteredFreelancers = filteredFreelancers.filter(f => f.availability === filters.availability);
    }
    if (filters?.role) {
      filteredFreelancers = filteredFreelancers.filter(f => 
        f.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }
    if (filters?.skills && filters.skills.length > 0) {
      filteredFreelancers = filteredFreelancers.filter(f =>
        filters.skills.some((skill: string) =>
          f.skills.some(fSkill => fSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
    if (filters?.location) {
      filteredFreelancers = filteredFreelancers.filter(f =>
        f.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredFreelancers = filteredFreelancers.filter(f =>
        f.name.toLowerCase().includes(search) ||
        f.role.toLowerCase().includes(search) ||
        f.bio.toLowerCase().includes(search) ||
        f.skills.some(skill => skill.toLowerCase().includes(search))
      );
    }
    if (filters?.minRate) {
      filteredFreelancers = filteredFreelancers.filter(f => f.rate >= filters.minRate);
    }
    if (filters?.maxRate) {
      filteredFreelancers = filteredFreelancers.filter(f => f.rate <= filters.maxRate);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredFreelancers.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredFreelancers.length,
        totalPages: Math.ceil(filteredFreelancers.length / limit),
      },
    };
  }

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
      console.warn('API unavailable, using mock data for freelancers:', error);
      return this.getMockFreelancers(page, limit, filters);
    }
  }

  // Get a single freelancer by ID
  static async getFreelancer(id: string): Promise<Freelancer> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer> | Freelancer>(`/freelancers/${id}`);
      return normalizeFreelancer(response.data);
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancer:', error);
      await addRandomDelay();
      const freelancer = MOCK_FREELANCERS.find(f => f.id === id);
      if (!freelancer) {
        throw new Error(`Freelancer with id ${id} not found`);
      }
      return freelancer;
    }
  }

  // Create a new freelancer profile (mock implementation)
  static async createFreelancer(freelancerData: CreateFreelancerData): Promise<Freelancer> {
    console.warn('API unavailable, freelancer creation simulated');
    await addRandomDelay();
    
    const newFreelancer: Freelancer = {
      id: Date.now().toString(),
      name: freelancerData.name,
      role: freelancerData.role,
      bio: freelancerData.bio,
      skills: freelancerData.skills,
      portfolio: freelancerData.portfolio,
      rate: freelancerData.rate,
      availability: freelancerData.availability,
      location: freelancerData.location,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: freelancerData.email,
    };
    
    // In a real implementation, this would be added to the database
    MOCK_FREELANCERS.unshift(newFreelancer);
    return newFreelancer;
  }

  // Update an existing freelancer profile (mock implementation)
  static async updateFreelancer(id: string, freelancerData: Partial<CreateFreelancerData>): Promise<Freelancer> {
    console.warn('API unavailable, freelancer update simulated');
    await addRandomDelay();
    
    const freelancerIndex = MOCK_FREELANCERS.findIndex(f => f.id === id);
    if (freelancerIndex === -1) {
      throw new Error(`Freelancer with id ${id} not found`);
    }
    
    const updatedFreelancer = {
      ...MOCK_FREELANCERS[freelancerIndex],
      ...freelancerData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_FREELANCERS[freelancerIndex] = updatedFreelancer;
    return updatedFreelancer;
  }

  // Delete a freelancer profile (mock implementation)
  static async deleteFreelancer(id: string): Promise<void> {
    console.warn('API unavailable, freelancer deletion simulated');
    await addRandomDelay();
    
    const freelancerIndex = MOCK_FREELANCERS.findIndex(f => f.id === id);
    if (freelancerIndex === -1) {
      throw new Error(`Freelancer with id ${id} not found`);
    }
    
    MOCK_FREELANCERS.splice(freelancerIndex, 1);
  }

  // Get freelancers by availability status
  static async getFreelancersByAvailability(availability: string): Promise<Freelancer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/availability/${availability}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancers by availability:', error);
      await addRandomDelay();
      return MOCK_FREELANCERS.filter(f => f.availability === availability);
    }
  }

  // Get freelancers by role
  static async getFreelancersByRole(role: string): Promise<Freelancer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/role/${role}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancers by role:', error);
      await addRandomDelay();
      return MOCK_FREELANCERS.filter(f => 
        f.role.toLowerCase().includes(role.toLowerCase())
      );
    }
  }

  // Search freelancers
  static async searchFreelancers(query: string): Promise<Freelancer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancer search:', error);
      await addRandomDelay();
      const search = query.toLowerCase();
      return MOCK_FREELANCERS.filter(f =>
        f.name.toLowerCase().includes(search) ||
        f.role.toLowerCase().includes(search) ||
        f.bio.toLowerCase().includes(search) ||
        f.skills.some(skill => skill.toLowerCase().includes(search))
      );
    }
  }

  // Get freelancers by skills
  static async getFreelancersBySkills(skills: string[]): Promise<Freelancer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/skills?skills=${skills.join(',')}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancers by skills:', error);
      await addRandomDelay();
      return MOCK_FREELANCERS.filter(f =>
        skills.some(skill =>
          f.skills.some(fSkill => fSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
  }

  // Get freelancer statistics (mock implementation)
  static async getFreelancerStats(): Promise<{
    total: number;
    available: number;
    limited: number;
    unavailable: number;
    averageRate: number;
  }> {
    console.warn('API unavailable, using mock data for freelancer stats');
    await addRandomDelay();
    
    const stats = {
      total: MOCK_FREELANCERS.length,
      available: MOCK_FREELANCERS.filter(f => f.availability === 'Available').length,
      limited: MOCK_FREELANCERS.filter(f => f.availability === 'Limited').length,
      unavailable: MOCK_FREELANCERS.filter(f => f.availability === 'Unavailable').length,
      averageRate: MOCK_FREELANCERS.reduce((sum, f) => sum + f.rate, 0) / MOCK_FREELANCERS.length,
    };
    
    return stats;
  }

  // Get popular skills (mock implementation)
  static async getPopularSkills(): Promise<{ skill: string; count: number }[]> {
    console.warn('API unavailable, using mock data for popular skills');
    await addRandomDelay();
    
    const skillCounts: Record<string, number> = {};
    MOCK_FREELANCERS.forEach(freelancer => {
      freelancer.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Get freelancers by location
  static async getFreelancersByLocation(location: string): Promise<Freelancer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Freelancer[]>>(`/freelancers/location/${encodeURIComponent(location)}`);
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for freelancers by location:', error);
      await addRandomDelay();
      return MOCK_FREELANCERS.filter(f =>
        f.location.toLowerCase().includes(location.toLowerCase())
      );
    }
  }

  // Rate a freelancer (mock implementation)
  static async rateFreelancer(id: string, rating: number, review?: string): Promise<Freelancer> {
    console.warn('API unavailable, freelancer rating simulated');
    await addRandomDelay();
    
    const freelancerIndex = MOCK_FREELANCERS.findIndex(f => f.id === id);
    if (freelancerIndex === -1) {
      throw new Error(`Freelancer with id ${id} not found`);
    }
    
    // In a real implementation, this would update the rating in the database
    console.log(`Rating freelancer ${id} with ${rating} stars${review ? ` and review: ${review}` : ''}`);
    
    return MOCK_FREELANCERS[freelancerIndex];
  }
}
