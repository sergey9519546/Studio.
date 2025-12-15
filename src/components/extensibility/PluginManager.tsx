/**
 * PluginManager - Core plugin management system
 * Provides extensible plugin architecture for the Enhanced Liquid Glass Design System
 */

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';

// Plugin Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  icon?: string;
  enabled: boolean;
  installed: boolean;
  dependencies: string[];
  permissions: PluginPermission[];
  metadata: PluginMetadata;
  hooks: PluginHooks;
  lifecycle: PluginLifecycle;
}

export interface PluginMetadata {
  entryPoint: string;
  manifest: Record<string, any>;
  size: number;
  checksum: string;
  compatibleVersions: string[];
  installationDate?: Date;
  lastUpdate?: Date;
  rating?: number;
  downloads?: number;
  tags: string[];
  screenshots?: string[];
  changelog?: string[];
}

export interface PluginHooks {
  onInit?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  onUninstall?: () => void;
  onUpdate?: (oldVersion: string, newVersion: string) => void;
  beforeRender?: (props: any) => any;
  afterRender?: (element: HTMLElement) => void;
  onError?: (error: Error) => void;
  custom?: Record<string, Function>;
}

export interface PluginLifecycle {
  state: 'pending' | 'loading' | 'active' | 'inactive' | 'error' | 'updating' | 'uninstalling';
  startTime?: Date;
  endTime?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface PluginPermission {
  type: 'filesystem' | 'network' | 'ui' | 'data' | 'system' | 'custom';
  scope: string;
  description: string;
  granted: boolean;
}

export interface PluginContext {
  registerHook: (name: string, hook: Function) => void;
  unregisterHook: (name: string) => void;
  emitEvent: (event: string, data?: any) => void;
  getConfig: (key: string, defaultValue?: any) => any;
  setConfig: (key: string, value: any) => void;
  requestPermission: (permission: PluginPermission) => Promise<boolean>;
  getAPI: (name: string) => any;
  log: (level: 'debug' | 'info' | 'warn' | 'error', message: string) => void;
}

export interface PluginAPI {
  ui: {
    createComponent: (component: React.ComponentType<any>, props?: any) => void;
    registerShortcut: (shortcut: string, callback: Function) => void;
    showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    openModal: (component: React.ComponentType<any>, props?: any) => void;
  };
  data: {
    getStore: (key: string) => any;
    setStore: (key: string, value: any) => void;
    subscribe: (key: string, callback: Function) => () => void;
  };
  system: {
    getVersion: () => string;
    getPlatform: () => string;
    getConfig: () => any;
    restart: () => void;
  };
  plugin: {
    getPlugins: () => Plugin[];
    enablePlugin: (id: string) => void;
    disablePlugin: (id: string) => void;
  };
}

export type PluginCategory = 
  | 'ui-enhancement'
  | 'data-analysis'
  | 'integration'
  | 'visualization'
  | 'productivity'
  | 'development'
  | 'custom';

export interface PluginStore {
  availablePlugins: Plugin[];
  installedPlugins: Plugin[];
  loading: boolean;
  error: string | null;
}

export interface PluginManagerState {
  plugins: PluginStore;
  activePlugins: Set<string>;
  pluginContext: Map<string, PluginContext>;
  eventBus: Map<string, Function[]>;
  config: PluginManagerConfig;
  ui: {
    selectedCategory: PluginCategory | 'all';
    searchQuery: string;
    viewMode: 'grid' | 'list';
    showDetails: boolean;
    selectedPlugin: Plugin | null;
  };
}

export interface PluginManagerConfig {
  autoUpdate: boolean;
  allowUntrusted: boolean;
  maxPlugins: number;
  enableDevMode: boolean;
  pluginDirectories: string[];
  permissions: {
    requireApproval: boolean;
    autoGrant: PluginPermission['type'][];
  };
}

export interface PluginManagerProps {
  children: ReactNode;
  config?: Partial<PluginManagerConfig>;
  onPluginInstall?: (plugin: Plugin) => void;
  onPluginUninstall?: (plugin: Plugin) => void;
  onPluginError?: (plugin: Plugin, error: Error) => void;
}

// Action Types
type PluginManagerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PLUGINS'; payload: Plugin[] }
  | { type: 'INSTALL_PLUGIN'; payload: Plugin }
  | { type: 'UNINSTALL_PLUGIN'; payload: string }
  | { type: 'ENABLE_PLUGIN'; payload: string }
  | { type: 'DISABLE_PLUGIN'; payload: string }
  | { type: 'UPDATE_PLUGIN'; payload: { id: string; updates: Partial<Plugin> } }
  | { type: 'SET_CATEGORY'; payload: PluginCategory | 'all' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SHOW_PLUGIN_DETAILS'; payload: Plugin | null }
  | { type: 'SET_CONFIG'; payload: Partial<PluginManagerConfig> };

// Initial State
const initialState: PluginManagerState = {
  plugins: {
    availablePlugins: [],
    installedPlugins: [],
    loading: false,
    error: null
  },
  activePlugins: new Set(),
  pluginContext: new Map(),
  eventBus: new Map(),
  config: {
    autoUpdate: true,
    allowUntrusted: false,
    maxPlugins: 50,
    enableDevMode: false,
    pluginDirectories: [],
    permissions: {
      requireApproval: true,
      autoGrant: []
    }
  },
  ui: {
    selectedCategory: 'all',
    searchQuery: '',
    viewMode: 'grid',
    showDetails: false,
    selectedPlugin: null
  }
};

// Reducer
function pluginManagerReducer(state: PluginManagerState, action: PluginManagerAction): PluginManagerState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        plugins: { ...state.plugins, loading: action.payload }
      };

