/**
 * useAutoSave - React hook for auto-save functionality
 * Integrates with DraftService to provide easy auto-save handling in React components
 */

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import {
  draftService,
  DraftData,
  DraftOptions,
  DraftMetadata
} from '../services/DraftService';
import { debounce } from '../lib/utils';

interface UseAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  debounceMs?: number;
  maxSize?: number;
  onSave?: (draft: DraftData) => void;
  onError?: (error: Error) => void;
  onAutoSave?: (draft: DraftData) => void;
  onStatusChange?: (status: DraftData['status']) => void;
  enableVersioning?: boolean;
  maxVersions?: number;
}

interface UseAutoSaveReturn {
  // State
  draft: DraftData | null;
  status: DraftData['status'];
  isDirty: boolean;
  lastSaved: Date | null;
  error: string | null;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  save: () => Promise<void>;
  update: (content: any, metadata?: Partial<DraftData['metadata']>) => Promise<void>;
  createDraft: (content: any, metadata?: Partial<DraftData['metadata']>) => Promise<void>;
  deleteDraft: () => Promise<void>;
  toggleAutoSave: (enabled: boolean) => void;
  restoreVersion: (version: number) => Promise<void>;
  getVersions: () => import('../services/DraftService').VersionInfo[];

  // Utility
  getMetadata: () => DraftMetadata | null;
  getStats: () => ReturnType<typeof draftService.getStorageStats>;
  clearError: () => void;
  exportDraft: () => string | null;
  importDraft: (data: string) => Promise<boolean>;
}

interface AutoSaveState {
  draft: DraftData | null;
  status: DraftData['status'];
  isDirty: boolean;
  lastSaved: Date | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook for managing auto-save functionality in React components
 */
export function useAutoSave(
  draftId: string,
  draftType: DraftData['type'],
  initialContent: any = {},
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const {
    enabled = true,
    interval = 30000, // 30 seconds
    debounceMs = 2000, // 2 seconds
    maxSize = 1024 * 1024, // 1MB
    onSave,
    onError,
    onAutoSave,
    onStatusChange,
    enableVersioning = true,
    maxVersions = 10
  } = options;

  const [state, setState] = useState<AutoSaveState>({
    draft: null,
    status: 'draft',
    isDirty: false,
    lastSaved: null,
    error: null,
    isLoading: false
  });

  const contentRef = useRef<any>(initialContent);
  const metadataRef = useRef<Partial<DraftData['metadata']>>({});
  const isManualSaveRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create draft on mount if it doesn't exist
  useEffect(() => {
    const existingDraft = draftService.getDraft(draftId);
    if (existingDraft) {
      setState(prev => ({
        ...prev,
        draft: existingDraft,
        status: existingDraft.status,
        isDirty: false,
        lastSaved: existingDraft.lastSaved || null,
        error: existingDraft.error || null
      }));
      contentRef.current = existingDraft.content;
    } else {
      // Create new draft
      createDraftInternal(initialContent, {});
    }
  }, [draftId, draftType]);

  // Subscribe to draft changes
  useEffect(() => {
    const unsubscribe = draftService.subscribe(draftId, (draft: DraftData) => {
      setState(prev => {
        const newState = {
          ...prev,
          draft,
          status: draft.status,
          isDirty: draft.status === 'draft',
          lastSaved: draft.lastSaved || null,
          error: draft.error || null,
          isLoading: draft.status === 'saving'
        };

        // Trigger callbacks
        if (onStatusChange) {
          onStatusChange(draft.status);
        }

        if (draft.status === 'saved' && onSave) {
          onSave(draft);
        }

        if (draft.status === 'error' && onError && draft.error) {
          onError(new Error(draft.error));
        }

        return newState;
      });
    });

    return unsubscribe;
  }, [draftId, onSave, onError, onStatusChange]);

  // Auto-save timer
  useEffect(() => {
    if (enabled && !state.isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (state.isDirty && !isManualSaveRef.current) {
          performAutoSave();
        }
      }, interval);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [enabled, state.isDirty, state.isLoading, interval]);

  /**
   * Create a new draft
   */
  const createDraftInternal = useCallback(async (content: any, metadata: Partial<DraftData['metadata']>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const draftOptions: DraftOptions = {
        autoSaveInterval: enabled ? interval : 0,
        enableVersioning,
        maxVersions
      };

      const draft = await draftService.createDraft(
        draftId,
        draftType,
        content,
        {
          ...metadataRef.current,
          ...metadata,
          title: metadata.title || `Untitled ${draftType}`
        }
      );

      setState(prev => ({
        ...prev,
        draft,
        status: draft.status,
        isDirty: false,
        lastSaved: draft.lastSaved || null,
        error: null,
        isLoading: false
      }));

      contentRef.current = content;
      return draft;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create draft';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));

      if (onError) {
        onError(new Error(errorMessage));
      }

      throw error;
    }
  }, [draftId, draftType, enabled, interval, enableVersioning, maxVersions, onError]);

