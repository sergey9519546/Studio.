import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { AIUsageService } from './ai-usage.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MonitoringController],
    providers: [AIUsageService],
    exports: [AIUsageService],
})
export class MonitoringModule { }
