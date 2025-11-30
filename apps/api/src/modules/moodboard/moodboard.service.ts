import { GoogleGenerativeAI } from '@google/generative-ai';
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      this.logger.warn('Skipping AI analysis: No API_KEY found');
      return;
    }

    try {
      const asset = await this.assetsService.findOne(assetId);
      // For this MVP, we are only analyzing the metadata or using a text prompt
      // In a full implementation, we would download the image buffer and pass it to Gemini

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this file: ${asset.fileName} (${asset.mimeType}). 
      Generate a JSON response with:
      - caption: A short creative caption
      - tags: 5 comma-separated keywords
      - moods: 3 comma-separated mood adjectives`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Basic parsing (robust JSON parsing would be better in prod)
      // Assuming the model returns somewhat structured text or we just use the text as caption

      await this.update(itemId, {
        caption: text.slice(0, 200), // Truncate for safety
        tags: "AI,Analyzed,GenAI",
        moods: "Automated,Smart"
      });

      this.logger.log(`AI Analysis completed for ${itemId}`);

    } catch (e: any) {
      this.logger.error("AI Analysis Failed", e);
    }
  }
}
