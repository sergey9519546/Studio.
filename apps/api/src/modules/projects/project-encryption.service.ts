import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  keyId: string;
  algorithm: string;
}

export interface DecryptionResult {
  decryptedData: string;
  keyId: string;
}

@Injectable()
export class ProjectEncryptionService {
  private readonly logger = new Logger(ProjectEncryptionService.name);
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16;
  private readonly AUTH_TAG_LENGTH = 16;

  // In-memory key cache (in production, use HSM or secure key vault)
  private keyCache: Map<string, Buffer> = new Map();

  constructor(private prisma: PrismaService) {}

  /**
   * Encrypt content for a specific project
   */
  async encrypt(projectId: string, plaintext: string): Promise<EncryptionResult> {
    const key = await this.getOrCreateProjectKey(projectId);
    const iv = crypto.randomBytes(this.IV_LENGTH);

    const cipher = crypto.createCipheriv(this.ALGORITHM, key.buffer, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    // Combine encrypted data and auth tag
    const combined = Buffer.concat([
      Buffer.from(encrypted, 'base64'),
      authTag,
    ]).toString('base64');

    return {
      encryptedData: combined,
      iv: iv.toString('base64'),
      keyId: key.keyId,
      algorithm: this.ALGORITHM,
    };
  }

  /**
   * Decrypt content for a specific project
   */
  async decrypt(
    projectId: string,
    encryptedData: string,
    iv: string,
    keyId: string
  ): Promise<DecryptionResult> {
    const key = await this.getProjectKey(projectId, keyId);
    const ivBuffer = Buffer.from(iv, 'base64');

    // Split encrypted data and auth tag
    const combined = Buffer.from(encryptedData, 'base64');
    const authTag = combined.slice(-this.AUTH_TAG_LENGTH);
    const encrypted = combined.slice(0, -this.AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return {
      decryptedData: decrypted,
      keyId,
    };
  }

  /**
   * Encrypt sensitive fields in an object
   */
  async encryptFields(
    projectId: string,
    data: Record<string, unknown>,
    fieldsToEncrypt: string[]
  ): Promise<{
    encryptedData: Record<string, unknown>;
    encryptionMetadata: Record<string, EncryptionResult>;
  }> {
    const encryptedData = { ...data };
    const encryptionMetadata: Record<string, EncryptionResult> = {};

    for (const field of fieldsToEncrypt) {
      if (data[field] && typeof data[field] === 'string') {
        const result = await this.encrypt(projectId, data[field]);
        encryptedData[field] = result.encryptedData;
        encryptionMetadata[field] = result;
      }
    }

    return { encryptedData, encryptionMetadata };
  }

  /**
   * Decrypt sensitive fields in an object
   */
  async decryptFields(
    projectId: string,
    data: Record<string, unknown>,
    encryptionMetadata: Record<string, EncryptionResult>
  ): Promise<Record<string, unknown>> {
    const decryptedData = { ...data };

    for (const [field, metadata] of Object.entries(encryptionMetadata)) {
      if (data[field]) {
        const result = await this.decrypt(
          projectId,
          data[field] as string,
          metadata.iv,
          metadata.keyId
        );
        decryptedData[field] = result.decryptedData;
      }
    }

    return decryptedData;
  }

  /**
   * Generate a new encryption key for a project
   */
  async rotateProjectKey(projectId: string): Promise<string> {
    const newKey = crypto.randomBytes(this.KEY_LENGTH);
    const newKeyId = this.generateKeyId();

    // Store new key (in production, use HSM or key vault)
    await this.storeProjectKey(projectId, newKeyId, newKey);

    // Update project with new key ID
    await this.prisma.project.update({
      where: { id: projectId },
      data: { encryptionKeyId: newKeyId },
    });

    // Cache the new key
    this.keyCache.set(`${projectId}:${newKeyId}`, newKey);

    this.logger.log(`Rotated encryption key for project ${projectId}`);
    return newKeyId;
  }

  /**
   * Re-encrypt all content with new key after rotation
   */
  async reencryptProjectContent(projectId: string, _oldKeyId: string): Promise<number> {
    let reencryptedCount = 0;

    // Get all knowledge sources with encryption
    const knowledgeSources = await this.prisma.knowledgeSource.findMany({
      where: {
        projectId,
        encryptionStatus: { not: 'unencrypted' },
      },
    });

    for (const source of knowledgeSources) {
      try {
        // Decrypt with old key
        const metadata = source.metadata as Record<string, unknown>;
        const encryptionMeta = metadata?.encryptionMetadata as Record<string, EncryptionResult> | undefined;
        if (encryptionMeta?.content) {
          const decrypted = await this.decryptFields(
            projectId,
            { content: source.content },
            { content: encryptionMeta.content }
          );

          // Re-encrypt with new key
          const encrypted = await this.encrypt(
            projectId,
            decrypted.content as string
          );

          // Update record
          await this.prisma.knowledgeSource.update({
            where: { id: source.id },
            data: {
              content: encrypted.encryptedData,
              metadata: JSON.parse(JSON.stringify({
                ...metadata,
                encryptionMetadata: {
                  content: encrypted,
                },
              })),
            },
          });

          reencryptedCount++;
        }
      } catch (error) {
        this.logger.error(`Failed to re-encrypt knowledge source ${source.id}`, error);
      }
    }

    return reencryptedCount;
  }

  /**
   * Check if content is encrypted
   */
  isEncrypted(content: string): boolean {
    // Check if content looks like base64-encoded encrypted data
    try {
      const decoded = Buffer.from(content, 'base64');
      return decoded.length > this.AUTH_TAG_LENGTH + this.IV_LENGTH;
    } catch {
      return false;
    }
  }

  /**
   * Get encryption status for a project
   */
  async getProjectEncryptionStatus(projectId: string): Promise<{
    hasEncryptionKey: boolean;
    keyId: string | null;
    encryptedDocuments: number;
    unencryptedDocuments: number;
  }> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { encryptionKeyId: true },
    });

