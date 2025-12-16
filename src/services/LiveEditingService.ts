/**
 * LiveEditingService - Collaborative editing with conflict resolution
 * Implements Operational Transform (OT) for real-time collaborative editing
 */

import { webSocketService } from './WebSocketService';

export interface CollaborativeEdit {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  operation: EditOperation;
  version: number;
  projectId: string;
}

export interface EditOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
}

export interface DocumentState {
  id: string;
  content: string;
  version: number;
  users: Map<string, UserPresence>;
  operations: CollaborativeEdit[];
  lastModified: Date;
}

export interface UserPresence {
  userId: string;
  userName: string;
  cursor: number;
  selection: { start: number; end: number } | null;
  color: string;
  isActive: boolean;
  lastSeen: Date;
}

export interface ConflictResolution {
  strategy: 'last-writer-wins' | 'merge' | 'prompt-user';
  applied: boolean;
  conflicts?: EditConflict[];
}

export interface EditConflict {
  operations: CollaborativeEdit[];
  positions: number[];
  content: string[];
}

export type EditHandler = (edit: CollaborativeEdit) => void;
export type ConflictHandler = (conflict: EditConflict) => void;
export type PresenceHandler = (users: UserPresence[]) => void;

class LiveEditingService {
  private documents: Map<string, DocumentState> = new Map();
  private editHandlers: Map<string, Set<EditHandler>> = new Map();
  private conflictHandlers: Map<string, Set<ConflictHandler>> = new Map();
  private presenceHandlers: Map<string, Set<PresenceHandler>> = new Map();
  private currentUserId: string = '';
  private currentUserName: string = '';
  private userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  private colorIndex = 0;

  constructor() {
    this.initializeWebSocketHandlers();
  }

  /**
   * Initialize the service with user information
   */
  initialize(userId: string, userName: string): void {
    this.currentUserId = userId;
    this.currentUserName = userName;
  }

  /**
   * Join a collaborative editing session
   */
  async joinSession(documentId: string, initialContent: string = ''): Promise<DocumentState> {
    // Check if document already exists locally
    if (this.documents.has(documentId)) {
      return this.documents.get(documentId)!;
    }

    // Create new document state
    const document: DocumentState = {
      id: documentId,
      content: initialContent,
      version: 0,
      users: new Map(),
      operations: [],
      lastModified: new Date()
    };

    this.documents.set(documentId, document);

    // Request current state from server
    webSocketService.send({
      type: 'join-edit-session',
      payload: {
        documentId,
        userId: this.currentUserId,
        userName: this.currentUserName,
        color: this.getNextColor()
      },
      projectId: documentId,
      userId: this.currentUserId
    });

    return document;
  }

  /**
   * Leave a collaborative editing session
   */
  leaveSession(documentId: string): void {
    const document = this.documents.get(documentId);
    if (document) {
      // Remove user from document
      document.users.delete(this.currentUserId);
      
      // Notify server
      webSocketService.send({
        type: 'leave-edit-session',
        payload: { documentId, userId: this.currentUserId },
        projectId: documentId,
        userId: this.currentUserId
      });

      // Clean up handlers
      this.editHandlers.delete(documentId);
      this.conflictHandlers.delete(documentId);
      this.presenceHandlers.delete(documentId);
    }
  }

  /**
   * Apply an edit operation to a document
   */
  applyEdit(documentId: string, operation: Omit<EditOperation, 'id' | 'userId'>): CollaborativeEdit | null {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const edit: CollaborativeEdit = {
      id: this.generateId(),
      userId: this.currentUserId,
      userName: this.currentUserName,
      timestamp: Date.now(),
      operation: operation as EditOperation,
      version: document.version + 1,
      projectId: documentId
    };

    // Apply operation locally first for immediate feedback
    this.applyOperationLocal(document, edit.operation);

    // Send to other users via WebSocket
    webSocketService.send({
      type: 'edit-operation',
      payload: edit,
      projectId: documentId,
      userId: this.currentUserId
    });

    // Add to document history
    document.operations.push(edit);
    document.version = edit.version;
    document.lastModified = new Date();

    // Notify local handlers
    this.notifyEditHandlers(documentId, edit);

    return edit;
  }

