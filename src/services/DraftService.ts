/**
 * DraftService - Auto-save and draft management system
 * Provides automatic saving, version control, and recovery capabilities
 */

import { debounce } from '../lib/utils';

export interface DraftData {
  id: string;
  type: 'project' | 'script' | 'message' | 'design' | 'document';
  content: any;
  metadata: {
    title?: string;
    projectId?: string;
    userId?: string;
    lastModified: Date;
    version: number;
    size: number;
    tags?: string[];
  };
  status: 'draft' | 'saving' | 'saved' | 'error';
  autoSaveEnabled: boolean;
  lastSaved?: Date;
  error?: string;
}

export interface DraftOptions {
  autoSaveInterval?: number; // milliseconds
  maxDrafts?: number;
  enableVersioning?: boolean;
  maxVersions?: number;
  debounceMs?: number;
  enableEncryption?: boolean;
}

export interface DraftMetadata {
  id: string;
  title: string;
  type: DraftData['type'];
  lastModified: Date;
  size: number;
  status: DraftData['status'];
  hasUnsavedChanges: boolean;
  projectId?: string;
  version: number;
}

export interface VersionInfo {
  id: string;
  draftId: string;
  version: number;
  content: any;
  timestamp: Date;
  size: number;
  checksum: string;
  description?: string;
}

class DraftService {
  private static instance: DraftService | null = null;
  private drafts: Map<string, DraftData> = new Map();
  private versions: Map<string, VersionInfo[]> = new Map();
  private autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();
  private options: DraftOptions;
  private listeners: Map<string, Set<(draft: DraftData) => void>> = new Map();
  private storageKey = 'studio_roster_drafts';
  private versionStorageKey = 'studio_roster_versions';

  private constructor(options: DraftOptions = {}) {
    this.options = {
      autoSaveInterval: 30000, // 30 seconds
      maxDrafts: 50,
      enableVersioning: true,
      maxVersions: 10,
      debounceMs: 2000, // 2 seconds
      enableEncryption: false,
      ...options
    };

    // Load drafts from storage on initialization
    this.loadDraftsFromStorage();
    this.loadVersionsFromStorage();
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: DraftOptions): DraftService {
    if (!DraftService.instance) {
      DraftService.instance = new DraftService(options);
    }
    return DraftService.instance;
  }

  /**
   * Create a new draft
   */
  async createDraft(
    id: string,
    type: DraftData['type'],
    content: any,
    metadata: Partial<DraftData['metadata']> = {}
  ): Promise<DraftData> {
    const draft: DraftData = {
      id,
      type,
      content: this.serializeContent(content),
      metadata: {
        title: metadata.title || 'Untitled',
        projectId: metadata.projectId,
        userId: metadata.userId,
        lastModified: new Date(),
        version: 1,
        size: this.calculateSize(content),
        tags: metadata.tags || [],
        ...metadata
      },
      status: 'draft',
      autoSaveEnabled: true
    };

    this.drafts.set(id, draft);
    this.saveDraftToStorage(id);
    this.notifyListeners(id, draft);

    // Start auto-save if enabled
    if (draft.autoSaveEnabled) {
      this.startAutoSave(id);
    }

    return draft;
  }

  /**
   * Update draft content
   */
  async updateDraft(
    id: string,
    content: any,
    metadata?: Partial<DraftData['metadata']>
  ): Promise<DraftData> {
    const draft = this.drafts.get(id);
    if (!draft) {
      throw new Error(`Draft with id ${id} not found`);
    }

    // Create version before update if versioning is enabled
    if (this.options.enableVersioning) {
      await this.createVersion(id, `Auto-save before update to v${draft.metadata.version + 1}`);
    }

    // Update draft
    draft.content = this.serializeContent(content);
    draft.metadata = {
      ...draft.metadata,
      ...metadata,
      lastModified: new Date(),
      version: draft.metadata.version + 1,
      size: this.calculateSize(content)
    };
    draft.status = 'draft';

    this.drafts.set(id, draft);
    this.saveDraftToStorage(id);
    this.notifyListeners(id, draft);

    // Trigger auto-save
    if (draft.autoSaveEnabled) {
      this.triggerAutoSave(id);
    }

    return draft;
  }

