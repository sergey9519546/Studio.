import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from "../../prisma/prisma.module.js";
import { AIModule } from "../ai/ai.module.js";
import { GoogleModule } from "../google/google.module.js";
import { WorkspaceAnalysisController } from "./workspace-analysis.controller.js";
import { WorkspaceAnalysisService } from "./workspace-analysis.service.js";

@Module({
  imports: [ConfigModule, GoogleModule, AIModule, PrismaModule],
  controllers: [WorkspaceAnalysisController],
  providers: [
    WorkspaceAnalysisService,
    // DataExtractorService and GoogleClientFactory are provided by GoogleModule
  ],
  exports: [WorkspaceAnalysisService],
})
export class AnalysisModule {}
