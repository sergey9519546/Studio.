import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { EmbeddingsService } from "./embeddings.service.js";
import { GeminiAnalystService } from "../ai/gemini-analyst.service.js";

interface AssetComparison {
  asset1Id: string;
  asset2Id: string;
  similarityScore: number;
  comparisonDetails: {
    visualSimilarity: number;
    colorSimilarity: number;
    styleSimilarity: number;
    compositionSimilarity: number;
    semanticSimilarity: number;
  };
  commonFeatures: string[];
  differences: string[];
  recommendations: string[];
  metadata: {
    analysisType: string;
    confidence: number;
    processingTime: number;
    timestamp: Date;
  };
}

interface AssetCluster {
  clusterId: string;
  assets: Array<{
    id: string;
    name: string;
    url: string;
    similarityScore?: number;
  }>;
  clusterFeatures: string[];
  averageSimilarity: number;
  metadata: {
    type: 'style' | 'color' | 'composition' | 'semantic' | 'mixed';
    description: string;
    confidence: number;
  };
}

interface SimilaritySearchOptions {
  topK?: number;
  threshold?: number;
  similarityTypes?: Array<'visual' | 'color' | 'style' | 'composition' | 'semantic'>;
  includeAnalysis?: boolean;
  projectId?: string;
  assetType?: string;
}

interface AssetAnalysisResult {
  assetId: string;
  analysis: {
    tags: string[];
    moods: string[];
    colors: string[];
    composition: {
      ruleOfThirds: boolean;
      leadingLines: string[];
      focalPoints: string[];
      balance: 'balanced' | 'unbalanced' | 'dynamic';
    };
    lighting: {
      type: string;
      direction: string;
      mood: string;
      quality: 'soft' | 'harsh' | 'natural' | 'artificial';
    };
    style: {
      genre: string;
      era: string;
      movements: string[];
      techniques: string[];
    };
  };
  visualEmbedding: number[];
  metadata: {
    extractedAt: Date;
    analysisType: string;
    confidence: number;
  };
}

@Injectable()
export class AssetSimilarityEngine {
  private readonly logger = new Logger(AssetSimilarityEngine.name);
  private assetCache: Map<string, AssetAnalysisResult> = new Map();

  constructor(
    private prisma: PrismaService,
    private embeddings: EmbeddingsService,
    private geminiAnalyst: GeminiAnalystService
  ) {}

