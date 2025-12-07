/**
 * CustomMediaProvider
 * 
 * Implements the "Shadow Proxy" architecture for media handling.
 * 
 * Architecture (from document):
 * - MediaClient expects to talk to Atlassian's Media API ("Stargate")
 * - We configure authProvider with a custom baseUrl pointing to our backend
 * - Our backend implements the Media API contract but stores files in S3
 * - This preserves ALL MediaClient features (resizing, cards, slash commands)
 * 
 * Critical: The legacyImageUploadProvider does NOT work with slash commands
 * or advanced media features, so we MUST use this Shadow Proxy approach.
 */

import { MediaClient, MediaClientConfig } from '@atlaskit/media-client';

/**
 * Auth Provider for MediaClient
 * 
 * The MediaClient expects a token-based auth system.
 * For our custom backend, we use session cookies instead,
 * so the token is a dummy value and the backend validates
 * the session from the HTTP-only cookie.
 */
const createAuthProvider = () => {
  return async (): Promise<{
    clientId: string;
    token: string;
    baseUrl: string;
  }> => {
    // Return auth configuration
    // The backend will validate actual auth via session cookies
    return {
      clientId: 'studio-roster-pages',
      token: 'dummy-token', // Backend ignores this, uses session
      baseUrl: '/api/v1/media-proxy', // OUR Shadow Proxy endpoint!
    };
  };
};

/**
 * Create MediaClient Config
 * 
 * This configures the MediaClient to send all requests to our
 * custom backend instead of api.media.atlassian.com
 */
const createMediaClientConfig = (): MediaClientConfig => {
  return {
    authProvider: createAuthProvider(),
  };
};

/**
 * Create and export the Media Provider
 * 
 * This is used by the Editor's media prop:
 * media={{
 *   provider: Promise.resolve(customMediaProvider),
 *   allowMediaSingle: true,
 *   allowResizing: true,
 * }}
 */
export const createMediaProvider = () => {
  const config = createMediaClientConfig();
  const mediaClient = new MediaClient(config);
  
  return mediaClient;
};

/**
 * Advanced: Upload State Tracking
 * 
 * The MediaClient emits events during upload.
 * You can subscribe to these for progress bars, error handling, etc.
 * 
 * Example:
 * const subscription = mediaClient.file.upload({
 *   content: file,
 *   name: file.name,
 *   collection: 'pages',
 * }).subscribe({
 *   next: (state) => {
 *     if (state.status === 'processing') {
 *       console.log('Upload progress:', state.progress);
 *     } else if (state.status === 'processed') {
 *       console.log('Upload complete:', state.id);
 *     }
 *   },
 *   error: (error) => {
 *     console.error('Upload failed:', error);
 *   },
 * });
 */

/**
 * Media Configuration for Editor
 * 
 * This is the full configuration object to pass to the Editor component
 */
export const mediaConfig = {
  provider: Promise.resolve(createMediaProvider()),
  allowMediaSingle: true,       // Allow single images
  allowMediaGroup: true,         // Allow image galleries/grids
  allowResizing: true,           // Enable image resize handles
  allowResizingInTables: true,   // Allow resizing images in tables
  allowLinking: true,            // Allow wrapping images in links
  allowAdvancedToolBarOptions: true, // Show alignment, wrapping options
  allowAltTextOnImages: true,    // Enable alt text for accessibility
  allowCaptions: true,           // Enable image captions
  enableDownloadButton: true,    // Show download button on media cards
};

export default createMediaProvider;
