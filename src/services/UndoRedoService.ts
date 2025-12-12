/**
 * UndoRedoService - Action history management system
 * Provides undo/redo functionality with action tracking and state management
 */


export interface Action {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  data: any; // Action-specific data for undo/redo
  execute: () => Promise<void> | void; // Execute the action
  undo?: () => Promise<void> | void; // Undo the action (optional)
  redo?: () => Promise<void> | void; // Redo the action (optional)
  metadata?: {
    userId?: string;
    context?: string;
    tags?: string[];
    priority?: number;
    reversible?: boolean;
  };
}

export interface ActionHistory {
  actions: Action[];
  currentIndex: number;
  maxSize: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface ActionGroup {
  id: string;
  name: string;
  actions: Action[];
  timestamp: Date;
  metadata?: {
    description?: string;
    context?: string;
    tags?: string[];
  };
}

export interface UndoRedoOptions {
  maxHistorySize?: number;
  autoGroupSimilar?: boolean;
  groupTimeout?: number; // milliseconds
  enableCompression?: boolean;
  enablePersistence?: boolean;
  storageKey?: string;
}

export interface ActionFilter {
  type?: string;
  context?: string;
  tags?: string[];
  since?: Date;
  until?: Date;
  userId?: string;
}

export interface ActionStats {
  totalActions: number;
  actionsByType: Record<string, number>;
  averageActionTime: number;
  longestSession: number;
  mostRecentAction?: Date;
  sessionDuration: number;
}

class UndoRedoService {
  private history: ActionHistory;
  private options: UndoRedoOptions;
  private listeners: Map<string, Set<(history: ActionHistory) => void>> = new Map();
  private groupTimer: NodeJS.Timeout | null = null;
  private currentGroup: ActionGroup | null = null;
  private sessionStart: Date = new Date();
  private actionTimes: number[] = [];

  constructor(options: UndoRedoOptions = {}) {
    this.options = {
      maxHistorySize: 100,
      autoGroupSimilar: true,
      groupTimeout: 2000, // 2 seconds
      enableCompression: false,
      enablePersistence: false,
      storageKey: 'studio_roster_action_history',
      ...options
    };

    this.history = {
      actions: [],
      currentIndex: -1,
      maxSize: this.options.maxHistorySize!,
      canUndo: false,
      canRedo: false
    };

    // Load history from storage if enabled
    if (this.options.enablePersistence) {
      this.loadHistoryFromStorage();
    }

    // Setup automatic grouping
    if (this.options.autoGroupSimilar) {
      this.setupAutoGrouping();
    }
  }

  /**
   * Execute an action and add it to history
   */
  async executeAction(action: Action): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Execute the action
      await action.execute();

      // Record execution time
      const executionTime = Date.now() - startTime;
      this.actionTimes.push(executionTime);

      // Handle grouping
      if (this.shouldGroupAction(action)) {
        await this.addToCurrentGroup(action);
      } else {
        await this.addActionToHistory(action);
      }

      // Save to storage if enabled
      if (this.options.enablePersistence) {
        this.saveHistoryToStorage();
      }

