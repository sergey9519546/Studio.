import { Injectable, Logger } from '@nestjs/common';
import { GoogleClientFactory } from './google-client.factory.js';

/**
 * Google Drive file DTO representing file metadata
 */
export interface DriveFileDTO {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string | null;
  webViewLink?: string | null;
  iconLink?: string | null;
  modifiedTime?: string | null;
  size?: string | null;
}

/**
 * Google Drive API file response structure
 */
interface GoogleDriveFile {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
  thumbnailLink?: string | null;
  webViewLink?: string | null;
  iconLink?: string | null;
  modifiedTime?: string | null;
  size?: string | null;
}

/**
 * Google Drive API list response
 */
interface GoogleDriveListResponse {
  data?: {
    files?: GoogleDriveFile[];
    nextPageToken?: string | null;
  };
}

/**
 * Drive client interface for type safety
 */
interface DriveClient {
  files: {
    list: (params: {
      q: string;
      fields: string;
      pageSize: number;
      orderBy: string;
    }) => Promise<GoogleDriveListResponse>;
  };
}

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);
  private readonly TEAM_FOLDER_ID = process.env.GOOGLE_TEAM_FOLDER_ID;

  constructor(private readonly clientFactory: GoogleClientFactory) {}

  /**
   * List all team assets from the configured Google Drive folder
   * @returns Array of drive files with metadata
   */
  async listTeamAssets(): Promise<DriveFileDTO[]> {
    if (!this.TEAM_FOLDER_ID) {
      this.logger.warn('GOOGLE_TEAM_FOLDER_ID is not set. Returning empty asset list.');
      return [];
    }

    try {
      const driveClient = this.clientFactory.createDriveClient() as unknown as DriveClient;

      const response = await driveClient.files.list({
        q: `'${this.TEAM_FOLDER_ID}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, iconLink, modifiedTime, size)',
        pageSize: 100,
        orderBy: 'folder, modifiedTime desc',
      });

      if (!response.data || !response.data.files) {
        return [];
      }

      return response.data.files
        .map((file: GoogleDriveFile): DriveFileDTO => ({
          id: file.id || '',
          name: file.name || 'Untitled',
          mimeType: file.mimeType || 'application/octet-stream',
          thumbnailLink: file.thumbnailLink ?? undefined,
          webViewLink: file.webViewLink ?? undefined,
          iconLink: file.iconLink ?? undefined,
          modifiedTime: file.modifiedTime ?? undefined,
          size: file.size ?? undefined,
        }))
        .filter((f: DriveFileDTO) => f.id !== '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Drive error';
      this.logger.error(`Failed to list team assets: ${message}`);
      return [];
    }
  }

  /**
   * Get a specific file by ID
   * @param fileId The Google Drive file ID
   * @returns File metadata or null if not found
   */
  async getFile(fileId: string): Promise<DriveFileDTO | null> {
    try {
      const assets = await this.listTeamAssets();
      return assets.find(asset => asset.id === fileId) || null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get file ${fileId}: ${message}`);
      return null;
    }
  }

  /**
   * Search for files by name
   * @param query Search query string
   * @returns Matching files
   */
  async searchFiles(query: string): Promise<DriveFileDTO[]> {
    try {
      const assets = await this.listTeamAssets();
      const lowerQuery = query.toLowerCase();
      return assets.filter(asset => 
        asset.name.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to search files: ${message}`);
      return [];
    }
  }
}
