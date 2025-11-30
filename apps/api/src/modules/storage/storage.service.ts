
import { 
  Injectable, 
  Logger, 
  InternalServerErrorException, 
  OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Buffer } from 'buffer';
import { Readable } from 'stream';

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
  UPLOADED: 'storage.object.uploaded',
  DELETED: 'storage.object.deleted',
  ERROR: 'storage.operation.error',
};

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private storage: any;
  private bucket: any;
  private readonly bucketName: string;
  private isConfigured = false;
  private connectedEmail = '';

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {
    // Specific bucket configuration with fallback
    this.bucketName = this.configService.get('STORAGE_BUCKET') || 'studio-roster-assets-main';
  }

  async onModuleInit() {
    await this.initializeStorage();

    if (this.isConfigured) {
        this.logger.log(`StorageService: Online (Bucket: ${this.bucketName})`);
        if (this.connectedEmail) {
            this.logger.log(`Storage Identity: ${this.connectedEmail}`);
        }
        // Async verification without blocking boot
        this.verifyConnection().catch(e => this.logger.warn(`Lazy connection verify failed: ${e.message}`));
    } else {
        this.logger.warn('StorageService is NOT configured. Uploads will FAIL.');
    }
  }

  private async initializeStorage() {
    try {
        // Dynamic import to prevent crash if module is missing or fails to load bindings
        const { Storage } = await import('@google-cloud/storage');

        const storageConfig: any = {
          projectId: this.configService.get('GCP_PROJECT_ID') || this.configService.get('GOOGLE_CLOUD_PROJECT'),
          retryOptions: {
            autoRetry: true,
            retryDelayMultiplier: 2,
            totalTimeout: 600, // Increased to 600s (10 min) for large files
            maxRetryDelay: 60,
            maxRetries: 3,
          },
        };

        let method = 'None';

        // Strategy 1: Full JSON string in GCP_CREDENTIALS
        const credentialsJson = this.configService.get('GCP_CREDENTIALS');
        if (credentialsJson) {
          try {
            const parsed = JSON.parse(credentialsJson);
            storageConfig.credentials = parsed;
            this.connectedEmail = parsed.client_email;
            method = 'GCP_CREDENTIALS (JSON)';
          } catch (e) {
            this.logger.warn('Failed to parse GCP_CREDENTIALS JSON. Falling back to individual vars.');
          }
        } 
        
        // Strategy 2: Individual Vars
        if (!storageConfig.credentials) {
            const clientEmail = this.configService.get('GCP_CLIENT_EMAIL');
            const privateKey = this.configService.get('GCP_PRIVATE_KEY');
            
            if (clientEmail && privateKey) {
                // Robust newline handling: replaces literal \n or \\n with actual newlines
                // This fixes the most common "PEM routine" error
                const formattedKey = privateKey.replace(/\\n/g, '\n');
                
                storageConfig.credentials = {
                    client_email: clientEmail,
                    private_key: formattedKey,
                };
                this.connectedEmail = clientEmail;
                method = 'ENV VARS (Client Email + Private Key)';
            }
        }

        if (!storageConfig.credentials && !storageConfig.keyFilename) {
           const keyFile = this.configService.get('GOOGLE_APPLICATION_CREDENTIALS');
           if (keyFile) {
             storageConfig.keyFilename = keyFile;
             method = 'GOOGLE_APPLICATION_CREDENTIALS (File Path)';
           }
        }

        this.storage = new Storage(storageConfig);
        this.bucket = this.storage.bucket(this.bucketName);
        
        // Basic check to see if we actually have credentials
        if (storageConfig.credentials || storageConfig.keyFilename) {
            this.isConfigured = true;
            this.logger.log(`Storage Credential Strategy: ${method}`);
        } else {
            this.logger.warn('No valid GCP credentials found (JSON, Env Vars, or Keyfile).');
        }
    } catch (e: any) {
        this.logger.warn(`StorageService initialization failed. Reason: ${e.message}`);
        this.isConfigured = false;
    }
  }

  private async verifyConnection() {
    if (!this.bucket) return;
    try {
      const [exists] = await this.bucket.exists();
      if (!exists) {
        this.logger.warn(`Bucket '${this.bucketName}' does not exist. Check your GCP Project permissions.`);
      } else {
        this.logger.log(`Bucket '${this.bucketName}' connected successfully.`);
      }
    } catch (e: any) {
      if (e.code === 403) {
         this.logger.error(`Permission Denied accessing bucket '${this.bucketName}'. Check Service Account Roles (Storage Admin / Storage Object Admin).`);
      } else {
         this.logger.warn(`GCS Connectivity Check: ${e.message}`);
      }
    }
  }

  private sanitizeKey(key: string): string {
    return key.replace(/\\/g, '/').replace(/^\/+/, '');
  }

  async uploadObject(params: UploadOptions): Promise<StoredObject> {
    const safeKey = this.sanitizeKey(params.key);

    if (!this.isConfigured) {
        throw new InternalServerErrorException('Cloud Storage is not configured. Upload rejected.');
    }

    const file = this.bucket.file(safeKey);

    try {
      const stream = file.createWriteStream({
        metadata: {
          contentType: params.contentType,
          metadata: params.metadata,
          // Increased cache size: 2 years + immutable for optimal edge caching
          cacheControl: 'public, max-age=63072000, immutable',
        },
        resumable: false, 
        validation: false,
      });

      await new Promise((resolve, reject) => {
        if (Buffer.isBuffer(params.body)) {
          stream.end(params.body);
        } else if (params.body instanceof Readable) {
          params.body.pipe(stream);
        } else {
          reject(new Error('Invalid body format'));
        }

        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      let publicUrl: string | undefined = undefined;
      let signedUrl: string | undefined = undefined;

      // Handle Public Access
      if (params.isPublic) {
        try {
            await file.makePublic();
            publicUrl = `https://storage.googleapis.com/${this.bucketName}/${safeKey}`;
        } catch (e: any) {
            // Check for UBLA (Uniform Bucket Level Access) error
            if (e.code === 409 || e.code === 400) {
               this.logger.debug(`Bucket enforces Uniform Bucket Level Access. Cannot use ACLs. Falling back to Signed URL.`);
            } else {
               this.logger.warn(`Could not make object public: ${e.message}`);
            }
            
            // Fallback: Generate a long-lived signed URL immediately so the frontend has something to show
            // Max duration for V4 signed URL is 7 days (604800 seconds)
            signedUrl = await this.getSignedDownloadUrl(safeKey, 604800);
        }
      }

      this.eventEmitter.emit(STORAGE_EVENTS.UPLOADED, { key: safeKey, traceId: params.traceId });
      this.logger.log(`Object Uploaded: ${safeKey}`);

      return {
        storageKey: safeKey,
        mimeType: params.contentType,
        publicUrl,
        signedUrl,
        sizeBytes: Buffer.isBuffer(params.body) ? params.body.length : undefined
      };

    } catch (error: any) {
      this.logger.error(`GCS Upload Failed [${safeKey}]: ${error.message}`);
      this.eventEmitter.emit(STORAGE_EVENTS.ERROR, { operation: 'upload', key: safeKey, error: error.message });
      throw new InternalServerErrorException('Cloud storage upload failed');
    }
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    if (!this.isConfigured) throw new InternalServerErrorException('Storage not configured');
    
    const safeKey = this.sanitizeKey(key);
    
    try {
      const [url] = await this.bucket.file(safeKey).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresInSeconds * 1000,
      });
      return url;
    } catch (error: any) {
      this.logger.error(`GCS Sign URL Failed [${safeKey}]: ${error.message}`);
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!this.isConfigured) return;

    const safeKey = this.sanitizeKey(key);
    try {
      await this.bucket.file(safeKey).delete();
      this.eventEmitter.emit(STORAGE_EVENTS.DELETED, { key: safeKey });
      this.logger.log(`Deleted GCS Object: ${safeKey}`);
    } catch (error: any) {
      if (error.code !== 404) {
        this.logger.warn(`Delete failed: ${error.message}`);
      }
    }
  }

  getStorageInfo() {
    return {
      bucket: this.bucketName,
      configured: this.isConfigured,
      identity: this.connectedEmail || 'unknown',
      projectId: this.configService.get('GCP_PROJECT_ID') || this.configService.get('GOOGLE_CLOUD_PROJECT') || 'unknown'
    };
  }
}