    case 'SET_ERROR':
      return {
        ...state,
        plugins: { ...state.plugins, error: action.payload }
      };

    case 'SET_PLUGINS':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          availablePlugins: action.payload,
          loading: false
        }
      };

    case 'INSTALL_PLUGIN':
      const newInstalledPlugins = [...state.plugins.installedPlugins, action.payload];
      return {
        ...state,
        plugins: {
          ...state.plugins,
          installedPlugins: newInstalledPlugins,
          availablePlugins: state.plugins.availablePlugins.filter(p => p.id !== action.payload.id)
        },
        activePlugins: action.payload.enabled ? new Set([...state.activePlugins, action.payload.id]) : state.activePlugins
      };

    case 'UNINSTALL_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          installedPlugins: state.plugins.installedPlugins.filter(p => p.id !== action.payload)
        },
        activePlugins: new Set([...state.activePlugins].filter(id => id !== action.payload)),
        pluginContext: new Map([...state.pluginContext.entries()].filter(([id]) => id !== action.payload)),
        ui: {
          ...state.ui,
          selectedPlugin: state.ui.selectedPlugin?.id === action.payload ? null : state.ui.selectedPlugin
        }
      };

    case 'ENABLE_PLUGIN':
      const enabledPlugin = state.plugins.installedPlugins.find(p => p.id === action.payload);
      if (enabledPlugin) {
        return {
          ...state,
          plugins: {
            ...state.plugins,
            installedPlugins: state.plugins.installedPlugins.map(p =>
              p.id === action.payload ? { ...p, enabled: true } : p
            )
          },
          activePlugins: new Set([...state.activePlugins, action.payload])
        };
      }
      return state;

    case 'DISABLE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          installedPlugins: state.plugins.installedPlugins.map(p =>
            p.id === action.payload ? { ...p, enabled: false } : p
          )
        },
        activePlugins: new Set([...state.activePlugins].filter(id => id !== action.payload))
      };

    case 'UPDATE_PLUGIN':
      return {
        ...state,
        plugins: {
          ...state.plugins,
          installedPlugins: state.plugins.installedPlugins.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
          )
        }
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        ui: { ...state.ui, selectedCategory: action.payload }
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        ui: { ...state.ui, searchQuery: action.payload }
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        ui: { ...state.ui, viewMode: action.payload }
      };

    case 'SHOW_PLUGIN_DETAILS':
      return {
        ...state,
        ui: { ...state.ui, selectedPlugin: action.payload }
      };

    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };

    default:
      return state;
  }
}

