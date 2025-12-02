import { Injectable } from '@nestjs/common';
import { VertexAIService } from './vertex-ai.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getTools } from './tools';

@Injectable()
export class GeminiAnalystService {
  private tools: any[];

  constructor(private vertexAI: VertexAIService, private prisma: PrismaService) {
    this.tools = getTools(this.prisma);
  }

  /**
   * Chat with context
   */
  async chat(context: string, messages: Array<{ role: string; content: string }> = []): Promise<string | { toolCalls: any[] }> {
    // Build full conversation with context
    const systemPrompt = `You are an AI analyst for a creative agency management system.
        
Context:
${context}

Please provide helpful, accurate responses based on this context.`;

    return this.vertexAI.chat(messages, systemPrompt, this.tools);
  }

  /**
   * Execute a tool
   */
  async executeTool(toolName: string, args: any) {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return tool.function(args);
  }


  /**
   * Extract structured data
   */
  async extractData(prompt: string, schema?: Record<string, unknown>, files?: Express.Multer.File[]): Promise<unknown> {
    let fullPrompt = prompt;

    // Add file contents to prompt if provided
    if (files && files.length > 0) {
      fullPrompt += '\n\nAttached files:\n';
      for (const file of files) {
        fullPrompt += `\nFile: ${file.originalname}\n`;
        fullPrompt += `Content: ${file.buffer.toString('utf-8').substring(0, 5000)}\n`;
      }
    }

    return this.vertexAI.extractData(fullPrompt, schema);
  }

  /**
   * Generate content
   */
  async generateContent(prompt: string): Promise<string> {
    return this.vertexAI.generateContent(prompt);
  }

  /**
   * Analyze project profitability
   */
  async analyzeProjectProfitability(projectId: string): Promise<unknown> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assignments: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const totalCost = project.assignments.reduce((acc, assignment) => {
      const duration = (assignment.endDate.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24); // duration in days
      const rate = assignment.freelancer.rate || 0;
      return acc + (duration * (rate / 30)); // assuming rate is monthly
    }, 0);

    const profit = (project.budget || 0) - totalCost;

    const prompt = `
      Analyze the following project data and provide a profitability report.
      Project Title: ${project.title}
      Budget: ${project.budget}
      Total Cost: ${totalCost}
      Profit: ${profit}
      Assignments:
      ${project.assignments.map(a => `- ${a.freelancer.name}: ${a.role}`).join('\n')}
    `;

    const schema = {
      type: 'object',
      properties: {
        profitabilityScore: { type: 'number', description: 'A score from 0 to 10 indicating profitability' },
        summary: { type: 'string', description: 'A brief summary of the profitability analysis' },
        recommendations: { type: 'string', description: 'Recommendations to improve profitability' },
      },
      required: ['profitabilityScore', 'summary', 'recommendations'],
    };

    return this.extractData(prompt, schema);
  }

  /**
   * Analyze freelancer performance
   */
  async analyzeFreelancerPerformance(freelancerId: string): Promise<unknown> {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
      include: {
        assignments: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    const prompt = `
      Analyze the following freelancer data and provide a performance review.
      Freelancer Name: ${freelancer.name}
      Role: ${freelancer.role}
      Skills: ${freelancer.skills.map(s => s.name).join(', ')}
      Assignments:
      ${freelancer.assignments.map(a => `- ${a.project.title}: ${a.role}`).join('\n')}
    `;

    const schema = {
      type: 'object',
      properties: {
        performanceScore: { type: 'number', description: 'A score from 0 to 10 indicating performance' },
        summary: { type: 'string', description: 'A brief summary of the performance review' },
        recommendations: { type: 'string', description: 'Recommendations for improvement' },
      },
      required: ['performanceScore', 'summary', 'recommendations'],
    };

    return this.extractData(prompt, schema);
  }

  /**
   * Generate project brief
   */
  async generateProjectBrief(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assignments: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const prompt = `
      Generate a project brief for the following project:
      Title: ${project.title}
      Description: ${project.description}
      Team:
      ${project.assignments.map(a => `- ${a.freelancer.name}: ${a.role}`).join('\n')}
    `;

    return this.generateContent(prompt);
  }
}