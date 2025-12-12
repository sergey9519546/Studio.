/**
 * KeyboardService - Centralized keyboard shortcut management system
 * Provides global shortcut registration, conflict resolution, and execution
 */

import { useCallback, useEffect, useRef } from 'react';

export interface KeyboardShortcut {
  id: string;
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean; // Cmd on Mac, Win on Windows
  };
  action: () => void;
  description?: string;
  category?: string;
  enabled?: boolean;
  global?: boolean; // Works even when input elements are focused
  preventDefault?: boolean;
}

export interface ShortcutRegistration {
  shortcut: KeyboardShortcut;
  priority: number;
  context?: string; // Optional context identifier
}

export type ShortcutContext = 'global' | 'editor' | 'dashboard' | 'project' | 'chat' | 'settings';

class KeyboardService {
  private shortcuts: Map<string, ShortcutRegistration[]> = new Map();
  private contextStack: ShortcutContext[] = ['global'];
  private eventListeners: Map<string, EventListener> = new Map();
  private debugMode = false;

  /**
   * Register a keyboard shortcut
   */
  registerShortcut(
    shortcut: KeyboardShortcut,
    context: ShortcutContext = 'global',
    priority: number = 0
  ): void {
    const contextShortcuts = this.shortcuts.get(context) || [];
    
    // Check for conflicts
    const existingConflict = contextShortcuts.find(reg => 
      this.isSameShortcut(reg.shortcut, shortcut)
    );
    
    if (existingConflict) {
      if (priority > existingConflict.priority) {
        // Replace lower priority shortcut
        const filtered = contextShortcuts.filter(reg => 
          !this.isSameShortcut(reg.shortcut, shortcut)
        );
        filtered.push({ shortcut, priority, context });
        this.shortcuts.set(context, filtered);
        
        if (this.debugMode) {
          console.warn(`[KeyboardService] Replaced shortcut ${shortcut.key} in context ${context}`);
        }
      } else {
        if (this.debugMode) {
          console.warn(`[KeyboardService] Ignored conflicting shortcut ${shortcut.key} in context ${context}`);
        }
      }
    } else {
      contextShortcuts.push({ shortcut, priority, context });
      this.shortcuts.set(context, contextShortcuts);
    }

    // Sort by priority (highest first)
    contextShortcuts.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregisterShortcut(
    key: string,
    context: ShortcutContext = 'global'
  ): void {
    const contextShortcuts = this.shortcuts.get(context) || [];
    const filtered = contextShortcuts.filter(reg => reg.shortcut.key !== key);
    this.shortcuts.set(context, filtered);
  }

  /**
   * Unregister all shortcuts for a specific context
   */
  unregisterContext(context: ShortcutContext): void {
    this.shortcuts.delete(context);
  }

  /**
   * Set the current context (pushes onto stack)
   */
  pushContext(context: ShortcutContext): void {
    this.contextStack.push(context);
    if (this.debugMode) {
      console.log(`[KeyboardService] Pushed context: ${context}`, this.contextStack);
    }
  }

  /**
   * Pop the current context from stack
   */
  popContext(): ShortcutContext | null {
    if (this.contextStack.length > 1) {
      const popped = this.contextStack.pop();
      if (this.debugMode) {
        console.log(`[KeyboardService] Popped context: ${popped}`, this.contextStack);
      }
      return popped;
    }
    return null;
  }

  /**
   * Set specific context (replaces entire stack except global)
   */
  setContext(context: ShortcutContext): void {
    this.contextStack = ['global', context];
    if (this.debugMode) {
      console.log(`[KeyboardService] Set context: ${context}`, this.contextStack);
    }
  }

  /**
   * Get current context
   */
  getCurrentContext(): ShortcutContext {
    return this.contextStack[this.contextStack.length - 1];
  }

  /**
   * Enable/disable a shortcut temporarily
   */
  toggleShortcut(
    key: string,
    enabled: boolean,
    context: ShortcutContext = 'global'
  ): void {
    const contextShortcuts = this.shortcuts.get(context) || [];
    const shortcut = contextShortcuts.find(reg => reg.shortcut.key === key);
    if (shortcut) {
      shortcut.shortcut.enabled = enabled;
    }
  }

  /**
   * Enable/disable all shortcuts in a context
   */
  toggleContext(context: ShortcutContext, enabled: boolean): void {
    const contextShortcuts = this.shortcuts.get(context) || [];
    contextShortcuts.forEach(reg => {
      reg.shortcut.enabled = enabled;
    });
  }

  /**
   * Check if a key combination matches a shortcut
   */
  private isSameShortcut(shortcut1: KeyboardShortcut, shortcut2: KeyboardShortcut): boolean {
    return shortcut1.key.toLowerCase() === shortcut2.key.toLowerCase() &&
           this.compareModifiers(shortcut1.modifiers, shortcut2.modifiers);
  }

  /**
   * Compare modifier combinations
   */
  private compareModifiers(
    mods1?: KeyboardShortcut['modifiers'],
    mods2?: KeyboardShortcut['modifiers']
  ): boolean {
    const m1 = mods1 || {};
    const m2 = mods2 || {};
    
    return (
      (m1.ctrl || false) === (m2.ctrl || false) &&
      (m1.alt || false) === (m2.alt || false) &&
      (m1.shift || false) === (m2.shift || false) &&
      (m1.meta || false) === (m2.meta || false)
    );
  }

  /**
   * Parse a keyboard shortcut string (e.g., "ctrl+k", "cmd+shift+p")
   */
  static parseShortcutString(shortcutString: string): Partial<KeyboardShortcut> {
    const parts = shortcutString.toLowerCase().split('+').map(p => p.trim());
    const key = parts.pop() || '';
    const modifiers: KeyboardShortcut['modifiers'] = {};

    parts.forEach(part => {
      switch (part) {
        case 'ctrl':
        case 'control':
          modifiers.ctrl = true;
          break;
        case 'alt':
        case 'option':
          modifiers.alt = true;
          break;
        case 'shift':
          modifiers.shift = true;
          break;
        case 'cmd':
        case 'command':
        case 'meta':
          modifiers.meta = true;
          break;
      }
    });

    return { key, modifiers };
  }

  /**
   * Format a shortcut for display
   */
  static formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    
    if (shortcut.modifiers?.ctrl) parts.push('Ctrl');
    if (shortcut.modifiers?.alt) parts.push('Alt');
    if (shortcut.modifiers?.shift) parts.push('Shift');
    if (shortcut.modifiers?.meta) parts.push('Cmd');
    
    parts.push(shortcut.key.toUpperCase());
    return parts.join('+');
  }

