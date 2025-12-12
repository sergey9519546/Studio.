import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { getTools } from './tools.js';
import type { ToolCall, ToolDefinition } from './types.js';
import { VertexAIService } from './vertex-ai.service.js';

@Injectable()
export class GeminiAnalystService {
  private readonly logger = new Logger(GeminiAnalystService.name);
  private tools: ToolDefinition[];

  constructor(
    private vertexAI: VertexAIService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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
    const cached = await this.cacheManager.get(cacheKey);
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
    await this.cacheManager.set(cacheKey, result, 3600);

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
   * Enhanced image analysis using Gemini Vision with creative intelligence
   */
  async analyzeImage(imageUrl: string, options?: {
    analysisType?: 'basic' | 'creative' | 'brand' | 'technical';
    context?: string;
    brandGuidelines?: Record<string, unknown>;
  }): Promise<{
    tags: string[];
    moods: string[];
    colors: string[];
    shotType?: string;
    description: string;
    composition?: {
      ruleOfThirds: boolean;
      leadingLines: string[];
      focalPoints: string[];
      balance: 'balanced' | 'unbalanced' | 'dynamic';
    };
    lighting?: {
      type: string;
      direction: string;
      mood: string;
      quality: 'soft' | 'harsh' | 'natural' | 'artificial';
    };
    style?: {
      genre: string;
      era: string;
      movements: string[];
      techniques: string[];
    };
    brandCompliance?: {
      compliant: boolean;
      issues: string[];
      suggestions: string[];
    };
    technical?: {
      resolution: string;
      aspectRatio: string;
      quality: 'high' | 'medium' | 'low';
      issues: string[];
    };
    creativeFeedback?: {
      strengths: string[];
      improvements: string[];
      alternativeSuggestions: string[];
    };
  }> {
    try {
      const analysisType = options?.analysisType || 'creative';
      const context = options?.context || '';
      const brandGuidelines = options?.brandGuidelines || {};

      const prompt = this.buildVisionAnalysisPrompt(imageUrl, analysisType, context, brandGuidelines);
      const schema = this.getVisionAnalysisSchema(analysisType);

      const result = await this.extractData(prompt, schema);
      return result as any;
    } catch (error) {
      this.logger.error('Error analyzing image:', error);
      throw error;
    }
  }

  /**
   * Batch analyze multiple images for consistency and comparison
   */
  async analyzeImageBatch(imageUrls: string[], options?: {
    analysisType?: 'basic' | 'creative' | 'brand' | 'technical';
    compareMode?: boolean;
    context?: string;
  }): Promise<{
    results: Array<{
      imageUrl: string;
      analysis: any;
    }>;
    comparison?: {
      consistency: number;
      commonElements: string[];
      differences: string[];
      recommendations: string[];
    };
  }> {
    const results = [];
    
    for (const imageUrl of imageUrls) {
      try {
        const analysis = await this.analyzeImage(imageUrl, {
          analysisType: options?.analysisType,
          context: options?.context
        });
        results.push({ imageUrl, analysis });
      } catch (error) {
        this.logger.error(`Error analyzing image ${imageUrl}:`, error);
        results.push({ 
          imageUrl, 
          analysis: { error: error.message } 
        });
      }
    }

    // Generate comparison if requested
    let comparison;
    if (options?.compareMode && results.length > 1) {
      comparison = await this.compareImages(results.map(r => r.analysis));
    }

    return { results, comparison };
  }

  /**
   * Analyze brand consistency across multiple assets
   */
  async analyzeBrandConsistency(imageUrls: string[], brandGuidelines: Record<string, unknown>): Promise<{
    overallScore: number;
    assetScores: Array<{
      imageUrl: string;
      score: number;
      compliance: boolean;
      issues: string[];
    }>;
    recommendations: string[];
    brandGuidelines: Record<string, unknown>;
  }> {
    const batchResults = await this.analyzeImageBatch(imageUrls, {
      analysisType: 'brand',
      compareMode: true,
      context: 'brand consistency analysis'
    });

    const assetScores = batchResults.results.map(result => {
      const compliance = result.analysis?.brandCompliance?.compliant || false;
      const score = compliance ? 8 + Math.random() * 2 : Math.random() * 7; // Mock scoring
      
      return {
        imageUrl: result.imageUrl,
        score: Math.round(score * 10) / 10,
        compliance,
        issues: result.analysis?.brandCompliance?.issues || []
      };
    });

    const overallScore = assetScores.reduce((acc, asset) => acc + asset.score, 0) / assetScores.length;
    
    const recommendations = [
      'Ensure consistent color palette across all brand assets',
      'Maintain uniform typography and font usage',
      'Align visual style with brand personality',
      'Review logo placement and sizing consistency'
    ];

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      assetScores,
      recommendations,
      brandGuidelines
    };
  }

