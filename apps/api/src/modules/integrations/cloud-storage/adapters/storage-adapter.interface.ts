
import { CloudFileDto } from '../dto/cloud-storage.dto.js';

export interface ICloudStorageAdapter {
  readonly providerId: string;

  /**
   * Checks if the user has valid credentials for this provider.
   */
  isConnected(userId: number): Promise<boolean>;

  /**
   * Generates the OAuth2 authorization URL for this provider.
   */
  getAuthUrl(userId: number): Promise<string>;

  /**
   * Lists files/folders from the provider.
   */
  listFiles(userId: number, folderId?: string, pageToken?: string): Promise<{ files: CloudFileDto[]; nextPageToken?: string }>;

  /**
   * Gets a download stream or URL for a specific file.
   */
  getDownloadUrl(userId: number, fileId: string): Promise<string>;
}
