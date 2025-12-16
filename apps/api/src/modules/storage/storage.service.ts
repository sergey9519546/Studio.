// Storage service - Google Cloud Storage implementation
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
import { Storage, type UploadOptions as GcsUploadOptions } from "@google-cloud/storage";

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
  private storage: Storage | null = null;

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
    const credentialsJson = this.configService.get<string>("GOOGLE_APPLICATION_CREDENTIALS_JSON");
    try {
      if (credentialsJson) {
        const credentials = JSON.parse(credentialsJson);
        this.storage = new Storage({ credentials });
      } else {
        this.storage = new Storage();
      }

      const bucket = this.storage.bucket(this.bucketName);
      await bucket.getMetadata();

      const [serviceAccount] = await this.storage.getServiceAccount();
      this.connectedEmail = serviceAccount?.email || "";

      this.isConfigured = true;
      this.logger.log(`StorageService: Connected to bucket ${this.bucketName}`);
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.warn(
        `StorageService initialization failed. Reason: ${error.message}`
      );
      this.isConfigured = false;
    }
  }

  private async verifyConnection() {
    if (!this.storage) return;
    try {
      const bucket = this.storage.bucket(this.bucketName);
      await bucket.getMetadata();
      this.logger.log(`Bucket '${this.bucketName}' verified successfully`);
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
      const bucket = this.storage!.bucket(this.bucketName);
      const file = bucket.file(safeKey);

      const uploadOpts: GcsUploadOptions = {
        contentType: params.contentType,
        gzip: false,
        metadata: params.metadata ? { metadata: params.metadata } : undefined,
        resumable: false,
        predefinedAcl: params.isPublic ? "publicRead" : undefined,
      };

      // Use save for buffers; createWriteStream for streams
      if (Buffer.isBuffer(params.body)) {
        await file.save(params.body, uploadOpts);
      } else {
        await new Promise<void>((resolve, reject) => {
          const stream = params.body.pipe(file.createWriteStream(uploadOpts));
          stream.on("finish", () => resolve());
          stream.on("error", reject);
        });
      }

      const publicUrl = params.isPublic ? `https://storage.googleapis.com/${this.bucketName}/${safeKey}` : undefined;
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1h
      });

      this.eventEmitter.emit(STORAGE_EVENTS.UPLOADED, {
        key: safeKey,
        traceId: params.traceId,
      });
      this.logger.log(`Object Uploaded: ${safeKey}`);

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
    _expiresInSeconds = 3600
  ): Promise<string> {
    if (!this.isConfigured)
      throw new InternalServerErrorException("Storage not configured");

    const safeKey = this.sanitizeKey(key);

    try {
      const bucket = this.storage!.bucket(this.bucketName);
      const file = bucket.file(safeKey);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + _expiresInSeconds * 1000,
      });
      return url;
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
      const bucket = this.storage!.bucket(this.bucketName);
      const file = bucket.file(safeKey);
      await file.delete({ ignoreNotFound: true });
      this.eventEmitter.emit(STORAGE_EVENTS.DELETED, { key: safeKey });
      this.logger.log(`Deleted GCS Object: ${safeKey}`);
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
