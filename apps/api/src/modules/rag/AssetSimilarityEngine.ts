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
    const line
