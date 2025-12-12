/**
 * useKeyboardShortcuts - React hook for keyboard shortcut management
 * Integrates with KeyboardService to provide easy shortcut handling in React components
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '../lib/utils';
import {
  keyboardService,
  KeyboardShortcut,
  ShortcutContext,
  useKeyboardContext
} from '../services/KeyboardService';

interface UseKeyboardShortcutsOptions {
  context?: ShortcutContext;
  priority?: number;
  enabled?: boolean;
  global?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  throttleMs?: number;
}

interface ShortcutHandler {
  shortcut: KeyboardShortcut;
  handler: (event: KeyboardEvent) => void;
  cleanup?: () => void;
}

interface UseKeyboardShortcutsReturn {
  registerShortcut: (
    shortcut: Omit<KeyboardShortcut, 'action'> & { action?: (event: KeyboardEvent) => void },
    handler: (event: KeyboardEvent) => void,
    options?: Partial<UseKeyboardShortcutsOptions>
  ) => () => void;
  unregisterShortcut: (shortcutId: string) => void;
  unregisterAll: () => void;
  isShortcutRegistered: (shortcutId: string) => boolean;
  getRegisteredShortcuts: () => KeyboardShortcut[];
  executeShortcut: (shortcutId: string, event?: KeyboardEvent) => boolean;
  setContext: (context: ShortcutContext) => void;
  getCurrentContext: () => ShortcutContext;
}

/**
 * Hook for managing keyboard shortcuts in React components
 */
export function useKeyboardShortcuts(
  initialContext?: ShortcutContext,
  options: UseKeyboardShortcutsOptions = {}
): UseKeyboardShortcutsReturn {
  const {
    context = initialContext || 'global',
    priority = 0,
    enabled = true,
    global = false,
    preventDefault = true,
    stopPropagation = false,
    throttleMs = 100
  } = options;

  const shortcutsRef = useRef<Map<string, ShortcutHandler>>(new Map());
  const contextManager = useKeyboardContext();
  const eventHandlersRef = useRef<Map<string, EventListener>>(new Map());

  // Set initial context
  useEffect(() => {
    if (context) {
      contextManager.setContext(context);
    }
  }, [context, contextManager]);

  // Memoized event handler for global shortcuts
  const handleGlobalShortcut = useCallback(
    debounce((event: KeyboardEvent) => {
      const shortcuts = keyboardService.getShortcuts(context);
      
      for (const registration of shortcuts) {
        const { shortcut } = registration;
        
        if (!shortcut.enabled && shortcut.enabled !== undefined) {
          continue;
        }

        if (matchesShortcut(event, shortcut)) {
          if (preventDefault) {
            event.preventDefault();
          }
          
          if (stopPropagation) {
            event.stopPropagation();
          }

          // Execute the shortcut action
          try {
            shortcut.action();
          } catch (error) {
            console.error(`Error executing shortcut ${shortcut.id}:`, error);
          }
          
          break; // Only execute the first matching shortcut
        }
      }
    }, throttleMs),
    [context, preventDefault, stopPropagation, throttleMs]
  );

  // Set up global shortcut listener
  useEffect(() => {
    if (global && enabled) {
      document.addEventListener('keydown', handleGlobalShortcut);
      
      return () => {
        document.removeEventListener('keydown', handleGlobalShortcut);
      };
    }
  }, [global, enabled, handleGlobalShortcut]);

  /**
   * Register a keyboard shortcut
   */
  const registerShortcut = useCallback((
    shortcutConfig: Omit<KeyboardShortcut, 'action'> & { action?: (event: KeyboardEvent) => void },
    handler: (event: KeyboardEvent) => void,
    registerOptions: Partial<UseKeyboardShortcutsOptions> = {}
  ) => {
    const {
      context: shortcutContext = context,
      priority: shortcutPriority = priority,
      enabled: shortcutEnabled = enabled,
      global: shortcutGlobal = global,
      preventDefault: shortcutPreventDefault = preventDefault,
      stopPropagation: shortcutStopPropagation = stopPropagation
    } = registerOptions;

    const shortcut: KeyboardShortcut = {
      ...shortcutConfig,
      action: () => {
        const event = new KeyboardEvent('keydown', {
          key: shortcutConfig.key,
          ctrlKey: shortcutConfig.modifiers?.ctrl,
          altKey: shortcutConfig.modifiers?.alt,
          shiftKey: shortcutConfig.modifiers?.shift,
          metaKey: shortcutConfig.modifiers?.meta,
        });
        
        if (shortcutConfig.action) {
          shortcutConfig.action(event);
        }
        
        handler(event);
      },
      enabled: shortcutEnabled,
      global: shortcutGlobal,
      preventDefault: shortcutPreventDefault
    };

    // Register with KeyboardService
    keyboardService.registerShortcut(shortcut, shortcutContext, shortcutPriority);

    // Store for cleanup
    shortcutsRef.current.set(shortcutConfig.id, {
      shortcut,
      handler,
      cleanup: () => {
        keyboardService.unregisterShortcut(shortcutConfig.key, shortcutContext);
      }
    });

    // Return cleanup function
    return () => {
      unregisterShortcut(shortcutConfig.id);
    };
  }, [context, priority, enabled, global, preventDefault, stopPropagation]);

  /**
   * Unregister a keyboard shortcut
   */
  const unregisterShortcut = useCallback((shortcutId: string) => {
    const shortcutHandler = shortcutsRef.current.get(shortcutId);
    if (shortcutHandler) {
      if (shortcutHandler.cleanup) {
        shortcutHandler.cleanup();
      }
      shortcutsRef.current.delete(shortcutId);
    }
  }, []);

  /**
   * Unregister all shortcuts registered by this hook
   */
  const unregisterAll = useCallback(() => {
    shortcutsRef.current.forEach((handler, id) => {
      if (handler.cleanup) {
        handler.cleanup();
      }
    });
    shortcutsRef.current.clear();
  }, []);

  /**
   * Check if a shortcut is registered
   */
  const isShortcutRegistered = useCallback((shortcutId: string) => {
    return shortcutsRef.current.has(shortcutId);
  }, []);

  /**
   * Get all registered shortcuts
   */
  const getRegisteredShortcuts = useCallback(() => {
    return Array.from(shortcutsRef.current.values()).map(h => h.shortcut);
  }, []);

  /**
   * Execute a shortcut programmatically
   */
  const executeShortcut = useCallback((shortcutId: string, event?: KeyboardEvent) => {
    const shortcutHandler = shortcutsRef.current.get(shortcutId);
    if (shortcutHandler && shortcutHandler.shortcut.enabled !== false) {
      try {
        shortcutHandler.shortcut.action();
        if (event && shortcutHandler.handler) {
          shortcutHandler.handler(event);
        }
        return true;
      } catch (error) {
        console.error(`Error executing shortcut ${shortcutId}:`, error);
        return false;
      }
    }
    return false;
  }, []);

  /**
   * Set the current context
   */
  const setContext = useCallback((newContext: ShortcutContext) => {
    contextManager.setContext(newContext);
  }, [contextManager]);

  /**
   * Get the current context
   */
  const getCurrentContext = useCallback(() => {
    return contextManager.getCurrentContext();
  }, [contextManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterAll();
    };
  }, [unregisterAll]);

  return {
    registerShortcut,
    unregisterShortcut,
    unregisterAll,
    isShortcutRegistered,
    getRegisteredShortcuts,
    executeShortcut,
    setContext,
    getCurrentContext
  };
}

