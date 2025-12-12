
import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service.js';
import { FreelancersController } from './freelancers.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [FreelancersController],
  providers: [FreelancersService],
})
export class FreelancersModule {}
