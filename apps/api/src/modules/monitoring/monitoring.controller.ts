import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { AIUsageService } from "./ai-usage.service.js";
import { AlertsService } from "./alerts.service.js";

@Controller({ path: "monitoring", version: "1" })
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(
    private aiUsage: AIUsageService,
    private alerts: AlertsService
  ) {}

  @Get("budget/status")
  async getBudgetStatus() {
    return this.alerts.getAllBudgetStatus();
  }

  @Get("ai-usage/today")
  async getToday() {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    return this.aiUsage.getStats({ start, end: new Date() });
  }

  @Get("ai-usage/week")
  async getWeek() {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - 7));
    return this.aiUsage.getStats({ start, end: new Date() });
  }

  @Get("ai-usage/month")
  async getMonth() {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - 30));
    return this.aiUsage.getStats({ start, end: new Date() });
  }

  @Get("ai-usage/custom")
  async getCustom(@Query("start") start: string, @Query("end") end: string) {
    return this.aiUsage.getStats({
      start: new Date(start),
      end: new Date(end),
    });
  }

  @Get("ai-usage/dashboard")
  async getDashboard() {
    const [today, week, month] = await Promise.all([
      this.getToday(),
      this.getWeek(),
      this.getMonth(),
    ]);

    return {
      summary: {
        today,
        week,
        month,
      },
      costTrend: this.calculateTrend(today, week, month),
    };
  }

  private calculateTrend(
    today: { totalCost: string },
    week: { totalCost: string },
    month: { totalCost: string }
  ) {
    const todayCost = parseFloat(today.totalCost.replace("$", ""));
    const weekCost = parseFloat(week.totalCost.replace("$", ""));
    const monthCost = parseFloat(month.totalCost.replace("$", ""));

    return {
      dailyAvg: "$" + (weekCost / 7).toFixed(4),
      weeklyAvg: "$" + (monthCost / 4).toFixed(4),
      projectedMonthly: "$" + (todayCost * 30).toFixed(2),
    };
  }
}