  /**
   * Update draft content
   */
  const update = useCallback(
    debounce(async (content: any, metadata?: Partial<DraftData['metadata']>) => {
      if (!state.draft) {
        await createDraftInternal(content, metadata);
        return;
      }

      // Check size limit
      const contentSize = JSON.stringify(content).length;
      if (contentSize > maxSize) {
        const error = new Error(`Content size (${contentSize} bytes) exceeds limit (${maxSize} bytes)`);
        setState(prev => ({ ...prev, error: error.message }));

        if (onError) {
          onError(error);
        }
        return;
      }

      contentRef.current = content;
      if (metadata) {
        metadataRef.current = { ...metadataRef.current, ...metadata };
      }

      try {
        await draftService.updateDraft(draftId, content, {
          ...metadataRef.current,
          ...metadata
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update draft';
        setState(prev => ({ ...prev, error: errorMessage }));

        if (onError) {
          onError(new Error(errorMessage));
        }
      }
    }, debounceMs),
    [state.draft, draftId, maxSize, debounceMs, onError, createDraftInternal]
  );

  /**
   * Save draft immediately
   */
  const save = useCallback(async () => {
    if (!state.draft) {
      await createDraftInternal(contentRef.current, metadataRef.current);
      return;
    }

    try {
      isManualSaveRef.current = true;
      await draftService.saveDraft(draftId);

      if (onSave) {
        onSave(state.draft);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      setState(prev => ({ ...prev, error: errorMessage }));

      if (onError) {
        onError(new Error(errorMessage));
      }
    } finally {
      isManualSaveRef.current = false;
    }
  }, [state.draft, draftId, onSave, onError, createDraftInternal]);

  /**
   * Perform automatic save
   */
  const performAutoSave = useCallback(async () => {
    if (!state.draft || !enabled || isManualSaveRef.current) {
      return;
    }

    try {
      const draft = await draftService.saveDraft(draftId);

      if (onAutoSave) {
        onAutoSave(draft);
      }
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }, [state.draft, enabled, draftId, onAutoSave]);

  /**
   * Create draft (public method)
   */
  const createDraft = useCallback(async (content: any, metadata?: Partial<DraftData['metadata']>) => {
    await createDraftInternal(content, metadata);
  }, [createDraftInternal]);

  /**
   * Delete draft
   */
  const deleteDraft = useCallback(async () => {
    try {
      await draftService.deleteDraft(draftId);
      setState({
        draft: null,
        status: 'draft',
        isDirty: false,
        lastSaved: null,
        error: null,
        isLoading: false
      });
      contentRef.current = null;
      metadataRef.current = {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete draft';
      setState(prev => ({ ...prev, error: errorMessage }));

      if (onError) {
        onError(new Error(errorMessage));
      }
    }
  }, [draftId, onError]);

  /**
   * Toggle auto-save
   */
  const toggleAutoSave = useCallback((autoSaveEnabled: boolean) => {
    if (state.draft) {
      draftService.toggleAutoSave(draftId, autoSaveEnabled);
    }
  }, [state.draft, draftId]);

  /**
   * Restore version
   */
  const restoreVersion = useCallback(async (version: number) => {
    try {
      const draft = await draftService.restoreVersion(draftId, version);
      setState(prev => ({
        ...prev,
        draft,
        status: draft.status,
        isDirty: draft.status === 'draft',
        lastSaved: draft.lastSaved || null,
        error: draft.error || null
      }));
      contentRef.current = draft.content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore version';
      setState(prev => ({ ...prev, error: errorMessage }));

      if (onError) {
        onError(new Error(errorMessage));
      }
    }
  }, [draftId, onError]);

  /**
   * Get versions
   */
  const getVersions = useCallback(() => {
    return draftService.getVersions(draftId);
  }, [draftId]);

  /**
   * Get draft metadata
   */
  const getMetadata = useCallback(() => {
    if (!state.draft) return null;

    return {
      id: state.draft.id,
      title: state.draft.metadata.title || 'Untitled',
      type: state.draft.type,
      lastModified: state.draft.metadata.lastModified,
      size: state.draft.metadata.size,
      status: state.draft.status,
      hasUnsavedChanges: state.draft.status === 'draft',
      projectId: state.draft.metadata.projectId,
      version: state.draft.metadata.version
    };
  }, [state.draft]);

  /**
   * Get storage stats
   */
  const getStats = useCallback(() => {
    return draftService.getStorageStats();
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Export draft
   */
  const exportDraft = useCallback(() => {
    if (!state.draft) return null;

    return JSON.stringify({
      draft: state.draft,
      content: contentRef.current,
      exportedAt: new Date()
    }, null, 2);
  }, [state.draft]);

  /**
   * Import draft
   */
  const importDraft = useCallback(async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.draft && parsed.content) {
        await createDraftInternal(parsed.content, parsed.draft.metadata);
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = 'Failed to import draft';
      setState(prev => ({ ...prev, error: errorMessage }));

      if (onError) {
        onError(new Error(errorMessage));
      }
      return false;
    }
  }, [createDraftInternal, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const canUndo = useMemo(() => {
    // This would integrate with UndoRedoService if available
    return false; // Placeholder
  }, []);

  const canRedo = useMemo(() => {
    // This would integrate with UndoRedoService if available
    return false; // Placeholder
  }, []);

  return {
    // State
    draft: state.draft,
    status: state.status,
    isDirty: state.isDirty,
    lastSaved: state.lastSaved,
    error: state.error,
    canUndo,
    canRedo,

    // Actions
    save,
    update,
    createDraft,
    deleteDraft,
    toggleAutoSave,
    restoreVersion,
    getVersions,

    // Utility
    getMetadata,
    getStats,
    clearError,
    exportDraft,
    importDraft
  };
}

/**
 * Hook for managing multiple drafts
 */
export function useAutoSaveMultiple(
  drafts: Array<{
    id: string;
    type: DraftData['type'];
    content: any;
    options?: UseAutoSaveOptions;
  }>
) {
  const [draftsState, setDraftsState] = useState<Map<string, ReturnType<typeof useAutoSave>>>(new Map());

  useEffect(() => {
    const newDraftsState = new Map<string, ReturnType<typeof useAutoSave>>();

    drafts.forEach(draft => {
      const autoSaveHook = useAutoSave(draft.id, draft.type, draft.content, draft.options);
      newDraftsState.set(draft.id, autoSaveHook);
    });

    setDraftsState(newDraftsState);
  }, [drafts]);

  const getDraft = useCallback((draftId: string) => {
    return draftsState.get(draftId);
  }, [draftsState]);

  const getAllDrafts = useCallback(() => {
    return Array.from(draftsState.values());
  }, [draftsState]);

  const saveAll = useCallback(async () => {
    const promises = Array.from(draftsState.values()).map(draft => draft.save());
    await Promise.all(promises);
  }, [draftsState]);

  const updateDraft = useCallback((draftId: string, content: any, metadata?: Partial<DraftData['metadata']>) => {
    const draft = draftsState.get(draftId);
    if (draft) {
      draft.update(content, metadata);
    }
  }, [draftsState]);

  return {
    getDraft,
    getAllDrafts,
    saveAll,
    updateDraft
  };
}

/**
 * Hook for auto-save with conflict resolution
 */
export function useAutoSaveWithConflicts(
  draftId: string,
  draftType: DraftData['type'],
  initialContent: any = {},
  options: UseAutoSaveOptions & {
    onConflict?: (localDraft: DraftData, remoteDraft: DraftData) => Promise<'keep-local' | 'keep-remote' | 'merge'>;
  } = {}
) {
  const autoSave = useAutoSave(draftId, draftType, initialContent, options);
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictingDraft, setConflictingDraft] = useState<DraftData | null>(null);

  useEffect(() => {
    if (autoSave.draft && conflictingDraft) {
      const localLastModified = autoSave.draft.metadata.lastModified.getTime();
      const remoteLastModified = conflictingDraft.metadata.lastModified.getTime();

      if (remoteLastModified > localLastModified) {
        setHasConflict(true);
      }
    }
  }, [autoSave.draft, conflictingDraft]);

  const resolveConflict = useCallback(async (resolution: 'keep-local' | 'keep-remote' | 'merge') => {
    if (!hasConflict || !conflictingDraft) return;

    try {
      switch (resolution) {
        case 'keep-local':
          // Keep local changes, discard remote
          setHasConflict(false);
          setConflictingDraft(null);
          break;
        case 'keep-remote':
          // Replace local with remote
          await autoSave.update(conflictingDraft.content, conflictingDraft.metadata);
          setHasConflict(false);
          setConflictingDraft(null);
          break;
        case 'merge':
          // This would require a merge function
          if (options.onConflict) {
            const result = await options.onConflict(autoSave.draft!, conflictingDraft);
            resolveConflict(result);
          }
          break;
      }
    } catch (error) {
      console.error('Conflict resolution failed:', error);
    }
  }, [hasConflict, conflictingDraft, autoSave, options.onConflict]);

  return {
    ...autoSave,
    hasConflict,
    conflictingDraft,
    resolveConflict
  };
}
