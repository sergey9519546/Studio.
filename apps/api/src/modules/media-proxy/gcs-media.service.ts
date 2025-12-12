/**
 * GCSMediaService
 * 
 * Service for handling media file storage in Google Cloud Storage
 * Used by the MediaProxyController for the Pages application
 * 
 * Leverages the existing StorageService infrastructure
 */

import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class GCSMediaService {
  private readonly logger = new Logger(GCSMediaService.name);

  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload file to GCS
   *
   * @param key - GCS object key (path/filename)
   * @param body - File buffer
   * @param contentType - MIME type
   * @returns GCS key of uploaded file with signed URL
   */
  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<{ key: string; signedUrl: string }> {
    try {
      this.logger.log(`Uploading file to GCS: ${key}`);

      // Upload to GCS using existing StorageService
      const result = await this.storageService.uploadObject({
        key,
        body,
        contentType,
        isPublic: false, // Pages media should be private with signed URLs
        metadata: {
          uploadedAt: new Date().toISOString(),
          source: "pages-editor",
        },
      });

      // Generate signed URL (1 hour expiry)
      const { url } = await this.getSignedUrl(key, 3600);

      this.logger.log(`File uploaded successfully: ${key}`);

      return {
        key: result.storageKey,
        signedUrl: url,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to upload file to GCS: ${err.message}`,
        err.stack
      );
      throw new Error(`GCS upload failed: ${err.message}`);
    }
  }

  /**
   * Generate signed URL for file access
   *
   * Creates a temporary URL that allows direct access to the GCS object
   * without requiring authentication. The URL expires after the specified time.
   *
   * @param key - GCS object key
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Signed URL with expiry timestamp
   */
  async getSignedUrl(
    key: string,
    expiresIn = 3600
  ): Promise<{
    url: string;
    expiresAt: string;
  }> {
    try {
      const url = await this.storageService.getSignedDownloadUrl(
        key,
        expiresIn
      );

      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

      this.logger.debug(`Generated signed URL for: ${key}`);
      return { url, expiresAt };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to generate signed URL: ${err.message}`,
        err.stack
      );
      throw new Error(`Failed to generate signed URL: ${err.message}`);
    }
  }

  /**
   * Batch generate signed URLs for multiple files
   *
   * Generates signed URLs for multiple files in parallel for better performance.
   * Useful for collection/list endpoints.
   *
   * @param keys - Array of GCS object keys
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Map of keys to signed URL data
   */
  async getSignedUrlsBatch(
    keys: string[],
    expiresIn = 3600
  ): Promise<Map<string, { url: string; expiresAt: string }>> {
    try {
      const urlPromises = keys.map(async (key) => {
        const result = await this.getSignedUrl(key, expiresIn);
        return [key, result] as const;
      });

      const results = await Promise.all(urlPromises);
      return new Map(results);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to generate batch signed URLs: ${err.message}`,
        err.stack
      );
      throw new Error(`Failed to generate batch signed URLs: ${err.message}`);
    }
  }

  /**
   * Delete file from GCS
   *
   * @param key - GCS object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.storageService.deleteObject(key);
      this.logger.log(`File deleted from GCS: ${key}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to delete file: ${err.message}`, err.stack);
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  }

  /**
   * Check if file exists in GCS
   *
   * Note: This is a basic implementation. For production, you might want
   * to add a method to StorageService to check file existence.
   *
   * @param key - GCS object key
   * @returns true if file exists (assumed), false if error
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      // Try to get signed URL - if it fails, file doesn't exist
      await this.getSignedUrl(key, 60);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage configuration info
   *
   * @returns Bucket name and configuration status
   */
  getStorageInfo() {
    return this.storageService.getStorageInfo();
  }

  /**
   * Helper: Get bucket prefix for Pages media
   *
   * Recommended structure:
   * - pages/media/{uuid}/{filename} - User uploaded media
   * - pages/avatars/{userId}.jpg - User avatars (for mentions)
   * - pages/templates/{templateId}/ - Page templates
   */
  getMediaPath(fileId: string, filename: string): string {
    return `pages/media/${fileId}/${filename}`;
  }

  getAvatarPath(userId: string, extension = "jpg"): string {
    return `pages/avatars/${userId}.${extension}`;
  }

  getTemplatePath(templateId: string, filename: string): string {
    return `pages/templates/${templateId}/${filename}`;
  }
}
