/**
 * CollaborativeCursor - Multi-user cursor tracking component
 * Displays other users' cursors and selections in real-time collaborative editing
 */

import React, { useEffect, useRef, useState } from 'react';
import { liveEditingService, UserPresence } from '../../services/LiveEditingService';
import { presenceService, PresenceUser } from '../../services/PresenceService';

interface CollaborativeCursorProps {
  documentId: string;
  currentUserId: string;
  children: React.ReactNode;
  showNames?: boolean;
  showSelections?: boolean;
  className?: string;
}

interface CursorPosition {
  x: number;
  y: number;
  element?: HTMLElement;
}

interface UserCursor {
  userId: string;
  userName: string;
  color: string;
  position: CursorPosition;
  selection: { start: number; end: number } | null;
  isVisible: boolean;
  timestamp: number;
}

export const CollaborativeCursor: React.FC<CollaborativeCursorProps> = ({
  documentId,
  currentUserId,
  children,
  showNames = true,
  showSelections = true,
  className = '',
}) => {
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Initialize collaboration services
    presenceService.initialize(currentUserId, {
      name: 'Current User', // This should come from user context
      color: '#4ECDC4',
      permissions: {
        canEdit: true,
        canComment: true,
        canView: true,
        canInvite: false,
        canDelete: false,
        role: 'editor'
      }
    });

    liveEditingService.initialize(currentUserId, 'Current User');

    // Join the collaborative editing session
    const joinSession = async () => {
      try {
        await liveEditingService.joinSession(documentId);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to join collaborative session:', error);
      }
    };

    joinSession();

    // Subscribe to presence updates
    const unsubscribePresence = presenceService.onUsersChange((users) => {
      const activeUsers = users.filter(user => user.id !== currentUserId);
      updateUserCursors(activeUsers);
    });

    // Subscribe to live editing updates
    const unsubscribeEditing = liveEditingService.onPresence(documentId, (users) => {
      updateCollaborativeCursors(users);
    });

    // Track cursor position changes
    const trackCursorPosition = (e: MouseEvent) => {
      updateCurrentUserCursor(e);
    };

    // Track selection changes
    const trackSelection = () => {
      updateCurrentUserSelection();
    };

    document.addEventListener('mousemove', trackCursorPosition);
    document.addEventListener('selectionchange', trackSelection);

    // Cleanup
    return () => {
      unsubscribePresence();
      unsubscribeEditing();
      document.removeEventListener('mousemove', trackCursorPosition);
      document.removeEventListener('selectionchange', trackSelection);
      liveEditingService.leaveSession(documentId);
      
      // Clear all cursor timeouts
      cursorTimeouts.current.forEach(timeout => clearTimeout(timeout));
      cursorTimeouts.current.clear();
    };
  }, [documentId, currentUserId]);

  const updateUserCursors = (users: PresenceUser[]) => {
    const newCursors = new Map(userCursors);

    users.forEach(user => {
      if (user.currentActivity?.type === 'editing' || user.currentActivity?.type === 'viewing') {
        const existingCursor = newCursors.get(user.id);
        if (existingCursor) {
          // Update existing cursor
          newCursors.set(user.id, {
            ...existingCursor,
            userName: user.name,
            color: user.color,
            isVisible: true,
            timestamp: Date.now()
          });
        } else {
          // Create new cursor
          newCursors.set(user.id, {
            userId: user.id,
            userName: user.name,
            color: user.color,
            position: { x: 0, y: 0 },
            selection: null,
            isVisible: true,
            timestamp: Date.now()
          });
        }
      } else {
        // Hide cursor if user is not actively editing/viewing
        newCursors.delete(user.id);
      }
    });

    setUserCursors(newCursors);
  };

  const updateCollaborativeCursors = (users: UserPresence[]) => {
    const newCursors = new Map(userCursors);

    users.forEach(user => {
      if (user.userId !== currentUserId) {
        const existingCursor = newCursors.get(user.userId);
        if (existingCursor) {
          newCursors.set(user.userId, {
            ...existingCursor,
            userName: user.userName,
            color: user.color,
            selection: user.selection,
            timestamp: Date.now()
          });
        }
      }
    });

    setUserCursors(newCursors);
  };

  const updateCurrentUserCursor = (e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update cursor position in live editing service
    liveEditingService.updateCursor(documentId, x, null);

    // Update presence activity
    presenceService.trackActivity('editing', 'Moving cursor', documentId);
  };

  const updateCurrentUserSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!containerRef.current?.contains(range.commonAncestorContainer)) return;

    const start = range.startOffset;
    const end = range.endOffset;

    if (start !== end) {
      liveEditingService.updateCursor(documentId, start, { start, end });
      presenceService.trackActivity('editing', 'Making selection', documentId);
    }
  };

  const hideCursorAfterDelay = (userId: string) => {
    // Clear existing timeout
    const existingTimeout = cursorTimeouts.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to hide cursor after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      setUserCursors(prev => {
        const newCursors = new Map(prev);
        const cursor = newCursors.get(userId);
        if (cursor) {
          newCursors.set(userId, { ...cursor, isVisible: false });
        }
        return newCursors;
      });
    }, 3000);

    cursorTimeouts.current.set(userId, timeout);
  };

  const handleMouseEnter = (userId: string) => {
    const timeout = cursorTimeouts.current.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      cursorTimeouts.current.delete(userId);
    }

    setUserCursors(prev => {
      const newCursors = new Map(prev);
      const cursor = newCursors.get(userId);
      if (cursor) {
        newCursors.set(userId, { ...cursor, isVisible: true });
      }
      return newCursors;
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      
      {/* Render collaborative cursors */}
      {Array.from(userCursors.values())
        .filter(cursor => cursor.isVisible)
        .map(cursor => (
          <CollaborativeCursorElement
            key={cursor.userId}
            cursor={cursor}
            showName={showNames}
            showSelection={showSelections}
            onMouseEnter={() => handleMouseEnter(cursor.userId)}
            onPositionUpdate={(position) => {
              setUserCursors(prev => {
                const newCursors = new Map(prev);
                newCursors.set(cursor.userId, { ...cursor, position });
                return newCursors;
              });
            }}
          />
        ))}
      
      {/* Connection status indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-50">
          <div className={`px-2 py-1 rounded text-xs ${
            isConnected 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
      )}
    </div>
  );
};

interface CollaborativeCursorElementProps {
  cursor: UserCursor;
  showName: boolean;
  showSelection: boolean;
  onMouseEnter: () => void;
  onPositionUpdate: (position: CursorPosition) => void;
}

const CollaborativeCursorElement: React.FC<CollaborativeCursorElementProps> = ({
  cursor,
  showName,
  showSelection,
  onMouseEnter,
  onPositionUpdate,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef.current) {
      const rect = cursorRef.current.getBoundingClientRect();
      onPositionUpdate({
        x: rect.left,
        y: rect.top,
        element: cursorRef.current
      });
    }
  }, [cursor.position, onPositionUpdate]);

  return (
    <div
      ref={cursorRef}
      className="absolute pointer-events-none z-40"
      style={{
        left: cursor.position.x,
        top: cursor.position.y,
        transform: 'translate(-2px, -2px)',
      }}
      onMouseEnter={onMouseEnter}
    >
      {/* Cursor pointer */}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: `8px solid ${cursor.color}`,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
        }}
      />
      
      {/* User name label */}
      {showName && (
        <div
          className="absolute top-0 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
          style={{
            backgroundColor: cursor.color,
            transform: 'translateY(-100%)',
          }}
        >
          {cursor.userName}
        </div>
      )}
      
      {/* Selection highlight */}
      {showSelection && cursor.selection && cursor.selection.start !== cursor.selection.end && (
        <div
          className="absolute bg-opacity-20"
          style={{
            backgroundColor: cursor.color,
            left: cursor.position.x,
            top: cursor.position.y - 16,
            width: Math.abs(cursor.selection.end - cursor.selection.start) * 8, // Approximate character width
            height: 20,
          }}
        />
      )}
    </div>
  );
};

export default CollaborativeCursor;
