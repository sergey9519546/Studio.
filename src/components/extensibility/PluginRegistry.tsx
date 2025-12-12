/**
 * PluginRegistry - Plugin registration and discovery system
 * Provides plugin discovery, registration, and marketplace functionality
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Button } from '../design/Button';
import { LiquidGlassContainer } from '../design/LiquidGlassContainer';
import { 
  Search, 
  Star, 
  Download, 
  Filter,
  Grid,
  List,
  ExternalLink,
  Clock,
  TrendingUp,
  Award,
  Users,
  Tag,
  BookOpen
} from 'lucide-react';
import { Plugin, PluginCategory } from './PluginManager';

// Registry Types
export interface PluginRegistryEntry {
  id: string;
  plugin: Plugin;
  registryMetadata: {
    verified: boolean;
    featured: boolean;
    trending: boolean;
    latestVersion: string;
    compatibilityScore: number;
    communityRating: number;
    downloadCount: number;
    reviews: PluginReview[];
    categories: string[];
    publisher: string;
    license: string;
    supportUrl?: string;
    documentation?: string;
    screenshots: string[];
    videoUrl?: string;
    installationCount: number;
    lastUpdated: Date;
    createdAt: Date;
  };
}

export interface PluginReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

export interface RegistryFilter {
  category?: PluginCategory | 'all';
  rating?: number;
  price?: 'free' | 'paid' | 'freemium' | 'all';
  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  compatibility?: string;
  license?: string;
  searchQuery?: string;
  sortBy: 'relevance' | 'rating' | 'downloads' | 'newest' | 'updated';
  sortOrder: 'asc' | 'desc';
}

export interface RegistryState {
  entries: PluginRegistryEntry[];
  featuredEntries: PluginRegistryEntry[];
  trendingEntries: PluginRegistryEntry[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalEntries: number;
  };
  filters: RegistryFilter;
  viewMode: 'grid' | 'list';
  selectedEntry: PluginRegistryEntry | null;
}

export interface RegistryContext {
  state: RegistryState;
  dispatch: React.Dispatch<RegistryAction>;
  searchPlugins: (query: string) => Promise<void>;
  applyFilters: (filters: Partial<RegistryFilter>) => void;
  loadFeatured: () => Promise<void>;
  loadTrending: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  getPluginById: (id: string) => Promise<PluginRegistryEntry | null>;
  installFromRegistry: (entry: PluginRegistryEntry) => Promise<void>;
  ratePlugin: (entryId: string, rating: number, review: string) => Promise<void>;
  bookmarkPlugin: (entryId: string) => Promise<void>;
  sharePlugin: (entryId: string) => Promise<void>;
}

// Action Types
type RegistryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ENTRIES'; payload: PluginRegistryEntry[] }
  | { type: 'SET_FEATURED_ENTRIES'; payload: PluginRegistryEntry[] }
  | { type: 'SET_TRENDING_ENTRIES'; payload: PluginRegistryEntry[] }
  | { type: 'SET_PAGINATION'; payload: Partial<RegistryState['pagination']> }
  | { type: 'SET_FILTERS'; payload: Partial<RegistryFilter> }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SELECT_ENTRY'; payload: PluginRegistryEntry | null }
  | { type: 'ADD_REVIEW'; payload: { entryId: string; review: PluginReview } };

// Initial State
const initialState: RegistryState = {
  entries: [],
  featuredEntries: [],
  trendingEntries: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalEntries: 0
  },
  filters: {
    sortBy: 'relevance',
    sortOrder: 'desc'
  },
  viewMode: 'grid',
  selectedEntry: null
};

// Reducer
function registryReducer(state: RegistryState, action: RegistryAction): RegistryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_ENTRIES':
      return {
        ...state,
        entries: action.payload,
        loading: false
      };

    case 'SET_FEATURED_ENTRIES':
      return {
        ...state,
        featuredEntries: action.payload
      };

    case 'SET_TRENDING_ENTRIES':
      return {
        ...state,
        trendingEntries: action.payload
      };

    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 } // Reset to first page when filters change
      };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'SELECT_ENTRY':
      return { ...state, selectedEntry: action.payload };

    case 'ADD_REVIEW':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.entryId
            ? {
                ...entry,
                registryMetadata: {
                  ...entry.registryMetadata,
                  reviews: [...entry.registryMetadata.reviews, action.payload.review],
                  communityRating: calculateNewRating(entry.registryMetadata.reviews, action.payload.review)
                }
              }
            : entry
        )
      };

    default:
      return state;
  }
}

// Context
const RegistryContext = createContext<RegistryContext | null>(null);

// Provider Component
export interface PluginRegistryProviderProps {
  children: ReactNode;
  registryUrl?: string;
  apiKey?: string;
  onPluginInstall?: (plugin: Plugin) => void;
  onPluginError?: (error: Error) => void;
}

export const PluginRegistryProvider: React.FC<PluginRegistryProviderProps> = ({
  children,
  registryUrl = 'https://registry.plugins.liquidglass.dev',
  apiKey,
  onPluginInstall,
  onPluginError
}) => {
  const [state, dispatch] = useReducer(registryReducer, initialState);

  // Initialize registry
  useEffect(() => {
    loadFeatured();
    loadTrending();
    searchPlugins('');
  }, []);

  // Plugin Management Functions
  const searchPlugins = useCallback(async (query: string = '') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call to plugin registry
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEntries: PluginRegistryEntry[] = [
        {
          id: 'advanced-theme-manager',
          plugin: {
            id: 'advanced-theme-manager',
            name: 'Advanced Theme Manager Pro',
            version: '2.1.0',
            description: 'Professional theme management with advanced animations, custom themes, and seamless switching',
            author: 'ThemeCraft Studios',
            category: 'ui-enhancement',
            enabled: false,
            installed: false,
            dependencies: ['ui-core', 'animation-engine'],
            permissions: [
              { type: 'ui', scope: 'theme-change', description: 'Modify application theme', granted: false },
              { type: 'data', scope: 'theme-storage', description: 'Store theme preferences', granted: false },
              { type: 'filesystem', scope: 'theme-import', description: 'Import custom themes', granted: false }
            ],
            metadata: {
              entryPoint: './theme-manager-pro.js',
              manifest: { main: './theme-manager-pro.js', name: 'Advanced Theme Manager Pro' },
              size: 512000,
              checksum: 'sha256:abc123def456',
              compatibleVersions: ['1.0.0', '1.1.0', '2.0.0'],
              installationDate: undefined,
              rating: 4.9,
              downloads: 25420,
              tags: ['theme', 'ui', 'customization', 'animation', 'premium'],
              changelog: ['Enhanced animation engine', 'New theme templates', 'Performance optimizations', 'Mobile responsive themes']
            },
            hooks: {
              onInit: () => console.log('Advanced Theme Manager Pro initialized'),
              onEnable: () => console.log('Advanced Theme Manager Pro enabled')
            },
            lifecycle: {
              state: 'pending',
              retryCount: 0,
              maxRetries: 3
            }
          },
          registryMetadata: {
            verified: true,
            featured: true,
            trending: true,
            latestVersion: '2.1.0',
            compatibilityScore: 0.98,
            communityRating: 4.9,
            downloadCount: 25420,
            reviews: [
              {
                id: 'review_1',
                author: 'DeveloperPro',
                rating: 5,
                title: 'Amazing theme system!',
                content: 'This plugin completely transformed our app\'s appearance. The animations are buttery smooth.',
                date: new Date('2024-02-15'),
                helpful: 24,
                verified: true
              },
              {
                id: 'review_2',
                author: 'DesignGuru',
                rating: 5,
                title: 'Best theme manager available',
                content: 'Professional quality with extensive customization options. Highly recommended!',
                date: new Date('2024-02-10'),
                helpful: 18,
                verified: true
              }
            ],
            categories: ['UI Enhancement', 'Customization'],
            publisher: 'ThemeCraft Studios',
            license: 'Premium',
            supportUrl: 'https://themecraft.studio/support',
            documentation: 'https://docs.themecraft.studio',
            screenshots: ['/screenshots/theme-1.png', '/screenshots/theme-2.png'],
            installationCount: 25420,
            lastUpdated: new Date('2024-02-20'),
            createdAt: new Date('2023-08-15')
          }
        },
        {
          id: 'smart-analytics-dashboard',
          plugin: {
            id: 'smart-analytics-dashboard',
            name: 'Smart Analytics Dashboard',
            version: '1.8.2',
            description: 'Real-time analytics dashboard with AI-powered insights and customizable visualizations',
            author: 'DataVision Analytics',
            category: 'data-analysis',
            enabled: false,
            installed: false,
            dependencies: ['ai-core', 'chart-engine'],
            permissions: [
              { type: 'data', scope: 'analytics-read', description: 'Read analytics data', granted: false },
              { type: 'network', scope: 'analytics-api', description: 'Access analytics APIs', granted: false }
            ],
            metadata: {
              entryPoint: './analytics-dashboard.js',
              manifest: { main: './analytics-dashboard.js', name: 'Smart Analytics Dashboard' },
              size: 768000,
              checksum: 'sha256:def456ghi789',
              compatibleVersions: ['1.5.0', '1.6.0', '1.7.0'],
              installationDate: undefined,
              rating: 4.7,
              downloads: 18930,
              tags: ['analytics', 'dashboard', 'visualization', 'ai', 'data'],
              changelog: ['New AI insights', 'Enhanced charts', 'Mobile optimization', 'Export improvements']
            },
            hooks: {
              onInit: () => console.log('Analytics Dashboard initialized')
            },
            lifecycle: {
              state: 'pending',
              retryCount: 0,
              maxRetries: 3
            }
          },
          registryMetadata: {
            verified: true,
            featured: false,
            trending: true,
            latestVersion: '1.8.2',
            compatibilityScore: 0.94,
            communityRating: 4.7,
            downloadCount: 18930,
            reviews: [
              {
                id: 'review_3',
                author: 'DataScientist',
                rating: 5,
                title: 'Incredible analytics power',
                content: 'The AI insights are game-changing for understanding user behavior.',
                date: new Date('2024-02-12'),
                helpful: 31,
                verified: true
              }
            ],
            categories: ['Data Analysis', 'Visualization'],
            publisher: 'DataVision Analytics',
            license: 'Freemium',
            supportUrl: 'https://datavision.io/support',
            screenshots: ['/screenshots/analytics-1.png', '/screenshots/analytics-2.png'],
            installationCount: 18930,
            lastUpdated: new Date('2024-02-18'),
            createdAt: new Date('2023-10-20')
          }
        }
      ];

      dispatch({ type: 'SET_ENTRIES', payload: mockEntries });
      dispatch({ type: 'SET_PAGINATION', payload: { 
        totalEntries: mockEntries.length, 
        totalPages: Math.ceil(mockEntries.length / initialState.pagination.pageSize) 
      } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load plugins' });
      if (onPluginError) {
        onPluginError(error instanceof Error ? error : new Error('Failed to load plugins'));
      }
    }
  }, [onPluginError]);

  const applyFilters = useCallback((filters: Partial<RegistryFilter>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    searchPlugins(state.filters.searchQuery || '');
  }, [state.filters.searchQuery]);

  const loadFeatured = useCallback(async () => {
    try {
      // Simulate loading featured plugins
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const featuredEntries = state.entries.filter(entry => entry.registryMetadata.featured);
      dispatch({ type: 'SET_FEATURED_ENTRIES', payload: featuredEntries });
    } catch (error) {
      console.error('Failed to load featured plugins:', error);
    }
  }, [state.entries]);

  const loadTrending = useCallback(async () => {
    try {
      // Simulate loading trending plugins
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const trendingEntries = state.entries.filter(entry => entry.registryMetadata.trending);
      dispatch({ type: 'SET_TRENDING_ENTRIES', payload: trendingEntries });
    } catch (error) {
      console.error('Failed to load trending plugins:', error);
    }
  }, [state.entries]);

  const loadPage = useCallback(async (page: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: page } });
    // In a real implementation, this would fetch the specific page from the API
    await searchPlugins(state.filters.searchQuery || '');
  }, [state.filters.searchQuery]);

  const getPluginById = useCallback(async (id: string): Promise<PluginRegistryEntry | null> => {
    const entry = state.entries.find(entry => entry.id === id);
    return entry || null;
  }, [state.entries]);

  const installFromRegistry = useCallback(async (entry: PluginRegistryEntry) => {
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (onPluginInstall) {
        onPluginInstall(entry.plugin);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Installation failed' });
      if (onPluginError) {
        onPluginError(error instanceof Error ? error : new Error('Installation failed'));
      }
    }
  }, [onPluginInstall, onPluginError]);

  const ratePlugin = useCallback(async (entryId: string, rating: number, review: string) => {
    try {
      const newReview: PluginReview = {
        id: `review_${Date.now()}`,
        author: 'Current User',
        rating,
        title: review.split(' ').slice(0, 5).join(' '),
        content: review,
        date: new Date(),
        helpful: 0,
        verified: true
      };

      dispatch({ type: 'ADD_REVIEW', payload: { entryId, review: newReview } });
      
      // In a real implementation, this would submit the review to the registry API
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit review' });
    }
  }, []);

  const bookmarkPlugin = useCallback(async (entryId: string) => {
    // Simulate bookmarking
    console.log(`Bookmarked plugin: ${entryId}`);
  }, []);

  const sharePlugin = useCallback(async (entryId: string) => {
    // Simulate sharing
    const url = `${registryUrl}/plugins/${entryId}`;
    if (navigator
