

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { AssetsService } from "../assets/assets.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { CreateFromUnsplashDto } from "./dto/create-from-unsplash.dto";
import { CreateMoodboardItemDto } from './dto/create-moodboard-item.dto';
import { UpdateMoodboardItemDto } from './dto/update-moodboard-item.dto';
import { MoodboardService } from "./moodboard.service";

@Controller({ path: "moodboard", version: "1" })
@UseGuards(JwtAuthGuard)
export class MoodboardController {
  constructor(
    private readonly moodboardService: MoodboardService,
    private readonly assetsService: AssetsService
  ) {}

  @Post(":projectId/upload")
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 uploads per minute
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Param("projectId") projectId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    // 1. Upload to Cloud Storage via AssetsService
    const asset = await this.assetsService.create(file, projectId);

    // 2. Create DTO with real GCS URL
    const dto: CreateMoodboardItemDto = {
      projectId,
      type: (file.mimetype.startsWith("video") ? "video" : "image") as
        | "image"
        | "video",
      url: asset.url || asset.publicUrl || "",
      caption: "Processing analysis...",
    };

    return this.moodboardService.create(dto);
  }

  @Post(":projectId/link-asset")
  async linkAsset(
    @Param("projectId") projectId: string,
    @Body("assetId") assetId: string
  ) {
    return this.moodboardService.createFromAsset(projectId, assetId);
  }

  @Post(":projectId")
  async create(
    @Param("projectId") projectId: string,
    @Body() createDto: CreateMoodboardItemDto
  ) {
    createDto.projectId = projectId;
    return this.moodboardService.create(createDto);
  }

  @Get(":projectId")
  async findAll(
    @Param("projectId") projectId: string,
    @Query("favorite") favorite?: string,
    @Query("collectionId") collectionId?: string,
    @Query("source") source?: string
  ) {
    interface MoodboardFilters {
      favorite?: boolean;
      collectionId?: string;
      source?: string;
    }
    const filters: MoodboardFilters = {};

    if (favorite !== undefined) {
      filters.favorite = favorite === "true";
    }

    if (collectionId) {
      filters.collectionId = collectionId;
    }

    if (source) {
      filters.source = source;
    }

    return this.moodboardService.findAllByProject(projectId, filters);
  }

  @Get(":projectId/search")
  async search(
    @Param("projectId") projectId: string,
    @Query("q") query: string
  ) {
    return this.moodboardService.search(projectId, query);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateData: UpdateMoodboardItemDto
  ) {
    return this.moodboardService.update(id, updateData);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.moodboardService.remove(id);
  }

  // P0: Unsplash Integration
  @Post(":projectId/from-unsplash")
  async createFromUnsplash(
    @Param("projectId") projectId: string,
    @Body() dto: CreateFromUnsplashDto
  ) {
    dto.projectId = projectId;
    return this.moodboardService.createFromUnsplash(dto);
  }

  // P1: Favorites
  @Patch(":id/favorite")
  async toggleFavorite(
    @Param("id") id: string,
    @Body("isFavorite") isFavorite: boolean
  ) {
    return this.moodboardService.toggleFavorite(id, isFavorite);
  }

  @Get(":projectId/favorites")
  async getFavorites(@Param("projectId") projectId: string) {
    return this.moodboardService.findFavorites(projectId);
  }

  // P1: Collections
  @Post(":projectId/collections")
  async createCollection(
    @Param("projectId") projectId: string,
    @Body() dto: CreateCollectionDto
  ) {
    dto.projectId = projectId;
    return this.moodboardService.createCollection(dto);
  }

  @Get(":projectId/collections")
  async getCollections(@Param("projectId") projectId: string) {
    return this.moodboardService.findCollections(projectId);
  }

  @Patch(":itemId/collection/:collectionId")
  async addToCollection(
    @Param("itemId") itemId: string,
    @Param("collectionId") collectionId: string
  ) {
    return this.moodboardService.addToCollection(itemId, collectionId);
  }

  @Delete(":itemId/collection")
  async removeFromCollection(@Param("itemId") itemId: string) {
    return this.moodboardService.removeFromCollection(itemId);
  }

  @Delete("collections/:id")
  async deleteCollection(@Param("id") id: string) {
    return this.moodboardService.deleteCollection(id);
  }
}