  /**
   * Get all registered shortcuts for a context
   */
  getShortcuts(context?: ShortcutContext): ShortcutRegistration[] {
    if (context) {
      return this.shortcuts.get(context) || [];
    }
    
    // Return shortcuts from current context stack
    return this.contextStack
      .map(ctx => this.shortcuts.get(ctx) || [])
      .flat()
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Enable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Clear all shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
    this.contextStack = ['global'];
  }

  /**
   * Get service statistics
   */
  getStats(): {
    totalContexts: number;
    totalShortcuts: number;
    currentContext: ShortcutContext;
    contextStack: ShortcutContext[];
  } {
    const totalShortcuts = Array.from(this.shortcuts.values())
      .reduce((sum, shortcuts) => sum + shortcuts.length, 0);
    
    return {
      totalContexts: this.shortcuts.size,
      totalShortcuts,
      currentContext: this.getCurrentContext(),
      contextStack: [...this.contextStack]
    };
  }
}

// Create singleton instance
export const keyboardService = new KeyboardService();

/**
 * React hook for using keyboard shortcuts with automatic cleanup
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  context: ShortcutContext = 'global',
  priority: number = 0
) {
  const callbackRef = useRef(shortcut.action);
  const shortcutRef = useRef<KeyboardShortcut>({ ...shortcut });

  // Update callback ref when action changes
  useEffect(() => {
    callbackRef.current = shortcut.action;
  }, [shortcut.action]);

  // Update shortcut ref when shortcut changes
  useEffect(() => {
    shortcutRef.current = { ...shortcut };
  }, [shortcut]);

  // Register/unregister shortcut
  useEffect(() => {
    keyboardService.registerShortcut(shortcutRef.current, context, priority);
    
    return () => {
      keyboardService.unregisterShortcut(shortcutRef.current.key, context);
    };
  }, [context, priority]);

  // Return the current action for external use if needed
  return callbackRef.current;
}

/**
 * React hook for managing context
 */
