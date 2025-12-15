/**
 * EnhancedAIOrchestrator - Unified AI orchestration service
 * Coordinates Vision, Audio, Document, and MultiModalContext components
 */

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';
import { MultiModalProvider } from './MultiModalContext';

// Orchestrator Types
export interface OrchestratorConfig {
  enableVision: boolean;
  enableAudio: boolean;
  enableDocument: boolean;
  enableMultiModal: boolean;
  autoProcess: boolean;
  batchProcessing: boolean;
  realTimeSync: boolean;
  confidenceThreshold: number;
  maxConcurrentProcesses: number;
  outputFormat: 'json' | 'xml' | 'csv' | 'markdown';
}

export interface ProcessingPipeline {
  id: string;
  name: string;
  description: string;
  steps: ProcessingStep[];
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  results: ProcessingResult[];
  errors: ProcessingError[];
}

export interface ProcessingStep {
  id: string;
  name: string;
  type: 'vision' | 'audio' | 'document' | 'aggregation' | 'analysis' | 'export';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

export interface ProcessingResult {
  id: string;
  type: 'vision' | 'audio' | 'document' | 'multimodal' | 'insight' | 'relationship';
  timestamp: Date;
  data: any;
  confidence: number;
  metadata: Record<string, any>;
}

export interface ProcessingError {
  id: string;
  stepId: string;
  type: 'validation' | 'processing' | 'integration' | 'export';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  context?: any;
}

export interface OrchestratorState {
  config: OrchestratorConfig;
  activePipelines: ProcessingPipeline[];
  completedPipelines: ProcessingPipeline[];
  isProcessing: boolean;
  currentPipeline: ProcessingPipeline | null;
  viewMode: 'grid' | 'list';
  filterStatus: 'all' | 'running' | 'completed' | 'error';
  selectedResults: string[];
  exportProgress: number;
}

// Action Types
type OrchestratorAction =
  | { type: 'SET_CONFIG'; payload: Partial<OrchestratorConfig> }
  | { type: 'START_PIPELINE'; payload: ProcessingPipeline }
  | { type: 'UPDATE_PIPELINE'; payload: { id: string; updates: Partial<ProcessingPipeline> } }
  | { type: 'COMPLETE_PIPELINE'; payload: { id: string; results: ProcessingResult[] } }
  | { type: 'FAIL_PIPELINE'; payload: { id: string; error: ProcessingError } }
  | { type: 'PAUSE_PIPELINE'; payload: { id: string } }
  | { type: 'RESUME_PIPELINE'; payload: { id: string } }
  | { type: 'CANCEL_PIPELINE'; payload: { id: string } }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SET_FILTER'; payload: 'all' | 'running' | 'completed' | 'error' }
  | { type: 'SELECT_RESULTS'; payload: string[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'EXPORT_RESULTS'; payload: { format: 'json' | 'xml' | 'csv' | 'markdown' } }
  | { type: 'SET_EXPORT_PROGRESS'; payload: number };

// Initial State
const initialState: OrchestratorState = {
  config: {
    enableVision: true,
    enableAudio: true,
    enableDocument: true,
    enableMultiModal: true,
    autoProcess: false,
    batchProcessing: false,
    realTimeSync: false,
    confidenceThreshold: 0.7,
    maxConcurrentProcesses: 3,
    outputFormat: 'json'
  },
  activePipelines: [],
  completedPipelines: [],
  isProcessing: false,
  currentPipeline: null,
  viewMode: 'grid',
  filterStatus: 'all',
  selectedResults: [],
  exportProgress: 0
};

// Reducer
function orchestratorReducer(state: OrchestratorState, action: OrchestratorAction): OrchestratorState {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };

    case 'START_PIPELINE':
      return {
        ...state,
        activePipelines: [...state.activePipelines, action.payload],
        currentPipeline: action.payload,
        isProcessing: true
      };

    case 'UPDATE_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.map(pipeline =>
          pipeline.id === action.payload.id 
            ? { ...pipeline, ...action.payload.updates }
            : pipeline
        ),
        currentPipeline: state.currentPipeline?.id === action.payload.id
          ? { ...state.currentPipeline, ...action.payload.updates }
          : state.currentPipeline
      };

    case 'COMPLETE_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.filter(p => p.id !== action.payload.id),
        completedPipelines: [
          ...state.completedPipelines,
          { ...state.activePipelines.find(p => p.id === action.payload.id)!, ...action.payload }
        ],
        isProcessing: state.activePipelines.length > 1,
        currentPipeline: state.activePipelines.length > 1 
          ? state.activePipelines.find(p => p.id !== action.payload.id) || null
          : null
      };

    case 'FAIL_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.map(pipeline =>
          pipeline.id === action.payload.id
            ? { ...pipeline, status: 'error', errors: [...pipeline.errors, action.payload.error] }
            : pipeline
        ),
        currentPipeline: state.currentPipeline?.id === action.payload.id
          ? { ...state.currentPipeline, status: 'error', errors: [...state.currentPipeline.errors, action.payload.error] }
          : state.currentPipeline
      };

    case 'PAUSE_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.map(pipeline =>
          pipeline.id === action.payload.id
            ? { ...pipeline, status: 'paused' }
            : pipeline
        )
      };

    case 'RESUME_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.map(pipeline =>
          pipeline.id === action.payload.id
            ? { ...pipeline, status: 'running' }
            : pipeline
        )
      };

    case 'CANCEL_PIPELINE':
      return {
        ...state,
        activePipelines: state.activePipelines.filter(p => p.id !== action.payload.id),
        isProcessing: state.activePipelines.length > 1,
        currentPipeline: state.currentPipeline?.id === action.payload.id
          ? state.activePipelines.find(p => p.id !== action.payload.id) || null
          : state.currentPipeline
      };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'SET_FILTER':
      return { ...state, filterStatus: action.payload };

    case 'SELECT_RESULTS':
      return { ...state, selectedResults: action.payload };

    case 'CLEAR_SELECTION':
      return { ...state, selectedResults: [] };

    case 'SET_EXPORT_PROGRESS':
      return { ...state, exportProgress: action.payload };

    default:
      return state;
  }
}

