import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { EmbeddingsService } from "./embeddings.service.js";
import { RAGService } from "./rag.service.js";

@Injectable()
export class IntelligentContextEngine {
  private readonly logger = new Logger(IntelligentContextEngine.name);

  constructor(
    private prisma: PrismaService,
    private ragService: RAGService,
    private embeddingsService: EmbeddingsService
  ) {}

  async generateContext(request: any): Promise<any> {
    this.logger.log(`Generating context for conversation: ${request.conversationId}`);

    const entities = await this.extractEntities(request.context || {});
    const briefContext = await this.generateBriefContext(request.brief, request.context, entities);
    
    const brandTensorRaw = request.projectId 
      ? await this.generateBrandTensor(request.projectId, entities)
      : undefined;
    
    const assetIntelligenceRaw = await this.generateAssetIntelligence(request.projectId, entities);
    
    const knowledgeSourceIds = await this.generateKnowledgeSources(request.conversationId, request.context);
    
    const content = this.assembleContextContent(briefContext, brandTensorRaw, assetIntelligenceRaw, entities);
    const metadata = await this.generateMetadata(content, entities, request.context);
    
    return {
      id: `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.substring(0, request.options?.maxContextLength || 2000),
      briefContext,
      brandTensor: brandTensorRaw as Record<string, unknown>,
      assetIntelligence: assetIntelligenceRaw as Record<string, unknown>,
      knowledgeSourceIds,
      metadata
    };
  }

  async generateBrandTensor(projectId: string, entities: any[]): Promise<any> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        this.logger.debug(`No project found: ${projectId}`);
        return undefined;
      }

      return {
        brandId: `brand_${projectId}`,
        brandName: project.client || 'Unknown Client',
        personality: {
          traits: [
            { trait: 'Professional', score: 0.8, evidence: ['Client communications'] },
            { trait: 'Innovative', score: 0.7, evidence: ['Creative solutions'] }
          ],
          tone: { voice: 'Professional', style: 'Modern', energy: 'professional' },
          colors: [{ hex: '#2563eb', usage: 'Primary', emotional_impact: 'Trust' }],
          values: ['Quality', 'Innovation'],
          messaging: { key_messages: ['Creative excellence'], differentiators: ['Quality focus'], target_audience: ['Businesses'] }
        },
        visual_identity: {
          style: 'Modern and clean',
          typography: 'Sans-serif',
          imagery_style: 'High-quality',
          logo_usage: 'Prominent',
          brand_guidelines: { spacing: 'Generous whitespace' }
        },
        competitive_positioning: {
          market_position: 'Premium partner',
          unique_value_proposition: 'Expert creative solutions',
          competitive_advantages: ['Technical expertise'],
          market_differentiation: 'Boutique agency'
        }
      };
    } catch (error) {
      this.logger.error(`Failed to generate brand tensor: ${error.message}`);
      return undefined;
    }
  }

  async generateAssetIntelligence(projectId?: string, entities: any[] = []): Promise<any> {
    try {
      if (!projectId) return undefined;

      const moodboardItems = await this.prisma.moodboardItem.findMany({
        where: { projectId },
      });

      const assets = moodboardItems.map(item => ({
        id: item.id,
        type: 'image' as const,
        name: item.caption || item.url?.split('/').pop() || 'Untitled',
        description: item.caption || '',
        metadata: {
          tags: typeof item.tags === 'string' ? [item.tags] : [],
          colors: typeof item.colors === 'string' ? [item.colors] : [],
          mood: typeof item.moods === 'string' ? item.moods : '',
          technical_specs: {},
          usage_context: item.source,
          performance_metrics: {},
        },
        relationships: [],
      }));

      return {
        assets,
        collections: [],
        insights: {
          usage_patterns: [{ pattern: 'High-quality images perform better', frequency: 0.8, context: 'Visual content' }],
          performance_analysis: {
            most_used_assets: assets.slice(0, 3).map(a => a.id),
            underperforming_assets: assets.slice(-2).map(a => a.id),
            optimization_suggestions: ['Optimize image sizes for web', 'Update outdated assets']
          },
          trend_analysis: {
            emerging_styles: ['Minimalist design'],
            declining_styles: ['Complex layouts'],
            predictions: ['Increased motion graphics']
          }
        }
      };
    } catch (error) {
      this.logger.error(`Failed to generate asset intelligence: ${error.message}`);
      return undefined;
    }
  }

  private async extractEntities(context: any): Promise<Array<{type: string; id: string; name: string; data?: any}>> {
    const entities: Array<{type: string; id: string; name: string; data?: any}> = [];

    if (context.currentProject) {
      entities.push({
        type: 'project',
        id: context.currentProject.id,
        name: context.currentProject.title || context.currentProject.name,
        data: context.currentProject,
      });
    }

    if (context.relevantEntities) {
      entities.push(...context.relevantEntities);
    }

    if (context.recentMessages) {
      const messageEntities = await this.extractEntitiesFromMessages(context.recentMessages);
      entities.push(...messageEntities);
    }

    return entities.filter((entity, index, self) => 
      index === self.findIndex(e => e.id === entity.id && e.type === entity.type)
    );
  }

  private async generateBriefContext(brief?: string, context: any = {}, entities: any[] = []): Promise<Record<string, unknown>> {
    const briefContext: Record<string, unknown> = {};

    if (brief) {
      briefContext.summary = brief;
    }

    if (context.currentProject) {
      briefContext.project = {
        id: context.currentProject.id,
        name: context.currentProject.title || context.currentProject.name,
        status: context.currentProject.status,
        client: context.currentProject.client,
      };
    }

    if (entities.length > 0) {
      briefContext.key_entities = entities
        .slice(0, 5)
        .map(e => ({
          type: e.type,
          name: e.name,
          relevance: this.calculateEntityRelevance(e, context),
        }));
    }

    if (context.recentMessages && context.recentMessages.length > 0) {
      const messageContext = this.summarizeMessages(context.recentMessages);
      briefContext.conversation_summary = messageContext;
    }

    return briefContext;
  }

  private async generateKnowledgeSources(conversationId: string, context: any): Promise<string[]> {
    try {
      try {
        const memory = (this.ragService as any).getMemory?.(conversationId);
        if (memory) {
          return memory.contextSnapshots.map((s: any) => s.id);
        }
      } catch (memoryError) {
        this.logger.debug(`getMemory not available: ${memoryError.message}`);
      }

      const recentKnowledgeSources = await this.prisma.knowledgeSource.findMany({
        where: { projectId: context.currentProject?.id },
        take: 10,
      });

      return recentKnowledgeSources.map(doc => doc.id);
    } catch (error) {
      this.logger.error(`Failed to generate knowledge sources: ${error.message}`);
      return [];
    }
  }

  private async extractEntitiesFromMessages(messages: Array<{ role: string; content: string }>): Promise<Array<{type: string; id: string; name: string}>> {
    const entities = [];

    for (const message of messages) {
      const content = message.content.toLowerCase();

      const projectMatches = content.match(/project\s+(\w+)/g);
      if (projectMatches) {
        projectMatches.forEach(match => {
          const projectName = match.replace('project ', '');
          entities.push({ type: 'project', id: `project_${projectName}`, name: projectName });
        });
      }

      const freelancerMatches = content.match(/freelancer\s+(\w+)/g);
      if (freelancerMatches) {
        freelancerMatches.forEach(match => {
          const freelancerName = match.replace('freelancer ', '');
          entities.push({ type: 'freelancer', id: `freelancer_${freelancerName}`, name: freelancerName });
        });
      }

      const assetMatches = content.match(/asset\s+(\w+)/g);
      if (assetMatches) {
        assetMatches.forEach(match => {
          const assetName = match.replace('asset ', '');
          entities.push({ type: 'asset', id: `asset_${assetName}`, name: assetName });
        });
      }
    }

    return entities.filter((entity, index, self) =>
      index === self.findIndex(e => e.id === entity.id && e.type === entity.type)
    );
  }

  private calculateEntityRelevance(entity: any, context: any): number {
    let relevance = 0.5;

    if (context.currentProject && entity.type === 'project' &&
        context.currentProject.title?.toLowerCase().includes(entity.name.toLowerCase())) {
      relevance += 0.3;
    }

    return Math.min(relevance, 1.0);
  }

  private summarizeMessages(messages: Array<{ role: string; content: string }>): string {
    if (messages.length === 0) return '';

    const recentMessages = messages.slice(-3);
    const summary = recentMessages
      .map(msg => `${msg.role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`)
      .join(' | ');

    return `Recent conversation: ${summary}`;
  }

  private calculateAssetSimilarity(asset1: any, asset2: any): number {
    let similarity = 0;
    let factors = 0;

    if (asset1.type === asset2.type) {
      similarity += 0.3;
    }
    factors += 0.3;

    if (asset1.metadata?.tags && asset2.metadata?.tags) {
      const tags1 = new Set(asset1.metadata.tags);
      const tags2 = new Set(asset2.metadata.tags);
      const intersection = new Set([...tags1].filter(tag => tags2.has(tag)));
      const union = new Set([...tags1, ...tags2]);
      if (union.size > 0) {
        similarity += (intersection.size / union.size) * 0.4;
      }
    }
    factors += 0.4;

    if (asset1.metadata?.colors && asset2.metadata?.colors) {
      const colors1 = new Set(asset1.metadata.colors);
      const colors2 = new Set(asset2.metadata.colors);
      const intersection = new Set([...colors1].filter(color => colors2.has(color)));
      const union = new Set([...colors1, ...colors2]);
      if (union.size > 0) {
        similarity += (intersection.size / union.size) * 0.3;
      }
    }
    factors += 0.3;

    return factors > 0 ? similarity / factors : 0;
  }

  private assembleContextContent(
    briefContext: Record<string, unknown>,
    brandTensor: any,
    assetIntelligence: any,
    entities: any[]
  ): string {
    const parts = [];

    if (briefContext.summary) {
      parts.push(`Summary: ${briefContext.summary}`);
    }

    if (briefContext.project) {
      const project = briefContext.project as any;
      parts.push(`Project: ${project.name} (${project.status}) - Client: ${project.client}`);
    }

    if (briefContext.key_entities) {
      const keyEntities = briefContext.key_entities as any[];
      if (keyEntities.length > 0) {
        parts.push(`Key Entities: ${keyEntities.map(e => `${e.type}: ${e.name}`).join(', ')}`);
      }
    }

    if (briefContext.conversation_summary) {
      parts.push(briefContext.conversation_summary as string);
    }

    if (brandTensor) {
      parts.push(`Brand: ${brandTensor.brandName}`);
      if (brandTensor.personality?.traits) {
        const topTraits = brandTensor.personality.traits.slice(0, 3);
        parts.push(`Brand Traits: ${topTraits.map((t: any) => t.trait).join(', ')}`);
      }
    }

    if (assetIntelligence?.insights) {
      const insights = assetIntelligence.insights;
      if (insights.usage_patterns?.length > 0) {
        parts.push(`Asset Patterns: ${insights.usage_patterns[0].pattern}`);
      }
    }

    return parts.join('\n\n');
  }

  private async generateMetadata(
    content: string,
    entities: any[],
    context: any
  ): Promise<any> {
    const topics = entities.map(e => e.type).filter((type, index, self) => self.indexOf(type) === index);

    const sentiment = content.toLowerCase().includes('good') || content.toLowerCase().includes('excellent')
      ? 'positive'
      : content.toLowerCase().includes('bad') || content.toLowerCase().includes('issue')
      ? 'negative'
      : 'neutral';

    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('asap')) {
      urgency = 'high';
    } else if (content.toLowerCase().includes('soon') || content.toLowerCase().includes('important')) {
      urgency = 'medium';
    }

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    if (entities.length > 5 || content.length > 1000) {
      complexity = 'complex';
    } else if (entities.length > 2 || content.length > 500) {
      complexity = 'moderate';
    }

    return {
      entities: entities.map(e => ({
        type: e.type,
        id: e.id,
        name: e.name,
        relevance: this.calculateEntityRelevance(e, context),
      })),
      topics,
      sentiment,
      urgency,
      complexity,
      confidence: 0.8,
      generatedAt: new Date(),
    };
  }
}