  /**
   * Save draft immediately
   */
  async saveDraft(id: string): Promise<DraftData> {
    const draft = this.drafts.get(id);
    if (!draft) {
      throw new Error(`Draft with id ${id} not found`);
    }

    draft.status = 'saving';
    this.notifyListeners(id, draft);

    try {
      // Simulate async save operation
      await this.performSave(draft);
      
      draft.status = 'saved';
      draft.lastSaved = new Date();
      delete draft.error;

      this.drafts.set(id, draft);
      this.saveDraftToStorage(id);
      this.notifyListeners(id, draft);

      return draft;
    } catch (error) {
      draft.status = 'error';
      draft.error = error instanceof Error ? error.message : 'Unknown error';
      this.drafts.set(id, draft);
      this.notifyListeners(id, draft);
      throw error;
    }
  }

  /**
   * Get draft by ID
   */
  getDraft(id: string): DraftData | undefined {
    return this.drafts.get(id);
  }

  /**
   * Get all drafts
   */
  getAllDrafts(): DraftData[] {
    return Array.from(this.drafts.values()).sort((a, b) => 
      b.metadata.lastModified.getTime() - a.metadata.lastModified.getTime()
    );
  }

  /**
   * Get drafts by type
   */
  getDraftsByType(type: DraftData['type']): DraftData[] {
    return this.getAllDrafts().filter(draft => draft.type === type);
  }

  /**
   * Get drafts by project
   */
  getDraftsByProject(projectId: string): DraftData[] {
    return this.getAllDrafts().filter(draft => draft.metadata.projectId === projectId);
  }

  /**
   * Get draft metadata (lightweight listing)
   */
  getDraftMetadata(): DraftMetadata[] {
    return this.getAllDrafts().map(draft => ({
      id: draft.id,
      title: draft.metadata.title || 'Untitled',
      type: draft.type,
      lastModified: draft.metadata.lastModified,
      size: draft.metadata.size,
      status: draft.status,
      hasUnsavedChanges: draft.status === 'draft',
      projectId: draft.metadata.projectId,
      version: draft.metadata.version
    }));
  }

  /**
   * Delete draft
   */
  async deleteDraft(id: string): Promise<void> {
    const draft = this.drafts.get(id);
    if (!draft) {
      return; // Already deleted
    }

    // Stop auto-save timer
    this.stopAutoSave(id);

    // Remove from drafts
    this.drafts.delete(id);

    // Remove from storage
    this.removeDraftFromStorage(id);

    // Clean up versions if they exist
    if (this.options.enableVersioning) {
      await this.deleteVersions(id);
    }

    this.notifyListeners(id, draft);
  }

  /**
   * Enable/disable auto-save for a draft
   */
  toggleAutoSave(id: string, enabled: boolean): void {
    const draft = this.drafts.get(id);
    if (!draft) return;

    draft.autoSaveEnabled = enabled;

    if (enabled) {
      this.startAutoSave(id);
    } else {
      this.stopAutoSave(id);
    }

    this.drafts.set(id, draft);
    this.saveDraftToStorage(id);
    this.notifyListeners(id, draft);
  }

  /**
   * Create a version of the draft
   */
  async createVersion(
    id: string,
    description?: string
  ): Promise<VersionInfo> {
    const draft = this.drafts.get(id);
    if (!draft) {
      throw new Error(`Draft with id ${id} not found`);
    }

    const version: VersionInfo = {
      id: `v${draft.metadata.version}_${Date.now()}`,
      draftId: id,
      version: draft.metadata.version,
      content: { ...draft.content },
      timestamp: new Date(),
      size: draft.metadata.size,
      checksum: this.calculateChecksum(draft.content),
      description
    };

    const versions = this.versions.get(id) || [];
    versions.push(version);

    // Keep only the latest maxVersions
    if (versions.length > (this.options.maxVersions || 10)) {
      versions.splice(0, versions.length - (this.options.maxVersions || 10));
    }

    this.versions.set(id, versions);
    this.saveVersionsToStorage(id);

    return version;
  }

