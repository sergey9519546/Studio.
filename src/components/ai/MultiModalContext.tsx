/**
 * MultiModalContext - Context aggregation across media types
 * Provides unified context management for Vision, Audio, and Document AI analysis
 */

import React, { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';
import { AudioAnalysisResult } from './AudioAIComponent';
import { DocumentAnalysisResult } from './DocumentAIComponent';
import { VisionAnalysisResult } from './VisionAIComponent';

// Context Types
export interface UnifiedContext {
  id: string;
  timestamp: Date;
  projectId?: string;
  mediaItems: MediaItem[];
  crossModalInsights: CrossModalInsight[];
  aggregatedMetadata: AggregatedMetadata;
  processingStatus: ProcessingStatus;
  relationships: ContextRelationship[];
  suggestions: AISuggestion[];
  summary: ContextSummary;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'audio' | 'document' | 'video';
  filename: string;
  analysisResult: VisionAnalysisResult | AudioAnalysisResult | DocumentAnalysisResult;
  tags: string[];
  confidence: number;
  timestamp: Date;
  processingTime: number;
  metadata: Record<string, any>;
}

export interface CrossModalInsight {
  id: string;
  type: 'theme' | 'entity' | 'sentiment' | 'temporal' | 'conceptual' | 'semantic';
  title: string;
  description: string;
  confidence: number;
  relatedMediaIds: string[];
  evidence: Evidence[];
  category: 'visual' | 'audio' | 'text' | 'mixed';
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface Evidence {
  source: string;
  type: 'text' | 'visual' | 'audio' | 'metadata';
  content: string;
  mediaId: string;
  timestamp: Date;
  confidence: number;
}

export interface AggregatedMetadata {
  totalFiles: number;
  fileTypes: Record<string, number>;
  timeSpan: {
    start: Date;
    end: Date;
    duration: number;
  };
  contentMetrics: {
    totalText: number;
    totalImages: number;
    totalAudio: number;
    totalWords: number;
    totalDuration: number;
  };
  qualityMetrics: {
    averageConfidence: number;
    processingEfficiency: number;
    coverage: number;
  };
}

export interface ProcessingStatus {
  overall: 'idle' | 'processing' | 'aggregating' | 'complete' | 'error';
  currentStep: string;
  progress: number;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
}

export interface ProcessingError {
  id: string;
  type: 'validation' | 'processing' | 'integration' | 'storage';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  mediaId?: string;
  contextId?: string;
}

export interface ProcessingWarning {
  id: string;
  type: 'compatibility' | 'quality' | 'performance' | 'accuracy';
  message: string;
  timestamp: Date;
  mediaId?: string;
  contextId?: string;
}

export interface ContextRelationship {
  id: string;
  type: 'temporal' | 'semantic' | 'thematic' | 'structural' | 'causal';
  sourceMediaId: string;
  targetMediaId: string;
  strength: number;
  description: string;
  metadata: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  type: 'content' | 'analysis' | 'organization' | 'insight' | 'action';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  relatedInsights: string[];
  actionable: boolean;
  estimatedImpact: string;
  timestamp: Date;
}

export interface ContextSummary {
  overview: string;
  keyFindings: string[];
  dominantThemes: string[];
  notablePatterns: string[];
  recommendations: string[];
  confidence: number;
  generatedAt: Date;
}

// Action Types
type MultiModalAction =
  | { type: 'ADD_MEDIA_ITEM'; payload: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_MEDIA_ITEM'; payload: MediaItem }
  | { type: 'ADD_CROSS_MODAL_INSIGHT'; payload: CrossModalInsight }
  | { type: 'SET_PROCESSING_STATUS'; payload: Partial<ProcessingStatus> }
  | { type: 'ADD_RELATIONSHIP'; payload: ContextRelationship }
  | { type: 'ADD_SUGGESTION'; payload: AISuggestion }
  | { type: 'AGGREGATE_CONTEXT'; payload: UnifiedContext }
  | { type: 'CLEAR_CONTEXT' }
  | { type: 'SET_ERROR'; payload: ProcessingError }
  | { type: 'CLEAR_ERRORS' };

// State Interface
interface MultiModalState {
  currentContext: UnifiedContext | null;
  mediaItems: MediaItem[];
  crossModalInsights: CrossModalInsight[];
  processingStatus: ProcessingStatus;
  relationships: ContextRelationship[];
  suggestions: AISuggestion[];
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: MultiModalState = {
  currentContext: null,
  mediaItems: [],
  crossModalInsights: [],
  processingStatus: {
    overall: 'idle',
    currentStep: '',
    progress: 0,
    errors: [],
    warnings: []
  },
  relationships: [],
  suggestions: [],
  isLoading: false,
  error: null
};

// Reducer
function multiModalReducer(state: MultiModalState, action: MultiModalAction): MultiModalState {
  switch (action.type) {
    case 'ADD_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: [...state.mediaItems, action.payload],
        processingStatus: {
          ...state.processingStatus,
          overall: 'processing',
          currentStep: 'Analyzing media items...',
          progress: Math.min(state.processingStatus.progress + 10, 95)
        }
      };

    case 'REMOVE_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: state.mediaItems.filter(item => item.id !== action.payload.id),
        currentContext: state.currentContext ? {
          ...state.currentContext,
          mediaItems: state.currentContext.mediaItems.filter(item => item.id !== action.payload.id)
        } : null
      };

    case 'UPDATE_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: state.mediaItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        currentContext: state.currentContext ? {
          ...state.currentContext,
          mediaItems: state.currentContext.mediaItems.map(item =>
            item.id === action.payload.id ? action.payload : item
          )
        } : null
      };

    case 'ADD_CROSS_MODAL_INSIGHT':
      return {
        ...state,
        crossModalInsights: [...state.crossModalInsights, action.payload],
        currentContext: state.currentContext ? {
          ...state.currentContext,
          crossModalInsights: [...state.currentContext.crossModalInsights, action.payload]
        } : null
      };

    case 'SET_PROCESSING_STATUS':
      return {
        ...state,
        processingStatus: {
          ...state.processingStatus,
          ...action.payload
        }
      };

    case 'ADD_RELATIONSHIP':
      return {
        ...state,
        relationships: [...state.relationships, action.payload],
        currentContext: state.currentContext ? {
          ...state.currentContext,
          relationships: [...state.currentContext.relationships, action.payload]
        } : null
      };

    case 'ADD_SUGGESTION':
      return {
        ...state,
        suggestions: [...state.suggestions, action.payload],
        currentContext: state.currentContext ? {
          ...state.currentContext,
          suggestions: [...state.currentContext.suggestions, action.payload]
        } : null
      };

    case 'AGGREGATE_CONTEXT':
      return {
        ...state,
        currentContext: action.payload,
        processingStatus: {
          ...state.processingStatus,
          overall: 'complete',
          currentStep: 'Context aggregation complete',
          progress: 100
        },
        isLoading: false
      };

    case 'CLEAR_CONTEXT':
      return {
        ...initialState
      };

    case 'SET_ERROR':
      return {
        ...state,
        processingStatus: {
          ...state.processingStatus,
          errors: [...state.processingStatus.errors, action.payload],
          overall: 'error'
        },
        isLoading: false,
        error: action.payload.message
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        processingStatus: {
          ...state.processingStatus,
          errors: []
        },
        error: null
      };

    default:
      return state;
  }
}

