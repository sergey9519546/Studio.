import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiAnalystService } from '../ai/gemini-analyst.service';

@Injectable()
export class WorkspaceAnalysisService {
  private readonly logger = new Logger(WorkspaceAnalysisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: GeminiAnalystService,
  ) {}

  /**
   * Get an overview of workspace health
   */
  async getWorkspaceOverview() {
    const [projectCount, freelancerCount, assignmentCount, totalBudget] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.freelancer.count(),
      this.prisma.assignment.count({ where: { status: 'ACTIVE' } }),
      this.prisma.project.aggregate({ _sum: { budget: true } }),
    ]);

    const statusCounts = await this.prisma.project.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      projects: {
        total: projectCount,
        byStatus: statusCounts,
      },
      freelancers: {
        total: freelancerCount,
      },
      assignments: {
        active: assignmentCount,
      },
      financials: {
        totalBudget: totalBudget._sum.budget || 0,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Perform AI-powered analysis of workspace workload
   */
  async analyzeWorkload() {
    const freelancers = await this.prisma.freelancer.findMany({
      include: {
        assignments: {
          where: { status: 'ACTIVE' },
          include: { project: true },
        },
      },
    });

    const prompt = `
      Analyze the workload of the following freelancers in the creative agency.
      Freelancers and their active assignments:
      ${freelancers.map(f => `
        - ${f.name} (Role: ${f.role}):
          ${f.assignments.map(a => `  * Project: ${a.project.title}, Role: ${a.role}, Allocation: ${a.allocation}%`).join('\n')}
      `).join('\n')}

      Provide a summary of:
      1. Overloaded freelancers (allocation > 100%)
      2. Underutilized freelancers (allocation < 50%)
      3. Critical bottlenecks in specific roles
      4. Recommendations for better resource distribution.
    `;

    const result = await this.aiService.chat(prompt);
    return {
      analysis: typeof result === 'string' ? result : JSON.stringify(result),
      timestamp: new Date(),
    };
  }

  /**
   * Analyze project profitability across the workspace
   */
  async analyzeGlobalProfitability() {
    const projects = await this.prisma.project.findMany({
      where: { budget: { gt: 0 } },
      include: {
        assignments: {
          include: { freelancer: true },
        },
      },
    });

    const analysisPrompt = `
      Analyze the profitability of the following projects.
      Projects:
      ${projects.map(p => `
        - ${p.title} (Budget: ${p.budget}):
          Assignments: ${p.assignments.map(a => `[${a.freelancer.name}, Rate: ${a.freelancer.rate}]`).join(', ')}
      `).join('\n')}

      Provide:
      1. Overall profitability score (0-10)
      2. High-risk projects (low margin)
      3. Most profitable project types
      4. Strategic recommendations for budget management.
    `;

    const result = await this.aiService.chat(analysisPrompt);
    return {
      analysis: typeof result === 'string' ? result : JSON.stringify(result),
      timestamp: new Date(),
    };
  }
}
