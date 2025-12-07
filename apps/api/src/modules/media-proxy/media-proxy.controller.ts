/**
 * MediaProxyController
 * 
 * "Shadow Proxy" Architecture Implementation
 * 
 * This controller mimics the Atlassian Media API ("Stargate") endpoints
 * but stores files in our custom S3 infrastructure instead.
 * 
 * The MediaClient in the frontend is configured with baseUrl='/api/v1/media-proxy'
 * which redirects all media requests here instead of to Atlassian's servers.
 * 
 * Critical endpoints (per architectural document):
 * 1. POST /file/binary - Upload file
 * 2. GET /file/:id - Get file metadata with pre-signed URL
 * 3. GET /collection/:name/items - Browse uploaded files (optional)
 */

import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../../prisma/prisma.service";
import { GCSMediaService } from "./gcs-media.service";
import { MediaErrors } from "./media-proxy.errors";

@Controller({ path: "media-proxy", version: "1" })
export class MediaProxyController {
  private readonly logger = new Logger(MediaProxyController.name);

  constructor(
    private readonly gcsService: GCSMediaService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Endpoint 1: Upload Binary File
   * POST /v1/media-proxy/file/binary
   *
   * Mimics: POST https://api.media.atlassian.com/file/binary
   *
   * Process:
   * 1. Receive file from MediaClient
   * 2. Generate UUID for file
   * 3. Upload to S3
   * 4. Store metadata in database
   * 5. Return MOCKED Stargate response with processingStatus='succeeded'
   */
  @Post("file/binary")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`File upload initiated: ${file.originalname}`);

    try {
      // File validation
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "video/mp4",
        "video/webm",
        "application/pdf",
      ];

      if (file.size > MAX_FILE_SIZE) {
        throw MediaErrors.fileTooLarge(file.size, MAX_FILE_SIZE);
      }

      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw MediaErrors.invalidType(file.mimetype, ALLOWED_TYPES);
      }

      // Generate unique file ID
      const fileId = uuidv4();

      // Determine media type from MIME type
      const mediaType = this.getMediaType(file.mimetype);

      // Generate GCS key using helper method
      const gcsKey = this.gcsService.getMediaPath(fileId, file.originalname);

      // Upload to Google Cloud Storage
      const uploadResult = await this.gcsService.uploadFile(
        gcsKey,
        file.buffer,
        file.mimetype
      );

      // Store metadata in database
      await this.prisma.pageMedia.create({
        data: {
          id: fileId,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          s3Key: uploadResult.key,
          mediaType: mediaType,
          uploadedBy: "public", // Public access - no auth required
        },
      });

      // Return MOCKED Stargate response
      return {
        data: {
          id: fileId,
          processingStatus: "succeeded",
          mediaType: mediaType,
          mimeType: file.mimetype,
          name: file.originalname,
          size: file.size,
          artifacts: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`File upload failed: ${err.message}`, err.stack);

      // Re-throw media errors as-is, wrap others
      if (err.name === "MediaProxyError") {
        throw err;
      }
      throw MediaErrors.uploadFailed(err);
    }
  }

  /**
   * Endpoint 2: Get File Metadata
   * GET /v1/media-proxy/file/:id
   *
   * Mimics: GET https://api.media.atlassian.com/file/{fileId}
   *
   * Process:
   * 1. Look up file metadata from database
   * 2. Generate pre-signed S3 URL (1 hour expiry)
   * 3. Return response with URL in 'artifacts' field
   */
  @Get("file/:id")
  async getFile(@Param("id") id: string) {
    this.logger.log(`Fetching file metadata: ${id}`);

    try {
      // Look up file in database
      const media = await this.prisma.pageMedia.findUnique({
        where: { id },
      });

      if (!media) {
        throw new NotFoundException(`File not found: ${id}`);
      }

      // Generate pre-signed GCS URL for file access (1 hour expiry)
      const signedUrl = await this.gcsService.getSignedUrl(media.s3Key, 3600);

      // Return MOCKED Stargate response
      // The MediaClient expects the URL in the 'artifacts' field
      return {
        data: {
          id: media.id,
          processingStatus: "succeeded",
          mediaType: media.mediaType,
          mimeType: media.mimeType,
          name: media.filename,
          size: media.size,
          createdAt: media.createdAt.toISOString(),
          // Artifacts: URLs for different representations
          artifacts: {
            // Primary artifact - the actual file
            [`${media.mediaType}.${this.getExtension(media.mimeType)}`]: {
              url: signedUrl,
              processingStatus: "succeeded",
            },
          },
          // Additional representation fields MediaClient might expect
          representations: {
            image: signedUrl, // For images
          },
        },
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to fetch file: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Endpoint 3: Get Collection Items (Optional)
   * GET /v1/media-proxy/collection/:name/items
   *
   * Mimics: GET https://api.media.atlassian.com/collection/{collectionId}/items
   *
   * Used by Media Picker to show a grid of previously uploaded files.
   * Optional - only needed if you want the "Browse" feature in slash commands.
   */
  @Get("collection/:name/items")
  async getCollection(
    @Param("name") collectionName: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 50,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0
  ) {
    this.logger.log(`Fetching collection: ${collectionName}`);

    try {
      const safeLimit = Math.min(limit, 100); // Enforce max 100

      // Fetch media and total count in parallel
      const [media, total] = await Promise.all([
        this.prisma.pageMedia.findMany({
          take: safeLimit,
          skip: offset,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.pageMedia.count(),
      ]);

      // Batch generate signed URLs for performance
      const keys = media.map((m) => m.s3Key);
      const urlMap = await this.gcsService.getSignedUrlsBatch(keys, 3600);

      // Transform to collection format
      const items = media.map((m) => {
        const urlData = urlMap.get(m.s3Key);
        return {
          id: m.id,
          type: "file" as const,
          details: {
            name: m.filename,
            size: m.size,
            mediaType: m.mediaType,
            mimeType: m.mimeType,
            artifacts: {
              [`${m.mediaType}.${this.getExtension(m.mimeType)}`]: {
                url: urlData?.url,
                expiresAt: urlData?.expiresAt,
              },
            },
          },
        };
      });

      return {
        data: {
          contents: items,
          pagination: {
            limit: safeLimit,
            offset,
            total,
            hasMore: offset + safeLimit < total,
          },
        },
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch collection: ${err.message}`,
        err.stack
      );
      throw MediaErrors.storageError("fetch collection", err);
    }
  }

  /**
   * Helper: Determine media type from MIME type
   */
  private getMediaType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "doc";
    return "unknown";
  }

  /**
   * Helper: Get file extension from MIME type
   */
  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "application/pdf": "pdf",
    };
    return map[mimeType] || "bin";
  }
}