// Context
const OrchestratorContext = createContext<{
  state: OrchestratorState;
  dispatch: React.Dispatch<OrchestratorAction>;
  createPipeline: (name: string, description: string, files: File[]) => Promise<void>;
  executePipeline: (pipelineId: string) => Promise<void>;
  pausePipeline: (pipelineId: string) => void;
  resumePipeline: (pipelineId: string) => void;
  cancelPipeline: (pipelineId: string) => void;
  exportResults: (pipelineId: string, format: 'json' | 'xml' | 'csv' | 'markdown') => Promise<void>;
  clearCompletedPipelines: () => void;
  getPipelineResults: (pipelineId: string) => ProcessingResult[];
} | null>(null);

// Provider Component
export interface EnhancedAIOrchestratorProps {
  children: ReactNode;
  projectId?: string;
  config?: Partial<OrchestratorConfig>;
  onPipelineComplete?: (pipeline: ProcessingPipeline) => void;
  onError?: (error: ProcessingError) => void;
}

export const EnhancedAIOrchestrator: React.FC<EnhancedAIOrchestratorProps> = ({
  children,
  projectId,
  config = {},
  onPipelineComplete,
  onError
}) => {
  const [state, dispatch] = useReducer(orchestratorReducer, initialState);
  const finalConfig = { ...initialState.config, ...config };

  // Update config when props change
  useEffect(() => {
    dispatch({ type: 'SET_CONFIG', payload: finalConfig });
  }, [finalConfig]);

  // Action Creators
  const createPipeline = useCallback(async (name: string, description: string, files: File[]) => {
    const pipeline: ProcessingPipeline = {
      id: `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      status: 'idle',
      progress: 0,
      steps: [],
      results: [],
      errors: []
    };

    // Create processing steps based on file types
    files.forEach((file, index) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      let stepType: ProcessingStep['type'] = 'document';
      
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'mp4', 'avi', 'mov', 'mkv'].includes(fileExtension)) {
        stepType = 'vision';
      } else if (['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac', 'wma'].includes(fileExtension)) {
        stepType = 'audio';
      } else if (['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm', 'md'].includes(fileExtension)) {
        stepType = 'document';
      }

      pipeline.steps.push({
        id: `step_${index}`,
        name: `Process ${file.name}`,
        type: stepType,
        status: 'pending',
        progress: 0
      });
    });

    // Add aggregation step if multi-modal is enabled
    if (finalConfig.enableMultiModal && files.length > 1) {
      pipeline.steps.push({
        id: `step_aggregation`,
        name: 'Cross-Modal Analysis',
        type: 'aggregation',
        status: 'pending',
        progress: 0
      });
    }

    // Add export step
    pipeline.steps.push({
      id: `step_export`,
      name: 'Export Results',
      type: 'export',
      status: 'pending',
      progress: 0
    });

    dispatch({ type: 'START_PIPELINE', payload: pipeline });
  }, [finalConfig.enableMultiModal]);

  const executePipeline = useCallback(async (pipelineId: string) => {
    const pipeline = state.activePipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;

    dispatch({ type: 'UPDATE_PIPELINE', payload: { 
      id: pipelineId, 
      updates: { status: 'running', startTime: new Date() } 
    } });

    try {
      for (let i = 0; i < pipeline.steps.length; i++) {
        const step = pipeline.steps[i];
        
        // Update step status
        dispatch({ type: 'UPDATE_PIPELINE', payload: { 
          id: pipelineId, 
          updates: { 
            steps: pipeline.steps.map((s, index) => 
              index === i ? { ...s, status: 'running', startTime: new Date() } : s
            )
          } 
        } });

        // Execute step based on type
        await executeStep(step, pipelineId, i);
        
        // Update step as completed
        dispatch({ type: 'UPDATE_PIPELINE', payload: { 
          id: pipelineId, 
          updates: { 
            steps: pipeline.steps.map((s, index) => 
              index === i ? { ...s, status: 'completed', endTime: new Date(), progress: 100 } : s
            ),
            progress: ((i + 1) / pipeline.steps.length) * 100
          } 
        } });
      }

      // Mark pipeline as completed
      dispatch({ type: 'COMPLETE_PIPELINE', payload: { 
        id: pipelineId, 
        results: pipeline.results 
      } });

      if (onPipelineComplete) {
        const completedPipeline = state.activePipelines.find(p => p.id === pipelineId);
        if (completedPipeline) {
          onPipelineComplete(completedPipeline);
        }
      }
    } catch (error) {
      const errorObj: ProcessingError = {
        id: `error_${Date.now()}`,
        stepId: pipeline.steps[0].id,
        type: 'processing',
        message: error instanceof Error ? error.message : 'Pipeline execution failed',
        severity: 'critical',
        timestamp: new Date()
      };

      dispatch({ type: 'FAIL_PIPELINE', payload: { id: pipelineId, error: errorObj } });
      
      if (onError) {
        onError(errorObj);
      }
    }
  }, [state.activePipelines, onPipelineComplete, onError]);

  const executeStep = async (step: ProcessingStep, pipelineId: string, stepIndex: number) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Update progress during execution
    const progressInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_PIPELINE', payload: { 
        id: pipelineId, 
        updates: { 
          steps: state.activePipelines
            .find(p => p.id === pipelineId)
            ?.steps.map((s, index) => 
              index === stepIndex 
                ? { ...s, progress: Math.min(s.progress + 20, 95) }
                : s
            ) || []
        } 
      } });
    }, 500);

    // Simulate result based on step type
    let result: any;
    switch (step.type) {
      case 'vision':
        result = { type: 'vision', data: 'Mock vision analysis result', confidence: 0.85 };
        break;
      case 'audio':
        result = { type: 'audio', data: 'Mock audio analysis result', confidence: 0.78 };
        break;
      case 'document':
        result = { type: 'document', data: 'Mock document analysis result', confidence: 0.92 };
        break;
      case 'aggregation':
        result = { type: 'multimodal', data: 'Mock cross-modal analysis result', confidence: 0.75 };
        break;
      case 'export':
        result = { type: 'export', data: 'Mock export result', confidence: 1.0 };
        break;
      default:
        result = { type: 'unknown', data: 'Mock result', confidence: 0.5 };
    }

    clearInterval(progressInterval);

    // Add result to pipeline
    const pipeline = state.activePipelines.find(p => p.id === pipelineId);
    if (pipeline) {
      const newResult: ProcessingResult = {
        id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: result.type,
        timestamp: new Date(),
        data: result.data,
        confidence: result.confidence,
        metadata: { stepId: step.id, pipelineId }
      };

      dispatch({ type: 'UPDATE_PIPELINE', payload: { 
        id: pipelineId, 
        updates: { results: [...pipeline.results, newResult] } 
      } });
    }
  };

  const pausePipeline = useCallback((pipelineId: string) => {
    dispatch({ type: 'PAUSE_PIPELINE', payload: { id: pipelineId } });
  }, []);

  const resumePipeline = useCallback((pipelineId: string) => {
    dispatch({ type: 'RESUME_PIPELINE', payload: { id: pipelineId } });
  }, []);

  const cancelPipeline = useCallback((pipelineId: string) => {
    dispatch({ type: 'CANCEL_PIPELINE', payload: { id: pipelineId } });
  }, []);

  const exportResults = useCallback(async (pipelineId: string, format: 'json' | 'xml' | 'csv' | 'markdown') => {
    const pipeline = state.completedPipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;

    dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 0 });

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        dispatch({ type: 'SET_EXPORT_PROGRESS', payload: i });
      }

      // Generate export data based on format
      let exportData: string;
      switch (format) {
        case 'json':
          exportData = JSON.stringify(pipeline.results, null, 2);
          break;
        case 'csv':
          exportData = pipeline.results.map(r => `${r.id},${r.type},${r.confidence}`).join('\n');
          break;
        case 'markdown':
          exportData = pipeline.results.map(r => `## ${r.type}\n${r.data}`).join('\n\n');
          break;
        default:
          exportData = JSON.stringify(pipeline.results);
      }

      // Trigger download
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pipeline.name}_results.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 100 });
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [state.completedPipelines]);

  const clearCompletedPipelines = useCallback(() => {
    // Clear completed pipelines (would need a new action type)
  }, []);

  const getPipelineResults = useCallback((pipelineId: string): ProcessingResult[] => {
    const pipeline = [...state.activePipelines, ...state.completedPipelines].find(p => p.id === pipelineId);
    return pipeline?.results || [];
  }, [state.activePipelines, state.completedPipelines]);

  const value = {
    state,
    dispatch,
    createPipeline,
    executePipeline,
    pausePipeline,
    resumePipeline,
    cancelPipeline,
    exportResults,
    clearCompletedPipelines,
    getPipelineResults
  };

  return (
    <OrchestratorContext.Provider value={value}>
      <MultiModalProvider projectId={projectId}>
        {children}
      </MultiModalProvider>
    </OrchestratorContext.Provider>
  );
};

// Hook
export const useOrchestrator = () => {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error('useOrchestrator must be used within an EnhancedAIOrchestrator');
  }
  return context;
};

export default EnhancedAIOrchestrator;