  /**
   * Get versions for a draft
   */
  getVersions(id: string): VersionInfo[] {
    return (this.versions.get(id) || []).sort((a, b) => 
      b.version - a.version
    );
  }

  /**
   * Restore a specific version
   */
  async restoreVersion(id: string, versionNumber: number): Promise<DraftData> {
    const versions = this.versions.get(id);
    if (!versions) {
      throw new Error(`No versions found for draft ${id}`);
    }

    const version = versions.find(v => v.version === versionNumber);
    if (!version) {
      throw new Error(`Version ${versionNumber} not found for draft ${id}`);
    }

    // Update draft with version content
    const draft = this.drafts.get(id);
    if (!draft) {
      throw new Error(`Draft with id ${id} not found`);
    }

    draft.content = { ...version.content };
    draft.metadata.version = version.version;
    draft.metadata.lastModified = new Date();

    this.drafts.set(id, draft);
    this.saveDraftToStorage(id);
    this.notifyListeners(id, draft);

    return draft;
  }

  /**
   * Delete all versions for a draft
   */
  async deleteVersions(id: string): Promise<void> {
    this.versions.delete(id);
    this.removeVersionsFromStorage(id);
  }

  /**
   * Clean up old drafts based on options
   */
  async cleanup(): Promise<void> {
    const drafts = this.getAllDrafts();

    // Remove drafts exceeding maxDrafts limit
    if (drafts.length > (this.options.maxDrafts || 50)) {
      const toDelete = drafts.slice(this.options.maxDrafts || 50);
      for (const draft of toDelete) {
        await this.deleteDraft(draft.id);
      }
    }

    // Clean up orphaned versions
    for (const [draftId, versions] of this.versions.entries()) {
      if (!this.drafts.has(draftId)) {
        this.versions.delete(draftId);
        this.removeVersionsFromStorage(draftId);
      }
    }
  }

