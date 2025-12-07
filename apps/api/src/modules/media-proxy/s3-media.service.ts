/**
 * S3MediaService
 * 
 * Service for handling file storage in AWS S3
 * Used by the MediaProxyController to store/retrieve files
 * 
 * This abstracts S3 operations and provides pre-signed URL generation
 * for secure, time-limited access to media files.
 */

import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class S3MediaService {
  private readonly logger = new Logger(S3MediaService.name);
  private s3Client: S3Client;
  private readonly bucket: string;

  constructor() {
    // Initialize S3 Client
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.bucket = process.env.S3_BUCKET || 'studio-roster-pages-media';
    
    this.logger.log(`S3MediaService initialized with bucket: ${this.bucket}`);
  }

  /**
   * Upload file to S3
   * 
   * @param key - S3 object key (path/filename)
   * @param body - File buffer
   * @param contentType - MIME type
   * @returns S3 key of uploaded file
   */
  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        // Optional: Add metadata
        Metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);
      
      this.logger.log(`File uploaded successfully: ${key}`);
      return key;
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${error.message}`, error.stack);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Generate pre-signed URL for file access
   * 
   * This creates a temporary URL that allows direct access to the S3 object
   * without requiring AWS credentials. The URL expires after the specified time.
   * 
   * @param key - S3 object key
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Pre-signed URL
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      
      this.logger.debug(`Generated pre-signed URL for: ${key}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Check if file exists in S3
   * 
   * @param key - S3 object key
   * @returns true if file exists, false otherwise
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata from S3
   * 
   * @param key - S3 object key
   * @returns Metadata object with size, content type, etc.
   */
  async getFileMetadata(key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
  } | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      
      return {
        size: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        lastModified: response.LastModified || new Date(),
      };
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return null;
      }
      throw error;
    }
  }
}
