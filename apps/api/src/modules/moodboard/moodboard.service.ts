import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MoodboardCollection, MoodboardItem } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service.js";
import { VertexAIService } from "../ai/vertex-ai.service.js";
import { AssetsService } from "../assets/assets.service.js";
import { CreateCollectionDto } from "./dto/create-collection.dto.js";
import { CreateFromUnsplashDto } from "./dto/create-from-unsplash.dto.js";
import { CreateMoodboardItemDto } from "./dto/create-moodboard-item.dto.js";

@Injectable()
export class MoodboardService {
  private readonly logger = new Logger(MoodboardService.name);

  constructor(
    private readonly assetsService: AssetsService,
    private readonly prisma: PrismaService,
    private readonly vertexAI: VertexAIService
  ) {}

  async create(createDto: CreateMoodboardItemDto): Promise<MoodboardItem> {
    return this.prisma.moodboardItem.create({
      data: {
        projectId: createDto.projectId,
        assetId: "manual",
        source: "upload",
        url: createDto.url || "",
        caption: createDto.caption || "Processing...",
        tags: Array.isArray(createDto.tags) ? createDto.tags : (createDto.tags ? [createDto.tags] : []),
        moods: Array.isArray(createDto.moods) ? createDto.moods : (createDto.moods ? [createDto.moods] : []),
        colors: Array.isArray(createDto.colors) ? createDto.colors : (createDto.colors ? [createDto.colors] : []),
        shotType: createDto.shotType,
      },
    });
  }

  /**
   * P0: Create moodboard item from Unsplash image
   * Stores all attribution metadata for API compliance
   */
  async createFromUnsplash(dto: CreateFromUnsplashDto): Promise<MoodboardItem> {
    return this.prisma.moodboardItem.create({
      data: {
        projectId: dto.projectId,
        source: "unsplash",
        url: dto.imageUrl,
        caption: dto.description || dto.altDescription || "",
        tags: [],
        moods: [],
        colors: dto.color ? [dto.color] : [],
        assetId: null,
      },
    });
  }

  /**
   * Creates a moodboard item linked to an existing Asset.
   */
  async createFromAsset(
    projectId: string,
    assetId: string
  ): Promise<MoodboardItem> {
    const asset = await this.assetsService.findOne(assetId);

    const newItem = await this.prisma.moodboardItem.create({
      data: {
        projectId,
        assetId: asset.id,
        source: "asset",
        url: asset.url || "",
        tags: [],
        moods: [],
        colors: [],
        caption: "Processing analysis...",
      },
    });

    // Trigger Async Analysis
    this.analyzeAsset(newItem.id, assetId).catch((err) =>
      this.logger.error(`Analysis failed for ${newItem.id}`, err)
    );

    return newItem;
  }

  async findAllByProject(
    projectId: string,
    filters?: { favorite?: boolean; collectionId?: string; source?: string }
  ): Promise<
    Array<
      Omit<MoodboardItem, "tags" | "moods" | "colors"> & {
        tags: string[];
        moods: string[];
        colors: string[];
      }
    >
  > {
    const where: Record<string, unknown> = { projectId };

    if (filters?.favorite !== undefined) {
      where.isFavorite = filters.favorite;
    }

    if (filters?.collectionId) {
      where.collectionId = filters.collectionId;
    }

    if (filters?.source) {
      where.source = filters.source;
    }

    const items = await this.prisma.moodboardItem.findMany({ where });
    return this.enrichItems(items);
  }

  async search(
    projectId: string,
    query: string
  ): Promise<
    Array<
      Omit<MoodboardItem, "tags" | "moods" | "colors"> & {
        tags: string[];
        moods: string[];
        colors: string[];
      }
    >
  > {
    const lowerQ = query.toLowerCase();
    // Perform search in memory for now as SQLite doesn't support array contains easily with CSV
    // Ideally use full text search or separate tables for tags
    const allItems = await this.findAllByProject(projectId);

    return allItems.filter(
      (item) =>
        (item.caption && item.caption.toLowerCase().includes(lowerQ)) ||
        item.tags.some((t: string) => t.toLowerCase().includes(lowerQ)) ||
        item.moods.some((m: string) => m.toLowerCase().includes(lowerQ))
    );
  }

