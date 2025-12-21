// Mock data for Projects and Freelancers when API is unavailable
import { Freelancer, Project } from '../types';

// Sample project data
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Brand Identity Refresh',
    description: 'Complete brand identity overhaul for tech startup',
    status: 'Active',
    client: 'TechCorp Inc.',
    budget: 15000,
    startDate: '2024-12-01',
    endDate: '2025-02-15',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
    tone: ['modern', 'tech-forward', 'professional']
  },
  {
    id: '2',
    title: 'Website Redesign',
    description: 'Complete website redesign for e-commerce platform',
    status: 'In Progress',
    client: 'ShopSmart',
    budget: 25000,
    startDate: '2024-11-15',
    endDate: '2025-03-01',
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-12-18T00:00:00Z',
    tone: ['modern', 'conversion-focused', 'user-friendly']
  },
  {
    id: '3',
    title: 'Product Launch Campaign',
    description: 'Multi-channel marketing campaign for new product launch',
    status: 'In Progress',
    client: 'InnovateLabs',
    budget: 35000,
    startDate: '2024-12-10',
    endDate: '2025-04-01',
    createdAt: '2024-12-10T00:00:00Z',
    updatedAt: '2024-12-19T00:00:00Z',
    tone: ['dynamic', 'innovative', 'impactful']
  },
  {
    id: '4',
    title: 'Mobile App UI Design',
    description: 'User interface design for fitness tracking mobile app',
    status: 'In Progress',
    client: 'FitLife',
    budget: 18000,
    startDate: '2024-11-20',
    endDate: '2025-01-31',
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2024-12-21T00:00:00Z',
    tone: ['clean', 'intuitive', 'motivating']
  },
  {
    id: '5',
    title: 'Corporate Video Production',
    description: 'Video production for company culture and values',
    status: 'Completed',
    client: 'Global Dynamics',
    budget: 22000,
    startDate: '2024-10-01',
    endDate: '2024-12-15',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    tone: ['engaging', 'authentic', 'professional']
  }
];

// Sample freelancer data
export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@freelancer.com',
    role: 'Senior UX Designer',
    bio: 'Passionate UX designer with 8+ years experience creating user-centered digital experiences.',
    skills: ['UX Design', 'UI Design', 'Figma', 'User Research', 'Prototyping'],
    portfolio: 'https://dribbble.com/sarahjohnson',
    rate: 85,
    availability: 'Available',
    location: 'New York, NY',
    rating: 4.9,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus.c@freelancer.com',
    role: 'Full Stack Developer',
    bio: 'Full-stack developer specializing in modern web technologies and scalable applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    portfolio: 'https://github.com/marcuschen',
    rate: 95,
    availability: 'Limited',
    location: 'San Francisco, CA',
    rating: 4.8,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@freelancer.com',
    role: 'Brand Designer',
    bio: 'Creative brand designer helping startups and established companies build memorable identities.',
    skills: ['Brand Identity', 'Logo Design', 'Packaging', 'Print Design', 'Art Direction'],
    portfolio: 'https://behance.net/elenarodriguez',
    rate: 75,
    availability: 'Available',
    location: 'Austin, TX',
    rating: 4.7,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-12-05T00:00:00Z'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@freelancer.com',
    role: 'Video Producer',
    bio: 'Award-winning video producer and director with expertise in commercial and narrative content.',
    skills: ['Video Production', 'Directing', 'Editing', 'Motion Graphics', 'Color Grading'],
    portfolio: 'https://vimeo.com/davidkim',
    rate: 110,
    availability: 'Available',
    location: 'Los Angeles, CA',
    rating: 4.9,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@freelancer.com',
    role: 'Copywriter',
    bio: 'Strategic copywriter specializing in digital marketing and brand storytelling.',
    skills: ['Copywriting', 'Content Strategy', 'SEO', 'Email Marketing', 'Social Media'],
    portfolio: 'https://lisawrites.com',
    rate: 65,
    availability: 'Limited',
    location: 'Chicago, IL',
    rating: 4.6,
    createdAt: '2024-04-12T00:00:00Z',
    updatedAt: '2024-10-25T00:00:00Z'
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to add some randomness to data
export const addRandomDelay = () => simulateApiDelay(Math.random() * 800 + 200);
