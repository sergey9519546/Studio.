import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceAnalysisController } from './workspace-analysis.controller.js';
import { GoogleModule } from '../google/google.module.js';
import { AIModule } from '../ai/ai.module.js';

@Module({
  imports: [ConfigModule, GoogleModule, AIModule],
  controllers: [WorkspaceAnalysisController],
  providers: [
    // DataExtractorService and GoogleClientFactory are provided by GoogleModule
  ],
})
export class AnalysisModule { }
