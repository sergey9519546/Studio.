// Storage service - mock implementation without Google Cloud dependencies
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Buffer } from "buffer";
import { Readable } from "stream";

export interface StoredObject {
  storageKey: string;
  publicUrl?: string;
  signedUrl?: string; // Fallback for UBLA buckets
  mimeType: string;
  sizeBytes?: number;
}

export interface UploadOptions {
  key: string;
  body: Buffer | Readable;
  contentType: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
  traceId?: string;
}

export const STORAGE_EVENTS = {
  UPLOADED: "storage.object.uploaded",
  DELETED: "storage.object.deleted",
  ERROR: "storage.operation.error",
};

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucketName: string;
  private isConfigured = false;
  private connectedEmail = "";

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {
    // Specific bucket configuration with fallback
    this.bucketName =
      this.configService.get("STORAGE_BUCKET") || "studio-roster-assets-main";
  }

  async onModuleInit() {
    await this.initializeStorage();

    if (this.isConfigured) {
      this.logger.log(`StorageService: Online (Bucket: ${this.bucketName})`);
      if (this.connectedEmail) {
        this.logger.log(`Storage Identity: ${this.connectedEmail}`);
      }
      // Async verification without blocking boot
      this.verifyConnection().catch((e) =>
        this.logger.warn(`Lazy connection verify failed: ${e.message}`)
      );
    } else {
      this.logger.warn("StorageService is NOT configured. Uploads will FAIL.");
    }
  }

  private async initializeStorage() {
    try {
      // Storage service initialized in mock mode - no Google Cloud dependencies
      this.isConfigured = true;
      this.logger.log(`StorageService initialized in mock mode (Bucket: ${this.bucketName})`);
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.warn(
        `StorageService initialization failed. Reason: ${error.message}`
      );
      this.isConfigured = false;
    }
  }

  private async verifyConnection() {
    try {
      this.logger.log(`Bucket '${this.bucketName}' - Connection check skipped (Google Cloud dependency commented)`);
    } catch (e: unknown) {
      const error = e as { code?: number; message: string };
      if (error.code === 403) {
        this.logger.error(
          `Permission Denied accessing bucket '${this.bucketName}'. Check Service Account Roles (Storage Admin / Storage Object Admin).`
        );
      } else {
        this.logger.warn(`GCS Connectivity Check: ${error.message}`);
      }
    }
  }

  private sanitizeKey(key: string): string {
    return key.replace(/\\/g, "/").replace(/^\/+/, "");
  }

  async uploadObject(params: UploadOptions): Promise<StoredObject> {
    const safeKey = this.sanitizeKey(params.key);

    if (!this.isConfigured) {
      throw new InternalServerErrorException(
        "Cloud Storage is not configured. Upload rejected."
      );
    }

    try {
      const publicUrl: string | undefined = undefined;
      const signedUrl: string | undefined = undefined;

      // Handle Public Access
      if (params.isPublic) {
        this.logger.warn(`File upload simulated (Google Cloud dependency commented). Key: ${safeKey}`);
      }

      this.eventEmitter.emit(STORAGE_EVENTS.UPLOADED, {
        key: safeKey,
        traceId: params.traceId,
      });
      this.logger.log(`Object Uploaded (simulated): ${safeKey}`);

      return {
        storageKey: safeKey,
        mimeType: params.contentType,
        publicUrl,
        signedUrl,
        sizeBytes: Buffer.isBuffer(params.body)
          ? params.body.length
          : undefined,
      };
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error(`GCS Upload Failed [${safeKey}]:`, error);

      // Specific check for the common "Service Account Token Creator" missing role
      if (err.message?.includes("iam.serviceAccounts.signBlob")) {
        this.logger.error(
          `CRITICAL PERMISSION ERROR: Service Account missing 'roles/iam.serviceAccountTokenCreator'. Cannot sign URLs.`
        );
      }

      this.logger.error(`GCS Upload Failed [${safeKey}]: ${err.message}`);
      this.eventEmitter.emit(STORAGE_EVENTS.ERROR, {
        operation: "upload",
        key: safeKey,
        error: err.message,
      });
      throw new InternalServerErrorException(
        `Cloud storage upload failed: ${err.message}`
      );
    }
  }

  async getSignedDownloadUrl(
    key: string,
    expiresInSeconds = 3600
  ): Promise<string> {
    if (!this.isConfigured)
      throw new InternalServerErrorException("Storage not configured");

    const safeKey = this.sanitizeKey(key);

    try {
      this.logger.warn(`Signed URL generation simulated for key: ${safeKey}`);
      return `https://storage.googleapis.com/${this.bucketName}/${safeKey}`;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`GCS Sign URL Failed [${safeKey}]: ${err.message}`);
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!this.isConfigured) return;

    const safeKey = this.sanitizeKey(key);
    try {
      this.eventEmitter.emit(STORAGE_EVENTS.DELETED, { key: safeKey });
      this.logger.log(`Deleted GCS Object (simulated): ${safeKey}`);
    } catch (error: unknown) {
      const err = error as { code?: number; message: string };
      if (err.code !== 404) {
        this.logger.warn(`Delete failed: ${err.message}`);
      }
    }
  }

  getStorageInfo() {
    return {
      bucket: this.bucketName,
      configured: this.isConfigured,
      identity: this.connectedEmail || "unknown",
      projectId:
        this.configService.get("GCP_PROJECT_ID") ||
        this.configService.get("GOOGLE_CLOUD_PROJECT") ||
        "unknown",
    };
  }
}