  /**
   * Compare two assets and generate detailed similarity analysis
   */
  async compareAssets(
    asset1Id: string,
    asset2Id: string,
    options: {
      includeRecommendations?: boolean;
      analysisType?: 'basic' | 'creative' | 'technical';
    } = {}
  ): Promise<AssetComparison> {
    const startTime = Date.now();
    this.logger.log(`Comparing assets: ${asset1Id} vs ${asset2Id}`);

    try {
      // Get asset analysis for both assets
      const [analysis1, analysis2] = await Promise.all([
        this.getAssetAnalysis(asset1Id, options.analysisType),
        this.getAssetAnalysis(asset2Id, options.analysisType),
      ]);

      // Calculate different similarity scores
      const visualSimilarity = this.calculateVisualSimilarity(analysis1, analysis2);
      const colorSimilarity = this.calculateColorSimilarity(analysis1, analysis2);
      const styleSimilarity = this.calculateStyleSimilarity(analysis1, analysis2);
      const compositionSimilarity = this.calculateCompositionSimilarity(analysis1, analysis2);
      const semanticSimilarity = this.calculateSemanticSimilarity(analysis1, analysis2);

      // Calculate overall similarity score (weighted average)
      const similarityScore = (
        visualSimilarity * 0.25 +
        colorSimilarity * 0.20 +
        styleSimilarity * 0.25 +
        compositionSimilarity * 0.15 +
        semanticSimilarity * 0.15
      );

      // Generate detailed comparison
      const comparisonDetails = {
        visualSimilarity,
        colorSimilarity,
        styleSimilarity,
        compositionSimilarity,
        semanticSimilarity,
      };

      // Find common features and differences
      const commonFeatures = this.findCommonFeatures(analysis1, analysis2);
      const differences = this.findDifferences(analysis1, analysis2);

      // Generate recommendations if requested
      const recommendations = options.includeRecommendations
        ? this.generateRecommendations(analysis1, analysis2, comparisonDetails)
        : [];

      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(analysis1, analysis2, processingTime);

      const result: AssetComparison = {
        asset1Id,
        asset2Id,
        similarityScore,
        comparisonDetails,
        commonFeatures,
        differences,
        recommendations,
        metadata: {
          analysisType: options.analysisType || 'creative',
          confidence,
          processingTime,
          timestamp: new Date(),
        },
      };

      this.logger.log(`Asset comparison completed: ${similarityScore.toFixed(3)} similarity score`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to compare assets ${asset1Id} vs ${asset2Id}:`, error);
      throw error;
    }
  }

  /**
   * Find similar assets using multi-dimensional similarity search
   */
  async findSimilarAssets(
    queryAssetId: string,
    options: SimilaritySearchOptions = {}
  ): Promise<Array<{
    assetId: string;
    similarityScore: number;
    comparisonDetails?: AssetComparison['comparisonDetails'];
    asset: {
      id: string;
      name: string;
      url: string;
      type: string;
    };
  }>> {
    const {
      topK = 10,
      threshold = 0.3,
      similarityTypes = ['visual', 'color', 'style', 'composition', 'semantic'],
      includeAnalysis = false,
      projectId,
      assetType,
    } = options;

    this.logger.log(`Finding similar assets for: ${queryAssetId}`);

    try {
      // Get query asset analysis
      const queryAnalysis = await this.getAssetAnalysis(queryAssetId);

      // Build search criteria
      const searchCriteria: any = {
        NOT: { id: queryAssetId },
      };

      if (projectId) {
        searchCriteria.projectId = projectId;
      }

      if (assetType) {
        searchCriteria.type = assetType;
      }

      // Get candidate assets
      const candidateAssets = await this.prisma.asset.findMany({
        where: searchCriteria,
        take: 100, // Limit for performance
      });

      // Calculate similarities
      const similarities = await Promise.all(
        candidateAssets.map(async (asset) => {
          try {
            const assetAnalysis = await this.getAssetAnalysis(asset.id);
            const similarity = this.calculateOverallSimilarity(queryAnalysis, assetAnalysis, similarityTypes);
            
            return {
              asset,
              similarityScore: similarity,
              comparisonDetails: includeAnalysis ? {
                visualSimilarity: this.calculateVisualSimilarity(queryAnalysis, assetAnalysis),
                colorSimilarity: this.calculateColorSimilarity(queryAnalysis, assetAnalysis),
                styleSimilarity: this.calculateStyleSimilarity(queryAnalysis, assetAnalysis),
                compositionSimilarity: this.calculateCompositionSimilarity(queryAnalysis, assetAnalysis),
                semanticSimilarity: this.calculateSemanticSimilarity(queryAnalysis, assetAnalysis),
              } : undefined,
            };
          } catch (error) {
            this.logger.warn(`Failed to analyze asset ${asset.id}:`, error.message);
            return null;
          }
        })
      );

      // Filter and sort results
      const validSimilarities = similarities
        .filter((result): result is NonNullable<typeof result> => result !== null)
        .filter(result => result.similarityScore >= threshold)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, topK);

      return validSimilarities.map(result => ({
        assetId: result.asset.id,
        similarityScore: result.similarityScore,
        comparisonDetails: result.comparisonDetails,
        asset: {
          id: result.asset.id,
          name: result.asset.fileName || `Asset ${result.asset.id}`,
          url: result.asset.publicUrl || '',
          type: result.asset.mimeType || 'unknown',
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to find similar assets for ${queryAssetId}:`, error);
      throw error;
    }
  }

