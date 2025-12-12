/**
 * PluginAPI - Plugin API and hooks system
 * Provides standardized API for plugin development and integration
 */

import React, { createContext, useContext, useCallback, useEffect, ReactNode, useReducer } from 'react';
import { Button } from '../design/Button';
import { LiquidGlassContainer } from '../design/LiquidGlassContainer';
import { 
  Code, 
  Webhook, 
  Zap, 
  Shield, 
  Activity, 
  Database, 
  Globe, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Terminal
} from 'lucide-react';

// Plugin API Types
export interface PluginAPIConfig {
  version: string;
  capabilities: string[];
  permissions: string[];
  hooks: PluginHook[];
  endpoints: APIEndpoint[];
  middleware: APIMiddleware[];
  rateLimits: RateLimit[];
}

export interface PluginHook {
  name: string;
  type: 'before' | 'after' | 'around' | 'filter' | 'action';
  phase: 'init' | 'enable' | 'process' | 'disable' | 'destroy';
  priority: number;
  handler: string;
  params: Record<string, any>;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  params: EndpointParam[];
  response: ResponseSchema;
  middleware: string[];
  auth: boolean;
  rateLimit: number;
}

export interface EndpointParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
}

export interface ResponseSchema {
  type: 'json' | 'text' | 'blob' | 'stream';
  structure: Record<string, any>;
}

export interface APIMiddleware {
  name: string;
  type: 'auth' | 'validation' | 'transform' | 'cache' | 'logging';
  handler: string;
  config: Record<string, any>;
}

export interface RateLimit {
  endpoint: string;
  limit: number;
  window: number; // milliseconds
  strategy: 'sliding' | 'fixed' | 'token_bucket';
}

export interface PluginAPIState {
  config: PluginAPIConfig | null;
  hooks: PluginHook[];
  endpoints: APIEndpoint[];
  middleware: APIMiddleware[];
  rateLimits: RateLimit[];
  activeHooks: ActiveHook[];
  callHistory: APICall[];
  performance: APIPerformance;
  errorLog: APIError[];
  loading: boolean;
  error: string | null;
}

export interface ActiveHook {
  id: string;
  hookName: string;
  phase: PluginHook['phase'];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: string;
  pluginId: string;
}

export interface APICall {
  id: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  duration: number;
  status: 'success' | 'error' | 'timeout';
  pluginId: string;
  requestSize: number;
  responseSize: number;
  userAgent: string;
}

export interface APIPerformance {
  totalCalls: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  topEndpoints: EndpointMetric[];
  topPlugins: PluginMetric[];
  timeSeriesData: TimeSeriesPoint[];
}

export interface EndpointMetric {
  endpoint: string;
  calls: number;
  averageTime: number;
  errorCount: number;
}

export interface PluginMetric {
  pluginId: string;
  pluginName: string;
  calls: number;
  averageTime: number;
  errorCount: number;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  calls: number;
  errors: number;
  averageResponseTime: number;
}

export interface APIError {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  error: string;
  stack?: string;
  pluginId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

// Action Types
type PluginAPIAction =
  | { type: 'SET_CONFIG'; payload: PluginAPIConfig }
  | { type: 'SET_HOOKS'; payload: PluginHook[] }
  | { type: 'SET_ENDPOINTS'; payload: APIEndpoint[] }
  | { type: 'SET_MIDDLEWARE'; payload: APIMiddleware[] }
  | { type: 'SET_RATE_LIMITS'; payload: RateLimit[] }
  | { type: 'ADD_ACTIVE_HOOK'; payload: ActiveHook }
  | { type: 'UPDATE_ACTIVE_HOOK'; payload: { id: string; updates: Partial<ActiveHook> } }
  | { type: 'REMOVE_ACTIVE_HOOK'; payload: string }
  | { type: 'ADD_API_CALL'; payload: APICall }
  | { type: 'SET_PERFORMANCE'; payload: APIPerformance }
  | { type: 'ADD_ERROR'; payload: APIError }
  | { type: 'RESOLVE_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial State
const initialState: PluginAPIState = {
  config: null,
  hooks: [],
  endpoints: [],
  middleware: [],
  rateLimits: [],
  activeHooks: [],
  callHistory: [],
  performance: {
    totalCalls: 0,
    averageResponseTime: 0,
    successRate: 0,
    errorRate: 0,
    topEndpoints: [],
    topPlugins: [],
    timeSeriesData: []
  },
  errorLog: [],
  loading: false,
  error: null
};

// Reducer
function pluginAPIReducer(state: PluginAPIState, action: PluginAPIAction): PluginAPIState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.payload };

    case 'SET_HOOKS':
      return { ...state, hooks: action.payload };

    case 'SET_ENDPOINTS':
      return { ...state, endpoints: action.payload };