// Context
const PluginManagerContext = createContext<{
  state: PluginManagerState;
  dispatch: React.Dispatch<PluginManagerAction>;
  installPlugin: (plugin: Plugin) => Promise<void>;
  uninstallPlugin: (id: string) => Promise<void>;
  enablePlugin: (id: string) => Promise<void>;
  disablePlugin: (id: string) => Promise<void>;
  loadPlugins: () => Promise<void>;
  updatePlugin: (id: string) => Promise<void>;
  getPluginContext: (id: string) => PluginContext | null;
  emitPluginEvent: (pluginId: string, event: string, data?: any) => void;
  registerPluginHook: (pluginId: string, name: string, hook: Function) => void;
  checkPermissions: (permissions: PluginPermission[]) => Promise<boolean>;
  getAvailablePlugins: () => Plugin[];
  getInstalledPlugins: () => Plugin[];
  getActivePlugins: () => Plugin[];
} | null>(null);

// Provider Component
export const PluginManagerProvider: React.FC<PluginManagerProps> = ({
  children,
  config = {},
  onPluginInstall,
  onPluginUninstall,
  onPluginError
}) => {
  const [state, dispatch] = useReducer(pluginManagerReducer, initialState);
  const finalConfig = { ...initialState.config, ...config };

  // Initialize plugin system
  useEffect(() => {
    loadPlugins();
    dispatch({ type: 'SET_CONFIG', payload: finalConfig });
  }, [finalConfig]);

  // Plugin Management Functions
  const loadPlugins = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate loading plugins from store
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPlugins: Plugin[] = [
        {
          id: 'theme-manager',
          name: 'Advanced Theme Manager',
          version: '1.2.0',
          description: 'Advanced theme management with custom themes, animations, and dynamic switching',
          author: 'Liquid Glass Team',
          category: 'ui-enhancement',
          enabled: true,
          installed: true,
          dependencies: ['ui-core'],
          permissions: [
            { type: 'ui', scope: 'theme-change', description: 'Modify application theme', granted: true },
            { type: 'data', scope: 'theme-storage', description: 'Store theme preferences', granted: true }
          ],
          metadata: {
            entryPoint: './theme-manager.js',
            manifest: { main: './theme-manager.js', name: 'Advanced Theme Manager' },
            size: 245760,
            checksum: 'sha256:abc123',
            compatibleVersions: ['1.0.0', '1.1.0', '1.2.0'],
            installationDate: new Date('2024-01-15'),
            rating: 4.8,
            downloads: 15420,
            tags: ['theme', 'ui', 'customization', 'animation'],
            changelog: ['Fixed theme switching animation', 'Added dark mode support', 'Performance improvements']
          },
          hooks: {
            onInit: () => console.log('Theme Manager initialized'),
            onEnable: () => console.log('Theme Manager enabled'),
            beforeRender: (props) => ({ ...props, theme: 'custom' })
          },
          lifecycle: {
            state: 'active',
            startTime: new Date(),
            retryCount: 0,
            maxRetries: 3
          }
        },
        {
          id: 'data-analyzer',
          name: 'Smart Data Analyzer',
          version: '2.1.3',
          description: 'AI-powered data analysis and visualization tools',
          author: 'Analytics Corp',
          category: 'data-analysis',
          enabled: false,
          installed: true,
          dependencies: ['ai-core'],
          permissions: [
            { type: 'data', scope: 'read-analytics', description: 'Read analytics data', granted: true },
            { type: 'network', scope: 'ai-api', description: 'Access AI analysis APIs', granted: false }
          ],
          metadata: {
            entryPoint: './data-analyzer.js',
            manifest: { main: './data-analyzer.js', name: 'Smart Data Analyzer' },
            size: 512000,
            checksum: 'sha256:def456',
            compatibleVersions: ['2.0.0', '2.1.0'],
            installationDate: new Date('2024-02-20'),
            rating: 4.6,
            downloads: 8930,
            tags: ['analytics', 'ai', 'visualization', 'data'],
            changelog: ['Enhanced AI models', 'New visualization types', 'Performance optimization']
          },
          hooks: {
            onInit: () => console.log('Data Analyzer initialized')
          },
          lifecycle: {
            state: 'inactive',
            retryCount: 0,
            maxRetries: 3
          }
        }
      ];

      dispatch({ type: 'SET_PLUGINS', payload: mockPlugins });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load plugins' });
    }
  }, []);

  const installPlugin = useCallback(async (plugin: Plugin) => {
    try {
      // Check permissions
      const hasPermissions = await checkPermissions(plugin.permissions);
      if (!hasPermissions) {
        throw new Error('Required permissions not granted');
      }

      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const installedPlugin: Plugin = {
        ...plugin,
        installed: true,
        metadata: {
          ...plugin.metadata,
          installationDate: new Date()
        }
      };

      dispatch({ type: 'INSTALL_PLUGIN', payload: installedPlugin });
      
      if (onPluginInstall) {
        onPluginInstall(installedPlugin);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Installation failed' });
      if (onPluginError) {
        onPluginError(plugin, error instanceof Error ? error : new Error('Installation failed'));
      }
    }
  }, [onPluginInstall, onPluginError]);

  const uninstallPlugin = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'UNINSTALL_PLUGIN', payload: id });
      
      const plugin = state.plugins.installedPlugins.find(p => p.id === id);
      if (plugin && onPluginUninstall) {
        onPluginUninstall(plugin);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Uninstallation failed' });
    }
  }, [state.plugins.installedPlugins, onPluginUninstall]);

  const enablePlugin = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'ENABLE_PLUGIN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to enable plugin' });
    }
  }, []);

  const disablePlugin = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DISABLE_PLUGIN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to disable plugin' });
    }
  }, []);

  const updatePlugin = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: 'UPDATE_PLUGIN', payload: { id, updates: { version: 'updated' } } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update plugin' });
    }
  }, []);

  const getPluginContext = useCallback((id: string): PluginContext | null => {
    return state.pluginContext.get(id) || null;
  }, [state.pluginContext]);

  const emitPluginEvent = useCallback((pluginId: string, event: string, data?: any) => {
    const handlers = state.eventBus.get(event) || [];
    handlers.forEach(handler => handler(data));
  }, [state.eventBus]);

  const registerPluginHook = useCallback((pluginId: string, name: string, hook: Function) => {
    // Register hook implementation
  }, []);

  const checkPermissions = useCallback(async (permissions: PluginPermission[]): Promise<boolean> => {
    return permissions.every(p => p.granted);
  }, []);

  const getAvailablePlugins = useCallback(() => state.plugins.availablePlugins, [state.plugins.availablePlugins]);
  const getInstalledPlugins = useCallback(() => state.plugins.installedPlugins, [state.plugins.installedPlugins]);
  const getActivePlugins = useCallback(() => {
    return state.plugins.installedPlugins.filter(p => state.activePlugins.has(p.id));
  }, [state.plugins.installedPlugins, state.activePlugins]);

  const value = {
    state,
    dispatch,
    installPlugin,
    uninstallPlugin,
    enablePlugin,
    disablePlugin,
    loadPlugins,
    updatePlugin,
    getPluginContext,
    emitPluginEvent,
    registerPluginHook,
    checkPermissions,
    getAvailablePlugins,
    getInstalledPlugins,
    getActivePlugins
  };

  return (
    <PluginManagerContext.Provider value={value}>
      {children}
    </PluginManagerContext.Provider>
  );
};

// Hook
export const usePluginManager = () => {
  const context = useContext(PluginManagerContext);
  if (!context) {
    throw new Error('usePluginManager must be used within a PluginManagerProvider');
  }
  return context;
};

export default PluginManagerProvider;
