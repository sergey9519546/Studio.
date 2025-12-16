/**
 * Enhanced Mock Data Generators for Testing
 * Provides comprehensive mock data for various testing scenarios
 * 
 * This module provides a comprehensive set of mock data generators for testing
 * various components and functionality throughout the application.
 */

import {
  ApiError,
  Assignment,
  Freelancer,
  FreelancerStatus,
  MoodboardItem,
  Priority,
  Project,
  ProjectStatus,
  User
} from '../types';

// User Mock Data Generators
export function generateMockUser(overrides: Partial<User> = {}): User {
  const id = `user_${Math.random().toString(36).substr(2, 9)}`;
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  const user: User = {
    id,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    contactInfo: `user${Math.floor(Math.random() * 1000)}@example.com`,
    role: 'Manager',
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80`
  };

  return { ...user, ...overrides };
}

// Project Mock Data Generators
export function generateMockProject(overrides: Partial<Project> = {}): Project {
  const projectNames = [
    'E-commerce Platform Redesign',
    'Mobile App Development',
    'Brand Identity Creation',
    'Website Development',
    'Marketing Campaign Design',
    'UI/UX Enhancement',
    'Digital Transformation',
    'Content Management System',
    'Social Media Strategy',
    'Product Launch Campaign'
  ];

  const clientNames = [
    'TechStart Inc',
    'Creative Agency Ltd',
    'Digital Solutions Co',
    'Innovation Labs',
    'Modern Business Group',
    'Future Systems',
    'Global Enterprises',
    'NextGen Technologies',
    'Smart Solutions Inc',
    'Advanced Dynamics'
  ];

  const id = `proj_${Math.random().toString(36).substr(2, 9)}`;
  const projectName = projectNames[Math.floor(Math.random() * projectNames.length)];
  const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];

  const project: Project = {
    id,
    name: projectName,
    clientName,
    description: `A comprehensive project focused on ${projectName.toLowerCase()} for ${clientName}. This project involves multiple stakeholders and requires careful coordination to achieve the desired outcomes.`,
    status: getRandomEnumValue(ProjectStatus),
    priority: getRandomEnumValue(Priority),
    dueDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: Math.floor(Math.random() * 50000) + 10000,
    roleRequirements: [
      {
        id: `req_${Math.random().toString(36).substr(2, 5)}`,
        role: 'designer',
        count: 1,
        filled: 0,
        skillsRequired: ['UI/UX', 'Figma', 'Adobe Creative Suite']
      },
      {
        id: `req_${Math.random().toString(36).substr(2, 5)}`,
        role: 'developer',
        count: 1,
        filled: 0,
        skillsRequired: ['React', 'TypeScript', 'Node.js']
      }
    ],
    tags: ['design', 'development', 'strategy']
  };

  return { ...project, ...overrides };
}

// Freelancer Mock Data Generators
export function generateMockFreelancer(overrides: Partial<Freelancer> = {}): Freelancer {
  const specializations = [
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Graphic Design',
    'Brand Identity',
    'Digital Marketing',
    'Content Writing',
    'Video Production'
  ];

  const skills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision',
    'UI/UX', 'Wireframing', 'Prototyping',
    'HTML', 'CSS', 'SASS', 'Less',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'
  ];

  const id = `freelancer_${Math.random().toString(36).substr(2, 9)}`;
  const firstNames = ['Sarah', 'Michael', 'Jessica', 'David', 'Emma', 'James', 'Olivia', 'Robert'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson'];

  const freelancer: Freelancer = {
    id,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    contactInfo: `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}${Math.floor(Math.random() * 1000)}@freelancer.com`,
    role: specializations[Math.floor(Math.random() * specializations.length)],
    bio: 'Experienced professional with a passion for creating exceptional digital experiences.',
    skills: Array.from(new Set(
      Array.from({ length: Math.floor(Math.random() * 8) + 3 }, () => 
        skills[Math.floor(Math.random() * skills.length)]
      )
    )),
    rate: Math.floor(Math.random() * 100) + 50,
    currency: 'USD',
    timezone: 'UTC-5',
    status: getRandomEnumValue(FreelancerStatus),
    utilization: Math.floor(Math.random() * 100),
    avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80`
  };

  return { ...freelancer, ...overrides };
}

// Assignment Mock Data Generators
export function generateMockAssignment(overrides: Partial<Assignment> = {}): Assignment {
  const id = `assignment_${Math.random().toString(36).substr(2, 9)}`;
  const freelancer = generateMockFreelancer();

  const assignment: Assignment = {
    id,
    projectId: `proj_${Math.random().toString(36).substr(2, 9)}`,
    freelancerId: freelancer.id,
    role: 'developer',
    startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    allocation: Math.floor(Math.random() * 100) + 10,
    status: Math.random() > 0.5 ? 'Confirmed' : 'Tentative',
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...assignment, ...overrides };
}