  /**
   * Subscribe to draft changes
   */
  subscribe(id: string, callback: (draft: DraftData) => void): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    
    this.listeners.get(id)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(id);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(id);
        }
      }
    };
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    totalDrafts: number;
    totalVersions: number;
    totalSize: number;
    draftsByType: Record<string, number>;
    oldestDraft?: Date;
    newestDraft?: Date;
  } {
    const drafts = this.getAllDrafts();
    const totalSize = drafts.reduce((sum, draft) => sum + draft.metadata.size, 0);
    const totalVersions = Array.from(this.versions.values())
      .reduce((sum, versions) => sum + versions.length, 0);

    const draftsByType = drafts.reduce((acc, draft) => {
      acc[draft.type] = (acc[draft.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = drafts.map(d => d.metadata.lastModified);
    const oldestDraft = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : undefined;
    const newestDraft = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : undefined;

    return {
      totalDrafts: drafts.length,
      totalVersions,
      totalSize,
      draftsByType,
      oldestDraft,
      newestDraft
    };
  }

  /**
   * Simple method to save draft (alias for compatibility)
   */
  async saveDraftCompat(draftId: string, data: any): Promise<void> {
    await this.updateDraft(draftId, data);
  }

  /**
   * Simple method to load draft (alias for compatibility)
   */
  loadDraft(draftId: string): any {
    const draft = this.getDraft(draftId);
    return draft ? draft.content : null;
  }

  // Private methods

  private startAutoSave(id: string): void {
    this.stopAutoSave(id); // Clear any existing timer
    
    const timer = setTimeout(() => {
      this.performAutoSave(id);
    }, this.options.autoSaveInterval);

    this.autoSaveTimers.set(id, timer);
  }

  private stopAutoSave(id: string): void {
    const timer = this.autoSaveTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.autoSaveTimers.delete(id);
    }
  }

  private triggerAutoSave = debounce((id: string) => {
    this.performAutoSave(id);
  }, this.options.debounceMs);

  private async performAutoSave(id: string): Promise<void> {
    const draft = this.drafts.get(id);
    if (!draft || !draft.autoSaveEnabled) return;

    try {
      await this.saveDraft(id);
    } catch (error) {
      console.warn(`Auto-save failed for draft ${id}:`, error);
    }
  }

  private async performSave(draft: DraftData): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real implementation, this would make an API call
    // await api.saveDraft(draft);
  }

  private serializeContent(content: any): any {
    try {
      return JSON.parse(JSON.stringify(content));
    } catch (error) {
      return { data: content };
    }
  }

  private calculateSize(content: any): number {
    try {
      return new Blob([JSON.stringify(content)]).size;
    } catch (error) {
      return 0;
    }
  }

  private calculateChecksum(content: any): string {
    // Simple checksum calculation
    const str = JSON.stringify(content);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private notifyListeners(id: string, draft: DraftData): void {
    const callbacks = this.listeners.get(id);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(draft);
        } catch (error) {
          console.error('Error in draft listener:', error);
        }
      });
    }
  }

  private saveDraftToStorage(id: string): void {
    try {
      const draft = this.drafts.get(id);
      if (!draft) return;

      const storage = this.getDraftStorage();
      storage[id] = {
        ...draft,
        metadata: {
          ...draft.metadata,
          lastModified: draft.metadata.lastModified.toISOString()
        },
        lastSaved: draft.lastSaved?.toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (error) {
      console.warn('Failed to save draft to storage:', error);
    }
  }

  private removeDraftFromStorage(id: string): void {
    try {
      const storage = this.getDraftStorage();
      delete storage[id];
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (error) {
      console.warn('Failed to remove draft from storage:', error);
    }
  }

  private saveVersionsToStorage(id: string): void {
    try {
      const versions = this.versions.get(id);
      if (!versions) return;

      const storage = this.getVersionStorage();
      storage[id] = versions.map(v => ({
        ...v,
        timestamp: v.timestamp.toISOString()
      }));

      localStorage.setItem(this.versionStorageKey, JSON.stringify(storage));
    } catch (error) {
      console.warn('Failed to save versions to storage:', error);
    }
  }

  private removeVersionsFromStorage(id: string): void {
    try {
      const storage = this.getVersionStorage();
      delete storage[id];
      localStorage.setItem(this.versionStorageKey, JSON.stringify(storage));
    } catch (error) {
      console.warn('Failed to remove versions from storage:', error);
    }
  }

  private getDraftStorage(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load drafts from storage:', error);
      return {};
    }
  }

  private getVersionStorage(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.versionStorageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load versions from storage:', error);
      return {};
    }
  }

  private loadDraftsFromStorage(): void {
    try {
      const storage = this.getDraftStorage();
      for (const [id, draftData] of Object.entries(storage)) {
        const draft: DraftData = {
          ...draftData,
          metadata: {
            ...draftData.metadata,
            lastModified: new Date(draftData.metadata.lastModified)
          },
          lastSaved: draftData.lastSaved ? new Date(draftData.lastSaved) : undefined
        } as DraftData;

        this.drafts.set(id, draft);

        // Start auto-save if enabled
        if (draft.autoSaveEnabled) {
          this.startAutoSave(id);
        }
      }
    } catch (error) {
      console.warn('Failed to load drafts from storage:', error);
    }
  }

  private loadVersionsFromStorage(): void {
    try {
      const storage = this.getVersionStorage();
      for (const [id, versionData] of Object.entries(storage)) {
        const versions = (versionData as any[]).map(v => ({
          ...v,
          timestamp: new Date(v.timestamp)
        }));
        this.versions.set(id, versions);
      }
    } catch (error) {
      console.warn('Failed to load versions from storage:', error);
    }
  }
}

// Export singleton instance
export const draftService = DraftService.getInstance();