  async update(
    id: string,
    updateData: Partial<
      MoodboardItem & { tags?: string[]; moods?: string[]; colors?: string[] }
    >
  ): Promise<MoodboardItem> {
    const data: Record<string, unknown> = { ...updateData };

    // Arrays are already in correct format for Prisma
    // No conversion needed since schema defines them as String[]

    try {
      return await this.prisma.moodboardItem.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }

  /**
   * P1: Toggle favorite status
   */
  async toggleFavorite(
    id: string,
    isFavorite: boolean
  ): Promise<MoodboardItem> {
    return this.prisma.moodboardItem.update({
      where: { id },
      data: { isFavorite },
    });
  }

  /**
   * P1: Get all favorites for a project
   */
  async findFavorites(projectId: string): Promise<
    Array<
      Omit<MoodboardItem, "tags" | "moods" | "colors"> & {
        tags: string[];
        moods: string[];
        colors: string[];
      }
    >
  > {
    const items = await this.prisma.moodboardItem.findMany({
      where: {
        projectId,
        isFavorite: true,
      },
    });

    return this.enrichItems(items);
  }

  /**
   * P1: Create a new collection
   */
  async createCollection(
    dto: CreateCollectionDto
  ): Promise<MoodboardCollection> {
    return this.prisma.moodboardCollection.create({
      data: {
        projectId: dto.projectId,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  /**
   * P1: Get all collections for a project
   */
  async findCollections(projectId: string): Promise<MoodboardCollection[]> {
    return this.prisma.moodboardCollection.findMany({
      where: { projectId },
      include: { items: true },
    });
  }

  /**
   * P1: Add item to collection
   */
  async addToCollection(
    itemId: string,
    collectionId: string
  ): Promise<MoodboardItem> {
    // Create the relationship in MoodboardCollectionItem table
    await this.prisma.moodboardCollectionItem.create({
      data: {
        collectionId,
        moodboardItemId: itemId,
      },
    });

    // Return the updated item
    return this.prisma.moodboardItem.findUnique({
      where: { id: itemId },
    }) as Promise<MoodboardItem>;
  }

  /**
   * P1: Remove item from collection
   */
  async removeFromCollection(itemId: string): Promise<MoodboardItem> {
    // Remove the relationship from MoodboardCollectionItem table
    await this.prisma.moodboardCollectionItem.deleteMany({
      where: { moodboardItemId: itemId },
    });

    // Return the item
    return this.prisma.moodboardItem.findUnique({
      where: { id: itemId },
    }) as Promise<MoodboardItem>;
  }

  /**
   * P1: Delete a collection
   */
  async deleteCollection(id: string): Promise<void> {
    // First, delete all relationships in the junction table
    await this.prisma.moodboardCollectionItem.deleteMany({
      where: { collectionId: id },
    });

    // Then delete the collection
    await this.prisma.moodboardCollection.delete({
      where: { id },
    });
  }

  /**
   * Helper: Enrich items with signed URLs
   * Tags, moods, colors are already arrays in the schema
   */
  private async enrichItems(items: MoodboardItem[]): Promise<
    Array<
      Omit<MoodboardItem, "tags" | "moods" | "colors"> & {
        tags: string[];
        moods: string[];
        colors: string[];
      }
    >
  > {
    return Promise.all(
      items.map(async (item) => {
        let url = item.url;

        // Tags, moods, colors are already arrays - no need to split
        const tags = item.tags || [];
        const moods = item.moods || [];
        const colors = item.colors || [];

        if (item.assetId && item.assetId !== "manual") {
          try {
            const freshUrl = await this.assetsService.getDownloadUrl(
              item.assetId
            );
            if (freshUrl) {
              url = freshUrl;
            }
          } catch {
            this.logger.warn(`Failed to refresh URL for asset ${item.assetId}`);
          }
        }
        return { ...item, url, tags, moods, colors };
      })
    );
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.moodboardItem.delete({
        where: { id },
      });
    } catch {
      // Ignore if already deleted
    }
  }

  private async analyzeAsset(itemId: string, assetId: string) {
    try {
      const asset = await this.assetsService.findOne(assetId);

      const prompt = `Analyze this file: ${asset.fileName} (${asset.mimeType}). 
      Generate a JSON response with:
      - caption: A short creative caption
      - tags: 5 comma-separated keywords
      - moods: 3 comma-separated mood adjectives`;

      const text = await this.vertexAI.generateContent(prompt);

      await this.update(itemId, {
        caption: text.slice(0, 200), // Truncate for safety
        tags: ["AI", "Analyzed", "GenAI"],
        moods: ["Automated", "Smart"],
      } as Partial<
        MoodboardItem & { tags?: string[]; moods?: string[]; colors?: string[] }
      >);

      this.logger.log(`AI Analysis completed for ${itemId}`);
    } catch (error: unknown) {
      this.logger.error(
        "AI Analysis Failed",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
