
import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service.js';
import { FreelancersController } from './freelancers.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { CacheModule } from '../../common/cache/cache.module.js';
import { AIModule } from '../../common/ai/ai.module.js';

@Module({
  imports: [PrismaModule, CacheModule, AIModule],
  controllers: [FreelancersController],
  providers: [FreelancersService],
  exports: [FreelancersService],
})
export class FreelancersModule {}
