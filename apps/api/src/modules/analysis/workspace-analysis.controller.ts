import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { WorkspaceAnalysisService } from "./workspace-analysis.service.js";

@Controller({ path: "analysis", version: "1" })
@UseGuards(JwtAuthGuard)
export class WorkspaceAnalysisController {
  constructor(private readonly analysisService: WorkspaceAnalysisService) {}

  @Get("overview")
  async getOverview() {
    return this.analysisService.getWorkspaceOverview();
  }

  @Get("workload")
  async analyzeWorkload() {
    return this.analysisService.analyzeWorkload();
  }

  @Get("profitability")
  async analyzeProfitability() {
    return this.analysisService.analyzeGlobalProfitability();
  }
}