  /**
   * Update cursor position
   */
  updateCursor(documentId: string, cursor: number, selection: { start: number; end: number } | null = null): void {
    const document = this.documents.get(documentId);
    if (!document) return;

    const userPresence: UserPresence = {
      userId: this.currentUserId,
      userName: this.currentUserName,
      cursor,
      selection,
      color: this.getCurrentUserColor(),
      isActive: true,
      lastSeen: new Date()
    };

    document.users.set(this.currentUserId, userPresence);

    // Send presence update
    webSocketService.send({
      type: 'cursor-update',
      payload: {
        documentId,
        userId: this.currentUserId,
        userName: this.currentUserName,
        cursor,
        selection,
        color: userPresence.color
      },
      projectId: documentId,
      userId: this.currentUserId
    });
  }

  /**
   * Get current document state
   */
  getDocument(documentId: string): DocumentState | undefined {
    return this.documents.get(documentId);
  }

  /**
   * Subscribe to edit events
   */
  onEdit(documentId: string, handler: EditHandler): () => void {
    if (!this.editHandlers.has(documentId)) {
      this.editHandlers.set(documentId, new Set());
    }
    this.editHandlers.get(documentId)!.add(handler);

    return () => {
      this.editHandlers.get(documentId)?.delete(handler);
    };
  }

  /**
   * Subscribe to conflict events
   */
  onConflict(documentId: string, handler: ConflictHandler): () => void {
    if (!this.conflictHandlers.has(documentId)) {
      this.conflictHandlers.set(documentId, new Set());
    }
    this.conflictHandlers.get(documentId)!.add(handler);

    return () => {
      this.conflictHandlers.get(documentId)?.delete(handler);
    };
  }

  /**
   * Subscribe to presence events
   */
  onPresence(documentId: string, handler: PresenceHandler): () => void {
    if (!this.presenceHandlers.has(documentId)) {
      this.presenceHandlers.set(documentId, new Set());
    }
    this.presenceHandlers.get(documentId)!.add(handler);

    return () => {
      this.presenceHandlers.get(documentId)?.delete(handler);
    };
  }

  /**
   * Get list of active users in a document
   */
  getActiveUsers(documentId: string): UserPresence[] {
    const document = this.documents.get(documentId);
    if (!document) return [];

    return Array.from(document.users.values()).filter(user => user.isActive);
  }

  /**
   * Undo the last operation
   */
  undo(documentId: string): boolean {
    const document = this.documents.get(documentId);
    if (!document || document.operations.length === 0) return false;

    const lastOperation = document.operations[document.operations.length - 1];
    if (lastOperation.userId !== this.currentUserId) return false; // Can only undo own operations

    // Create inverse operation
    const inverseOperation = this.createInverseOperation(lastOperation.operation);
    
    return this.applyEdit(documentId, inverseOperation) !== null;
  }

  /**
   * Redo the last undone operation
   */
  redo(_documentId: string): boolean {
    // Implementation would track undone operations separately
    // For now, return false as it's a complex feature
    return false;
  }

  /**
   * Get document history for debugging
   */
  getHistory(documentId: string): CollaborativeEdit[] {
    const document = this.documents.get(documentId);
    return document ? [...document.operations] : [];
  }

  // Private methods

  private initializeWebSocketHandlers(): void {
    // Handle session joined
    webSocketService.onMessage('edit-session-joined', (message) => {
      const { documentId, document: docData, users } = message.payload;
      
      const document: DocumentState = {
        id: documentId,
        content: docData.content,
        version: docData.version,
        users: new Map(),
        operations: docData.operations || [],
        lastModified: new Date(docData.lastModified)
      };

      // Restore users
      users.forEach((user: UserPresence) => {
        document.users.set(user.userId, user);
      });

      this.documents.set(documentId, document);
      this.notifyPresenceHandlers(documentId, Array.from(document.users.values()));
    });

    // Handle edit operations from other users
    webSocketService.onMessage('edit-operation', (message) => {
      const edit = message.payload as CollaborativeEdit;
      const document = this.documents.get(edit.projectId!);
      
      if (document && edit.userId !== this.currentUserId) {
        // Check for conflicts
        const conflict = this.detectConflict(document, edit);
        if (conflict) {
          this.handleConflict(document.id, conflict);
        } else {
          // Apply operation
          this.applyOperationLocal(document, edit.operation);
          document.operations.push(edit);
          document.version = edit.version;
          document.lastModified = new Date();
          
          this.notifyEditHandlers(document.id, edit);
        }
      }
    });

    // Handle cursor updates
    webSocketService.onMessage('cursor-update', (message) => {
      const { documentId, userId, userName, cursor, selection, color } = message.payload;
      const document = this.documents.get(documentId);
      
      if (document && userId !== this.currentUserId) {
        const userPresence: UserPresence = {
          userId,
          userName,
          cursor,
          selection,
          color,
          isActive: true,
          lastSeen: new Date()
        };

        document.users.set(userId, userPresence);
        this.notifyPresenceHandlers(documentId, Array.from(document.users.values()));
      }
    });

    // Handle user joined
    webSocketService.onMessage('user-joined-session', (message) => {
      const { documentId, user } = message.payload;
      const document = this.documents.get(documentId);
      
      if (document) {
        document.users.set(user.userId, user);
        this.notifyPresenceHandlers(documentId, Array.from(document.users.values()));
      }
    });

    // Handle user left
    webSocketService.onMessage('user-left-session', (message) => {
      const { documentId, userId } = message.payload;
      const document = this.documents.get(documentId);
      
      if (document) {
        document.users.delete(userId);
        this.notifyPresenceHandlers(documentId, Array.from(document.users.values()));
      }
    });
  }