export function useKeyboardContext() {
  const pushContext = useCallback((context: ShortcutContext) => {
    keyboardService.pushContext(context);
  }, []);

  const popContext = useCallback(() => {
    return keyboardService.popContext();
  }, []);

  const setContext = useCallback((context: ShortcutContext) => {
    keyboardService.setContext(context);
  }, []);

  const getCurrentContext = useCallback(() => {
    return keyboardService.getCurrentContext();
  }, []);

  return {
    pushContext,
    popContext,
    setContext,
    getCurrentContext
  };
}

/**
 * Predefined shortcut sets for common actions
 */
export const CommonShortcuts = {
  // Global shortcuts
  Global: {
    OPEN_COMMAND_PALETTE: {
      id: 'open-command-palette',
      key: 'k',
      modifiers: { meta: true },
      action: () => {
        // This would typically trigger the command palette
        window.dispatchEvent(new CustomEvent('open-command-palette'));
      },
      description: 'Open command palette',
      category: 'navigation',
      global: true
    },
    SAVE: {
      id: 'save',
      key: 's',
      modifiers: { meta: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('save-document'));
      },
      description: 'Save current document',
      category: 'file'
    },
    UNDO: {
      id: 'undo',
      key: 'z',
      modifiers: { meta: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('undo-action'));
      },
      description: 'Undo last action',
      category: 'edit'
    },
    REDO: {
      id: 'redo',
      key: 'z',
      modifiers: { meta: true, shift: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('redo-action'));
      },
      description: 'Redo last action',
      category: 'edit'
    },
    COPY: {
      id: 'copy',
      key: 'c',
      modifiers: { meta: true },
      action: () => {
        document.execCommand('copy');
      },
      description: 'Copy selected content',
      category: 'edit',
      global: true
    },
    PASTE: {
      id: 'paste',
      key: 'v',
      modifiers: { meta: true },
      action: () => {
        document.execCommand('paste');
      },
      description: 'Paste content',
      category: 'edit',
      global: true
    },
    SELECT_ALL: {
      id: 'select-all',
      key: 'a',
      modifiers: { meta: true },
      action: () => {
        document.execCommand('selectAll');
      },
      description: 'Select all content',
      category: 'edit',
      global: true
    }
  },

  // Editor shortcuts
  Editor: {
    TOGGLE_BOLD: {
      id: 'toggle-bold',
      key: 'b',
      modifiers: { meta: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('editor-action', { detail: 'toggle-bold' }));
      },
      description: 'Toggle bold formatting',
      category: 'formatting'
    },
    TOGGLE_ITALIC: {
      id: 'toggle-italic',
      key: 'i',
      modifiers: { meta: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('editor-action', { detail: 'toggle-italic' }));
      },
      description: 'Toggle italic formatting',
      category: 'formatting'
    },
    TOGGLE_UNDERLINE: {
      id: 'toggle-underline',
      key: 'u',
      modifiers: { meta: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('editor-action', { detail: 'toggle-underline' }));
      },
      description: 'Toggle underline formatting',
      category: 'formatting'
    }
  },

  // Navigation shortcuts
  Navigation: {
    GO_DASHBOARD: {
      id: 'go-dashboard',
      key: 'd',
      modifiers: { meta: true, shift: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/dashboard' }));
      },
      description: 'Go to dashboard',
      category: 'navigation'
    },
    GO_PROJECTS: {
      id: 'go-projects',
      key: 'p',
      modifiers: { meta: true, shift: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/projects' }));
      },
      description: 'Go to projects',
      category: 'navigation'
    },
    GO_FREELANCERS: {
      id: 'go-freelancers',
      key: 'f',
      modifiers: { meta: true, shift: true },
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/freelancers' }));
      },
      description: 'Go to freelancers',
      category: 'navigation'
    }
  }
};

// Export convenience function to register common shortcuts
export function registerCommonShortcuts(context: ShortcutContext = 'global'): void {
  Object.values(CommonShortcuts).forEach(shortcutSet => {
    Object.values(shortcutSet).forEach(shortcut => {
      keyboardService.registerShortcut(shortcut, context);
    });
  });
}

export default keyboardService;
