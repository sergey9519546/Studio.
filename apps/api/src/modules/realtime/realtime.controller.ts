import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { RealtimeService } from './realtime.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller({ path: 'realtime', version: '1' })
@UseGuards(JwtAuthGuard)
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  /**
   * Server-Sent Events endpoint for real-time updates
   * GET /v1/realtime/events
   */
  @Get('events')
  async events(
    @Res() res: Response,
    @Query('freelancers') freelancerIds?: string,
    @Query('projects') projectIds?: string,
  ) {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const filters = {
      freelancerIds: freelancerIds ? freelancerIds.split(',') : undefined,
      projectIds: projectIds ? projectIds.split(',') : undefined,
    };

    this.realtimeService.addClient(clientId, res, filters);
  }

  /**
   * Get current number of connected clients (for monitoring)
   */
  @Get('stats')
  getStats() {
    return {
      connectedClients: this.realtimeService.getClientsCount(),
      timestamp: new Date().toISOString(),
    };
  }
}
