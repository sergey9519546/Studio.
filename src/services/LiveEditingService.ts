import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UserPresence {
  userId: string;
  userName: string;
  color: string;
  selection?: { start: number; end: number };
  position?: { x: number; y: number };
}

class CollaborationService {
  private socket: Socket | null = null;
  private presenceCallbacks: ((users: UserPresence[]) => void)[] = [];
  private cursorCallbacks: ((data: UserPresence[]) => void)[] = [];

  constructor() {
    // Lazy initialization
  }

  initialize(_userId: string, _userName: string) {
    if (this.socket) return;

    this.socket = io(`${SOCKET_URL}/collaboration`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to collaboration server');
    });

    this.socket.on('presence-update', (_users: string[]) => {
      // Logic to fetch full user details if needed,
      // but for now the gateway just sends IDs.
      // We might need to enrich this.
      // Actually, let's keep it simple: we just relay cursor events which contain the data we need.
    });

    this.socket.on('cursor-update', (data: UserPresence) => {
      this.cursorCallbacks.forEach(cb => cb([data])); // Send array to match interface
    });
  }

  joinSession(documentId: string) {
    if (!this.socket) return;
    // Mock user data for now
    const userId = 'user-' + Math.floor(Math.random() * 1000);
    const userName = 'User ' + userId.split('-')[1];

    this.socket.emit('join-room', { projectId: documentId, userId, name: userName });
  }

  leaveSession(documentId: string) {
    if (!this.socket) return;
    this.socket.emit('leave-room', { projectId: documentId });
  }

  updateCursor(documentId: string, x: number, selection: unknown) {
    if (!this.socket) return;
    this.socket.emit('cursor-move', { x, y: 0, selection }); // y=0 for now if just horizontal text, or actual Y
  }

  // To match the existing interface expected by CollaborativeCursor
  onPresence(documentId: string, callback: (users: UserPresence[]) => void) {
    this.cursorCallbacks.push(callback);
    return () => {
      this.cursorCallbacks = this.cursorCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const liveEditingService = new CollaborationService();

// Mock PresenceService to satisfy imports if needed, or we just fix imports
export const presenceService = {
  initialize: () => {},
  trackActivity: () => {},
  onUsersChange: (_cb: unknown) => { return () => {} },
};
