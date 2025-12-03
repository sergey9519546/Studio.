
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService
  ) { }

  async findAll() {
    return this.prisma.assignment.findMany();
  }

  async create(data: CreateAssignmentDto) {
    const { freelancerId, startDate, endDate, allocation } = data;

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

    return this.prisma.assignment.create({ data });
  }

  async update(id: string, data: UpdateAssignmentDto) {
    const { freelancerId, startDate, endDate, allocation } = data;

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

    return this.prisma.assignment.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.assignment.delete({ where: { id } });
  }
}
