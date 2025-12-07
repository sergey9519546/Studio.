import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AlertsService } from './alerts.service';

/**
 * Guard to enforce AI budget limits
 * 
 * Usage:
 * @UseGuards(BudgetGuard)
 * @Post('ai/chat')
 */
@Injectable()
export class BudgetGuard implements CanActivate {
    constructor(private alerts: AlertsService) { }

    async canActivate(_: ExecutionContext): Promise<boolean> {
        // Check daily budget
        const budgetStatus = await this.alerts.checkDailyBudget();

        // Block if daily budget exceeded
        if (budgetStatus.percentage >= 1.0) {
            throw new ForbiddenException(
                `Daily AI budget exceeded ($${budgetStatus.cost.toFixed(2)} / $${budgetStatus.budget}). Please contact administrator.`
            );
        }

        // Warn if approaching limit (90%)
        if (budgetStatus.percentage >= 0.9 && budgetStatus.percentage < 1.0) {
            // Could log warning or add header to response
            console.warn(`⚠️  Approaching daily budget limit: ${(budgetStatus.percentage * 100).toFixed(1)}%`);
        }

        return true;
    }
}
