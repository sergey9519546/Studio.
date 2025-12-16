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
import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

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
  private readonly nodeEnv: string;
  private readonly projectId: string | undefined;
  private isConfigured = false;
  private connectedEmail = "";
  private firebaseApp: App | null = null;
  private storage: Storage | null = null;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {
    const envBucket = this.configService.get("STORAGE_BUCKET");
    this.nodeEnv = this.configService.get("NODE_ENV") || "development";
    this.projectId =
      this.configService.get("GCP_PROJECT_ID") ||
      this.configService.get("GOOGLE_CLOUD_PROJECT");

    // Specific bucket configuration with fallback (production requires explicit value)
    const defaultFirebaseBucket = this.projectId
      ? `${this.projectId}.appspot.com`
      : "studio-roster-assets-main";
    this.bucketName = envBucket || defaultFirebaseBucket;

    if (!envBucket && this.nodeEnv === "production") {
      this.logger.error(
        "STORAGE_BUCKET is required in production. Set it via environment variable or Secret Manager."
      );
    }
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

  private initFirebaseApp(): App {
    if (this.firebaseApp) return this.firebaseApp;
    if (getApps().length) {
      this.firebaseApp = getApp();
      return this.firebaseApp;
    }

    const credentialsJson =
      this.configService.get<string>("GOOGLE_APPLICATION_CREDENTIALS_JSON") ||
      this.configService.get<string>("GCP_CREDENTIALS");
    const clientEmail =
      this.configService.get<string>("GCP_CLIENT_EMAIL") ||
      this.configService.get<string>("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey =
      this.configService.get<string>("GCP_PRIVATE_KEY") ||
      this.configService.get<string>("GOOGLE_SERVICE_PRIVATE_KEY");
    const keyFile = this.configService.get<string>(
      "GOOGLE_APPLICATION_CREDENTIALS"
    );

    let credential: ReturnType<typeof applicationDefault> =
      applicationDefault();

    try {
      if (credentialsJson) {
        const parsed = JSON.parse(credentialsJson) as Record<string, string>;
        const parsedProjectId =
          parsed.project_id || parsed.projectId || this.projectId;
        const parsedClientEmail =
          parsed.client_email || parsed.clientEmail || clientEmail;
        const parsedPrivateKey =
          parsed.private_key || parsed.privateKey || privateKey;
        if (parsedClientEmail && parsedPrivateKey) {
          credential = cert({
            projectId: parsedProjectId,
            clientEmail: parsedClientEmail,
            privateKey: parsedPrivateKey.replace(/\\n/g, "\n"),
          } as ServiceAccount);
          this.logger.log("Firebase Admin: using inline JSON credentials");
        } else {
          this.logger.warn(
            "Firebase Admin: inline JSON missing client_email/private_key, falling back to application default credentials"
          );
          credential = applicationDefault();
        }
      } else if (clientEmail && privateKey) {
        credential = cert({
          projectId: this.projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        } as ServiceAccount);
        this.logger.log("Firebase Admin: using client email/private key env vars");
      } else if (keyFile) {
        credential = cert(keyFile);
        this.logger.log(`Firebase Admin: using key file ${keyFile}`);
      } else {
        credential = applicationDefault();
        this.logger.warn("Firebase Admin: using application default credentials");
      }
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.warn(
        `Firebase Admin credential initialization failed, falling back to application default. Reason: ${error.message}`
      );
      credential = applicationDefault();
    }

    this.firebaseApp = initializeApp({
      credential,
      projectId: this.projectId,
      storageBucket: this.bucketName,
    });
    return this.firebaseApp;
  }

  private async initializeStorage() {
    try {
      const app = this.initFirebaseApp();
      this.storage = getStorage(app);

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
      projectId: this.projectId || "unknown",
    };
  }
}
