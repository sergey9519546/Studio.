/**
 * Frontend service for Confluence operations
 */

import { ConfluenceError, ConfluenceErrorCode, ConfluencePageConfig } from '../types/confluence.types';

const API_BASE_URL = '/api/confluence';

class ConfluenceService {
  /**
   * Verify Confluence integration health
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return response.json();
    } catch (error) {
      console.error('Confluence health check failed:', error);
      throw new ConfluenceError(
        'Failed to connect to Confluence service',
        ConfluenceErrorCode.NETWORK_ERROR
      );
    }
  }

  /**
   * Validate user has access to a specific Confluence page
   */
  async validatePageAccess(pageId: string, token?: string): Promise<boolean> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/access`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ConfluenceError(
            'Page not found',
            ConfluenceErrorCode.PAGE_NOT_FOUND,
            404
          );
        }
        if (response.status === 401 || response.status === 403) {
          throw new ConfluenceError(
            'Not authenticated or insufficient permissions',
            ConfluenceErrorCode.NOT_AUTHENTICATED,
            response.status
          );
        }
        throw new Error('Failed to validate page access');
      }

      const data = await response.json();
      return data.hasAccess === true;
    } catch (error) {
      if (error instanceof ConfluenceError) {
        throw error;
      }
      console.error('Error validating page access:', error);
      throw new ConfluenceError(
        'Failed to validate page access',
        ConfluenceErrorCode.NETWORK_ERROR
      );
    }
  }

  /**
   * Get page metadata (optional helper)
   */
  async getPageMetadata(pageId: string, token?: string): Promise<any> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ConfluenceError(
            'Page not found',
            ConfluenceErrorCode.PAGE_NOT_FOUND,
            404
          );
        }
        throw new Error('Failed to fetch page metadata');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ConfluenceError) {
        throw error;
      }
      console.error('Error fetching page metadata:', error);
      throw new ConfluenceError(
        'Failed to fetch page metadata',
        ConfluenceErrorCode.NETWORK_ERROR
      );
    }
  }

  /**
   * Extract page ID from Confluence URL
   */
  extractPageIdFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Common Confluence URL patterns:
      // /wiki/spaces/{space}/pages/{pageId}/{title}
      // /pages/viewpage.action?pageId={pageId}
      
      const pageIdIndex = pathParts.indexOf('pages');
      if (pageIdIndex !== -1 && pathParts[pageIdIndex + 1]) {
        const potentialId = pathParts[pageIdIndex + 1];
        // Check if it looks like a numeric ID
        if (/^\d+$/.test(potentialId)) {
          return potentialId;
        }
      }
      
      // Check query parameters
      const pageIdParam = urlObj.searchParams.get('pageId');
      if (pageIdParam) {
        return pageIdParam;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting page ID from URL:', error);
      return null;
    }
  }

  /**
   * Build Confluence page configuration from URL
   */
  buildConfigFromUrl(pageUrl: string): ConfluencePageConfig | null {
    try {
      const urlObj = new URL(pageUrl);
      const siteUrl = `${urlObj.protocol}//${urlObj.host}`;
      const pageId = this.extractPageIdFromUrl(pageUrl);

      return {
        pageUrl,
        siteUrl,
        pageId: pageId || undefined,
      };
    } catch (error) {
      console.error('Error building config from URL:', error);
      return null;
    }
  }
}

// Export singleton instance
export const confluenceService = new ConfluenceService();
export default confluenceService;
