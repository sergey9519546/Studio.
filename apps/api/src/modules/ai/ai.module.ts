import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { ConfigModule } from '@nestjs/config';
import { IntelligenceModule } from '../intelligence/intelligence.module';

@Module({
    imports: [ConfigModule, IntelligenceModule],
    controllers: [AIController],
    providers: [GeminiAnalystService],
    exports: [GeminiAnalystService],
})
export class AIModule { }
