import { apiClient } from './index';

export interface WorkspaceOverview {
  counts: {
    projects: number;
    freelancers: number;
    assignments: number;
  };
  financials: {
    totalBudget: number;
  };
  projectsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface AnalysisSection {
  title: string;
  content: string;
  insights: string[];
  recommendations: string[];
}

export interface WorkspaceAnalysis {
  timestamp: string;
  sections: AnalysisSection[];
  summary: string;
}

export const AnalysisAPI = {
  getOverview: async () => {
    const response = await apiClient.get<WorkspaceOverview>('/analysis/v1/overview');
    return response.data;
  },

  getWorkloadAnalysis: async () => {
    const response = await apiClient.get<WorkspaceAnalysis>('/analysis/v1/workload');
    return response.data;
  },

  getProfitabilityAnalysis: async () => {
    const response = await apiClient.get<WorkspaceAnalysis>('/analysis/v1/profitability');
    return response.data;
  }
};
