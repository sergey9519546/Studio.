import { useEffect, useState } from 'react';
// @ts-ignore - Atlaskit package may not have perfect TypeScript definitions
import { EmbeddedConfluence } from '@atlaskit/embedded-confluence';
import { ConfluenceError, ConfluenceErrorCode, EmbeddedPageProps } from '../../types/confluence.types';
import { useConfluenceAuth } from './ConfluenceAuthProvider';

/**
 * Component for embedding Confluence pages
 * Uses @atlaskit/embedded-confluence package for seamless integration
 */
export default function EmbeddedConfluencePage({
  config,
  className = "",
  onLoad,
  onError,
  height = "800px",
}: EmbeddedPageProps) {
  const { isAuthenticated, isLoading, login } = useConfluenceAuth();
  const [pageError, setPageError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Validate configuration
  useEffect(() => {
    if (!config.pageUrl || !config.siteUrl) {
      const error = new ConfluenceError(
        "Invalid configuration: pageUrl and siteUrl are required",
        ConfluenceErrorCode.INVALID_CONFIG
      );
      setPageError(error.message);
      onError?.(error);
    }
  }, [config, onError]);

  // Handle authentication requirement
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User needs to authenticate
      // The embedded page component will show the login prompt
      setPageError("Please log in to Confluence to view this page.");
    }
  }, [isAuthenticated, isLoading]);

  const handleLoginClick = async () => {
    try {
      await login({
        onError: (error) => {
          setPageError(error.message);
          onError?.(error);
        },
      });
      setPageError(null);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handlePageLoad = () => {
    setIsPageLoading(false);
    onLoad?.();
    setPageError(null);
  };

  const handlePageError = (error: Error) => {
    setPageError(error.message);
    onError?.(error);
  };

  // Loading state
  if (isLoading || isPageLoading) {
    return (
      // eslint-disable-next-line react/forbid-component-props -- dynamic height prop
      <div
        className={`confluence-page-container ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-primary mx-auto mb-4"></div>
            <p className="text-ink-secondary">Loading Confluence page...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (pageError) {
    return (
      // eslint-disable-next-line react/forbid-component-props -- dynamic height prop
      <div
        className={`confluence-page-container ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md p-6 bg-subtle rounded-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">
              Unable to Load Page
            </h3>
            <p className="text-sm text-ink-secondary mb-4">{pageError}</p>
            {!isAuthenticated && (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-ink-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Log in to Confluence
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Extract page ID from URL if not provided
  const pageId = config.pageId || extractPageIdFromUrl(config.pageUrl);

  // Render the actual Embedded Confluence component
  if (isAuthenticated) {
    return (
      // eslint-disable-next-line react/forbid-component-props -- dynamic height prop
      <div
        className={`confluence-page-container ${className}`}
        style={{ height }}
      >
        <div className="w-full h-full">
          <EmbeddedConfluence
            contentId={pageId}
            hostname={config.siteUrl}
            onLoad={handlePageLoad}
            onError={handlePageError}
          />
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, display login prompt
  if (!isLoading && !isAuthenticated) {
    return (
      <div
        className={`confluence-page-container ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md p-6 bg-subtle rounded-xl">
            <h3 className="text-lg font-bold text-ink-primary mb-2">
              Please Log In
            </h3>
            <p className="text-sm text-ink-secondary mb-4">
              You need to log in to Confluence to view this page.
            </p>
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-ink-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Log in to Confluence
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Should not reach here if loading, error, or authenticated cases are covered
}

/**
 * Helper function to extract page ID from Confluence URL
 */
function extractPageIdFromUrl(url: string): string | undefined {
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
    
    return undefined;
  } catch (error) {
    console.error('Error extracting page ID from URL:', error);
    return undefined;
  }
}
