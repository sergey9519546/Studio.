
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from "../../prisma/prisma.service.js";
import { StorageService } from "../storage/storage.service.js";

export interface AssetEntity {
  id: string;
  projectId?: string | null;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  storageKey: string | null;
  publicUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
  title?: string | null;
  type: string;
  userId?: string | null;
  isTransient?: boolean;
  url?: string; // Virtual field for frontend convenience
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);
  private memoryStore: AssetEntity[] = []; // In-memory fallback

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {
    this.logger.log('AssetsService Initialized');
  }

  async create(file: MulterFile, projectId?: string): Promise<AssetEntity> {
    const fileExt = extname(file.originalname);
    const uniqueName = `${randomUUID()}${fileExt}`;
    const storageKey = `uploads/${projectId || 'global'}/${uniqueName}`;

    // 1. Upload to Cloud Storage
    const uploaded = await this.storage.uploadObject({
      key: storageKey,
      body: file.buffer,
      contentType: file.mimetype,
      isPublic: true,
    });

    const finalUrl = uploaded.publicUrl || uploaded.signedUrl;

    const assetEntity: AssetEntity = {
      id: randomUUID(),
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: uploaded.storageKey,
      url: finalUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
      type: 'file',
      isTransient: true,
      projectId: projectId || null,
      userId: null
    };

    // 2. Save to Memory Store (Resilience)
    this.memoryStore.unshift(assetEntity);
    if (this.memoryStore.length > 100) {
      this.memoryStore.pop();
    }

    // 3. Save Record to DB
    try {
      const asset = await this.prisma.asset.create({
        data: {
          id: assetEntity.id,
          url: finalUrl || '',
          type: 'file',
          fileName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          storageKey: uploaded.storageKey,
          projectId: projectId || null,
        },
      });

      // Update memory store to reflect persistence (remove transient flag)
      const index = this.memoryStore.findIndex(a => a.id === assetEntity.id);
      if (index !== -1) {
        this.memoryStore[index] = {
          ...(asset as unknown as AssetEntity),
          url: finalUrl,
          isTransient: false,
        };
      }

      return {
        ...(asset as unknown as AssetEntity),
        url: finalUrl,
        isTransient: false,
        projectId: asset.projectId ?? undefined,
      };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn(`Database save failed (Storage successful). Asset ${assetEntity.id} kept in memory: ${err.message}`);
      return assetEntity;
    }
  }

  async findAll(): Promise<AssetEntity[]> {
    let dbAssets: AssetEntity[] = [];

    // 1. Try DB
    // 1. Try DB
    try {
      const records = await this.prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1000
      });
      // Mark DB assets as persistent
      dbAssets = records.map((a) => ({ ...a, isTransient: false })) as AssetEntity[];
    } catch (e) {
      this.logger.warn(`Failed to list assets from DB: ${e}`);
    }

    // 2. Merge with Memory Store
    const dbIds = new Set(dbAssets.map(a => a.id));
    const memoryAssets = this.memoryStore.filter(a => !dbIds.has(a.id));

    // Combine and sort
    const allAssets = [...memoryAssets, ...dbAssets].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 3. Populate virtual URL field on list
    return this.enrichAssetsWithUrls(allAssets);
  }

  async findOne(id: string): Promise<AssetEntity> {
    // 1. Check memory first
    const memoryAsset = this.memoryStore.find(a => a.id === id);
    if (memoryAsset) return memoryAsset;

    // 2. Check DB
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset as unknown as AssetEntity;
  }

  async getDownloadUrl(id: string): Promise<string> {
    try {
      const asset = await this.findOne(id);
      if (asset.url) return asset.url;
      if (asset.publicUrl) return asset.publicUrl;
      if (asset.storageKey && asset.storageKey !== null) {
        return this.storage.getSignedDownloadUrl(asset.storageKey);
      }
      return '';
    } catch {
      return '';
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const asset = await this.findOne(id);

      if (asset.storageKey && asset.storageKey !== null) {
        await this.storage.deleteObject(asset.storageKey);
      }
      this.memoryStore = this.memoryStore.filter(a => a.id !== id);

      await this.prisma.asset.delete({ where: { id } });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn(`Delete failed: ${err.message}`);
    }
  }

  async searchByKeywords(params: {
    projectId?: string;
    keywords: string[];
    limit?: number;
  }): Promise<AssetEntity[]> {
    const normalizedKeywords = params.keywords
      .map(keyword => keyword.trim().toLowerCase())
      .filter(Boolean);

    if (normalizedKeywords.length === 0) {
      return [];
    }

    const limit = params.limit ?? 10;
    const projectFilter = params.projectId ? { projectId: params.projectId } : undefined;

    let dbAssets: AssetEntity[] = [];
    try {
      const records = await this.prisma.asset.findMany({
        where: projectFilter,
        orderBy: { createdAt: 'desc' },
        take: 200,
      });
      dbAssets = records.map((a) => ({ ...a, isTransient: false })) as AssetEntity[];
    } catch (e) {
      this.logger.warn(`Failed to search assets from DB: ${e}`);
    }

    const memoryAssets = this.memoryStore.filter(asset =>
      params.projectId ? asset.projectId === params.projectId : true
    );

    const merged = [...memoryAssets, ...dbAssets];
    const scored = merged
      .map(asset => {
        const haystack = [
          asset.title,
          asset.fileName,
          typeof asset.metadata?.title === 'string' ? asset.metadata.title : null,
          typeof asset.metadata?.description === 'string' ? asset.metadata.description : null,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const score = normalizedKeywords.reduce((acc, keyword) => {
          return acc + (haystack.includes(keyword) ? 1 : 0);
        }, 0);

        return { asset, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    const unique = new Map<string, AssetEntity>();
    for (const entry of scored) {
      if (!unique.has(entry.asset.id)) {
        unique.set(entry.asset.id, entry.asset);
      }
      if (unique.size >= limit) break;
    }

    return this.enrichAssetsWithUrls(Array.from(unique.values()));
  }

  private async enrichAssetsWithUrls(assets: AssetEntity[]): Promise<AssetEntity[]> {
    return Promise.all(
      assets.map(async (asset) => {
        if (asset.url) return asset;
        if (asset.publicUrl) return { ...asset, url: asset.publicUrl };

        let url = '';
        try {
          if (asset.storageKey && asset.storageKey !== null) {
            url = await this.storage.getSignedDownloadUrl(asset.storageKey);
          }
        } catch {
          // Storage might be down or misconfigured, return asset without URL
        }

        return { ...asset, url };
      })
    );
  }
}