  /**
   * Extract visual metadata and technical details
   */
  async extractVisualMetadata(imageUrl: string): Promise<{
    dimensions: { width: number; height: number };
    format: string;
    colorProfile: string;
    dominantColors: Array<{ color: string; percentage: number }>;
    visualElements: {
      text: boolean;
      logos: boolean;
      faces: boolean;
      objects: string[];
      patterns: string[];
    };
    composition: {
      ruleOfThirds: boolean;
      symmetry: boolean;
      leadingLines: boolean;
      focalPoint: string;
    };
    accessibility: {
      contrastRatio: number;
      readabilityScore: number;
      altTextSuggestions: string[];
    };
  }> {
    const prompt = `Analyze this image and extract detailed visual metadata. Focus on technical aspects, composition, and accessibility considerations. Respond in JSON format:

{
  "dimensions": {"width": number, "height": number},
  "format": "image format",
  "colorProfile": "color profile information",
  "dominantColors": [{"color": "#hex", "percentage": number}],
  "visualElements": {
    "text": boolean,
    "logos": boolean,
    "faces": boolean,
    "objects": ["object1", "object2"],
    "patterns": ["pattern1", "pattern2"]
  },
  "composition": {
    "ruleOfThirds": boolean,
    "symmetry": boolean,
    "leadingLines": boolean,
    "focalPoint": "description of main focal point"
  },
  "accessibility": {
    "contrastRatio": number,
    "readabilityScore": number,
    "altTextSuggestions": ["suggestion1", "suggestion2"]
  }
}

Image URL: ${imageUrl}`;

    const schema = {
      type: 'object',
      properties: {
        dimensions: {
          type: 'object',
          properties: {
            width: { type: 'number' },
            height: { type: 'number' }
          },
          required: ['width', 'height']
        },
        format: { type: 'string' },
        colorProfile: { type: 'string' },
        dominantColors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              color: { type: 'string' },
              percentage: { type: 'number' }
            },
            required: ['color', 'percentage']
          }
        },
        visualElements: {
          type: 'object',
          properties: {
            text: { type: 'boolean' },
            logos: { type: 'boolean' },
            faces: { type: 'boolean' },
            objects: { type: 'array', items: { type: 'string' } },
            patterns: { type: 'array', items: { type: 'string' } }
          },
          required: ['text', 'logos', 'faces', 'objects', 'patterns']
        },
        composition: {
          type: 'object',
          properties: {
            ruleOfThirds: { type: 'boolean' },
            symmetry: { type: 'boolean' },
            leadingLines: { type: 'boolean' },
            focalPoint: { type: 'string' }
          },
          required: ['ruleOfThirds', 'symmetry', 'leadingLines', 'focalPoint']
        },
        accessibility: {
          type: 'object',
          properties: {
            contrastRatio: { type: 'number' },
            readabilityScore: { type: 'number' },
            altTextSuggestions: { type: 'array', items: { type: 'string' } }
          },
          required: ['contrastRatio', 'readabilityScore', 'altTextSuggestions']
        }
      },
      required: ['dimensions', 'format', 'colorProfile', 'dominantColors', 'visualElements', 'composition', 'accessibility']
    };

    return await this.extractData(prompt, schema) as any;
  }

  /**
   * Generate creative suggestions and improvements
   */
  async generateCreativeSuggestions(imageUrl: string, brief?: string): Promise<{
    improvements: string[];
    alternatives: string[];
    variations: string[];
    nextSteps: string[];
  }> {
    const prompt = `As a creative director, analyze this image and provide constructive feedback and suggestions. Consider the brief if provided.

Brief: ${brief || 'No specific brief provided'}

Provide suggestions in JSON format:
{
  "improvements": ["specific improvement suggestion 1", "improvement 2"],
  "alternatives": ["alternative approach 1", "alternative 2"],
  "variations": ["variation idea 1", "variation 2"],
  "nextSteps": ["actionable next step 1", "step 2"]
}

Focus on:
- Visual impact and hierarchy
- Brand alignment
- Target audience appeal
- Technical execution
- Creative innovation

Image URL: ${imageUrl}`;

    const schema = {
      type: 'object',
      properties: {
        improvements: { type: 'array', items: { type: 'string' } },
        alternatives: { type: 'array', items: { type: 'string' } },
        variations: { type: 'array', items: { type: 'string' } },
        nextSteps: { type: 'array', items: { type: 'string' } }
      },
      required: ['improvements', 'alternatives', 'variations', 'nextSteps']
    };

    return await this.extractData(prompt, schema) as any;
  }

  /**
   * Legacy method for backward compatibility
   */
  async analyzeImageLegacy(imageUrl: string): Promise<{
    tags: string[];
    moods: string[];
    colors: string[];
    shotType?: string;
    description: string;
  }> {
    return this.analyzeImage(imageUrl, { analysisType: 'basic' });
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
    const cached = await this.cacheManager.get(cacheKey);
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
    await this.cacheManager.set(cacheKey, result, 43200);

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
    const cached = await this.cacheManager.get(cacheKey);
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
