// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Project Types
export type ProjectStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'DELIVERED'
  | 'ARCHIVED';

export interface Project {
  id: string;
  title: string;
  name?: string;
  client?: string;
  clientName?: string;
  status: ProjectStatus;
  description?: string;
  tone?: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  client?: string;
  clientName?: string;
  description?: string;
  tone?: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
}

// Asset Types
export interface Asset {
  id: string;
  projectId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl?: string;
  url?: string;
  createdAt: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

// Moodboard Types
export interface MoodboardItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  caption?: string;
  source?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface CreateMoodboardItemData {
  url: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  caption?: string;
  projectId: string;
}

// Freelancer Types
export type FreelancerStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';

export interface Freelancer {
  id: string;
  name: string;
  role?: string;
  status?: FreelancerStatus;
  availability?: string;
  rate: number;
  skills: string[];
  location?: string;
  rating?: number;
  bio?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFreelancerData {
  name: string;
  role?: string;
  status?: FreelancerStatus;
  availability?: string;
  rate?: number;
  skills?: string[];
  location?: string;
  bio?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Additional utility types
export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: string | number | boolean | string[] | number[];
}