// Context
const MultiModalContext = createContext<{
  state: MultiModalState;
  dispatch: React.Dispatch<MultiModalAction>;
  addMediaItem: (item: MediaItem) => void;
  removeMediaItem: (id: string) => void;
  updateMediaItem: (item: MediaItem) => void;
  aggregateContext: () => Promise<void>;
  generateInsights: () => Promise<void>;
  clearContext: () => void;
  getContextSummary: () => ContextSummary | null;
  findRelationships: () => Promise<ContextRelationship[]>;
} | null>(null);

// Provider Component
export interface MultiModalProviderProps {
  children: ReactNode;
  projectId?: string;
  config?: MultiModalConfig;
}

export interface MultiModalConfig {
  enableCrossModalInsights: boolean;
  enableRelationshipDetection: boolean;
  enableSuggestionEngine: boolean;
  confidenceThreshold: number;
  maxMediaItems: number;
  enableRealTimeProcessing: boolean;
  aggregationStrategy: 'incremental' | 'batch' | 'hybrid';
}

const defaultConfig: MultiModalConfig = {
  enableCrossModalInsights: true,
  enableRelationshipDetection: true,
  enableSuggestionEngine: true,
  confidenceThreshold: 0.7,
  maxMediaItems: 100,
  enableRealTimeProcessing: false,
  aggregationStrategy: 'incremental'
};

