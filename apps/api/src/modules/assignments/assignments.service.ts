
import { ConflictException, Injectable } from '@nestjs/common';
import { AssignmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AvailabilityService } from '../availability/availability.service.js';
import { RealtimeService } from '../realtime/realtime.service.js';
import { CreateAssignmentDto } from './dto/assignment.dto.js';
import { UpdateAssignmentDto } from './dto/update-assignment.dto.js';

@Injectable()
export class AssignmentsService {
  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService,
    private realtimeService: RealtimeService
  ) { }

  async findAll() {
    return this.prisma.assignment.findMany();
  }

  async create(data: CreateAssignmentDto) {
    const { freelancerId, startDate, endDate, allocation, status, ...rest } = data;

    // Server-side Check
    const check = await this.availabilityService.checkConflicts(
      freelancerId,
      new Date(startDate),
      new Date(endDate),
      allocation
    );

    if (!check.isAvailable) {
      throw new ConflictException('CONFLICT_DETECTED');
    }

    const result = await this.prisma.assignment.create({
      data: {
        ...rest,
        freelancerId,
        startDate,
        endDate,
        allocation,
        status: this.normalizeStatus(status)
      }
    });

    // Broadcast real-time update
    this.realtimeService.broadcast({
      type: 'assignment_created',
      data: result,
      entityId: result.id
    });

    return result;
  }

  async update(id: string, data: UpdateAssignmentDto) {
    const { freelancerId, startDate, endDate, allocation, status, ...rest } = data;

    if (freelancerId && startDate && endDate) {
      const check = await this.availabilityService.checkConflicts(
        freelancerId,
        new Date(startDate),
        new Date(endDate),
        allocation || 100,
        id
      );
      if (!check.isAvailable) {
        throw new ConflictException('CONFLICT_DETECTED');
      }
    }

    const updatePayload: Record<string, unknown> = { ...rest };
    if (freelancerId !== undefined) updatePayload.freelancerId = freelancerId;
    if (startDate !== undefined) updatePayload.startDate = startDate;
    if (endDate !== undefined) updatePayload.endDate = endDate;
    if (allocation !== undefined) updatePayload.allocation = allocation;
    if (status) updatePayload.status = this.normalizeStatus(status);

    const result = await this.prisma.assignment.update({
      where: { id },
      data: updatePayload
    });

    // Broadcast real-time update
    this.realtimeService.broadcast({
      type: 'assignment_updated',
      data: result,
      entityId: id
    });

    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.assignment.delete({ where: { id } });

    // Broadcast real-time update
    this.realtimeService.broadcast({
      type: 'assignment_deleted',
      data: result,
      entityId: id
    });

    return result;
  }

  private normalizeStatus(status?: string): AssignmentStatus {
    if (!status) {
      return AssignmentStatus.ACTIVE;
    }

    const normalized = status.toUpperCase().replace(/\s+/g, '_');
    const allowedStatuses = Object.values(AssignmentStatus) as string[];
    return allowedStatuses.includes(normalized) ? normalized as AssignmentStatus : AssignmentStatus.ACTIVE;
  }
}
