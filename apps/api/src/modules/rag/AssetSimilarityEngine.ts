import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { GeminiAnalystService } from "../ai/gemini-analyst.service.js";
import { EmbeddingsService } from "./embeddings.service.js";

@Injectable()
export class AssetSimilarityEngine {
  private readonly logger = new Logger(AssetSimilarityEngine.name);

  constructor(
    private prisma: PrismaService,
    private embeddings: EmbeddingsService,
    private geminiAnalyst: GeminiAnalystService
  ) {}

  async compareAssets(asset1Id: string, asset2Id: string): Promise<any> {
    this.logger.log(`Comparing assets: ${asset1Id} vs ${asset2Id}`);
    
    const asset1 = await this.prisma.asset.findUnique({
      where: { id: asset1Id },
      include: { project: true },
    });

    const asset2 = await this.prisma.asset.findUnique({
      where: { id: asset2Id },
      include: { project: true },
    });

    if (!asset1 || !asset2) {
      throw new Error("Assets not found");
    }

    // Simple similarity calculation
    const similarity = this.calculateSimpleSimilarity(asset1, asset2);

    return {
      asset1Id,
      asset2Id,
      similarityScore: similarity,
      metadata: {
        analysisType: 'basic',
        confidence: 0.8,
        processingTime: 100,
        timestamp: new Date(),
      },
    };
  }

  async findSimilarAssets(queryAssetId: string): Promise<any[]> {
    this.logger.log(`Finding similar assets for: ${queryAssetId}`);
    
    const queryAsset = await this.prisma.asset.findUnique({
      where: { id: queryAssetId },
    });

    if (!queryAsset) {
      throw new Error("Query asset not found");
    }

    const candidateAssets = await this.prisma.asset.findMany({
      where: { 
        NOT: { id: queryAssetId },
        type: queryAsset.type 
      },
      take: 10,
    });

    return candidateAssets.map(asset => ({
      assetId: asset.id,
      similarityScore: Math.random(),
      asset: {
        id: asset.id,
        name: asset.fileName || `Asset ${asset.id}`,
        url: asset.url || '',
        type: asset.mimeType || 'unknown',
      },
    }));
  }

  async clusterAssets(projectId: string): Promise<any[]> {
    this.logger.log(`Clustering assets for project: ${projectId}`);
    
    const assets = await this.prisma.asset.findMany({
      where: { projectId },
    });

    return assets.map(asset => ({
      clusterId: `cluster_1`,
      assets: [{
        id: asset.id,
        name: asset.fileName || `Asset ${asset.id}`,
        url: asset.url || '',
      }],
      clusterFeatures: ['basic'],
      averageSimilarity: 0.8,
      metadata: {
        type: 'mixed',
        description: 'Basic cluster',
        confidence: 0.8,
      },
    }));
  }

  private calculateSimpleSimilarity(asset1: any, asset2: any): number {
    // Simple similarity based on type and project
    let similarity = 0;
    
    if (asset1.type === asset2.type) {
      similarity += 0.5;
    }
    
    if (asset1.projectId === asset2.projectId) {
      similarity += 0.5;
    }
    
    return similarity;
  }
}
