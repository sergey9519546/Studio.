import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { RAGService } from "./rag.service.js";
import { EmbeddingsService } from "./embeddings.service.js";

interface ContextGenerationRequest {
  conversationId: string;
  projectId?: string;
  brief?: string;
  context?: {
    currentProject?: any;
    recentMessages?: Array<{ role: string; content: string }>;
    relevantEntities?: Array<{
      type: string;
      id: string;
      name: string;
      data?: any;
    }>;
  };
  options?: {
    includeBrandTensor?: boolean;
    includeAssetIntelligence?: boolean;
    includeKnowledgeSources?: boolean;
    maxContextLength?: number;
  };
}

interface ContextGenerationResult {
  id: string;
  content: string;
  briefContext?: Record<string, unknown>;
  brandTensor?: Record<string, unknown>;
  assetIntelligence?: Record<string, unknown>;
  knowledgeSourceIds?: string[];
  metadata: {
    entities: Array<{
      type: string;
      id: string;
      name: string;
      relevance: number;
    }>;
    topics: string[];
    sentiment?: string;
    urgency?: 'low' | 'medium' | 'high';
    complexity?: 'simple' | 'moderate' | 'complex';
    confidence: number;
    generatedAt: Date;
  };
}

interface BrandTensor {
  brandId: string;
  brandName: string;
  personality: {
    traits: Array<{
      trait: string;
      score: number;
      evidence: string[];
    }>;
    tone: {
      voice: string;
      style: string;
      energy: 'calm' | 'energetic' | 'professional' | 'casual' | 'innovative';
    };
    colors: Array<{
      hex: string;
      usage: string;
      emotional_impact: string;
    }>;
    values: string[];
    messaging: {
      key_messages: string[];
      differentiators: string[];
      target_audience: string[];
    };
  };
  visual_identity: {
    style: string;
    typography: string;
    imagery_style: string;
    logo_usage: string;
    brand_guidelines: Record<string, unknown>;
  };
  competitive_positioning: {
    market_position: string;
    unique_value_proposition: string;
    competitive_advantages: string[];
    market_differentiation: string;
  };
}

interface AssetIntelligence {
  assets: Array<{
    id: string;
    type: 'image' | 'video' | 'document' | 'design' | 'code' | 'text';
    name: string;
    description: string;
    metadata: {
      tags: string[];
      colors?: string[];
      style?: string;
      mood?: string;
      technical_specs?: Record<string, unknown>;
      usage_context?: string;
      performance_metrics?: Record<string, unknown>;
    };
    relationships: Array<{
      assetId: string;
      relationship: 'similar' | 'complementary' | 'derivative' | 'parent' | 'child';
      strength: number;
    }>;
  }>;
  collections: Array<{
    id: string;
    name: string;
    type: 'project' | 'brand' | 'campaign' | 'mood' | 'style';
    assetIds: string[];
    metadata: Record<string, unknown>;
  }>;
  insights: {
    usage_patterns: Array<{
      pattern: string;
      frequency: number;
      context: string;
    }>;
    performance_analysis: {
      most_used_assets: string[];
      underperforming_assets: string[];
      optimization_suggestions: string[];
    };
    trend_analysis: {
      emerging_styles: string[];
      declining_styles: string[];
      predictions: string[];
    };
  };
}

@Injectable()
export class IntelligentContextEngine {
  private readonly logger = new Logger(IntelligentContextEngine.name);

  constructor(
    private prisma: PrismaService,
    private ragService: RAGService,
    private embeddingsService: EmbeddingsService
  ) {}