    case 'SET_MIDDLEWARE':
      return { ...state, middleware: action.payload };

    case 'SET_RATE_LIMITS':
      return { ...state, rateLimits: action.payload };

    case 'ADD_ACTIVE_HOOK':
      return {
        ...state,
        activeHooks: [...state.activeHooks, action.payload]
      };

    case 'UPDATE_ACTIVE_HOOK':
      return {
        ...state,
        activeHooks: state.activeHooks.map(hook =>
          hook.id === action.payload.id
            ? { ...hook, ...action.payload.updates }
            : hook
        )
      };

    case 'REMOVE_ACTIVE_HOOK':
      return {
        ...state,
        activeHooks: state.activeHooks.filter(hook => hook.id !== action.payload.id)
      };

    case 'ADD_API_CALL':
      return {
        ...state,
        callHistory: [action.payload, ...state.callHistory.slice(0, 99)] // Keep last 100 calls
      };

    case 'SET_PERFORMANCE':
      return { ...state, performance: action.payload };

    case 'ADD_ERROR':
      return {
        ...state,
        errorLog: [action.payload, ...state.errorLog.slice(0, 49)] // Keep last 50 errors
      };

    case 'RESOLVE_ERROR':
      return {
        ...state,
        errorLog: state.errorLog.map(error =>
          error.id === action.payload
            ? { ...error, resolved: true }
            : error
        )
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

// Context
const PluginAPIContext = createContext<{
  state: PluginAPIState;
  dispatch: React.Dispatch<PluginAPIAction>;
  executeHook: (hookName: string, pluginId: string, params?: any) => Promise<any>;
  registerEndpoint: (endpoint: APIEndpoint) => Promise<void>;
  registerMiddleware: (middleware: APIMiddleware) => Promise<void>;
  callEndpoint: (endpoint: string, method: string, data?: any, pluginId?: string) => Promise<any>;
  getPerformanceMetrics: () => APIPerformance;
  clearErrorLog: () => void;
  resolveError: (errorId: string) => void;
} | null>(null);

// Provider Component
export interface PluginAPIProviderProps {
  children: ReactNode;
  config?: Partial<PluginAPIConfig>;
  onHookExecute?: (hook: ActiveHook) => void;
  onAPIError?: (error: APIError) => void;
}

export const PluginAPIProvider: React.FC<PluginAPIProviderProps> = ({
  children,
  config = {},
  onHookExecute,
  onAPIError
}) => {
  const [state, dispatch] = useReducer(pluginAPIReducer, initialState);

  // Initialize Plugin API
  useEffect(() => {
    initializePluginAPI();
  }, []);

  const initializePluginAPI = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API initialization
      await new Promise(resolve => setTimeout(resolve, 1500));

      const defaultConfig: PluginAPIConfig = {
        version: '1.0.0',
        capabilities: ['hooks', 'endpoints', 'middleware', 'authentication', 'rate-limiting'],
        permissions: ['read', 'write', 'execute', 'admin'],
        hooks: [
          {
            name: 'onPluginInit',
            type: 'action',
            phase: 'init',
            priority: 1,
            handler: 'pluginManager.initializePlugin',
            params: {}
          },
          {
            name: 'beforeAIPipeline',
            type: 'before',
            phase: 'process',
            priority: 5,
            handler: 'orchestrator.validateInput',
            params: {}
          },
          {
            name: 'afterAIPipeline',
            type: 'after',
            phase: 'process',
            priority: 5,
            handler: 'orchestrator.processOutput',
            params: {}
          }
        ],
        endpoints: [
          {
            path: '/api/v1/plugins',
            method: 'GET',
            description: 'Get all plugins',
            params: [],
            response: {
              type: 'json',
              structure: {
                plugins: 'array',
                total: 'number',
                page: 'number'
              }
            },
            middleware: ['auth', 'validation'],
            auth: true,
            rateLimit: 100
          },
          {
            path: '/api/v1/plugins/:id',
            method: 'GET',
            description: 'Get plugin by ID',
            params: [
              {
                name: 'id',
                type: 'string',
                required: true,
                description: 'Plugin ID'
              }
            ],
            response: {
              type: 'json',
              structure: {
                id: 'string',
                name: 'string',
                version: 'string',
                status: 'string'
              }
            },
            middleware: ['auth', 'validation'],
            auth: true,
            rateLimit: 200
          }
        ],
        middleware: [
          {
            name: 'auth',
            type: 'auth',
            handler: 'middleware.authenticate',
            config: {
              tokenRequired: true,
              refreshToken: true
            }
          },
          {
            name: 'validation',
            type: 'validation',
            handler: 'middleware.validateRequest',
            config: {
              strictMode: true,
              sanitizeInput: true
            }
          },
          {
            name: 'logging',
            type: 'logging',
            handler: 'middleware.logRequest',
            config: {
              level: 'info',
              includeHeaders: false
            }
          }
        ],
        rateLimits: [
          {
            endpoint: '/api/v1/*',
            limit: 1000,
            window: 60000,
            strategy: 'sliding'
          },
          {
            endpoint: '/api/v1/plugins/install',
            limit: 10,
            window: 60000,
            strategy: 'fixed'
          }
        ]
      };

      const finalConfig = { ...defaultConfig, ...config };

      dispatch({ type: 'SET_CONFIG', payload: finalConfig });
      dispatch({ type: 'SET_HOOKS', payload: finalConfig.hooks });
      dispatch({ type: 'SET_ENDPOINTS', payload: finalConfig.endpoints });
      dispatch({ type: 'SET_MIDDLEWARE', payload: finalConfig.middleware });
      dispatch({ type: 'SET_RATE_LIMITS', payload: finalConfig.rateLimits });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to initialize Plugin API' });
    }
  }, [config]);

  // Core API Functions
  const executeHook = useCallback(async (hookName: string, pluginId: string, params?: any) => {
    const hook = state.hooks.find(h => h.name === hookName);
    if (!hook) {
      throw new Error(`Hook '${hookName}' not found`);
    }

    const activeHook: ActiveHook = {
      id: `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hookName,
      phase: hook.phase,
      status: 'pending',
      startTime: new Date(),
      pluginId
    };

    dispatch({ type: 'ADD_ACTIVE_HOOK', payload: activeHook });
    dispatch({ type: 'UPDATE_ACTIVE_HOOK', payload: { 
      id: activeHook.id, 
      updates: { status: 'executing' } 
    } });

    try {
      // Simulate hook execution
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));

      const result = { hookName, pluginId, params, executed: true };

      dispatch({ type: 'UPDATE_ACTIVE_HOOK', payload: { 
        id: activeHook.id, 
        updates: { 
          status: 'completed', 
          endTime: new Date(), 
          duration: Date.now() - activeHook.startTime.getTime(),
          result 
        } 
      } });

      if (onHookExecute) {
        onHookExecute(activeHook);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Hook execution failed';

      dispatch({ type: 'UPDATE_ACTIVE_HOOK', payload: { 
        id: activeHook.id, 
        updates: { 
          status: 'failed', 
          endTime: new Date(), 
          duration: Date.now() - activeHook.startTime.getTime(),
          error: errorMessage 
        } 
      } });

      // Log error
      const apiError: APIError = {
        id: `error_${Date.now()}`,
        timestamp: new Date(),
        endpoint: hookName,
        method: 'HOOK',
        error: errorMessage,
        pluginId,
        severity: 'medium',
        resolved: false
      };

      dispatch({ type: 'ADD_ERROR', payload: apiError });

      if (onAPIError) {
        onAPIError(apiError);
      }

      throw error;
    }
  }, [state.hooks, onHookExecute, onAPIError]);

  const registerEndpoint = useCallback(async (endpoint: APIEndpoint) => {
    const updatedEndpoints = [...state.endpoints, endpoint];
    dispatch({ type: 'SET_ENDPOINTS', payload: updatedEndpoints });

    // Update config if it exists
    if (state.config) {
      dispatch({ 
        type: 'SET_CONFIG', 
        payload: { ...state.config, endpoints: updatedEndpoints } 
      });
    }
  }, [state.endpoints, state.config]);

  const registerMiddleware = useCallback(async (middleware: APIMiddleware) => {
    const updatedMiddleware = [...state.middleware, middleware];
    dispatch({ type: 'SET_MIDDLEWARE', payload: updatedMiddleware });

    // Update config if it exists
    if (state.config) {
      dispatch({ 
        type: 'SET_CONFIG', 
        payload: { ...state.config, middleware: updatedMiddleware } 
      });
    }
  }, [state.middleware, state.config]);

  const callEndpoint = useCallback(async (endpoint: string, method: string, data?: any, pluginId?: string) => {
    const startTime = Date.now();
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));

      const duration = Date.now() - startTime;
      const success = Math.random() > 0.1; // 90% success rate

      const apiCall: APICall = {
        id: callId,
        endpoint,
        method,
        timestamp: new Date(),
        duration,
        status: success ? 'success' : 'error',
        pluginId: pluginId || 'unknown',
        requestSize: JSON.stringify(data || {}).length,
        responseSize: Math.floor(Math.random() * 5000) + 500,
        userAgent: 'PluginAPI/1.0.0'
      };

      dispatch({ type: 'ADD_API_CALL', payload: apiCall });

      if (!success) {
        throw new Error('API call failed');
      }

      return { 
        data: { message: 'API call successful', endpoint, method }, 
        status: 200,
        duration 
      };
    } catch (error) {
