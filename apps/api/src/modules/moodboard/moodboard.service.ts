
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMoodboardItemDto } from './dto/create-moodboard-item.dto';
import { AssetsService } from '../assets/assets.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MoodboardItem } from '@prisma/client';

@Injectable()
export class MoodboardService {
  private readonly logger = new Logger(MoodboardService.name);

  constructor(
    private readonly assetsService: AssetsService,
    private readonly prisma: PrismaService
  ) { }

  async create(createDto: CreateMoodboardItemDto): Promise<MoodboardItem> {
    return this.prisma.moodboardItem.create({
      data: {
        projectId: createDto.projectId,
        assetId: 'manual',
        type: createDto.type,
        url: createDto.url,
        caption: createDto.caption || 'Processing...',
        tags: (createDto.tags || []).join(','),
        moods: (createDto.moods || []).join(','),
        colors: (createDto.colors || []).join(','),
        shotType: createDto.shotType,
      }
    });
  }

  /**
   * Creates a moodboard item linked to an existing Asset.
   */
  async createFromAsset(projectId: string, assetId: string): Promise<MoodboardItem> {
    const asset = await this.assetsService.findOne(assetId);

    // Determine type from asset mimeType
    let type = 'image';
    if (asset.mimeType.includes('video')) type = 'video';
    else if (asset.mimeType.includes('gif')) type = 'gif';

    const newItem = await this.prisma.moodboardItem.create({
      data: {
        projectId,
        assetId: asset.id,
        type,
        tags: '',
        moods: '',
        colors: '',
        caption: 'Processing analysis...',
      }
    });

    // Trigger Async Analysis
    this.analyzeAsset(newItem.id, assetId).catch(err => this.logger.error(`Analysis failed for ${newItem.id}`, err));

    return newItem;
  }

  async findAllByProject(projectId: string): Promise<any[]> {
    const items = await this.prisma.moodboardItem.findMany({
      where: { projectId }
    });

    // Enrich items with signed URLs for the frontend
    return Promise.all(items.map(async (item) => {
      let url = item.url;
      const tags = item.tags ? item.tags.split(',').filter(Boolean) : [];
      const moods = item.moods ? item.moods.split(',').filter(Boolean) : [];
      const colors = item.colors ? item.colors.split(',').filter(Boolean) : [];

      // If linked to a real asset (not a manual URL import), fetch a fresh signed URL
      if (item.assetId && item.assetId !== 'manual') {
        try {
          const freshUrl = await this.assetsService.getDownloadUrl(item.assetId);
          if (freshUrl) {
            url = freshUrl;
          }
        } catch (e) {
          this.logger.warn(`Failed to refresh URL for asset ${item.assetId}`);
        }
      }
      return { ...item, url, tags, moods, colors };
    }));
  }

  async search(projectId: string, query: string): Promise<any[]> {
    const lowerQ = query.toLowerCase();
    // Perform search in memory for now as SQLite doesn't support array contains easily with CSV
    // Ideally use full text search or separate tables for tags
    const allItems = await this.findAllByProject(projectId);

    return allItems.filter(item =>
      (item.caption && item.caption.toLowerCase().includes(lowerQ)) ||
      item.tags.some((t: string) => t.toLowerCase().includes(lowerQ)) ||
      item.moods.some((m: string) => m.toLowerCase().includes(lowerQ))
    );
  }

  async update(id: string, updateData: Partial<any>): Promise<MoodboardItem> {
    const data: any = { ...updateData };

    // Convert arrays back to CSV if present
    if (Array.isArray(data.tags)) data.tags = data.tags.join(',');
    if (Array.isArray(data.moods)) data.moods = data.moods.join(',');
    if (Array.isArray(data.colors)) data.colors = data.colors.join(',');

    try {
      return await this.prisma.moodboardItem.update({
        where: { id },
        data
      });
    } catch (e) {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.moodboardItem.delete({
        where: { id }
      });
    } catch (e) {
      // Ignore if already deleted
    }
  }

  private async analyzeAsset(itemId: string, assetId: string) {
    if (!process.env.API_KEY) return;

    try {
      // Mocking the result for this implementation
      await new Promise(r => setTimeout(r, 2000));

      await this.update(itemId, {
        caption: "AI Analyzed Asset",
        tags: ["AI", "Cloud", "Secure"],
        moods: ["Professional", "Clean"]
      });

    } catch (e: any) {
      this.logger.error("AI Analysis Failed", e);
    }
  }
}
