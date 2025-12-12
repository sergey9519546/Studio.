
import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service.js';
import { AssignmentsController } from './assignments.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AvailabilityModule } from '../availability/availability.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [PrismaModule, AvailabilityModule, RealtimeModule],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
