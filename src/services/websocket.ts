import { AuthAPI } from './api/auth';
import { RealtimeUpdate, WebSocketEvent } from './types';

export type WebSocketCallback = (event: WebSocketEvent) => void;
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private callbacks: Map<string, WebSocketCallback[]> = new Map();
  private connectionStatus: ConnectionStatus = 'disconnected';
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastPong = Date.now();

  constructor(private url: string = 'ws://localhost:3000/ws') {}

  // Connect to WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = AuthAPI.getStoredToken();
        const wsUrl = token ? `${this.url}?token=${token}` : this.url;
        
        this.ws = new WebSocket(wsUrl);
        this.connectionStatus = 'connecting';

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connectionStatus = 'error';
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.connectionStatus = 'disconnected';
          this.stopHeartbeat();
          this.attemptReconnect();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.connectionStatus = 'disconnected';
  }

  // Send message to server
  send(event: string, data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Subscribe to event type
  subscribe(eventType: string, callback: WebSocketCallback): () => void {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Subscribe to all events
  subscribeAll(callback: WebSocketCallback): () => void {
    return this.subscribe('*', callback);
  }

  // Get current connection status
  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Check if connected
  isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }

  // Handle incoming messages
  private handleMessage(data: WebSocketEvent): void {
    const { type, payload } = data;
    
    // Call specific event callbacks
    if (this.callbacks.has(type)) {
      const callbacks = this.callbacks.get(type);
      callbacks?.forEach(callback => callback(data));
    }

    // Call global callbacks
    if (this.callbacks.has('*')) {
      const globalCallbacks = this.callbacks.get('*');
      globalCallbacks?.forEach(callback => callback(data));
    }
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
        
        // Check if we received a pong recently
        if (Date.now() - this.lastPong > 30000) {
          console.warn('No pong received, reconnecting');
          this.disconnect();
          this.attemptReconnect();
        }
      }
    }, 10000);
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Handle pong responses
  handlePong(): void {
    this.lastPong = Date.now();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Helper functions for common operations
export const subscribeToProjectUpdates = (callback: (update: RealtimeUpdate) => void) => {
  return webSocketService.subscribe('project:updated', (event) => {
    callback(event.payload as RealtimeUpdate);
  });
};

export const subscribeToMoodboardUpdates = (callback: (update: RealtimeUpdate) => void) => {
  return webSocketService.subscribe('moodboard:updated', (event) => {
    callback(event.payload as RealtimeUpdate);
  });
};

export const subscribeToFreelancerUpdates = (callback: (update: RealtimeUpdate) => void) => {
  return webSocketService.subscribe('freelancer:updated', (event) => {
    callback(event.payload as RealtimeUpdate);
  });
};

export const subscribeToUserUpdates = (callback: (update: RealtimeUpdate) => void) => {
  return webSocketService.subscribe('user:updated', (event) => {
    callback(event.payload as RealtimeUpdate);
  });
};
