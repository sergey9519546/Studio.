import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  BuildContextDto,
  RecordApprovalDto,
  RecordCreativeWorkDto,
  UpdateBrandContextDto,
} from './dto/omni-context.dto.js';
import {
  ProjectContext,
  ContextRequest,
  CachedContext,
  ApprovalData,
  ContextQueryResult,
  VectorSearchResult,
} from './types/omni-context.types.js';

/**
 * Omni-Context AI Service
 * 
 * Core service that builds, caches, and maintains persistent AI context
 * across projects. This is the brain of the AI system that remembers
 * brand voice, client preferences, and creative patterns.
 * 
 * Key Responsibilities:
 * - Build comprehensive project context from multiple data sources
 * - Cache contexts with Redis for performance
 * - Learn from approvals and feedback to improve context
 * - Query vector store for semantically similar knowledge
 * - Calculate confidence scores for context relevance
 */
@Injectable()
export class OmniContextService {
  private readonly logger = new Logger(OmniContextService.name);
  
  // In-memory cache (in production, use Redis)
  private readonly contextCache = new Map<string, CachedContext>();
  
  // Configuration
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_HISTORY_DEPTH = 10; // Number of past projects to consider
  private readonly MIN_CONFIDENCE_THRESHOLD = 0.6;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Build comprehensive AI context for a project
   * 
   * This is the main entry point for getting AI context. It will:
   * 1. Check cache first (unless forceRebuild is true)
   * 2. Gather context from multiple data sources in parallel
   * 3. Synthesize into unified ProjectContext
   * 4. Calculate confidence score
   * 5. Cache the result
   * 
   * @param dto - Context build request
   * @returns Complete project context for AI
   */
  async buildContext(dto: BuildContextDto): Promise<ContextQueryResult> {
    const startTime = Date.now();
    const cacheKey = `context:${dto.projectId}`;
    
    // Check cache first (unless force rebuild)
    if (!dto.include.forceRebuild) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for project ${dto.projectId}`);
        return {
          found: true,
          context: cached.context,
          cacheHit: true,
          buildTime: Date.now() - startTime,
          confidence: cached.context.confidence,
        };
      }
    }

    this.logger.log(`Building context for project ${dto.projectId}`);

    try {
      // Get project details first
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
        include: {
          user: true,
        },
      });

      if (!project) {
        throw new NotFoundException(`Project ${dto.projectId} not found`);
      }

      // Gather all context sources in parallel for performance
      const [
        brandContext,
        clientPreferences,
        successfulCampaigns,
        relatedProjects,
        relevantAssets,
        freelancerNotes,
      ] = await Promise.all([
        dto.include.brandVoice ? this.getBrandContext(dto.agencyId || project.userId) : Promise.resolve(undefined),
        dto.include.clientPreferences ? this.getClientPreferences(dto.projectId) : Promise.resolve(undefined),
        dto.include.successfulCampaigns ? this.getSuccessfulCampaigns(project.userId, dto.projectId) : Promise.resolve(undefined),
        dto.include.relatedProjects ? this.getRelatedProjects(dto.projectId, project.userId) : Promise.resolve(undefined),
        dto.include.knowledgeSources ? this.getRelevantAssets(dto.projectId) : Promise.resolve(undefined),
        dto.include.freelancerNotes ? this.getFreelancerNotes(dto.projectId) : Promise.resolve(undefined),
      ]);

      // Synthesize final context
      const context: ProjectContext = {
        projectId: dto.projectId,
        brandVoice: brandContext,
        visualIdentity: brandContext?.visualIdentity, // Extracted from brand context
        clientPreferences,
        successfulCampaigns,
        relatedProjects,
        relevantAssets,
        freelancerNotes,
        confidence: this.calculateConfidence({
          brandContext: !!brandContext,
          clientPreferences: !!clientPreferences,
          successfulCampaigns: !!successfulCampaigns?.length,
          relatedProjects: !!relatedProjects?.length,
        }),
        builtAt: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_TTL),
      };

      // Cache the result
      this.setCache(cacheKey, {
        context,
        expiresAt: Date.now() + this.CACHE_TTL,
        createdAt: Date.now(),
      });

      const buildTime = Date.now() - startTime;
      this.logger.log(`Context built for ${dto.projectId} in ${buildTime}ms with confidence ${context.confidence}`);

      return {
        found: true,
        context,
        cacheHit: false,
        buildTime,
        confidence: context.confidence,
      };

    } catch (error) {
      this.logger.error(`Failed to build context for project ${dto.projectId}`, error);
      throw error;
    }
  }

  /**
   * Record approval feedback to learn client preferences
   * 
   * This is the learning loop of the system. Each approval:
   * - Updates client preference model
   * - Refines brand voice if applicable
   * - May trigger re-embedding if significant change
   * 
   * @param dto - Approval data
   */
  async recordApproval(dto: RecordApprovalDto): Promise<void> {
    this.logger.log(`Recording approval for ${dto.itemType}:${dto.itemId}`);

    try {
      // Get or create client preference record
      const preferenceKey = `approval_${dto.projectId}_${dto.itemType}`;
      
      // Store approval in database (would be in ClientPreference table in full implementation)
      // For now, we'll use the existing project audit log
      await this.prisma.projectAuditLog.create({
        data: {
          projectId: dto.projectId,
          userId: dto.userId,
          action: 'APPROVAL_RECORDED',
          resourceType: dto.itemType,
          resourceId: dto.itemId,
          metadata: {
            approvalRating: dto.approvalRating,
            tags: dto.tags,
            clientId: dto.clientId,
            feedback: dto.feedback,
          },
        },
      });

      // Invalidate context cache for this project
      const cacheKey = `context:${dto.projectId}`;
      this.contextCache.delete(cacheKey);
      
      this.logger.log(`Approval recorded and cache invalidated for project ${dto.projectId}`);

      // In full implementation, this would also:
      // 1. Update client preference model
      // 2. Re-embed if significant change
      // 3. Trigger brand voice refinement

    } catch (error) {
      this.logger.error('Failed to record approval', error);
      throw new BadRequestException('Failed to record approval');
    }
  }

  /**
   * Record creative work to learn brand voice
   * 
   * When creative work is created and approved, we analyze it to:
   * - Extract tone patterns
   * - Identify vocabulary preferences
   * - Learn sentence structure
   * - Build tagline patterns
   * 
   * @param dto - Creative work data
   */
  async recordCreativeWork(dto: RecordCreativeWorkDto): Promise<void> {
    this.logger.log(`Recording creative work: ${dto.contentType} for project ${dto.projectId}`);

    try {
      // Analyze creative content (simplified version)
      const analysis = await this.analyzeCreativeContent(dto.content, dto.contentType);
      
      // Store in audit log (in full implementation, would be in dedicated brand_contexts table)
      await this.prisma.projectAuditLog.create({
        data: {
          projectId: dto.projectId,
          userId: dto.userId,
          action: 'CREATIVE_WORK_ANALYZED',
          resourceType: dto.contentType,
          metadata: {
            approved: dto.approved,
            tags: dto.tags,
            analysis: analysis,
          },
        },
      });

      // If approved and high quality, update brand voice model
      if (dto.approved && dto.approvalRating >= 4) {
        await this.updateBrandVoiceFromContent(dto.projectId, analysis, dto.tags);
      }

      // Invalidate cache
      this.contextCache.delete(`context:${dto.projectId}`);

    } catch (error) {
      this.logger.error('Failed to record creative work', error);
      throw new BadRequestException('Failed to record creative work');
    }
  }

  /**
   * Get or create brand context for an agency
   * 
   * @param agencyId - Agency or user ID
   * @returns Brand voice and visual identity context
   */
  private async getBrandContext(agencyId: string): Promise<any> {
    this.logger.debug(`Getting brand context for ${agencyId}`);

    // In full implementation, query BrandContext table
    // For now, return placeholder structure
    
    // This would be replaced with actual database query:
    // const brandContexts = await this.prisma.brandContext.findMany({
    //   where: { agencyId },
    //   orderBy: { usageCount: 'desc' },
    // });

    return {
      voice: {
        tone: ['aspirational', 'empowering', 'direct'],
        vocabulary: ['empower', 'unleash', 'achieve', 'exceed'],
        sentenceStructure: {
          avgLength: 12,
          lengthVariance: 4,
          preferredTenses: ['imperative', 'present'],
          usesActiveVoice: true,
          questionFrequency: 0.1,
          imperativeFrequency: 0.6,
        },
        wordChoicePreferences: [
          {
            category: 'power_words',
            words: ['unleash', 'dominate', 'conquer', 'master'],
            frequency: 0.8,
          },
        ],
        taglinePatterns: [
          {
            pattern: 'imperative + noun',
            examples: ['Unleash Your Stride', 'Own Your Run'],
            successRate: 0.85,
          },
        ],
        voiceExamples: [],
        confidence: 0.7,
      },
      visualIdentity: {
        colorPalettes: [
          {
            name: 'primary',
            primary: ['#000000', '#FFFFFF'],
            secondary: ['#333333', '#CCCCCC'],
            accent: ['#FF0000', '#0066FF'],
            usageContext: 'hero_images',
          },
        ],
        typographyStyles: [],
        photographyAesthetics: [],
        compositionPatterns: [],
        brandGuidelines: [],
        confidence: 0.6,
      },
    };
  }

  /**
   * Get client preferences from past approvals
   * 
   * @param projectId - Project ID
   * @returns Client preference context
   */
  private async getClientPreferences(projectId: string): Promise<any> {
    this.logger.debug(`Getting client preferences for ${projectId}`);

    // Query audit logs for approval patterns
    const approvalLogs = await this.prisma.projectAuditLog.findMany({
      where: {
        projectId,
        action: 'APPROVAL_RECORDED',
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (approvalLogs.length === 0) {
      return null;
    }

    // Analyze approval patterns (simplified)
    const approvalPatterns = approvalLogs.reduce((acc, log) => {
      const rating = log.metadata?.approvalRating || 0;
      if (rating >= 4) {
        acc.highApprovals++;
      } else {
        acc.lowApprovals++;
      }
      return acc;
    }, { highApprovals: 0, lowApprovals: 0 });

    return {
      clientId: undefined, // Would come from project.client
      approvalPatterns: [],
      feedbackTriggers: [],
      revisionHotspots: [],
      communicationStyle: {
        preferredChannels: ['email', 'in_app'],
        responseExpectations: 'within_24_hours',
        feedbackStyle: 'collaborative',
        approvalProcess: ['review', 'revision', 'final'],
      },
      confidence: 0.5,
      sampleSize: approvalLogs.length,
    };
  }

  /**
   * Get successful campaigns for reference
   * 
   * @param userId - User/agency ID
   * @param excludeProjectId - Exclude current project
   * @returns Successful campaigns
   */
  private async getSuccessfulCampaigns(userId: string, excludeProjectId: string): Promise<any[]> {
    this.logger.debug(`Getting successful campaigns for ${userId}`);

    const projects = await this.prisma.project.findMany({
      where: {
        userId,
        id: { not: excludeProjectId },
        status: 'DELIVERED',
      },
      orderBy: { updatedAt: 'desc' },
      take: this.DEFAULT_HISTORY_DEPTH,
      include: {
        assignments: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    return projects.map(p => ({
      projectId: p.id,
      title: p.title || p.name || 'Untitled',
      client: p.clientName || p.client || 'Unknown',
      industry: p.metadata?.industry,
      tags: [],
      successMetrics: {
        clientRating: 4.5, // Would come from actual data
        onTimeDelivery: true,
        withinBudget: true,
        revisionRounds: 2,
        reuseInFutureProjects: true,
      },
      creativeElements: [],
      completedAt: p.updatedAt,
    }));
  }

  /**
   * Get related projects
   * 
   * @param projectId - Current project ID
   * @param userId - User/agency ID
   * @returns Related projects
   */
  private async getRelatedProjects(projectId: string, userId: string): Promise<any[]> {
    this.logger.debug(`Getting related projects for ${projectId}`);

    const currentProject = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!currentProject) {
      return [];
    }

    // Find projects by same client, similar tags, or shared freelancers
    const related = await this.prisma.project.findMany({
      where: {
        userId,
        id: { not: projectId },
        OR: [
          { clientName: currentProject.clientName },
          { client: currentProject.client },
        ],
      },
      take: 5,
    });

    return related.map(p => ({
      projectId: p.id,
      title: p.title || p.name || 'Untitled',
      client: p.clientName || p.client || 'Unknown',
      similarity: 0.85, // Would be calculated via embeddings
      relationshipType: 'same_client' as const,
    }));
  }

  /**
   * Get relevant assets from knowledge base
   * 
   * @param projectId - Project ID
   * @returns Relevant assets
   */
  private async getRelevantAssets(projectId: string): Promise<any[]> {
    this.logger.debug(`Getting relevant assets for ${projectId}`);

    // Get project's moodboard items and assets
    const moodboardItems = await this.prisma.moodboardItem.findMany({
      where: { projectId },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return moodboardItems.map(item => ({
      assetId: item.id,
      type: item.source,
      url: item.url,
      title: item.title,
      tags: (item.tags as string[]) || [],
      moods: (item.moods as string[]) || [],
      colors: (item.colors as string[]) || [],
      relevanceScore: 0.8, // Would be calculated via embeddings
    }));
  }

  /**
   * Get freelancer performance notes
   * 
   * @param projectId - Project ID
   * @returns Freelancer notes
   */
  private async getFreelancerNotes(projectId: string): Promise<any[]> {
    this.logger.debug(`Getting freelancer notes for ${projectId}`);

    const assignments = await this.prisma.assignment.findMany({
      where: { projectId },
      include: {
        freelancer: true,
      },
      take: 10,
    });

    return assignments.map(a => ({
      freelancerId: a.freelancer.id,
      name: a.freelancer.name,
      skills: (a.freelancer.skills as string[]) || [],
      averageRating: a.freelancer.rating || 0,
      onTimeDeliveryRate: 0.9, // Would come from actual data
      recentProjects: [],
      notes: [],
    }));
  }

  /**
   * Analyze creative content (simplified NLP)
   * 
   * In production, this would use OpenAI or similar for proper analysis
   * 
   * @param content - Creative content to analyze
   * @param contentType - Type of content
   * @returns Analysis results
   */
  private async analyzeCreativeContent(content: string, contentType: string): Promise<any> {
    // This is a simplified version
    // In production, would use AI for proper analysis
    
    const words = content.split(/\s+/);
    const avgLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    return {
      tone: ['aspirational', 'empowering'],
      vocabulary: words.filter(w => w.length > 6).slice(0, 10),
      sentenceStructure: {
        avgLength: words.length,
        lengthVariance: Math.sqrt(words.reduce((sum, w) => sum + Math.pow(w.length - avgLength, 2), 0) / words.length),
        usesActiveVoice: true,
      },
      wordChoice: {
        powerWords: words.filter(w => w.length > 8),
        emotionalWords: words.filter(w => ['feel', 'love', 'believe', 'dream'].includes(w.toLowerCase())),
      },
      taglinePattern: contentType === 'tagline' ? this.detectTaglinePattern(content) : undefined,
    };
  }

  /**
   * Detect tagline pattern
   * 
   * @param tagline - Tagline text
   * @returns Pattern type
   */
  private detectTaglinePattern(tagline: string): string {
    const words = tagline.trim().split(/\s+/);
    
    if (words.length === 2) return 'two_words';
    if (words.length === 3) return 'three_words';
    if (tagline.includes('!')) return 'exclamation';
    if (/^[A-Z]/.test(tagline)) return 'starts_imperative';
    
    return 'unknown';
  }

  /**
   * Update brand voice from content
   * 
   * @param projectId - Project ID
   * @param analysis - Content analysis
   * @param tags - Associated tags
   */
  private async updateBrandVoiceFromContent(projectId: string, analysis: any, tags: string[]): Promise<void> {
    this.logger.debug(`Updating brand voice from content for ${projectId}`);

    // In full implementation, this would update BrandContext table
    // For now, just log
    
    await this.prisma.projectAuditLog.create({
      data: {
        projectId,
        action: 'BRAND_VOICE_UPDATED',
        metadata: {
          analysis,
          tags,
        },
      },
    });
  }

  /**
   * Calculate overall confidence score
   * 
   * @param contextData - Available context data
   * @returns Confidence score (0.0 - 1.0)
   */
  private calculateConfidence(contextData: {
    brandContext: boolean;
    clientPreferences: boolean;
    successfulCampaigns: boolean;
    relatedProjects: boolean;
  }): number {
    let score = 0;
    let total = 0;

    if (contextData.brandContext) {
      score += 0.3;
      total += 0.3;
    }

    if (contextData.clientPreferences) {
      score += 0.2;
      total += 0.2;
    }

    if (contextData.successfulCampaigns) {
      score += 0.3;
      total += 0.3;
    }

    if (contextData.relatedProjects) {
      score += 0.2;
      total += 0.2;
    }

    return total > 0 ? score / total : 0;
  }

  /**
   * Get context from cache
   * 
   * @param key - Cache key
   * @returns Cached context or undefined
   */
  private getFromCache(key: string): CachedContext | undefined {
    const cached = this.contextCache.get(key);
    if (!cached) return undefined;

    if (Date.now() > cached.expiresAt) {
      this.contextCache.delete(key);
      return undefined;
    }

    return cached;
  }

  /**
   * Set context in cache
   * 
   * @param key - Cache key
   * @param value - Context to cache
   */
  private setCache(key: string, value: CachedContext): void {
    this.contextCache.set(key, value);
  }

  /**
   * Query brand contexts
   * 
   * @param agencyId - Agency ID
   * @param type - Filter by type
   * @param limit - Result limit
   * @returns Brand contexts
   */
  async queryBrandContexts(agencyId?: string, type?: string, limit: number = 20): Promise<any[]> {
    // In full implementation, query BrandContext table
    // For now, return empty array
    
    this.logger.debug(`Querying brand contexts: agency=${agencyId}, type=${type}, limit=${limit}`);
    
    return [];
  }

  /**
   * Update brand context
   * 
   * @param dto - Brand context update data
   */
  async updateBrandContext(dto: UpdateBrandContextDto): Promise<void> {
    this.logger.log(`Updating brand context: ${dto.name} (${dto.type})`);

    // In full implementation, update BrandContext table
    // For now, just log
    
    await this.prisma.projectAuditLog.create({
      data: {
        projectId: 'brand_context', // Special marker
        action: 'BRAND_CONTEXT_UPDATED',
        metadata: {
          agencyId: dto.agencyId,
          name: dto.name,
          type: dto.type,
          data: dto.data,
        },
      },
    });
  }

  /**
   * Clear context cache for a project
   * 
   * @param projectId - Project ID
   */
  async clearContextCache(projectId: string): Promise<void> {
    const cacheKey = `context:${projectId}`;
    this.contextCache.delete(cacheKey);
    this.logger.log(`Cache cleared for project ${projectId}`);
  }
}