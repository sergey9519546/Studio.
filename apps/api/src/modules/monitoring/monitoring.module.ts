import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { AIUsageService } from './ai-usage.service';
import { AlertsService } from './alerts.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MonitoringController],
    providers: [AIUsageService, AlertsService],
    exports: [AIUsageService, AlertsService],
})
export class MonitoringModule { }
