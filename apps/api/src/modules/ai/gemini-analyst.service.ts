import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VertexAIService } from './vertex-ai.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getTools } from './tools';
import type { ToolCall, ToolDefinition } from './types';
import { createHash } from 'crypto';

@Injectable()
export class GeminiAnalystService {
  private readonly logger = new Logger(GeminiAnalystService.name);
  private tools: ToolDefinition[];

  constructor(
    private vertexAI: VertexAIService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {
    this.tools = getTools(this.prisma);
  }

  /**
   * Chat with context (cached for common queries)
   */
  async chat(context: string, messages: Array<{ role: string; content: string }> = []): Promise<string | { toolCalls: ToolCall[] }> {
    // Create cache key from context + messages
    const cacheKey = `ai:chat:${this.hashContent(context + JSON.stringify(messages))}`;

    // Check cache for common queries (1 hour TTL)
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug('Chat cache HIT');
      return cached as string | { toolCalls: ToolCall[] };
    }

    this.logger.debug('Chat cache MISS');
    const startTime = Date.now();

    // Enhanced system prompt with examples
    const systemPrompt = `You are an expert AI analyst for a creative agency management system.

ROLE: Analyze freelancers, projects, workload, and provide data-driven insights.

GUIDELINES:
- Be concise and actionable
- Cite specific data points from context
- Use bullet points for clarity
- Provide concrete recommendations

EXAMPLE:
User: "How is this freelancer performing?"
You: "**Performance Summary:**
• Completed 5 projects (100% on-time)
• Average rating: 4.8/5
• Specialties: Design, Branding
• Recommendation: Excellent for high-priority creative work"

Context:
${context}

Respond based on the provided context.`;

    const result = await this.vertexAI.chat(messages, systemPrompt, this.tools);

    // Cache for 1 hour (common queries)
    await this.cache.set(cacheKey, result, 3600);

    // Log usage
    const duration = Date.now() - startTime;
    this.logger.log({
      type: 'ai_usage',
      endpoint: 'chat',
      duration_ms: duration,
      cached: false,
    });

    return result;
  }

  /**
   * Hash content for cache key generation
   */
  private hashContent(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  /**
   * Execute a tool
   */
  async executeTool(toolName: string, args: Record<string, unknown>) {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return tool.function(args);
  }

  /**
   * Analyze image using Gemini Vision
   */
  async analyzeImage(imageUrl: string): Promise<{
    tags: string[];
    moods: string[];
    colors: string[];
    shotType?: string;
    description: string;
  }> {
    try {
      const prompt = `Analyze this image for creative and design purposes. Respond in JSON format with the following fields:
{
  "tags": ["visual tag 1", "visual tag 2", ...],
  "moods": ["mood 1", "mood 2", ...],
  "colors": ["hex color 1", "hex color 2", ...],
  "shotType": "shot type or framing style (optional)",
  "description": "2-3 sentence creative description"
}
Be specific and creative in your analysis. Tags should describe visual elements. Moods should capture emotional tone.`;

      const visionPrompt = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: await this.fetchImageAsBase64(imageUrl),
          },
        },
        {
          text: prompt,
        },
      ];

      const response = await this.vertexAI.generateContentWithVision(JSON.stringify(visionPrompt));

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : '{"tags":[],"moods":[],"colors":[],"description":""}';

      return JSON.parse(jsonContent);
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
      throw error;
    }
  }

  /**
   * Fetch image and convert to base64
   */
  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    } catch (error) {
      this.logger.error('Error fetching image:', error);
      throw error;
    }
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
   * Analyze project profitability (cached 12h)
   */
  async analyzeProjectProfitability(projectId: string): Promise<unknown> {
    const cacheKey = `ai:project:${projectId}`;

    // Check cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT for project ${projectId}`);
      return cached;
    }

    this.logger.debug(`Cache MISS for project ${projectId}`);
    const startTime = Date.now();

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

    const result = await this.extractData(prompt, schema);

    // Cache for 12 hours
    await this.cache.set(cacheKey, result, 43200);

    // Log usage
    const duration = Date.now() - startTime;
    this.logger.log({
      type: 'ai_usage',
      endpoint: 'analyzeProjectProfitability',
      projectId,
      duration_ms: duration,
      cached: false,
    });

    return result;
  }

  /**
   * Analyze freelancer performance (cached 24h)
   */
  async analyzeFreelancerPerformance(freelancerId: string): Promise<unknown> {
    const cacheKey = `ai:freelancer:${freelancerId}`;

    // Check cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT for freelancer ${freelancerId}`);
      return cached;
    }

    this.logger.debug(`Cache MISS for freelancer ${freelancerId}`);
    const startTime = Date.now();

    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
      include: {
        skills: true,
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

    const result = await this.extractData(prompt, schema);

    // Cache for 24 hours
    await this.cache.set(cacheKey, result, 86400);

    // Log usage
    const duration = Date.now() - startTime;
    this.logger.log({
      type: 'ai_usage',
      endpoint: 'analyzeFreelancerPerformance',
      freelancerId,
      duration_ms: duration,
      cached: false,
    });

    return result;
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