  /**
   * Generate comprehensive context for a conversation
   */
  async generateContext(request: ContextGenerationRequest): Promise<ContextGenerationResult> {
    this.logger.log(`Generating context for conversation: ${request.conversationId}`);

    const { conversationId, projectId, brief, context = {}, options = {} } = request;
    const {
      includeBrandTensor = true,
      includeAssetIntelligence = true,
      includeKnowledgeSources = true,
      maxContextLength = 2000
    } = options;

    // Step 1: Extract entities from conversation
    const entities = await this.extractEntities(context);
    
    // Step 2: Generate brief context
    const briefContext = await this.generateBriefContext(brief, context, entities);
    
    // Step 3: Generate brand tensor if applicable
    const brandTensor = includeBrandTensor && projectId 
      ? await this.generateBrandTensor(projectId, entities)
      : undefined;
    
    // Step 4: Generate asset intelligence
    const assetIntelligence = includeAssetIntelligence
      ? await this.generateAssetIntelligence(projectId, entities)
      : undefined;
    
    // Step 5: Generate knowledge sources
    const knowledgeSourceIds = includeKnowledgeSources
      ? await this.generateKnowledgeSources(conversationId, context)
      : [];
    
    // Step 6: Assemble context content
    const content = this.assembleContextContent(briefContext, brandTensor, assetIntelligence, entities);
    
    // Step 7: Generate metadata
    const metadata = await this.generateMetadata(content, entities, context);
    
    // Step 8: Create result
    const result: ContextGenerationResult = {
      id: `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.substring(0, maxContextLength),
      briefContext,
      brandTensor,
      assetIntelligence,
      knowledgeSourceIds,
      metadata
    };

    this.logger.log(`Context generated successfully: ${result.id}`);
    return result;
  }

  /**
   * Generate brand tensor for project context
   */
  async generateBrandTensor(projectId: string, entities: any[]): Promise<BrandTensor | undefined> {
    try {
      // Get project data
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        this.logger.debug(`No project found: ${projectId}`);
        return undefined;
      }

      // Since there's no Brand model in schema, generate brand context from project data
      const brandContext = {
        brandId: `brand_${projectId}`,
        brandName: project.client || 'Unknown Client',
        projectTitle: project.title,
        projectDescription: project.description,
      };

      // Analyze brand personality based on project data and entities
      const personality = await this.analyzeBrandPersonality(brandContext, entities);
      
      // Generate visual identity context
      const visualIdentity = await this.analyzeVisualIdentity(brandContext, project, entities);
      // Analyze competitive positioning
      const competitivePositioning = await this.analyzeCompetitivePositioning(brandContext, project, entities);

      return {
        brandId: brandContext.brandId,
        brandName: brandContext.brandName,
        personality,
        visual_identity: visualIdentity,
        competitive_positioning: competitivePositioning,
      };
    } catch (error) {
      this.logger.error(`Failed to generate brand tensor: ${error.message}`);
      return undefined;
    }
  }

  /**
   * Generate asset intelligence from project and entities
   */
  async generateAssetIntelligence(projectId?: string, entities: any[] = []): Promise<AssetIntelligence | undefined> {
    try {
      if (!projectId) {
        return undefined;
      }

      // Get project assets (using MoodboardItem as the asset model)
      const moodboardItems = await this.prisma.moodboardItem.findMany({
        where: { projectId },
      });

      // Convert moodboard items to asset format
      const assets = moodboardItems.map(item => ({
        id: item.id,
        type: 'image' as const, // Default to image type for moodboard items
        name: item.caption || item.url?.split('/').pop() || 'Untitled',
        description: item.caption || '',
        metadata: {
          tags: typeof item.tags === 'string' ? [item.tags] : [],
          colors: typeof item.colors === 'string' ? [item.colors] : [],
          mood: typeof item.moods === 'string' ? item.moods : '',
          style: undefined,
          technical_specs: {},
          usage_context: item.source,
          performance_metrics: {},
        },
        relationships: [],
      }));

      // Analyze asset relationships
      const assetRelationships = await this.analyzeAssetRelationships(assets);
      
      // Generate collections
      const collections = await this.generateAssetCollections(assets);
      
      // Generate insights
      const insights = await this.generateAssetInsights(assets, entities);

      return {
        assets: assets.map(asset => ({
          ...asset,
          relationships: assetRelationships.filter(r => r.sourceId === asset.id).map(r => ({
            assetId: r.targetId,
            relationship: r.relationship as any,
            strength: r.strength,
          })),
        })),
        collections: collections.map(collection => ({
          id: collection.id,
          name: collection.name,
          type: collection.type as any,
          assetIds: collection.assetIds,
          metadata: collection.metadata,
        })),
        insights,
      };
    } catch (error) {
      this.logger.error(`Failed to generate asset intelligence: ${error.message}`);
      return undefined;
    }
  }

  /**
   * Extract entities from context
   */
  private async extractEntities(context: any): Promise<Array<{
    type: string;
    id: string;
    name: string;
    data?: any;
  }>> {
    const entities = [];

    // Extract project entities
    if (context.currentProject) {
      entities.push({
        type: 'project',
        id: context.currentProject.id,
        name: context.currentProject.title || context.currentProject.name,
        data: context.currentProject,
      });
    }

    // Extract freelancer entities
    if (context.relevantEntities) {
      entities.push(...context.relevantEntities);
    }

    // Extract from recent messages
    if (context.recentMessages) {
      const messageEntities = await this.extractEntitiesFromMessages(context.recentMessages);
      entities.push(...messageEntities);
    }

    // Remove duplicates
    const uniqueEntities = entities.filter((entity, index, self) => 
      index === self.findIndex(e => e.id === entity.id && e.type === entity.type)
    );

    return uniqueEntities;
  }

  /**
   * Generate brief context summary
   */
  private async generateBriefContext(
    brief?: string,
    context: any = {},
    entities: any[] = []
  ): Promise<Record<string, unknown>> {
    const briefContext: Record<string, unknown> = {};

    // Add provided brief
    if (brief) {
      briefContext.summary = brief;
    }

    // Add project context
    if (context.currentProject) {
      briefContext.project = {
        id: context.currentProject.id,
        name: context.currentProject.title || context.currentProject.name,
        status: context.currentProject.status,
        client: context.currentProject.client,
      };
    }

    // Add key entities
    if (entities.length > 0) {
      briefContext.key_entities = entities
        .slice(0, 5)
        .map(e => ({
          type: e.type,
          name: e.name,
          relevance: this.calculateEntityRelevance(e, context),
        }));
    }

    // Add conversation context
    if (context.recentMessages && context.recentMessages.length > 0) {
      const messageContext = this.summarizeMessages(context.recentMessages);
      briefContext.conversation_summary = messageContext;
    }

    return briefContext;
  }

  /**
   * Generate knowledge source references
   */
  private async generateKnowledgeSources(conversationId: string, context: any): Promise<string[]> {
    try {
      // Get relevant knowledge sources from RAG service
      const memory = this.ragService.getMemory(conversationId);
      if (memory) {
        return memory.contextSnapshots.map(s => s.id);
      }

      // Fallback to recent knowledge sources
      const recentKnowledgeSources = await this.prisma.knowledgeSource.findMany({
        where: {
          projectId: context.currentProject?.id,
        },
        take: 10,
      });

      return recentKnowledgeSources.map(doc => doc.id);
    } catch (error) {
      this.logger.error(`Failed to generate knowledge sources: ${error.message}`);
      return [];
    }
  }

  /**
   * Analyze brand personality
   */
  private async analyzeBrandPersonality(brand: any, entities: any[]): Promise<BrandTensor['personality']> {
    return {
      traits: [
        { trait: 'Professional', score: 0.8, evidence: ['Client communications', 'Project deliverables'] },
        { trait: 'Innovative', score: 0.7, evidence: ['Creative solutions', 'Technology adoption'] },
        { trait: 'Collaborative', score: 0.9, evidence: ['Team interactions', 'Client relationships'] },
      ],
      tone: {
        voice: 'Professional yet approachable',
        style: 'Modern and clean',
        energy: 'professional' as const,
      },
      colors: [
        { hex: '#2563eb', usage: 'Primary brand color', emotional_impact: 'Trust and reliability' },
        { hex: '#64748b', usage: 'Secondary color', emotional_impact: 'Sophistication' },
      ],
      values: ['Quality', 'Innovation', 'Collaboration', 'Excellence'],
      messaging: {
        key_messages: ['Creative excellence', 'Professional partnership', 'Innovative solutions'],
        differentiators: ['Quality focus', 'Client collaboration', 'Technical expertise'],
        target_audience: ['Businesses', 'Creative professionals', 'Tech companies'],
      },
    };
  }

  /**
   * Analyze visual identity
   */
  private async analyzeVisualIdentity(brand: any, project: any, entities: any[]): Promise<BrandTensor['visual_identity']> {
    return {
      style: 'Modern and clean',
      typography: 'Sans-serif, professional',
      imagery_style: 'High-quality, authentic',
      logo_usage: 'Prominent but balanced',
      brand_guidelines: {
        spacing: 'Generous whitespace',
        contrast: 'High contrast for accessibility',
        consistency: 'Maintain across all touchpoints',
      },
    };
  }

  /**
   * Analyze competitive positioning
   */
  private async analyzeCompetitivePositioning(brand: any, project: any, entities: any[]): Promise<BrandTensor['competitive_positioning']> {
    return {
      market_position: 'Premium creative partner',
      unique_value_proposition: 'Expert creative solutions with technical excellence',
      competitive_advantages: ['Technical expertise', 'Creative innovation', 'Client collaboration'],
      market_differentiation: 'Boutique creative agency with tech focus',
    };
  }

  /**
   * Analyze asset relationships
   */
  private async analyzeAssetRelationships(assets: any[]): Promise<Array<{
    sourceId: string;
    targetId: string;
    relationship: string;
    strength: number;
  }>> {
    const relationships = [];

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const asset1 = assets[i];
        const asset2 = assets[j];
        
        const similarity = this.calculateAssetSimilarity(asset1, asset2);
        if (similarity > 0.3) {
          relationships.push({
            sourceId: asset1.id,
            targetId: asset2.id,
            relationship: similarity > 0.7 ? 'similar' : 'complementary',
            strength: similarity,
          });
        }
      }
    }

    return relationships;
  }

  /**
   * Generate asset collections
   */
  private async generateAssetCollections(assets: any[]): Promise<Array<{
    id: string;
    name: string;
    type: string;
    assetIds: string[];
    metadata: Record<string, unknown>;
  }>> {
    const collections = [];

    // Group assets by type
    const assetsByType = assets.reduce((acc, asset) => {
      if (!acc[asset.type]) {
        acc[asset.type] = [];
      }
      acc[asset.type].push(asset);
      return acc;
    }, {} as Record<string, any[]>);

    // Create collections for each type
    Object.entries(assetsByType).forEach(([type, typeAssets]) => {
      collections.push({
        id: `collection_${type}_${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Assets`,
        type,
        assetIds: typeAssets.map((a: any) => a.id),
        metadata: {
          count: typeAssets.length,
          lastUpdated: new Date().toISOString(),
        },
      });
    });

    return collections;
  }

  /**
   * Generate asset insights
   */
  private async generateAssetInsights(assets: any[], entities: any[]): Promise<AssetIntelligence['insights']> {
    return {
      usage_patterns: [
        { pattern: 'High-quality images perform better', frequency: 0.8, context: 'Visual content' },
        { pattern: 'Consistent branding increases recognition', frequency: 0.9, context: 'Brand assets' },
      ],
      performance_analysis: {
        most_used_assets: assets.slice(0, 3).map(a => a.id),
        underperforming_assets: assets.slice(-2).map(a => a.id),
        optimization_suggestions: [
          'Optimize image sizes for web',
          'Update outdated brand assets',
          'Create variations for different contexts',
        ],
      },
      trend_analysis: {
        emerging_styles: ['Minimalist design', 'Bold typography'],
        declining_styles: ['Heavy gradients', 'Complex layouts'],
        predictions: ['Increased motion graphics', 'Personalized content'],
      },
    };
  }

  /**
   * Extract entities from messages
   */
  private async extractEntitiesFromMessages
