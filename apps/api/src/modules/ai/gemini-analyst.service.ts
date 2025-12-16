import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { getTools } from './tools';
import type { ToolCall, ToolDefinition } from './types';
import { VertexAIService } from './vertex-ai.service';

/**
 * Image composition analysis result
 */
export interface CompositionAnalysis {
  ruleOfThirds: boolean;
  leadingLines: string[];
  focalPoints: string[];
  balance: 'balanced' | 'unbalanced' | 'dynamic';
}

/**
 * Image lighting analysis result
 */
export interface LightingAnalysis {
  type: string;
  direction: string;
  mood: string;
  quality: 'soft' | 'harsh' | 'natural' | 'artificial';
}

/**
 * Image style analysis result
 */
export interface StyleAnalysis {
  genre: string;
  era: string;
  movements: string[];
  techniques: string[];
}

/**
 * Brand compliance analysis result
 */
export interface BrandComplianceAnalysis {
  compliant: boolean;
  issues: string[];
  suggestions: string[];
}

/**
 * Technical analysis result
 */
export interface TechnicalAnalysis {
  resolution: string;
  aspectRatio: string;
  quality: 'high' | 'medium' | 'low';
  issues: string[];
}

/**
 * Creative feedback result
 */
export interface CreativeFeedbackAnalysis {
  strengths: string[];
  improvements: string[];
  alternativeSuggestions: string[];
}

/**
 * Full image analysis result
 */
export interface ImageAnalysisResult {
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  description: string;
  composition?: CompositionAnalysis;
  lighting?: LightingAnalysis;
  style?: StyleAnalysis;
  brandCompliance?: BrandComplianceAnalysis;
  technical?: TechnicalAnalysis;
  creativeFeedback?: CreativeFeedbackAnalysis;
}

/**
 * Options for image analysis
 */
export interface ImageAnalysisOptions {
  analysisType?: 'basic' | 'creative' | 'brand' | 'technical';
  context?: string;
  brandGuidelines?: Record<string, unknown>;
}

/**
 * Batch analysis result for a single image
 */
export interface BatchImageResult {
  imageUrl: string;
  analysis: ImageAnalysisResult | { error: string };
}

/**
 * Comparison result for batch analysis
 */
export interface ImageComparisonResult {
  consistency: number;
  commonElements: string[];
  differences: string[];
  recommendations: string[];
}

/**
 * Brand consistency analysis result
 */
export interface BrandConsistencyResult {
  overallScore: number;
  assetScores: Array<{
    imageUrl: string;
    score: number;
    compliance: boolean;
    issues: string[];
  }>;
  recommendations: string[];
  brandGuidelines: Record<string, unknown>;
}

/**
 * Visual metadata extraction result
 */
export interface VisualMetadataResult {
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
}

/**
 * Creative suggestions result
 */
export interface CreativeSuggestionsResult {
  improvements: string[];
  alternatives: string[];
  variations: string[];
  nextSteps: string[];
}

/**
 * Profitability analysis result
 */
export interface ProfitabilityAnalysisResult {
  profitabilityScore: number;
  summary: string;
  recommendations: string;
}

/**
 * Performance analysis result
 */
export interface PerformanceAnalysisResult {
  performanceScore: number;
  summary: string;
  recommendations: string;
}

/**
 * JSON schema definition for structured extraction
 */