    const [encryptedCount, unencryptedCount] = await Promise.all([
      this.prisma.knowledgeSource.count({
        where: {
          projectId,
          encryptionStatus: { not: 'unencrypted' },
        },
      }),
      this.prisma.knowledgeSource.count({
        where: {
          projectId,
          encryptionStatus: 'unencrypted',
        },
      }),
    ]);

    return {
      hasEncryptionKey: !!project?.encryptionKeyId,
      keyId: project?.encryptionKeyId || null,
      encryptedDocuments: encryptedCount,
      unencryptedDocuments: unencryptedCount,
    };
  }

  // Private helper methods

  private async getOrCreateProjectKey(projectId: string): Promise<{ buffer: Buffer; keyId: string }> {
    // Check if project has an encryption key
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { encryptionKeyId: true },
    });

    if (project?.encryptionKeyId) {
      const key = await this.getProjectKey(projectId, project.encryptionKeyId);
      return { buffer: key, keyId: project.encryptionKeyId };
    }

    // Create new key
    const keyId = await this.rotateProjectKey(projectId);
    const key = this.keyCache.get(`${projectId}:${keyId}`)!;
    return { buffer: key, keyId };
  }

  private async getProjectKey(projectId: string, keyId: string): Promise<Buffer> {
    const cacheKey = `${projectId}:${keyId}`;

    // Check cache first
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    // Load from storage (in production, load from HSM or key vault)
    const key = await this.loadProjectKey(projectId, keyId);

    if (!key) {
      throw new Error(`Encryption key ${keyId} not found for project ${projectId}`);
    }

    // Cache the key
    this.keyCache.set(cacheKey, key);
    return key;
  }

  private async storeProjectKey(projectId: string, keyId: string, key: Buffer): Promise<void> {
    // In production, store in HSM, AWS KMS, GCP KMS, or Azure Key Vault
    // For now, we just cache it in memory
    this.keyCache.set(`${projectId}:${keyId}`, key);

    this.logger.debug(`Stored encryption key ${keyId} for project ${projectId}`);
  }

  private async loadProjectKey(projectId: string, keyId: string): Promise<Buffer | null> {
    // In production, load from HSM, AWS KMS, GCP KMS, or Azure Key Vault
    return this.keyCache.get(`${projectId}:${keyId}`) || null;
  }

  private generateKeyId(): string {
    return `key_${crypto.randomBytes(16).toString('hex')}`;
  }

  /**
   * Hash content for integrity verification
   */
  hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Verify content integrity
   */
  verifyIntegrity(content: string, expectedHash: string): boolean {
    const actualHash = this.hashContent(content);
    return crypto.timingSafeEqual(
      Buffer.from(actualHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }
}
