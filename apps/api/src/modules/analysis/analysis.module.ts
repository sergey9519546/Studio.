import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceAnalysisController } from './workspace-analysis.controller';
import { GoogleModule } from '../google/google.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [ConfigModule, GoogleModule, AIModule],
  controllers: [WorkspaceAnalysisController],
  providers: [
    // DataExtractorService and GoogleClientFactory are provided by GoogleModule
  ],
})
export class AnalysisModule { }