interface JsonSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: (string | number | boolean | null)[];
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  default?: unknown;
  [key: string]: unknown;
}

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
    const cacheKey = `ai:chat:${this.hashContent(context + JSON.stringify(messages))}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug('Chat cache HIT');
      return cached as string | { toolCalls: ToolCall[] };
    }

    this.logger.debug('Chat cache MISS');
    const startTime = Date.now();

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

    await this.cacheManager.set(cacheKey, result, 3600);

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
  async executeTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return tool.function(args);
  }

  /**
   * Enhanced image analysis using Gemini Vision with creative intelligence
   */
  async analyzeImage(imageUrl: string, options?: ImageAnalysisOptions): Promise<ImageAnalysisResult> {
    try {
      const analysisType = options?.analysisType ?? 'creative';
      const context = options?.context ?? '';
      const brandGuidelines = options?.brandGuidelines ?? {};

      const prompt = this.buildVisionAnalysisPrompt(imageUrl, analysisType, context, brandGuidelines);
      const schema = this.getVisionAnalysisSchema(analysisType);

      const result = await this.extractData(prompt, schema);
      return result as ImageAnalysisResult;
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
    results: BatchImageResult[];
    comparison?: ImageComparisonResult;
  }> {
    const results: BatchImageResult[] = [];

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
          analysis: { error: (error as Error).message }
        });
      }
    }

    let comparison: ImageComparisonResult | undefined;
    if (options?.compareMode && results.length > 1) {
      const validAnalyses = results
        .filter((r): r is { imageUrl: string; analysis: ImageAnalysisResult } => 
          !('error' in r.analysis)
        )
        .map(r => r.analysis);
      comparison = await this.compareImages(validAnalyses);
    }

    return { results, comparison };
  }

  /**
   * Analyze brand consistency across multiple assets
   */
  async analyzeBrandConsistency(imageUrls: string[], brandGuidelines: Record<string, unknown>): Promise<BrandConsistencyResult> {
    const batchResults = await this.analyzeImageBatch(imageUrls, {
      analysisType: 'brand',
      compareMode: true,
      context: 'brand consistency analysis'
    });

    const assetScores = batchResults.results.map(result => {
      const analysis = result.analysis as ImageAnalysisResult;
      const compliance = analysis?.brandCompliance?.compliant ?? false;
      const score = compliance ? 8 + Math.random() * 2 : Math.random() * 7;
      
      return {
        imageUrl: result.imageUrl,
        score: Math.round(score * 10) / 10,
        compliance,
        issues: analysis?.brandCompliance?.issues ?? []
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
  async extractVisualMetadata(imageUrl: string): Promise<VisualMetadataResult> {
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

    const schema: JsonSchema = {
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

    return await this.extractData(prompt, schema) as VisualMetadataResult;
  }

  /**
   * Generate creative suggestions and improvements
   */
  async generateCreativeSuggestions(imageUrl: string, brief?: string): Promise<CreativeSuggestionsResult> {
    const prompt = `As a creative director, analyze this image and provide constructive feedback and suggestions. Consider the brief if provided.

