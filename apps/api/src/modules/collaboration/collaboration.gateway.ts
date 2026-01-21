import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'collaboration',
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(CollaborationGateway.name);

  // Track active users per room: Map<ProjectId, Set<UserId>>
  private rooms = new Map<string, Set<string>>();

  // Track user details: Map<SocketId, UserInfo>
  private clients = new Map<string, { userId: string; projectId: string; color: string; name: string }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const info = this.clients.get(client.id);
    if (info) {
      const { projectId, userId } = info;
      const room = this.rooms.get(projectId);
      if (room) {
        room.delete(userId);
        if (room.size === 0) {
          this.rooms.delete(projectId);
        } else {
          // Notify others in room
          this.server.to(projectId).emit('presence-update', Array.from(room));
        }
      }
      this.clients.delete(client.id);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, payload: { projectId: string; userId: string; name: string }) {
    const { projectId, userId, name } = payload;
    const color = this.generateColor(userId);

    // Store client info
    this.clients.set(client.id, { userId, projectId, color, name });

    // Join socket.io room
    client.join(projectId);

    // Update room tracking
    if (!this.rooms.has(projectId)) {
      this.rooms.set(projectId, new Set());
    }
    this.rooms.get(projectId)?.add(userId);

    // Notify room of new user
    const users = Array.from(this.rooms.get(projectId) || []);
    this.server.to(projectId).emit('presence-update', users);

    this.logger.log(`User ${name} (${userId}) joined room ${projectId}`);
    return { status: 'joined', color };
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(client: Socket, payload: { x: number; y: number; selection?: unknown }) {
    const info = this.clients.get(client.id);
    if (info) {
      // Broadcast to everyone else in the room
      client.to(info.projectId).emit('cursor-update', {
        userId: info.userId,
        userName: info.name,
        color: info.color,
        position: { x: payload.x, y: payload.y },
        selection: payload.selection
      });
    }
  }

  private generateColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
