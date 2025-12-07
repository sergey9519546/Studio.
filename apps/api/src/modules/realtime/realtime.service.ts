import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

interface ConnectedClient {
  id: string;
  res: Response;
  filters?: {
    freelancerIds?: string[];
    projectIds?: string[];
  };
}

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);
  private clients: Map<string, ConnectedClient> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  addClient(clientId: string, res: Response, filters?: ConnectedClient['filters']) {
    this.clients.set(clientId, { id: clientId, res, filters });

    this.logger.log(`Client connected: ${clientId}`);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial handshake
    res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

    // Handle client disconnect
    res.on('close', () => {
      this.removeClient(clientId);
    });

    res.on('error', () => {
      this.removeClient(clientId);
    });
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
    this.logger.log(`Client disconnected: ${clientId}`);
  }

  // Broadcast to all clients or filtered clients
  broadcast(eventData: {
    type: 'assignment_created' | 'assignment_updated' | 'assignment_deleted' |
           'project_created' | 'project_updated' | 'project_deleted' |
           'freelancer_created' | 'freelancer_updated' | 'freelancer_deleted';
    data: unknown;
    entityId: string;
  }) {
    const { type, data, entityId } = eventData;

    this.clients.forEach((client) => {
      // Apply filters if client has them
      if (client.filters) {
        if (this.shouldSkipEvent(eventData, client.filters)) {
          return;
        }
      }

      try {
        const eventString = `data: ${JSON.stringify({
          type,
          data,
          entityId,
          timestamp: new Date().toISOString()
        })}\n\n`;

        client.res.write(eventString);
      } catch (error) {
        this.logger.error(`Failed to send event to client ${client.id}:`, error);
        this.removeClient(client.id);
      }
    });
  }

  private shouldSkipEvent(event: { type: string; entityId: string }, filters: ConnectedClient['filters']): boolean {
    if (!filters) return false;

    // Extract resource type and ID from event type
    const eventParts = event.type.split('_');
    const resourceType = eventParts.slice(0, -1).join('_'); // assignment, project, freelancer

    // Currently we don't filter by action, only by resource ID
    if (resourceType === 'freelancer' && filters.freelancerIds && event.entityId) {
      return !filters.freelancerIds.includes(event.entityId);
    }

    if (resourceType === 'project' && filters.projectIds && event.entityId) {
      return !filters.projectIds.includes(event.entityId);
    }

    return false;
  }

  getClientsCount(): number {
    return this.clients.size;
  }
}
