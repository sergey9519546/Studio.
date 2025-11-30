
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICloudStorageAdapter } from './storage-adapter.interface';
import { CloudFileDto, CloudFileType, CloudProviderType } from '../dto/cloud-storage.dto';
import { GoogleClientFactory } from '../../../google/google-client.factory';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GoogleDriveAdapter implements ICloudStorageAdapter {
  private readonly logger = new Logger(GoogleDriveAdapter.name);
  readonly providerId = CloudProviderType.GOOGLE_DRIVE;

  constructor(
    private readonly clientFactory: GoogleClientFactory,
    private readonly prisma: PrismaService
  ) { }

  private async getUserWithCredentials(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        googleAccessToken: true,
        googleRefreshToken: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      googleCredentials: {
        accessToken: user.googleAccessToken,
        refreshToken: user.googleRefreshToken
      }
    };
  }

  async isConnected(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserWithCredentials(userId);
      return !!user?.googleCredentials?.refreshToken;
    } catch (e) {
      return false;
    }
  }

  async getAuthUrl(userId: string): Promise<string> {
    return `/auth/google/connect?userId=${userId}`;
  }

  async listFiles(userId: string, folderId = 'root'): Promise<{ files: CloudFileDto[]; nextPageToken?: string }> {
    try {
      const user = await this.getUserWithCredentials(userId);
      const { drive } = this.clientFactory.createDriveClientForUser(user as any);

      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'nextPageToken, files(id, name, mimeType, size, thumbnailLink, webViewLink, modifiedTime)',
        pageSize: 20,
      });

      const files = (res.data.files || []).map(f => ({
        id: f.id!,
        name: f.name!,
        provider: CloudProviderType.GOOGLE_DRIVE,
        type: f.mimeType === 'application/vnd.google-apps.folder' ? CloudFileType.FOLDER : CloudFileType.FILE,
        mimeType: f.mimeType!,
        sizeBytes: f.size ? parseInt(f.size) : undefined,
        thumbnailUrl: f.thumbnailLink || undefined,
        webViewUrl: f.webViewLink || undefined,
        updatedAt: f.modifiedTime || new Date().toISOString()
      }));

      return { files, nextPageToken: res.data.nextPageToken || undefined };
    } catch (e: any) {
      this.logger.error(`Drive List Failed: ${e.message}`);
      // Return empty if credentials invalid or other error
      return { files: [] };
    }
  }

  async getDownloadUrl(userId: string, fileId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }
}