export const MultiModalProvider: React.FC<MultiModalProviderProps> = ({
  children,
  projectId,
  config = {}
}) => {
  const [state, dispatch] = useReducer(multiModalReducer, initialState);
  const finalConfig = { ...defaultConfig, ...config };

  // Action Creators
  const addMediaItem = useCallback((item: MediaItem) => {
    if (state.mediaItems.length >= finalConfig.maxMediaItems) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          id: `error_${Date.now()}`,
          type: 'validation',
          message: `Maximum number of media items (${finalConfig.maxMediaItems}) reached`,
          severity: 'medium',
          timestamp: new Date()
        }
      });
      return;
    }
    dispatch({ type: 'ADD_MEDIA_ITEM', payload: item });
  }, [state.mediaItems.length, finalConfig.maxMediaItems]);

  const removeMediaItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_MEDIA_ITEM', payload: { id } });
  }, []);

  const updateMediaItem = useCallback((item: MediaItem) => {
    dispatch({ type: 'UPDATE_MEDIA_ITEM', payload: item });
  }, []);

  const aggregateContext = useCallback(async () => {
    if (state.mediaItems.length === 0) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          id: `error_${Date.now()}`,
          type: 'validation',
          message: 'No media items to aggregate',
          severity: 'high',
          timestamp: new Date()
        }
      });
      return;
    }

    dispatch({ type: 'SET_PROCESSING_STATUS', payload: { overall: 'aggregating', currentStep: 'Aggregating context...' } });

    try {
      // Simulate aggregation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aggregatedContext: UnifiedContext = {
        id: `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        projectId,
        mediaItems: state.mediaItems,
        crossModalInsights: state.crossModalInsights,
        aggregatedMetadata: calculateAggregatedMetadata(state.mediaItems),
        processingStatus: state.processingStatus,
        relationships: state.relationships,
        suggestions: state.suggestions,
        summary: generateContextSummary(state.mediaItems, state.crossModalInsights)
      };

      dispatch({ type: 'AGGREGATE_CONTEXT', payload: aggregatedContext });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          id: `error_${Date.now()}`,
          type: 'processing',
          message: error instanceof Error ? error.message : 'Context aggregation failed',
          severity: 'critical',
          timestamp: new Date()
        }
      });
    }
  }, [state.mediaItems, state.crossModalInsights, state.relationships, state.suggestions, projectId]);

  const generateInsights = useCallback(async () => {
    if (state.mediaItems.length < 2) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          id: `error_${Date.now()}`,
          type: 'validation',
          message: 'At least 2 media items required for cross-modal insights',
          severity: 'medium',
          timestamp: new Date()
        }
      });
      return;
    }

    dispatch({ type: 'SET_PROCESSING_STATUS', payload: { currentStep: 'Generating cross-modal insights...' } });

    try {
      // Simulate insight generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const insights = await generateCrossModalInsights(state.mediaItems);
      insights.forEach(insight => {
        dispatch({ type: 'ADD_CROSS_MODAL_INSIGHT', payload: insight });
      });

      const relationships = await detectRelationships(state.mediaItems);
      relationships.forEach(relationship => {
        dispatch({ type: 'ADD_RELATIONSHIP', payload: relationship });
      });

      const suggestions = await generateSuggestions(state.mediaItems, insights);
      suggestions.forEach(suggestion => {
        dispatch({ type: 'ADD_SUGGESTION', payload: suggestion });
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          id: `error_${Date.now()}`,
          type: 'processing',
          message: error instanceof Error ? error.message : 'Insight generation failed',
          severity: 'high',
          timestamp: new Date()
        }
      });
    }
  }, [state.mediaItems]);

  const clearContext = useCallback(() => {
    dispatch({ type: 'CLEAR_CONTEXT' });
  }, []);

  const getContextSummary = useCallback((): ContextSummary | null => {
    return state.currentContext?.summary || null;
  }, [state.currentContext]);

  const findRelationships = useCallback(async (): Promise<ContextRelationship[]> => {
    // Simulate relationship detection
    await new Promise(resolve => setTimeout(resolve, 1000));
    return state.relationships;
  }, [state.relationships]);

  const value = {
    state,
    dispatch,
    addMediaItem,
    removeMediaItem,
    updateMediaItem,
    aggregateContext,
    generateInsights,
    clearContext,
    getContextSummary,
    findRelationships
  };

  return (
    <MultiModalContext.Provider value={value}>
      {children}
    </MultiModalContext.Provider>
  );
};

// Hook
export const useMultiModal = () => {
  const context = useContext(MultiModalContext);
  if (!context) {
    throw new Error('useMultiModal must be used within a MultiModalProvider');
  }
  return context;
};

// Helper Functions
function calculateAggregatedMetadata(mediaItems: MediaItem[]): AggregatedMetadata {
  const fileTypes: Record<string, number> = {};
  let totalText = 0;
  let totalImages = 0;
  let totalAudio = 0;
  let totalWords = 0;
  let totalDuration = 0;
  let earliestTime = new Date();
  let latestTime = new Date(0);

  mediaItems.forEach(item => {
    // Count file types
    fileTypes[item.type] = (fileTypes[item.type] || 0) + 1;

    // Calculate content metrics based on type
    switch (item.type) {
      case 'image':
        totalImages++;
        break;
      case 'audio':
        totalAudio++;
        if (item.analysisResult.metadata && typeof item.analysisResult.metadata === 'object' && 'duration' in item.analysisResult.metadata) {
          totalDuration += (item.analysisResult.metadata as any).duration;
        }
        break;
      case 'document':
        totalText++;
        if (item.analysisResult.metadata && typeof item.analysisResult.metadata === 'object' && 'wordCount' in item.analysisResult.metadata) {
          totalWords += (item.analysisResult.metadata as any).wordCount;
        }
        break;
    }

    // Track time span
    const itemTime = item.timestamp;
    if (itemTime < earliestTime) {
      earliestTime = itemTime;
    }
    if (itemTime > latestTime) {
      latestTime = itemTime;
    }
  });

  const timeSpanDuration = latestTime.getTime() - earliestTime.getTime();
  
  // Calculate quality metrics
  const totalConfidence = mediaItems.reduce((sum, item) => sum + item.confidence, 0);
  const averageConfidence = mediaItems.length > 0 ? totalConfidence / mediaItems.length : 0;
  const processingEfficiency = mediaItems.length > 0 
    ? mediaItems.reduce((sum, item) => sum + (1 / (item.processingTime + 1)), 0) / mediaItems.length 
    : 0;
  const coverage = Math.min(mediaItems.length / 10, 1); // Assuming max 10

  return {
    totalFiles: mediaItems.length,
    fileTypes,
    timeSpan: {
      start: earliestTime,
      end: latestTime,
      duration: timeSpanDuration
    },
    contentMetrics: {
      totalText,
      totalImages,
      totalAudio,
      totalWords,
      totalDuration
    },
    qualityMetrics: {
      averageConfidence,
      processingEfficiency,
      coverage
    }
  };
}

function generateContextSummary(mediaItems: MediaItem[], insights: CrossModalInsight[]): ContextSummary {
  const themes = insights
    .filter(i => i.type === 'theme')
    .map(i => i.title);

  const patterns = insights
    .filter(i => i.type === 'conceptual' || i.type === 'semantic')
    .map(i => i.description);

  return {
    overview: `Context aggregated from ${mediaItems.length} media items with ${insights.length} cross-modal insights.`,
    keyFindings: insights.slice(0, 5).map(i => i.description),
    dominantThemes: themes.slice(0, 5),
    notablePatterns: patterns.slice(0, 3),
    recommendations: [
      'Review high-confidence insights for action items',
      'Consider temporal relationships between media items'
    ],
    confidence: insights.length > 0 
      ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length 
      : 0,
    generatedAt: new Date()
  };
}

async function generateCrossModalInsights(mediaItems: MediaItem[]): Promise<CrossModalInsight[]> {
  // Simulate insight generation
  const insights: CrossModalInsight[] = [];
  
  if (mediaItems.length >= 2) {
    insights.push({
      id: `insight_${Date.now()}_1`,
      type: 'theme',
      title: 'Common Theme Detected',
      description: 'Multiple media items share similar thematic elements.',
      confidence: 0.75,
      relatedMediaIds: mediaItems.slice(0, 2).map(m => m.id),
      evidence: [],
      category: 'mixed',
      impact: 'medium',
      timestamp: new Date()
    });
  }

  return insights;
}

async function detectRelationships(mediaItems: MediaItem[]): Promise<ContextRelationship[]> {
  const relationships: ContextRelationship[] = [];
  
  // Create temporal relationships between consecutive items
  for (let i = 0; i < mediaItems.length - 1; i++) {
    relationships.push({
      id: `rel_${Date.now()}_${i}`,
      type: 'temporal',
      sourceMediaId: mediaItems[i].id,
      targetMediaId: mediaItems[i + 1].id,
      strength: 0.8,
      description: 'Sequential relationship',
      metadata: {}
    });
  }

  return relationships;
}

async function generateSuggestions(
  mediaItems: MediaItem[], 
  insights: CrossModalInsight[]
): Promise<AISuggestion[]> {
  const suggestions: AISuggestion[] = [];

  if (mediaItems.length > 0) {
    suggestions.push({
      id: `suggestion_${Date.now()}_1`,
      type: 'analysis',
      title: 'Deep Analysis Available',
      description: 'Consider running deeper analysis on high-confidence items.',
      priority: 'medium',
      confidence: 0.7,
      relatedInsights: insights.slice(0, 2).map(i => i.id),
      actionable: true,
      estimatedImpact: 'Improved understanding of cross-modal relationships',
      timestamp: new Date()
    });
  }

  return suggestions;
}
