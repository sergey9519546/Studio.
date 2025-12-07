/**
 * Media Proxy Error Classes
 * 
 * Structured error handling for the media proxy module
 */

export enum MediaErrorCode {
  UPLOAD_FAILED = 'MEDIA_UPLOAD_FAILED',
  FILE_TOO_LARGE = 'MEDIA_FILE_TOO_LARGE',
  INVALID_TYPE = 'MEDIA_INVALID_TYPE',
  NOT_FOUND = 'MEDIA_NOT_FOUND',
  EXPIRED_URL = 'MEDIA_EXPIRED_URL',
  STORAGE_ERROR = 'MEDIA_STORAGE_ERROR',
}

export class MediaProxyError extends Error {
  constructor(
    message: string,
    public readonly code: MediaErrorCode,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'MediaProxyError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper factory functions for common errors
export const MediaErrors = {
  fileTooLarge: (size: number, maxSize: number) =>
    new MediaProxyError(
      `File size ${(size / 1024 / 1024).toFixed(2)}MB exceeds maximum of ${maxSize / 1024 / 1024}MB`,
      MediaErrorCode.FILE_TOO_LARGE,
      413,
      { size, maxSize }
    ),

  invalidType: (mimeType: string, allowed: string[]) =>
    new MediaProxyError(
      `File type '${mimeType}' is not allowed. Supported types: ${allowed.join(', ')}`,
      MediaErrorCode.INVALID_TYPE,
      415,
      { mimeType, allowed }
    ),

  notFound: (id: string) =>
    new MediaProxyError(
      `Media file not found: ${id}`,
      MediaErrorCode.NOT_FOUND,
      404,
      { id }
    ),

  uploadFailed: (originalError: Error) =>
    new MediaProxyError(
      'Failed to upload file to storage',
      MediaErrorCode.UPLOAD_FAILED,
      500,
      { originalError: originalError.message }
    ),

  storageError: (operation: string, originalError: Error) =>
    new MediaProxyError(
      `Storage operation '${operation}' failed`,
      MediaErrorCode.STORAGE_ERROR,
      500,
      { operation, originalError: originalError.message }
    ),
};
