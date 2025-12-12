import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller.js';
import { AIUsageService } from './ai-usage.service.js';
import { AlertsService } from './alerts.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [MonitoringController],
    providers: [AIUsageService, AlertsService],
    exports: [AIUsageService, AlertsService],
})
export class MonitoringModule { }