// Moodboard Mock Data Generators
export function generateMockMoodboardItem(overrides: Partial<MoodboardItem> = {}): MoodboardItem {
  const categories = ['image', 'video', 'gif'] as const;
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  const id = `mood_${Math.random().toString(36).substr(2, 9)}`;
  
  const moodboardItem: MoodboardItem = {
    id,
    projectId: `proj_${Math.random().toString(36).substr(2, 9)}`,
    type: category,
    url: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=400&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=200&h=200&fit=crop',
    caption: 'Inspiration piece for the project moodboard',
    tags: ['inspiration', 'design', 'creative'],
    moods: ['modern', 'professional', 'creative'],
    colors: ['#6366f1', '#8b5cf6', '#06b6d4'],
    isFavorite: Math.random() > 0.7,
    status: 'ready',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...moodboardItem, ...overrides };
}

// Helper function to get random enum value
function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj as Record<string, T[keyof T]>) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

// Batch generators for testing
export function generateMockUsers(count: number = 5): User[] {
  return Array.from({ length: count }, () => generateMockUser());
}

export function generateMockProjects(count: number = 5): Project[] {
  return Array.from({ length: count }, () => generateMockProject());
}

export function generateMockFreelancers(count: number = 10): Freelancer[] {
  return Array.from({ length: count }, () => generateMockFreelancer());
}

export function generateMockAssignments(count: number = 5): Assignment[] {
  return Array.from({ length: count }, () => generateMockAssignment());
}

export function generateMockMoodboardItems(count: number = 10): MoodboardItem[] {
  return Array.from({ length: count }, () => generateMockMoodboardItem());
}

// Error scenarios for testing
export function generateMockErrorScenario(type: 'network' | 'validation' | 'permission' | 'not-found'): ApiError {
  switch (type) {
    case 'network':
      return {
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        details: { status: 0, statusText: 'Network Error' },
        timestamp: new Date().toISOString(),
        path: '/api/test'
      };
    case 'validation':
      return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { 
          errors: [
            { field: 'email', message: 'Invalid email format' },
            { field: 'name', message: 'Name is required' }
          ]
        },
        timestamp: new Date().toISOString(),
        path: '/api/users'
      };
    case 'permission':
      return {
        code: 'PERMISSION_DENIED',
        message: 'Insufficient permissions to perform this action',
        details: { requiredRole: 'Admin', userRole: 'Viewer' },
        timestamp: new Date().toISOString(),
        path: '/api/admin/users'
      };
    case 'not-found':
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: { resourceType: 'User', resourceId: '123' },
        timestamp: new Date().toISOString(),
        path: '/api/users/123'
      };
    default:
      return {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        timestamp: new Date().toISOString(),
        path: '/api/test'
      };
  }
}

// Performance testing data generators
export function generateLargeDataset<T>(
  generator: () => T, 
  count: number = 1000
): T[] {
  return Array.from({ length: count }, generator);
}

// Data caching utilities for performance
const cache = new Map<string, unknown>();

export function getCachedData<T>(key: string, generator: () => T): T {
  if (cache.has(key)) {
    return cache.get(key) as T;
  }
  
  const data = generator();
  cache.set(key, data);
  return data;
}

export function clearCache(): void {
  cache.clear();
}

// Integration test helpers
export function createMockApiResponse<T>(data: T, success: boolean = true) {
  return {
    data: success ? data : undefined,
    success,
    error: success ? undefined : generateMockErrorScenario('network'),
    meta: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    }
  };
}

// Plugin integration test helpers
export function generatePluginTestScenarios() {
  return {
    successfulInstallation: {
      plugin: {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        description: 'A test plugin for integration testing',
        author: 'Test Author',
        category: 'ui-enhancement' as const,
        enabled: false,
        installed: false,
        dependencies: [],
        permissions: [],
        metadata: {
          entryPoint: './test-plugin.js',
          manifest: {},
          size: 102400,
          checksum: 'sha256:test123',
          compatibleVersions: ['1.0.0'],
          tags: ['test']
        },
        hooks: {},
        lifecycle: {
          state: 'pending' as const,
          retryCount: 0,
          maxRetries: 3
        }
      },
      expectedResult: 'success'
    },
    permissionDenied: {
      plugin: {
        id: 'restricted-plugin',
        name: 'Restricted Plugin',
        version: '1.0.0',
        description: 'A plugin requiring special permissions',
        author: 'Restricted Author',
        category: 'system' as const,
        enabled: false,
        installed: false,
        dependencies: [],
        permissions: [
          {
            type: 'filesystem',
            scope: '/system',
            description: 'Access to system files',
            granted: false
          }
        ],
        metadata: {
          entryPoint: './restricted-plugin.js',
          manifest: {},
          size: 102400,
          checksum: 'sha256:restricted123',
          compatibleVersions: ['1.0.0'],
          tags: ['restricted']
        },
        hooks: {},
        lifecycle: {
          state: 'pending' as const,
          retryCount: 0,
          maxRetries: 3
        }
      },
      expectedResult: 'permission-denied'
    }
  };
}
