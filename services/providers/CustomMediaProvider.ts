/**
 * CustomMediaProvider
 *
 * Simplified media handling for TipTap editor
 * Uses direct file uploads to backend instead of Atlaskit MediaClient
 */

import { useDropzone } from 'react-dropzone';

/**
 * Simple media upload handler
 * Uploads files directly to our backend API
 */
export const uploadMedia = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/media-upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Add auth token if available
        ...(localStorage.getItem('studio_roster_v1_auth_token') && {
          'Authorization': `Bearer ${localStorage.getItem('studio_roster_v1_auth_token')}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`Media upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Media upload error:', error);
    throw error;
  }
};

/**
 * Media Configuration for TipTap Editor
 *
 * Simplified configuration for image handling
 */
export const mediaConfig = {
  // TipTap uses direct image insertion via URL or base64
  allowImageUpload: true,
  allowImageResizing: true,
  allowImageAlignment: true,
  maxImageSize: 5 * 1024 * 1024, // 5MB max
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * React Dropzone hook for media uploads
 * Can be used in components for drag-and-drop file uploads
 */
export const useMediaUpload = () => {
  return useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: mediaConfig.maxImageSize,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          const file = acceptedFiles[0];
          const url = await uploadMedia(file);
          return { success: true, url };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
        }
      }
      return { success: false, error: 'No files selected' };
    },
  });
};

export default {
  uploadMedia,
  mediaConfig,
  useMediaUpload,
};
