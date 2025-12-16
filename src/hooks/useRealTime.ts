import { useCallback, useEffect, useState } from 'react';
import { RealtimeUpdate } from '../services/types';
import { ConnectionStatus, webSocketService } from '../services/websocket';

export interface UseRealTimeOptions {
  autoConnect?: boolean;
  onUpdate?: (update: RealtimeUpdate) => void;
  entities?: string[];
}

export function useRealTime(options: UseRealTimeOptions = {}) {
  const { autoConnect = false } = options;
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle connection status changes
  useEffect(() => {
    const updateStatus = () => setConnectionStatus(webSocketService.getStatus());
    
    const unsubscribe = webSocketService.subscribeAll((event) => {
      if (event.type === 'connection:status') {
        updateStatus();
      }
    });

    return unsubscribe;
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to reconnect when coming back online
      if (connectionStatus === 'disconnected' && autoConnect) {
        webSocketService.connect().catch(console.error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoConnect, connectionStatus]);

  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect && isOnline && connectionStatus === 'disconnected') {
      webSocketService.connect().catch(console.error);
    }
  }, [autoConnect, isOnline, connectionStatus]);

  // Subscribe to specific entity updates
  const subscribeToUpdates = useCallback((entities: string[], callback: (update: RealtimeUpdate) => void) => {
    const unsubscribers = entities.map(entity => {
      return webSocketService.subscribe(`${entity}:updated`, (event) => {
        callback(event.payload as RealtimeUpdate);
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Subscribe to all updates for specific entities
  const subscribeToEntity = useCallback((entity: string, callback: (update: RealtimeUpdate) => void) => {
    return webSocketService.subscribe(`${entity}:updated`, (event) => {
      callback(event.payload as RealtimeUpdate);
    });
  }, []);

  // Manual connection methods
  const connect = useCallback(() => {
    return webSocketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const send = useCallback(<TPayload,>(event: string, data: TPayload) => {
    webSocketService.send(event, data);
  }, []);

  return {
    connectionStatus,
    isOnline,
    isConnected: connectionStatus === 'connected' && isOnline,
    connect,
    disconnect,
    send,
    subscribeToUpdates,
    subscribeToEntity,
  };
}
