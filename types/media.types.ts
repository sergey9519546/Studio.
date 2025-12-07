/**
 * Media Type Definitions
 * 
 * Comprehensive type definitions for media module
 */

export interface MediaUploadResponse {
  data: {
    id: string;
    processingStatus: 'succeeded' | 'processing' | 'failed';
    mediaType: string;
    mimeType: string;
    name: string;
    size: number;
    artifacts: Record<string, MediaArtifact>;
    createdAt: string;
  };
}

export interface MediaArtifact {
  url: string;
  expiresAt?: string; // ISO 8601 timestamp when signed URL expires
  processingStatus: string;
}

export interface MediaRetrievalResponse {
  data: {
    id: string;
    processingStatus: string;
    mediaType: string;
    mimeType: string;
    name: string;
    size: number;
    createdAt: string;
    artifacts: Record<string, MediaArtifact>;
    representations?: {
      image?: string;
    };
  };
}

export interface MediaCollectionResponse {
  data: {
    contents: MediaCollectionItem[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
  };
}

export interface MediaCollectionItem {
  id: string;
  type: 'file';
 details: {
    name: string;
    size: number;
    mediaType: string;
    mimeType: string;
    artifacts: Record<string, MediaArtifact>;
  };
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'application/pdf',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