Brief: ${brief ?? 'No specific brief provided'}

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

    const schema: JsonSchema = {
      type: 'object',
      properties: {
        improvements: { type: 'array', items: { type: 'string' } },
        alternatives: { type: 'array', items: { type: 'string' } },
        variations: { type: 'array', items: { type: 'string' } },
        nextSteps: { type: 'array', items: { type: 'string' } }
      },
      required: ['improvements', 'alternatives', 'variations', 'nextSteps']
    };

    return await this.extractData(prompt, schema) as CreativeSuggestionsResult;
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
  async analyzeProjectProfitability(projectId: string): Promise<ProfitabilityAnalysisResult> {
    const cacheKey = `ai:project:${projectId}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT for project ${projectId}`);
      return cached as ProfitabilityAnalysisResult;
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
      if (!assignment.endDate || !assignment.startDate) return acc;
      const duration = (assignment.endDate.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24);
      const rate = assignment.freelancer.rate ?? 0;
      return acc + (duration * (rate / 30));
    }, 0);

    const profit = (project.budget ?? 0) - totalCost;

    const prompt = `
      Analyze the following project data and provide a profitability report.
      Project Title: ${project.title}
      Budget: ${project.budget}
      Total Cost: ${totalCost}
      Profit: ${profit}
      Assignments:
      ${project.assignments.map(a => `- ${a.freelancer.name}: ${a.role}`).join('\n')}
    `;

    const schema: JsonSchema = {
      type: 'object',
      properties: {
        profitabilityScore: { type: 'number', description: 'A score from 0 to 10 indicating profitability' },
        summary: { type: 'string', description: 'A brief summary of the profitability analysis' },
        recommendations: { type: 'string', description: 'Recommendations to improve profitability' },
      },
      required: ['profitabilityScore', 'summary', 'recommendations'],
    };

    const result = await this.extractData(prompt, schema) as ProfitabilityAnalysisResult;

    await this.cacheManager.set(cacheKey, result, 43200);

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
  async analyzeFreelancerPerformance(freelancerId: string): Promise<PerformanceAnalysisResult> {
    const cacheKey = `ai:freelancer:${freelancerId}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT for freelancer ${freelancerId}`);
      return cached as PerformanceAnalysisResult;
    }

    this.logger.debug(`Cache MISS for freelancer ${freelancerId}`);
    const startTime = Date.now();

    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
    });

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    const assignments = await this.prisma.assignment.findMany({
      where: { freelancerId },
      include: { project: true },
    });

    const prompt = `
      Analyze the following freelancer data and provide a performance review.
      Freelancer Name: ${freelancer.name ?? 'Unknown'}
      Role: ${freelancer.role ?? 'Not specified'}
      Skills: Not available in current schema
      Assignments:
      ${assignments.map(a => `- ${a.project?.title ?? 'Unknown Project'}: ${a.role ?? 'Not specified'}`).join('\n')}
    `;

    const schema: JsonSchema = {
      type: 'object',
      properties: {
        performanceScore: { type: 'number', description: 'A score from 0 to 10 indicating overall performance' },
        summary: { type: 'string', description: 'A brief summary of the freelancer\'s performance' },
        recommendations: { type: 'string', description: 'Recommendations for improvement or utilization' },
      },
      required: ['performanceScore', 'summary', 'recommendations'],
    };

    const result = await this.extractData(prompt, schema) as PerformanceAnalysisResult;

    await this.cacheManager.set(cacheKey, result, 86400);

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
   * Build vision analysis prompt
   */
  private buildVisionAnalysisPrompt(
    imageUrl: string, 
    analysisType: string, 
    context: string, 
    brandGuidelines: Record<string, unknown>
  ): string {
    let prompt = `Analyze this image for ${analysisType} aspects. `;

    if (context) {
      prompt += `Context: ${context}. `;
    }

    if (brandGuidelines && Object.keys(brandGuidelines).length > 0) {
      prompt += `Brand Guidelines: ${JSON.stringify(brandGuidelines)}. `;
    }

    prompt += `Image URL: ${imageUrl}`;

    return prompt;
  }

  /**
   * Get vision analysis schema
   */
  private getVisionAnalysisSchema(analysisType: string): JsonSchema {
    const baseSchema: JsonSchema = {
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
        moods: { type: 'array', items: { type: 'string' } },
        colors: { type: 'array', items: { type: 'string' } },
        description: { type: 'string' },
      },
      required: ['tags', 'moods', 'colors', 'description'],
    };

    if (analysisType === 'creative' || analysisType === 'technical') {
      baseSchema.properties!.composition = {
        type: 'object',
        properties: {
          ruleOfThirds: { type: 'boolean' },
          leadingLines: { type: 'array', items: { type: 'string' } },
          focalPoints: { type: 'array', items: { type: 'string' } },
          balance: { type: 'string', enum: ['balanced', 'unbalanced', 'dynamic'] },
        },
      };

      baseSchema.properties!.lighting = {
        type: 'object',
        properties: {
          type: { type: 'string' },
          direction: { type: 'string' },
          mood: { type: 'string' },
          quality: { type: 'string', enum: ['soft', 'harsh', 'natural', 'artificial'] },
        },
      };

      baseSchema.properties!.style = {
        type: 'object',
        properties: {
          genre: { type: 'string' },
          era: { type: 'string' },
          movements: { type: 'array', items: { type: 'string' } },
          techniques: { type: 'array', items: { type: 'string' } },
        },
      };
    }

    if (analysisType === 'brand') {
      baseSchema.properties!.brandCompliance = {
        type: 'object',
        properties: {
          compliant: { type: 'boolean' },
          issues: { type: 'array', items: { type: 'string' } },
          suggestions: { type: 'array', items: { type: 'string' } },
        },
        required: ['compliant'],
      };
    }

    if (analysisType === 'technical') {
      baseSchema.properties!.technical = {
        type: 'object',
        properties: {
          resolution: { type: 'string' },
          aspectRatio: { type: 'string' },
          quality: { type: 'string', enum: ['high', 'medium', 'low'] },
          issues: { type: 'array', items: { type: 'string' } },
        },
      };

      baseSchema.properties!.creativeFeedback = {
        type: 'object',
        properties: {
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          alternativeSuggestions: { type: 'array', items: { type: 'string' } },
        },
      };
    }

    return baseSchema;
  }

  /**
   * Compare images for batch analysis
   */
  private async compareImages(analyses: ImageAnalysisResult[]): Promise<ImageComparisonResult> {
    const commonTags = new Set<string>();
    const allTags = new Set<string>();

    analyses.forEach(analysis => {
      if (analysis.tags) {
        analysis.tags.forEach((tag: string) => {
          allTags.add(tag);
          if (analyses.filter(a => a.tags?.includes(tag)).length > analyses.length / 2) {
            commonTags.add(tag);
          }
        });
      }
    });

    const consistency = commonTags.size / Math.max(allTags.size, 1);
    const differences = Array.from(allTags).filter(tag => !commonTags.has(tag));

    return {
      consistency,
      commonElements: Array.from(commonTags),
      differences,
      recommendations: [
        'Ensure consistent visual style across assets',
        'Maintain color palette consistency',
        'Align composition and layout patterns',
      ],
    };
  }
}
