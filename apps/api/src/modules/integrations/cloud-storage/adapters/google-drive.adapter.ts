import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthenticatedUser, GoogleClientFactory } from '../../../google/google-client.factory';
import { CloudFileDto, CloudFileType, CloudProviderType } from '../dto/cloud-storage.dto';
import { ICloudStorageAdapter } from './storage-adapter.interface';

@Injectable()
export class GoogleDriveAdapter implements ICloudStorageAdapter {
  private readonly logger = new Logger(GoogleDriveAdapter.name);
  readonly providerId = CloudProviderType.GOOGLE_DRIVE;

  constructor(
    private readonly clientFactory: GoogleClientFactory,
    private readonly prisma: PrismaService
  ) { }

  private async getUserWithCredentials(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      id: user.id.toString(),
      email: user.email,
      googleCredentials: {
        accessToken: user.googleAccessToken || undefined,
        refreshToken: user.googleRefreshToken || undefined
      }
    };
  }

  async isConnected(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserWithCredentials(userId);
      return !!user?.googleCredentials?.refreshToken;
    } catch {
      return false;
    }
  }

  async getAuthUrl(userId: string): Promise<string> {
    return `/auth/google/connect?userId=${userId}`;
  }

  async listFiles(userId: string, folderId = 'root'): Promise<{ files: CloudFileDto[]; nextPageToken?: string }> {
    const user: AuthenticatedUser = await this.getUserWithCredentials(userId);
    const { drive } = this.clientFactory.createDriveClientForUser(user);

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, size, thumbnailLink, webViewLink, modifiedTime)',
      pageSize: 20,
    });

    const files = (res.data.files ?? []).map((f) => ({
      id: f.id ?? '',
      name: f.name ?? '',
      provider: CloudProviderType.GOOGLE_DRIVE,
      type: f.mimeType === 'application/vnd.google-apps.folder' ? CloudFileType.FOLDER : CloudFileType.FILE,
      mimeType: f.mimeType ?? '',
      sizeBytes: f.size ? parseInt(f.size, 10) : undefined,
      thumbnailUrl: f.thumbnailLink ?? undefined,
      webViewUrl: f.webViewLink ?? undefined,
      updatedAt: f.modifiedTime || new Date().toISOString()
    }));

    return { files, nextPageToken: res.data.nextPageToken || undefined };
  }

  async getDownloadUrl(userId: string, fileId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }
}
