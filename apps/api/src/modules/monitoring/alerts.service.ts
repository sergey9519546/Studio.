import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AIUsageService } from './ai-usage.service.js';

interface AlertConfig {
    dailyBudget: number;
    weeklyBudget: number;
    monthlyBudget: number;
    alertThresholds: number[]; // e.g., [0.5, 0.75, 0.9, 1.0]
    alertEmail?: string;
    slackWebhook?: string;
}

export interface BudgetStatus {
    period: 'daily' | 'weekly' | 'monthly';
    cost: number;
    budget: number;
    percentage: number;
    alert: boolean;
    level: 'info' | 'warning' | 'critical';
}

@Injectable()
export class AlertsService {
    private readonly logger = new Logger(AlertsService.name);

    // Configuration - can be moved to environment variables
    // LOWERED BUDGETS: Capped at $50/month for Vertex AI
    private readonly config: AlertConfig = {
        dailyBudget: parseFloat(process.env.AI_DAILY_BUDGET || '1.5'),   // $1.50/day
        weeklyBudget: parseFloat(process.env.AI_WEEKLY_BUDGET || '12'),  // $12/week
        monthlyBudget: parseFloat(process.env.AI_MONTHLY_BUDGET || '50'), // $50/month MAX
        alertThresholds: [0.5, 0.75, 0.9, 1.0], // Alert at 50%, 75%, 90%, 100%
        alertEmail: process.env.ALERT_EMAIL,
        slackWebhook: process.env.SLACK_WEBHOOK_URL,
    };

    constructor(private aiUsage: AIUsageService) { }

    /**
     * Automated budget check - runs every 6 hours
     */
    @Cron(CronExpression.EVERY_6_HOURS)
    async checkBudgets() {
        this.logger.log('Running automated budget check...');

        const [daily, weekly, monthly] = await Promise.all([
            this.checkDailyBudget(),
            this.checkWeeklyBudget(),
            this.checkMonthlyBudget(),
        ]);

        // Send alert if any budget threshold crossed
        if (daily.alert || weekly.alert || monthly.alert) {
            await this.sendAlert({ daily, weekly, monthly });
        }

        this.logger.log(`Budget check complete - Daily: ${daily.percentage.toFixed(1)}%, Weekly: ${weekly.percentage.toFixed(1)}%, Monthly: ${monthly.percentage.toFixed(1)}%`);
    }

    /**
     * Check daily budget status
     */
    async checkDailyBudget(): Promise<BudgetStatus> {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0));
        const stats = await this.aiUsage.getStats({ start, end: new Date() });

        const cost = parseFloat(stats.totalCost.replace('$', ''));
        const percentage = cost / this.config.dailyBudget;

        return {
            period: 'daily',
            cost,
            budget: this.config.dailyBudget,
            percentage,
            alert: this.shouldAlert(percentage),
            level: this.getAlertLevel(percentage),
        };
    }

    /**
     * Check weekly budget status
     */
    async checkWeeklyBudget(): Promise<BudgetStatus> {
        const now = new Date();
        const start = new Date(now.setDate(now.getDate() - 7));
        const stats = await this.aiUsage.getStats({ start, end: new Date() });

        const cost = parseFloat(stats.totalCost.replace('$', ''));
        const percentage = cost / this.config.weeklyBudget;

        return {
            period: 'weekly',
            cost,
            budget: this.config.weeklyBudget,
            percentage,
            alert: this.shouldAlert(percentage),
            level: this.getAlertLevel(percentage),
        };
    }

    /**
     * Check monthly budget status
     */
    async checkMonthlyBudget(): Promise<BudgetStatus> {
        const now = new Date();
        const start = new Date(now.setDate(now.getDate() - 30));
        const stats = await this.aiUsage.getStats({ start, end: new Date() });

        const cost = parseFloat(stats.totalCost.replace('$', ''));
        const percentage = cost / this.config.monthlyBudget;

        return {
            period: 'monthly',
            cost,
            budget: this.config.monthlyBudget,
            percentage,
            alert: this.shouldAlert(percentage),
            level: this.getAlertLevel(percentage),
        };
    }

    /**
     * Check if current percentage should trigger an alert
     */
    private shouldAlert(percentage: number): boolean {
        return this.config.alertThresholds.some(threshold =>
            percentage >= threshold && percentage < threshold + 0.05
        );
    }

    /**
     * Determine alert severity level
     */
    private getAlertLevel(percentage: number): 'info' | 'warning' | 'critical' {
        if (percentage >= 1.0) return 'critical';
        if (percentage >= 0.75) return 'warning';
        return 'info';
    }

    /**
     * Send alert notification
     */
    private async sendAlert(data: {
        daily: BudgetStatus;
        weekly: BudgetStatus;
        monthly: BudgetStatus;
    }) {
        const message = this.formatAlertMessage(data);

        this.logger.warn('🚨 BUDGET ALERT', message);

        // Future: Send email notification
        // if (this.config.alertEmail) {
        //   await this.emailService.send({
        //     to: this.config.alertEmail,
        //     subject: 'AI Budget Alert',
        //     body: message
        //   });
        // }

        // Future: Send Slack notification
        // if (this.config.slackWebhook) {
        //   await fetch(this.config.slackWebhook, {
        //     method: 'POST',
        //     body: JSON.stringify({ text: message })
        //   });
        // }
    }

    /**
     * Format alert message
     */
    private formatAlertMessage(data: {
        daily: BudgetStatus;
        weekly: BudgetStatus;
        monthly: BudgetStatus;
    }): string {
        const alerts = [data.daily, data.weekly, data.monthly]
            .filter(status => status.alert)
            .map(status => `${status.period.toUpperCase()}: $${status.cost.toFixed(2)} / $${status.budget} (${(status.percentage * 100).toFixed(1)}%)`)
            .join('\n');

        return `🚨 AI Budget Alert\n\n${alerts}\n\nAction: Review AI usage in monitoring dashboard.`;
    }

    /**
     * Get current budget status for all periods
     */
    async getAllBudgetStatus() {
        const [daily, weekly, monthly] = await Promise.all([
            this.checkDailyBudget(),
            this.checkWeeklyBudget(),
            this.checkMonthlyBudget(),
        ]);

        return {
            daily,
            weekly,
            monthly,
            config: {
                dailyBudget: this.config.dailyBudget,
                weeklyBudget: this.config.weeklyBudget,
                monthlyBudget: this.config.monthlyBudget,
                thresholds: this.config.alertThresholds,
            },
        };
    }
}
