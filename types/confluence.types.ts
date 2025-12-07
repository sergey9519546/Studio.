/**
 * Type definitions for Confluence integration
 */

export interface ConfluencePageConfig {
  /** The URL of the Confluence page to embed */
  pageUrl: string;
  /** Optional page ID for direct reference */
  pageId?: string;
  /** The Confluence site URL (e.g., https://your-site.atlassian.net) */
  siteUrl: string;
  /** Cloud ID for the Confluence instance */
  cloudId?: string;
}

export interface ConfluenceCookies {
  /** XSRF token for Confluence authentication */
  'atl.xsrf.token': string;
  /** Cloud session token for Confluence */
  'cloud.session.token': string;
}

export interface ConfluenceAuthState {
  /** Whether the user is authenticated with Confluence */
  isAuthenticated: boolean;
  /** Whether authentication is in progress */
  isLoading: boolean;
  /** Error message if authentication failed */
  error?: string;
  /** The authenticated user's email */
  userEmail?: string;
  /** Confluence cookies */
  cookies?: Partial<ConfluenceCookies>;
}

export interface ConfluenceLoginOptions {
  /** Callback fired when login succeeds */
  onSuccess?: (cookies: ConfluenceCookies) => void;
  /** Callback fired when login fails */
  onError?: (error: Error) => void;
  /** Whether to force re-authentication */
  forceLogin?: boolean;
}

export interface EmbeddedPageProps {
  /** Configuration for the Confluence page */
  config: ConfluencePageConfig;
  /** Optional CSS class name */
  className?: string;
  /** Callback fired when page loads successfully */
  onLoad?: () => void;
  /** Callback fired when an error occurs */
  onError?: (error: Error) => void;
  /** Height of the embedded iframe */
  height?: string | number;
}

export interface ConfluenceErrorResponse {
  message: string;
  code: string;
  statusCode: number;
}

export enum ConfluenceErrorCode {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  STORAGE_ACCESS_DENIED = 'STORAGE_ACCESS_DENIED',
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_CONFIG = 'INVALID_CONFIG',
}

export class ConfluenceError extends Error {
  constructor(
    message: string,
    public code: ConfluenceErrorCode,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'ConfluenceError';
  }
}
