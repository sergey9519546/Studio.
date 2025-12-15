/**
 * useRealTimeCollaboration - React hook for real-time collaboration
 * Integrates WebSocket, LiveEditing, and Presence services for seamless collaboration
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CollaborativeEdit, DocumentState, EditOperation, liveEditingService } from '../services/LiveEditingService';
import { ActivityInfo, presenceService, PresenceStats, PresenceUser } from '../services/PresenceService';
import { ConnectionState, webSocketService } from '../services/WebSocketService';

export interface RealTimeCollaborationConfig {
  autoConnect?: boolean;
  enablePresence?: boolean;
  enableEditing?: boolean;
  enableCursorTracking?: boolean;
  heartbeatInterval?: number;
}

export interface UseRealTimeCollaborationReturn {
  // Connection state
  isConnected: boolean;
  connectionState: ConnectionState;
  latency?: number;
  
  // Document state
  document: DocumentState | null;
  activeUsers: PresenceUser[];
  collaborativeEdits: CollaborativeEdit[];
  
  // User presence
  presenceStats: PresenceStats;
  currentUser: PresenceUser | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  joinSession: (documentId: string, initialContent?: string) => Promise<void>;
  leaveSession: () => void;
  applyEdit: (operation: EditOperation) => void;
  updateCursor: (position: number, selection?: { start: number; end: number }) => void;
  updateStatus: (status: PresenceUser['status']) => void;
  trackActivity: (type: ActivityInfo['type'], details: string, target?: string) => void;
  
  // Event handlers
  onConnectionChange: (handler: (state: ConnectionState) => void) => () => void;
  onEdit: (handler: (edit: CollaborativeEdit) => void) => () => void;
  onPresenceChange: (handler: (users: PresenceUser[]) => void) => () => void;
  onDocumentChange: (handler: (document: DocumentState) => void) => () => void;
}

export function useRealTimeCollaboration(
  userId: string,
  userName: string,
  config: RealTimeCollaborationConfig = {}
): UseRealTimeCollaborationReturn {
  const {
    autoConnect = true,
    enablePresence = true,
    enableEditing = true,
    enableCursorTracking = true,
    heartbeatInterval = 30000
  } = config;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>({ status: 'disconnected' });
  const [document, setDocument] = useState<DocumentState | null>(null);
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [collaborativeEdits, setCollaborativeEdits] = useState<CollaborativeEdit[]>([]);
  const [presenceStats, setPresenceStats] = useState<PresenceStats>({
    totalUsers: 0,
    activeUsers: 0,
    onlineUsers: 0,
    awayUsers: 0,
    busyUsers: 0,
    statusCounts: {},
    activityCounts: {},
    currentUser: null
  });
  const [currentUser, setCurrentUser] = useState<PresenceUser | null>(null);

  // Refs
  const currentDocumentId = useRef<string>('');
  const sessionCleanupRef = useRef<Array<() => void>>([]);
  const eventHandlers = useRef<{
    connectionChange: Set<(state: ConnectionState) => void>;
    edit: Set<(edit: CollaborativeEdit) => void>;
    presenceChange: Set<(users: PresenceUser[]) => void>;
    documentChange: Set<(document: DocumentState) => void>;
  }>({
    connectionChange: new Set(),
    edit: new Set(),
    presenceChange: new Set(),
    documentChange: new Set()
  });

  // Initialize services
  useEffect(() => {
    if (enablePresence) {
      presenceService.initialize(userId, {
        name: userName,
        color: generateUserColor(userId),
        permissions: {
          canEdit: true,
          canComment: true,
          canView: true,
          canInvite: false,
          canDelete: false,
          role: 'editor'
        }
      });
    }

    if (enableEditing) {
      liveEditingService.initialize(userId, userName);
    }

    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [userId, userName, autoConnect, enablePresence, enableEditing]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      await webSocketService.connect();
      setIsConnected(true);
      
      // Update presence status
      if (enablePresence) {
        presenceService.updateStatus('online');
      }
    } catch (error) {
      console.error('Failed to connect to collaboration service:', error);
      setIsConnected(false);
    }
  }, [enablePresence]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
    
    // Update presence status
    if (enablePresence) {
      presenceService.goOffline();
    }
  }, [enablePresence]);

  // Join collaborative editing session
  const joinSession = useCallback(async (documentId: string, initialContent: string = '') => {
    if (!enableEditing) return;

    try {
      currentDocumentId.current = documentId;
      const docState = await liveEditingService.joinSession(documentId, initialContent);
      setDocument(docState);

      // Subscribe to edit events
      const unsubscribeEdit = liveEditingService.onEdit(documentId, (edit) => {
        setCollaborativeEdits(prev => [...prev, edit]);
        // Use direct notification to avoid circular dependencies
        eventHandlers.current.edit.forEach(handler => {
          try {
            handler(edit);
          } catch (error) {
            console.error('Error in edit handler:', error);
          }
        });
      });

      // Subscribe to presence events for this document
      const unsubscribePresence = liveEditingService.onPresence(documentId, (users) => {
        setActiveUsers(users);
        // Use direct notification to avoid circular dependencies
        eventHandlers.current.presenceChange.forEach(handler => {
          try {
            handler(users);
          } catch (error) {
            console.error('Error in presence handler:', error);
          }
        });
      });

      // Store unsubscribe functions in a ref for cleanup
      // This prevents memory leaks by ensuring subscriptions are properly cleaned up
      if (!eventHandlers.current.sessionCleanup) {
        eventHandlers.current.sessionCleanup = [];
      }
      (eventHandlers.current.sessionCleanup as Array<() => void>).push(() => {
        unsubscribeEdit();
        unsubscribePresence();
      });
    } catch (error) {
      console.error('Failed to join editing session:', error);
    }
  }, [enableEditing]);

  // Leave collaborative editing session
  const leaveSession = useCallback(() => {
    if (!enableEditing || !currentDocumentId.current) return;

    liveEditingService.leaveSession(currentDocumentId.current);
    setDocument(null);
    setCollaborativeEdits([]);
    currentDocumentId.current = '';
  }, [enableEditing]);

  // Apply edit operation
  const applyEdit = useCallback((operation: EditOperation) => {
    if (!enableEditing || !currentDocumentId.current) return;

    try {
      const edit = liveEditingService.applyEdit(currentDocumentId.current, operation);
      if (edit) {
        setCollaborativeEdits(prev => [...prev, edit]);
      }
    } catch (error) {
      console.error('Failed to apply edit:', error);
    }
  }, [enableEditing]);

  // Update cursor position
  const updateCursor = useCallback((position: number, selection?: { start: number; end: number }) => {
    if (!enableEditing || !enableCursorTracking || !currentDocumentId.current) return;

    liveEditingService.updateCursor(currentDocumentId.current, position, selection);
    
    // Track activity
    if (enablePresence) {
      presenceService.trackActivity(
        selection ? 'editing' : 'viewing',
        selection ? 'Making selection' : 'Moving cursor',
        currentDocumentId.current
      );
    }
  }, [enableEditing, enableCursorTracking, enablePresence]);

  // Update user status
  const updateStatus = useCallback((status: PresenceUser['status']) => {
    if (!enablePresence) return;

    presenceService.updateStatus(status);
  }, [enablePresence]);

  // Track activity
  const trackActivity = useCallback((type: ActivityInfo['type'], details: string, target?: string) => {
    if (!enablePresence) return;

    presenceService.trackActivity(type, details, target);
  }, [enablePresence]);

  // Event handler subscriptions
  const onConnectionChange = useCallback((handler: (state: ConnectionState) => void) => {
    eventHandlers.current.connectionChange.add(handler);
    
    return () => {
      eventHandlers.current.connectionChange.delete(handler);
    };
  }, []);

  const onEdit = useCallback((handler: (edit: CollaborativeEdit) => void) => {
    eventHandlers.current.edit.add(handler);
    
    return () => {
      eventHandlers.current.edit.delete(handler);
    };
  }, []);

  const onPresenceChange = useCallback((handler: (users: PresenceUser[]) => void) => {
    eventHandlers.current.presenceChange.add(handler);
    
    return () => {
      eventHandlers.current.presenceChange.delete(handler);
    };
  }, []);

  const onDocumentChange = useCallback((handler: (document: DocumentState) => void) => {
    eventHandlers.current.documentChange.add(handler);
    
    return () => {
      eventHandlers.current.documentChange.delete(handler);
    };
  }, []);

  // Notification helpers
  const notifyConnectionChangeHandlers = useCallback((state: ConnectionState) => {
    eventHandlers.current.connectionChange.forEach(handler => {
      try {
        handler(state);
      } catch (error) {
        console.error('Error in connection change handler:', error);
      }
    });
  }, []);

  const notifyEditHandlers = useCallback((edit: CollaborativeEdit) => {
    eventHandlers.current.edit.forEach(handler => {
      try {
        handler(edit);
      } catch (error) {
        console.error('Error in edit handler:', error);
      }
    });
  }, []);

  const notifyPresenceChangeHandlers = useCallback((users: PresenceUser[]) => {
    eventHandlers.current.presenceChange.forEach(handler => {
      try {
        handler(users);
      } catch (error) {
        console.error('Error in presence change handler:', error);
      }
    });
  }, []);

  const notifyDocumentChangeHandlers = useCallback((document: DocumentState) => {
    eventHandlers.current.documentChange.forEach(handler => {
      try {
        handler(document);
      } catch (error) {
        console.error('Error in document change handler:', error);
      }
    });
  }, []);

  // Setup WebSocket event handlers
  useEffect(() => {
    const unsubscribeConnection = webSocketService.onConnectionChange((state) => {
      setConnectionState(state);
      setIsConnected(state.status === 'connected');
      notifyConnectionChangeHandlers(state);
    });

    // Update presence stats periodically
    const statsInterval = setInterval(() => {
      if (enablePresence) {
        const stats = presenceService.getPresenceStats();
        setPresenceStats(stats);
        setCurrentUser(stats.currentUser || null);
      }
    }, 5000);

    return () => {
      unsubscribeConnection();
      clearInterval(statsInterval);
    };
  }, [enablePresence, notifyConnectionChangeHandlers]);

  // Update document when it changes
  useEffect(() => {
    if (document) {
      notifyDocumentChangeHandlers(document);
    }
  }, [document, notifyDocumentChangeHandlers]);

  return {
    // Connection state
    isConnected,
    connectionState,
    latency: connectionState.latency,
    
    // Document state
    document,
    activeUsers,
    collaborativeEdits,
    
    // User presence
    presenceStats,
    currentUser,
    
    // Actions
    connect,
    disconnect,
    joinSession,
    leaveSession,
    applyEdit,
    updateCursor,
    updateStatus,
    trackActivity,
    
    // Event handlers
    onConnectionChange,
    onEdit,
    onPresenceChange,
    onDocumentChange
  };
}

// Utility function to generate consistent user colors
function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export default useRealTimeCollaboration;
