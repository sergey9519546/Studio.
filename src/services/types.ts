// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Project Types
export interface Project {
  id: string;
  title: string;
  client?: string;
  status: 'Active' | 'In Progress' | 'Blocked' | 'Completed' | 'Archived';
  description: string;
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
  description: string;
  tone?: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

// Moodboard Types
export interface MoodboardItem {
  id: string;
  url: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  uploadedAt: string;
  projectId: string;
  uploadedBy: string;
}

export interface CreateMoodboardItemData {
  url: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  projectId: string;
}

// Freelancer Types
export interface Freelancer {
  id: string;
  name: string;
  role: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  rate: number;
  skills: string[];
  location: string;
  rating: number;
  bio: string;
  portfolio?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFreelancerData {
  name: string;
  role: string;
  availability: 'Available' | 'Limited' | 'Unavailable';
  rate: number;
  skills: string[];
  location: string;
  bio: string;
  portfolio?: string;
  email?: string;
  phone?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'freelancer';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'freelancer';
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

export interface RealtimeUpdate {
  entity: 'project' | 'moodboard' | 'freelancer' | 'user';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