/**
 * Hook for common keyboard shortcuts patterns
 */
export function useCommonKeyboardShortcuts() {
  const shortcuts = useKeyboardShortcuts();

  /**
   * Register undo/redo shortcuts
   */
  const registerUndoRedo = useCallback((
    onUndo: () => void,
    onRedo: () => void,
    options?: Partial<UseKeyboardShortcutsOptions>
  ) => {
    const cleanups: (() => void)[] = [];

    // Ctrl+Z / Cmd+Z for undo
    cleanups.push(shortcuts.registerShortcut(
      {
        id: 'undo',
        key: 'z',
        modifiers: { ctrl: true },
        description: 'Undo last action',
        category: 'edit'
      },
      (event) => {
        event.preventDefault();
        onUndo();
      },
      options
    ));

    // Ctrl+Shift+Z / Cmd+Shift+Z for redo
    cleanups.push(shortcuts.registerShortcut(
      {
        id: 'redo',
        key: 'z',
        modifiers: { ctrl: true, shift: true },
        description: 'Redo last undone action',
        category: 'edit'
      },
      (event) => {
        event.preventDefault();
        onRedo();
      },
      options
    ));

    // Return cleanup function
    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [shortcuts]);

  /**
   * Register save shortcuts
   */
  const registerSave = useCallback((
    onSave: () => void,
    options?: Partial<UseKeyboardShortcutsOptions>
  ) => {
    return shortcuts.registerShortcut(
      {
        id: 'save',
        key: 's',
        modifiers: { ctrl: true },
        description: 'Save current work',
        category: 'file'
      },
      (event) => {
        event.preventDefault();
        onSave();
      },
      options
    );
  }, [shortcuts]);

  /**
   * Register navigation shortcuts
   */
  const registerNavigation = useCallback((
    shortcuts: Array<{
      id: string;
      key: string;
      modifiers?: KeyboardShortcut['modifiers'];
      description: string;
      onExecute: () => void;
    }>,
    options?: Partial<UseKeyboardShortcutsOptions>
  ) => {
    const cleanups: (() => void)[] = [];

    shortcuts.forEach(shortcut => {
      cleanups.push(shortcuts.registerShortcut(
        {
          id: shortcut.id,
          key: shortcut.key,
          modifiers: shortcut.modifiers,
          description: shortcut.description,
          category: 'navigation'
        },
        (event) => {
          event.preventDefault();
          shortcut.onExecute();
        },
        options
      ));
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [shortcuts]);

  /**
   * Register search shortcuts
   */
  const registerSearch = useCallback((
    onSearch: () => void,
    options?: Partial<UseKeyboardShortcutsOptions>
  ) => {
    const cleanups: (() => void)[] = [];

    // Ctrl+F / Cmd+F for search
    cleanups.push(shortcuts.registerShortcut(
      {
        id: 'search',
        key: 'f',
        modifiers: { ctrl: true },
        description: 'Open search',
        category: 'navigation'
      },
      (event) => {
        event.preventDefault();
        onSearch();
      },
      options
    ));

    // Escape to close search
    cleanups.push(shortcuts.registerShortcut(
      {
        id: 'close-search',
        key: 'Escape',
        description: 'Close search',
        category: 'navigation'
      },
      (event) => {
        event.preventDefault();
        // Could add onCloseSearch callback if needed
      },
      options
    ));

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [shortcuts]);

  return {
    registerUndoRedo,
    registerSave,
    registerNavigation,
    registerSearch,
    ...shortcuts
  };
}

/**
 * Hook for managing context-specific shortcuts
 */
export function useContextKeyboardShortcuts(
  context: ShortcutContext,
  shortcuts: Array<{
    id: string;
    key: string;
    modifiers?: KeyboardShortcut['modifiers'];
    description: string;
    action: () => void;
  }>
) {
  const { registerShortcut, unregisterAll } = useKeyboardShortcuts(context);

  // Register shortcuts when context changes
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    shortcuts.forEach(shortcut => {
      cleanups.push(registerShortcut(
        shortcut,
        () => shortcut.action()
      ));
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
      unregisterAll();
    };
  }, [context, shortcuts, registerShortcut, unregisterAll]);

  return {
    registerShortcut,
    unregisterAll
  };
}

/**
 * Check if a keyboard event matches a shortcut
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  // Check if key matches
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }

  // Check modifiers
  const modifiers = shortcut.modifiers || {};
  
  if ((modifiers.ctrl || false) !== event.ctrlKey) {
    return false;
  }
  
  if ((modifiers.alt || false) !== event.altKey) {
    return false;
  }
  
  if ((modifiers.shift || false) !== event.shiftKey) {
    return false;
  }
  
  if ((modifiers.meta || false) !== event.metaKey) {
    return false;
  }

  return true;
}

/**
 * Hook for keyboard shortcut conflicts detection
 */
export function useShortcutConflicts() {
  const [conflicts, setConflicts] = useState<Array<{
    shortcut1: KeyboardShortcut;
    shortcut2: KeyboardShortcut;
    contexts: string[];
  }>>([]);

  const checkConflicts = useCallback(() => {
    const allContexts = ['global', 'editor', 'dashboard', 'project', 'chat', 'settings'];
    const detectedConflicts: Array<{
      shortcut1: KeyboardShortcut;
      shortcut2: KeyboardShortcut;
      contexts: string[];
    }> = [];

    allContexts.forEach(context => {
      const shortcuts = keyboardService.getShortcuts(context);
      const shortcutMap = new Map<string, KeyboardShortcut>();

      shortcuts.forEach(registration => {
        const shortcut = registration.shortcut;
        const key = `${shortcut.key}_${JSON.stringify(shortcut.modifiers || {})}`;
        
        if (shortcutMap.has(key)) {
          detectedConflicts.push({
            shortcut1: shortcutMap.get(key)!,
            shortcut2: shortcut,
            contexts: [context]
          });
        } else {
          shortcutMap.set(key, shortcut);
        }
      });
    });

    setConflicts(detectedConflicts);
  }, []);

  useEffect(() => {
    checkConflicts();
  }, [checkConflicts]);

  return {
    conflicts,
    checkConflicts,
    hasConflicts: conflicts.length > 0
  };
}

export default useKeyboardShortcuts;
