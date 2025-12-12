/**
 * WebSocketService - Real-time communication layer
 * Provides WebSocket-based real-time collaboration infrastructure
 */

export interface WebSocketMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  projectId?: string;
}

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';
  connectedAt?: Date;
  lastPing?: Date;
  latency?: number;
  error?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionHandler = (state: ConnectionState) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private connectionState: ConnectionState = { status: 'disconnected' };
  private messageQueue: WebSocketMessage[] = [];
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      timeout: 10000,
      ...config
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      try {
        this.updateConnectionState({ status: 'connecting' });
        this.ws = new WebSocket(this.config.url);

        // Set timeout for connection
        const timeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, this.config.timeout!);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.reconnectAttempts = 0;
          this.isIntentionallyClosed = false;
          this.updateConnectionState({
            status: 'connected',
            connectedAt: new Date(),
            lastPing: new Date()
          });
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Process queued messages
          this.processMessageQueue();
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.cleanup();
          
          if (this.isIntentionallyClosed) {
            this.updateConnectionState({ status: 'disconnected' });
            return;
          }

          if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
            this.updateConnectionState({ 
              status: 'reconnecting',
              error: `Connection closed: ${event.code} ${event.reason}`
            });
            
            this.scheduleReconnect();
          } else {
            this.updateConnectionState({ 
              status: 'error',
              error: `Max reconnection attempts reached: ${event.code} ${event.reason}`
            });
          }
        };

        this.ws.onerror = (error) => {
          this.updateConnectionState({ 
            status: 'error',
            error: 'WebSocket connection error'
          });
          reject(error);
        };

      } catch (error) {
        this.updateConnectionState({ 
          status: 'error',
          error: 'Failed to create WebSocket connection'
        });
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.cleanup();
    this.updateConnectionState({ status: 'disconnected' });
  }

  /**
   * Send a message through WebSocket
   */
  send(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateId(),
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(fullMessage);
    }
  }

  /**
   * Subscribe to message events
   */
  onMessage(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    
    this.messageHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(type);
        }
      }
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get current latency (ping-pong)
   */
  async ping(): Promise<number> {
    if (!this.isConnected()) {
      throw new Error('Not connected');
    }

    const start = Date.now();
    const pingId = this.generateId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Ping timeout'));
      }, 5000);

      const unsubscribe = this.onMessage('pong', (message) => {
        if (message.payload?.pingId === pingId) {
          clearTimeout(timeout);
          unsubscribe();
          const latency = Date.now() - start;
          this.updateConnectionState({ latency });
          resolve(latency);
        }
      });

      this.send({
        type: 'ping',
        payload: { pingId }
      });
    });
  }

  // Private methods

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }

    // Handle system messages
    if (message.type === 'pong') {
      this.updateConnectionState({ 
        lastPing: new Date(),
        latency: Date.now() - message.timestamp 
      });
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: 'ping',
          payload: { timestamp: Date.now() }
        });
      }
    }, this.config.heartbeatInterval!);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    
    this.reconnectTimer = setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts - 1)); // Exponential backoff
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws!.send(JSON.stringify(message));
      }
    }
  }

  private updateConnectionState(state: Partial<ConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...state };
    this.connectionHandlers.forEach(handler => {
      try {
        handler(this.connectionState);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  private cleanup(): void {
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService({
  url: process.env.NODE_ENV === 'production' 
    ? 'wss://your-production-server.com/ws'
    : 'ws://localhost:3001/ws'
});

// Export utility functions
export function createWebSocketService(config: WebSocketConfig): WebSocketService {
  return new WebSocketService(config);
}

export default WebSocketService;