      // Notify listeners
      this.notifyListeners('action_executed', this.history);
      
    } catch (error) {
      console.error('Failed to execute action:', error);
      throw error;
    }
  }

  /**
   * Undo the last action
   */
  async undo(): Promise<boolean> {
    if (!this.history.canUndo) {
      return false;
    }

    const action = this.history.actions[this.history.currentIndex];
    
    try {
      if (action.undo) {
        await action.undo();
      } else if (action.execute) {
        // Fallback: execute with reverse logic if available
        console.warn('Action does not have explicit undo method');
        return false;
      }

      // Move backwards in history
      this.history.currentIndex--;
      this.updateHistoryState();

      // Notify listeners
      this.notifyListeners('action_undone', this.history);
      
      return true;
    } catch (error) {
      console.error('Failed to undo action:', error);
      return false;
    }
  }

  /**
   * Redo the last undone action
   */
  async redo(): Promise<boolean> {
    if (!this.history.canRedo) {
      return false;
    }

    const nextIndex = this.history.currentIndex + 1;
    const action = this.history.actions[nextIndex];
    
    try {
      if (action.redo) {
        await action.redo();
      } else if (action.execute) {
        // Fallback: re-execute the action
        await action.execute();
      } else {
        console.warn('Action does not have explicit redo method');
        return false;
      }

      // Move forwards in history
      this.history.currentIndex = nextIndex;
      this.updateHistoryState();

      // Notify listeners
      this.notifyListeners('action_redone', this.history);
      
      return true;
    } catch (error) {
      console.error('Failed to redo action:', error);
      return false;
    }
  }

  /**
   * Get current history state
   */
  getHistory(): ActionHistory {
    return { ...this.history };
  }

  /**
   * Get actions filtered by criteria
   */
  getActions(filter: ActionFilter = {}): Action[] {
    let actions = this.history.actions;

    if (filter.type) {
      actions = actions.filter(action => action.type === filter.type);
    }

    if (filter.context) {
      actions = actions.filter(action => action.metadata?.context === filter.context);
    }

    if (filter.tags && filter.tags.length > 0) {
      actions = actions.filter(action => 
        action.metadata?.tags?.some(tag => filter.tags!.includes(tag))
      );
    }

    if (filter.since) {
      actions = actions.filter(action => action.timestamp >= filter.since!);
    }

    if (filter.until) {
      actions = actions.filter(action => action.timestamp <= filter.until!);
    }

    if (filter.userId) {
      actions = actions.filter(action => action.metadata?.userId === filter.userId);
    }

    return actions;
  }

  /**
   * Clear history (optionally keeping recent actions)
   */
  clearHistory(keepRecent: number = 0): void {
    if (keepRecent > 0 && this.history.actions.length > keepRecent) {
      this.history.actions = this.history.actions.slice(-keepRecent);
      this.history.currentIndex = this.history.actions.length - 1;
    } else {
      this.history.actions = [];
      this.history.currentIndex = -1;
    }

    this.updateHistoryState();
    this.notifyListeners('history_cleared', this.history);
  }

  /**
   * Create an action group
   */
  async createActionGroup(
    name: string, 
    actions: Action[], 
    metadata?: ActionGroup['metadata']
  ): Promise<ActionGroup> {
    const group: ActionGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      actions,
      timestamp: new Date(),
      metadata
    };

    // Execute all actions in the group
    for (const action of actions) {
      await this.executeAction(action);
    }

    return group;
  }

  /**
   * Undo an entire action group
   */
  async undoGroup(groupId: string): Promise<boolean> {
    // Implementation for undoing action groups
    // This would require tracking groups in the history
    console.warn('Group undo functionality not yet implemented');
    return false;
  }

  /**
   * Get action statistics
   */
  getActionStats(): ActionStats {
    const actions = this.history.actions;
    const now = new Date();
    const sessionDuration = now.getTime() - this.sessionStart.getTime();

    const actionsByType = actions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageActionTime = this.actionTimes.length > 0
      ? this.actionTimes.reduce((sum, time) => sum + time, 0) / this.actionTimes.length
      : 0;

    const longestSession = this.actionTimes.length > 0
      ? Math.max(...this.actionTimes)
      : 0;

    return {
      totalActions: actions.length,
      actionsByType,
      averageActionTime,
      longestSession,
      mostRecentAction: actions.length > 0 ? actions[actions.length - 1].timestamp : undefined,
      sessionDuration
    };
  }

  /**
   * Subscribe to history changes
   */
  subscribe(event: string, callback: (history: ActionHistory) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Export history to JSON
   */
  exportHistory(): string {
    return JSON.stringify({
      history: this.history,
      stats: this.getActionStats(),
      sessionStart: this.sessionStart,
      exportedAt: new Date()
    }, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.history && data.history.actions) {
        this.history = {
          ...data.history,
          actions: data.history.actions.map((action: any) => ({
            ...action,
            timestamp: new Date(action.timestamp)
          }))
        };
        
        this.updateHistoryState();
        this.notifyListeners('history_imported', this.history);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }

  /**
   * Create a simple action with built-in undo/redo
   */
  static createSimpleAction(
    id: string,
    type: string,
    description: string,
    executeFn: () => Promise<void> | void,
    undoFn?: () => Promise<void> | void
  ): Action {
    return {
      id,
      type,
      description,
      timestamp: new Date(),
      data: {},
      execute: executeFn,
      undo: undoFn,
      redo: executeFn // Default redo to re-execute
    };
  }

  // Private methods

  private shouldGroupAction(action: Action): boolean {
    if (!this.options.autoGroupSimilar) {
      return false;
    }

    // Group if it's the same type as the last action and within timeout
    const lastAction = this.history.actions[this.history.currentIndex];
    if (lastAction && lastAction.type === action.type) {
      const timeDiff = action.timestamp.getTime() - lastAction.timestamp.getTime();
      return timeDiff < this.options.groupTimeout!;
    }

    return false;
  }

  private async addToCurrentGroup(action: Action): Promise<void> {
    if (!this.currentGroup) {
      this.currentGroup = {
        id: `group_${Date.now()}`,
        name: `${action.type} Group`,
        actions: [action],
        timestamp: new Date()
      };
    } else {
      this.currentGroup.actions.push(action);
    }

    // Reset group timer
    this.resetGroupTimer();
  }

  private async addActionToHistory(action: Action): Promise<void> {
    // If there's a pending group, finalize it first
    if (this.currentGroup) {
      await this.finalizeCurrentGroup();
    }

    // Add action to history
    this.history.actions.push(action);
    
    // Remove future history if we've undone some actions
    if (this.history.currentIndex < this.history.actions.length - 2) {
      this.history.actions = this.history.actions.slice(0, this.history.currentIndex + 2);
    }

    // Limit history size
    if (this.history.actions.length > this.history.maxSize) {
      this.history.actions = this.history.actions.slice(-this.history.maxSize);
      this.history.currentIndex = Math.min(
        this.history.currentIndex,
        this.history.actions.length - 1
      );
    } else {
      this.history.currentIndex++;
    }

    this.updateHistoryState();
  }

  private setupAutoGrouping(): void {
    this.resetGroupTimer();
  }

  private resetGroupTimer(): void {
    if (this.groupTimer) {
      clearTimeout(this.groupTimer);
    }

    this.groupTimer = setTimeout(() => {
      this.finalizeCurrentGroup();
    }, this.options.groupTimeout);
  }

  private async finalizeCurrentGroup(): Promise<void> {
    if (this.currentGroup && this.currentGroup.actions.length > 1) {
      // Add group as a single entry in history
      const groupAction: Action = {
        id: this.currentGroup.id,
        type: 'group',
        description: `Group: ${this.currentGroup.name}`,
        timestamp: this.currentGroup.timestamp,
        data: { group: this.currentGroup },
        execute: async () => {
          for (const action of this.currentGroup!.actions) {
            await action.execute();
          }
        },
        undo: async () => {
          for (let i = this.currentGroup!.actions.length - 1; i >= 0; i--) {
            const action = this.currentGroup!.actions[i];
            if (action.undo) {
              await action.undo();
            }
          }
        }
      };

      this.history.actions.push(groupAction);
      this.history.currentIndex++;
    }

    this.currentGroup = null;
    this.groupTimer = null;
  }

  private updateHistoryState(): void {
    this.history.canUndo = this.history.currentIndex >= 0;
    this.history.canRedo = this.history.currentIndex < this.history.actions.length - 1;
  }

  private notifyListeners(event: string, history: ActionHistory): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(history);
        } catch (error) {
          console.error('Error in history listener:', error);
        }
      });
    }
  }

  private saveHistoryToStorage(): void {
    if (!this.options.enablePersistence) return;

    try {
      const data = {
        history: this.history,
        sessionStart: this.sessionStart,
        actionTimes: this.actionTimes
      };
      
      localStorage.setItem(this.options.storageKey!, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save history to storage:', error);
    }
  }

  private loadHistoryFromStorage(): void {
    if (!this.options.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.options.storageKey!);
      if (stored) {
        const data = JSON.parse(stored);
        
        this.history = {
          ...data.history,
          actions: data.history.actions.map((action: any) => ({
            ...action,
            timestamp: new Date(action.timestamp)
          }))
        };
        
        this.sessionStart = new Date(data.sessionStart);
        this.actionTimes = data.actionTimes || [];
        
        this.updateHistoryState();
      }
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
    }
  }
}

// Create singleton instance
export const undoRedoService = new UndoRedoService();

// Export convenience functions
export function createAction(
  id: string,
  type: string,
  description: string,
  execute: () => Promise<void> | void,
  options: {
    undo?: () => Promise<void> | void;
    redo?: () => Promise<void> | void;
    metadata?: Action['metadata'];
  } = {}
): Action {
  return {
    id,
    type,
    description,
    timestamp: new Date(),
    data: {},
    execute,
    undo: options.undo,
    redo: options.redo || execute,
    metadata: options.metadata
  };
}

export function createBatchAction(
  actions: Action[],
  name: string = 'Batch Action'
): Action {
  return {
    id: `batch_${Date.now()}`,
    type: 'batch',
    description: name,
    timestamp: new Date(),
    data: { actions },
    execute: async () => {
      for (const action of actions) {
        await action.execute();
      }
    },
    undo: async () => {
      for (let i = actions.length - 1; i >= 0; i--) {
        const action = actions[i];
        if (action.undo) {
          await action.undo();
        }
      }
    },
    redo: async () => {
      for (const action of actions) {
        await action.execute();
      }
    }
  };
}

export default UndoRedoService;