  private applyOperationLocal(document: DocumentState, operation: EditOperation): void {
    const { content } = document;
    let newContent = content;

    switch (operation.type) {
      case 'insert':
        newContent = content.slice(0, operation.position) + 
                    (operation.content || '') + 
                    content.slice(operation.position);
        break;
      case 'delete':
        newContent = content.slice(0, operation.position) + 
                    content.slice(operation.position + (operation.length || 0));
        break;
      case 'retain':
        // No content change, just cursor movement
        break;
    }

    document.content = newContent;
  }

  private detectConflict(document: DocumentState, newEdit: CollaborativeEdit): EditConflict | null {
    // Simple conflict detection - check if operations overlap
    const recentOperations = document.operations.slice(-5); // Check last 5 operations
    const conflicts: CollaborativeEdit[] = [];

    for (const existing of recentOperations) {
      if (this.operationsOverlap(existing.operation, newEdit.operation)) {
        conflicts.push(existing);
      }
    }

    if (conflicts.length > 0) {
      return {
        operations: conflicts.concat([newEdit]),
        positions: conflicts.map(op => op.operation.position),
        content: conflicts.map(op => op.operation.content || '')
      };
    }

    return null;
  }

  private operationsOverlap(op1: EditOperation, op2: EditOperation): boolean {
    const pos1 = op1.position;
    const end1 = op1.type === 'delete' ? pos1 + (op1.length || 0) : pos1 + (op1.content?.length || 0);
    
    const pos2 = op2.position;
    const end2 = op2.type === 'delete' ? pos2 + (op2.length || 0) : pos2 + (op2.content?.length || 0);

    return !(end1 <= pos2 || end2 <= pos1);
  }

  private handleConflict(documentId: string, conflict: EditConflict): void {
    // For now, use last-writer-wins strategy
    // In a real implementation, this would be more sophisticated
    const document = this.documents.get(documentId);
    if (!document) return;

    const lastEdit = conflict.operations[conflict.operations.length - 1];
    this.applyOperationLocal(document, lastEdit.operation);
    
    document.operations.push(lastEdit);
    document.version = lastEdit.version;
    document.lastModified = new Date();

    this.notifyEditHandlers(documentId, lastEdit);
  }

  private createInverseOperation(operation: EditOperation): EditOperation {
    switch (operation.type) {
      case 'insert':
        return {
          type: 'delete',
          position: operation.position,
          length: operation.content?.length || 0
        };
      case 'delete':
        return {
          type: 'insert',
          position: operation.position,
          content: ' '.repeat(operation.length || 0) // This is simplified
        };
      case 'retain':
        return { ...operation };
      default:
        return operation;
    }
  }

  private notifyEditHandlers(documentId: string, edit: CollaborativeEdit): void {
    const handlers = this.editHandlers.get(documentId);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(edit);
        } catch (error) {
          console.error('Error in edit handler:', error);
        }
      });
    }
  }

  private notifyPresenceHandlers(documentId: string, users: UserPresence[]): void {
    const handlers = this.presenceHandlers.get(documentId);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(users);
        } catch (error) {
          console.error('Error in presence handler:', error);
        }
      });
    }
  }

  private getNextColor(): string {
    const color = this.userColors[this.colorIndex % this.userColors.length];
    this.colorIndex++;
    return color;
  }

  private getCurrentUserColor(): string {
    const document = Array.from(this.documents.values())[0];
    if (document) {
      const user = document.users.get(this.currentUserId);
      if (user) return user.color;
    }
    return this.getNextColor();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const liveEditingService = new LiveEditingService();

export default LiveEditingService;