  /**
   * Cluster assets based on visual and semantic similarity
   */
  async clusterAssets(
    projectId: string,
    options: {
      maxClusters?: number;
      similarityThreshold?: number;
      clusterType?: 'auto' | 'style' | 'color' | 'composition';
    } = {}
  ): Promise<AssetCluster[]> {
    const { maxClusters = 10, similarityThreshold = 0.6, clusterType = 'auto' } = options;

    this.logger.log(`Clustering assets for project: ${projectId}`);

    try {
      // Get all assets for the project
      const assets = await this.prisma.asset.findMany({
        where: { projectId },
        include: { tags: true },
      });

      if (assets.length === 0) {
        return [];
      }

      // Get analysis for all assets
      const assetAnalyses = await Promise.all(
        assets.map(async (asset) => {
          const analysis = await this.getAssetAnalysis(asset.id);
          return { asset, analysis };
        })
      );

      // Perform clustering based on similarity
      const clusters = this.performClustering(assetAnalyses, {
        maxClusters,
        similarityThreshold,
        clusterType,
      });

      return clusters;
    } catch (error) {
      this.logger.error(`Failed to cluster assets for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive asset analysis (cached)
   */
  private async getAssetAnalysis(
    assetId: string,
    analysisType: string = 'creative'
  ): Promise<AssetAnalysisResult> {
    // Check cache first
    const cached = this.assetCache.get(assetId);
    if (cached) {
      return cached;
    }

    // Get asset from database
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: { tags: true, project: true },
    });

    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    // Perform vision analysis using Gemini
    const visionAnalysis = await this.geminiAnalyst.analyzeImage(
      asset.publicUrl || '',
      {
        analysisType: analysisType as 'basic' | 'creative' | 'brand' | 'technical',
        context: `Asset: ${asset.fileName}, Type: ${asset.mimeType}`,
      }
    );

    // Generate visual embedding
    const visualEmbedding = await this.embeddings.generateEmbedding(
      `${asset.fileName} ${visionAnalysis.tags.join(' ')} ${visionAnalysis.moods.join(' ')} ${visionAnalysis.colors.join(' ')}`
    );

    const result: AssetAnalysisResult = {
      assetId,
      analysis: {
        tags: visionAnalysis.tags || [],
        moods: visionAnalysis.moods || [],
        colors: visionAnalysis.colors || [],
        composition: visionAnalysis.composition || {
          ruleOfThirds: false,
          leadingLines: [],
          focalPoints: [],
          balance: 'balanced',
        },
        lighting: visionAnalysis.lighting || {
          type: 'unknown',
          direction: 'unknown',
          mood: 'neutral',
          quality: 'natural',
        },
        style: visionAnalysis.style || {
          genre: 'unknown',
          era: 'contemporary',
          movements: [],
          techniques: [],
        },
      },
      visualEmbedding,
      metadata: {
        extractedAt: new Date(),
        analysisType,
        confidence: 0.8, // Based on analysis quality
      },
    };

    // Cache the result
    this.assetCache.set(assetId, result);
    
    return result;
  }

  /**
   * Calculate visual similarity between two assets
   */
  private calculateVisualSimilarity(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): number {
    const tags1 = new Set(analysis1.analysis.tags);
    const tags2 = new Set(analysis2.analysis.tags);
    
    // Jaccard similarity for tags
    const tagIntersection = new Set([...tags1].filter(tag => tags2.has(tag)));
    const tagUnion = new Set([...tags1, ...tags2]);
    const tagSimilarity = tagUnion.size > 0 ? tagIntersection.size / tagUnion.size : 0;

    // Mood similarity
    const moods1 = new Set(analysis1.analysis.moods);
    const moods2 = new Set(analysis2.analysis.moods);
    const moodIntersection = new Set([...moods1].filter(mood => moods2.has(mood)));
    const moodUnion = new Set([...moods1, ...moods2]);
    const moodSimilarity = moodUnion.size > 0 ? moodIntersection.size / moodUnion.size : 0;

    return (tagSimilarity + moodSimilarity) / 2;
  }

  /**
   * Calculate color similarity between two assets
   */
  private calculateColorSimilarity(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): number {
    const colors1 = new Set(analysis1.analysis.colors);
    const colors2 = new Set(analysis2.analysis.colors);
    
    const colorIntersection = new Set([...colors1].filter(color => colors2.has(color)));
    const colorUnion = new Set([...colors1, ...colors2]);
    
    return colorUnion.size > 0 ? colorIntersection.size / colorUnion.size : 0;
  }

  /**
   * Calculate style similarity between two assets
   */
  private calculateStyleSimilarity(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): number {
    const style1 = analysis1.analysis.style;
    const style2 = analysis2.analysis.style;

    let similarity = 0;
    let factors = 0;

    // Genre similarity
    if (style1.genre === style2.genre) {
      similarity += 0.3;
    }
    factors += 0.3;

    // Era similarity
    if (style1.era === style2.era) {
      similarity += 0.2;
    }
    factors += 0.2;

    // Movements similarity
    const movements1 = new Set(style1.movements);
    const movements2 = new Set(style2.movements);
    const movementIntersection = new Set([...movements1].filter(movement => movements2.has(movement)));
    const movementUnion = new Set([...movements1, ...movements2]);
    if (movementUnion.size > 0) {
      similarity += (movementIntersection.size / movementUnion.size) * 0.3;
    }
    factors += 0.3;

    // Techniques similarity
    const techniques1 = new Set(style1.techniques);
    const techniques2 = new Set(style2.techniques);
    const techniqueIntersection = new Set([...techniques1].filter(technique => techniques2.has(technique)));
    const techniqueUnion = new Set([...techniques1, ...techniques2]);
    if (techniqueUnion.size > 0) {
      similarity += (techniqueIntersection.size / techniqueUnion.size) * 0.2;
    }
    factors += 0.2;

    return factors > 0 ? similarity / factors : 0;
  }

  /**
   * Calculate composition similarity between two assets
   */
  private calculateCompositionSimilarity(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): number {
    const comp1 = analysis1.analysis.composition;
    const comp2 = analysis2.analysis.composition;

    let similarity = 0;
    let factors = 0;

    // Rule of thirds similarity
    if (comp1.ruleOfThirds === comp2.ruleOfThirds) {
      similarity += 0.2;
    }
    factors += 0.2;

    // Balance similarity
    if (comp1.balance === comp2.balance) {
      similarity += 0.3;
    }
    factors += 0.3;

    // Leading lines similarity
    const lines1 = new Set(comp1.leadingLines);
    const lines2 = new Set(comp2.leadingLines);
    const lineIntersection = new Set([...lines1].filter(line => lines2.has(line)));
    const lineUnion = new Set([...lines1, ...lines2]);
    if (lineUnion.size > 0) {
      similarity += (lineIntersection.size / lineUnion.size) * 0.2;
    }
    factors += 0.2;

    return factors > 0 ? similarity / factors : 0;
  }

  /**
   * Calculate semantic similarity between two assets
   */
  private calculateSemanticSimilarity(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): number {
    // For now, use a simple approach based on shared tags and moods
    const tags1 = new Set(analysis1.analysis.tags);
    const tags2 = new Set(analysis2.analysis.tags);
    const moods1 = new Set(analysis1.analysis.moods);
    const moods2 = new Set(analysis2.analysis.moods);

    const tagSimilarity = this.jaccardSimilarity(tags1, tags2);
    const moodSimilarity = this.jaccardSimilarity(moods1, moods2);

    return (tagSimilarity + moodSimilarity) / 2;
  }

  /**
   * Calculate overall similarity score
   */
  private calculateOverallSimilarity(
    analysis1: AssetAnalysisResult,
    analysis2: AssetAnalysisResult,
    similarityTypes: Array<'visual' | 'color' | 'style' | 'composition' | 'semantic'>
  ): number {
    let totalSimilarity = 0;
    let totalWeight = 0;

    const weights = {
      visual: 0.25,
      color: 0.20,
      style: 0.25,
      composition: 0.15,
      semantic: 0.15,
    };

    if (similarityTypes.includes('visual')) {
      totalSimilarity += this.calculateVisualSimilarity(analysis1, analysis2) * weights.visual;
      totalWeight += weights.visual;
    }

    if (similarityTypes.includes('color')) {
      totalSimilarity += this.calculateColorSimilarity(analysis1, analysis2) * weights.color;
      totalWeight += weights.color;
    }

    if (similarityTypes.includes('style')) {
      totalSimilarity += this.calculateStyleSimilarity(analysis1, analysis2) * weights.style;
      totalWeight += weights.style;
    }

    if (similarityTypes.includes('composition')) {
      totalSimilarity += this.calculateCompositionSimilarity(analysis1, analysis2) * weights.composition;
      totalWeight += weights.composition;
    }

    if (similarityTypes.includes('semantic')) {
      totalSimilarity += this.calculateSemanticSimilarity(analysis1, analysis2) * weights.semantic;
      totalWeight += weights.semantic;
    }

    return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
  }

  /**
   * Calculate confidence score for similarity analysis
   */
  private calculateConfidence(
    analysis1: AssetAnalysisResult,
    analysis2: AssetAnalysisResult,
    processingTime: number
  ): number {
    // Simple confidence calculation based on analysis quality and processing time
    const baseConfidence = 0.7;
    const timeBonus = processingTime < 5000 ? 0.1 : 0; // Bonus for fast processing
    const qualityBonus = (analysis1.analysis.tags.length + analysis2.analysis.tags.length) > 4 ? 0.1 : 0;

    return Math.min(baseConfidence + timeBonus + qualityBonus, 1.0);
  }

  /**
   * Find common features between two asset analyses
   */
  private findCommonFeatures(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): string[] {
    const commonFeatures: string[] = [];

    // Common tags
    const commonTags = analysis1.analysis.tags.filter(tag => analysis2.analysis.tags.includes(tag));
    if (commonTags.length > 0) {
      commonFeatures.push(`Shared tags: ${commonTags.join(', ')}`);
    }

    // Common moods
    const commonMoods = analysis1.analysis.moods.filter(mood => analysis2.analysis.moods.includes(mood));
    if (commonMoods.length > 0) {
      commonFeatures.push(`Shared moods: ${commonMoods.join(', ')}`);
    }

    // Common colors
    const commonColors = analysis1.analysis.colors.filter(color => analysis2.analysis.colors.includes(color));
    if (commonColors.length > 0) {
      commonFeatures.push(`Shared colors: ${commonColors.join(', ')}`);
    }

    return commonFeatures;
  }

  /**
   * Find differences between two asset analyses
   */
  private findDifferences(analysis1: AssetAnalysisResult, analysis2: AssetAnalysisResult): string[] {
    const differences: string[] = [];

    // Different tags
    const diffTags = analysis1.analysis.tags.filter(tag => !analysis2.analysis.tags.includes(tag));
    if (diffTags.length > 0) {
      differences.push(`Unique tags in asset 1: ${diffTags.join(', ')}`);
    }

    const diffTags2 = analysis2.analysis.tags.filter(tag => !analysis1.analysis.tags.includes(tag));
    if (diffTags2.length > 0) {
      differences.push(`Unique tags in asset 2: ${diffTags2.join(', ')}`);
    }

    // Different moods
    const diffMoods = analysis1.analysis.moods.filter(mood => !analysis2.analysis.moods.includes(mood));
    if (diffMoods.length > 0) {
      differences.push(`Unique moods in asset 1: ${diffMoods.join(', ')}`);
    }

    return differences;
  }

  /**
   * Generate recommendations based on similarity analysis
   */
  private generateRecommendations(
    analysis1: AssetAnalysisResult,
    analysis2: AssetAnalysisResult,
    comparisonDetails: any
  ): string[] {
    const recommendations: string[] = [];

    if (comparisonDetails.visualSimilarity < 0.5) {
      recommendations.push('Consider improving visual consistency between assets');
    }

    if (comparisonDetails.colorSimilarity < 0.5) {
      recommendations.push('Review color palette consistency across assets');
    }

    if (comparisonDetails.styleSimilarity < 0.5) {
      recommendations.push('Align artistic style and composition techniques');
    }

    if (recommendations.length === 0) {
      recommendations.push('Assets show good consistency - maintain current approach');
    }

    return recommendations;
  }

  /**
   * Perform clustering of assets
   */
  private performClustering(
    assetAnalyses: Array<{ asset: any; analysis: AssetAnalysisResult }>,
    options: {
      maxClusters: number;
      similarityThreshold: number;
      clusterType: 'auto' | 'style' | 'color' | 'composition';
    }
  ): AssetCluster[] {
    const clusters: AssetCluster[] = [];
    const processedAssets = new Set<string>();

    for (const item of assetAnalyses) {
      if (processedAssets.has(item.asset.id)) continue;

      const cluster: AssetCluster = {
        clusterId: `cluster_${clusters.length + 1}`,
        assets: [item.asset],
        clusterFeatures: [],
        averageSimilarity: 1.0,
        metadata: {
          type: options.clusterType === 'auto' ? 'mixed' : options.clusterType,
          description: `Cluster ${clusters.length + 1}`,
          confidence: 0.8,
        },
      };

      processedAssets.add(item.asset.id);

      // Find similar assets for this cluster
      for (const otherItem of assetAnalyses) {
        if (processedAssets.has(otherItem.asset.id)) continue;

        const similarity = this.calculateOverallSimilarity(
          item.analysis,
          otherItem.analysis,
          ['visual', 'color', 'style', 'composition', 'semantic']
        );

        if (similarity >= options.similarityThreshold) {
          cluster.assets.push(otherItem.asset);
          processedAssets.add(otherItem.asset.id);
        }
      }

      // Calculate cluster features and average similarity
      if (cluster.assets.length > 1) {
        cluster.clusterFeatures = this.extractClusterFeatures(cluster.assets);
        cluster.averageSimilarity = this.calculateClusterAverageSimilarity(
          cluster.assets.map(a => assetAnalyses.find(item => item.asset.id === a.id)?.analysis!)
        );
      }

      clusters.push(cluster);

      if (clusters.length >= options.maxClusters) break;
    }

    return clusters;
  }

  /**
   * Extract features common to a cluster of assets
   */
  private extractClusterFeatures(assets: any[]): string[] {
    const features: string[] = [];

    if (assets.length === 0) return features;

    // Find common tags across all assets
    const commonTags = assets.reduce((acc, asset) => {
      // This would need actual tag data from the asset
      return acc;
    }, new Set<string>());

    if (commonTags.size > 0) {
      features.push(`Common tags: ${Array.from(commonTags).join(', ')}`);
    }

    return features;
  }

  /**
   * Calculate average similarity within a cluster
   */
  private calculateClusterAverageSimilarity(analyses: AssetAnalysisResult[]): number {
    if (analyses.length < 2) return 1.0;

    let totalSimilarity = 0;
    let pairCount = 0;

    for (let i = 0; i < analyses.length; i++) {
      for (let j = i + 1; j < analyses.length; j++) {
        totalSimilarity += this.calculateOverallSimilarity(
          analyses[i],
          analyses[j],
          ['visual', 'color', 'style', 'composition', 'semantic']
        );
        pairCount++;
      }
    }

    return pairCount > 0 ? totalSimilarity / pairCount : 1.0;
  }

  /**
   * Calculate Jaccard similarity between two sets
   */
  private jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
