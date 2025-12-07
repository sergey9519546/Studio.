import { useEffect, useState } from 'react';
import { ConfluenceError, ConfluenceErrorCode, EmbeddedPageProps } from '../../types/confluence.types';
import { useConfluenceAuth } from './ConfluenceAuthProvider';

/**
 * Component for embedding Confluence pages
 * Requires @atlaskit/embedded-confluence package
 * 
 * Note: This component uses the Embedded Confluence component from Atlassian.
 * Make sure to install: npm install @atlaskit/embedded-confluence --legacy-peer-deps
 */
export default function EmbeddedConfluencePage({
  config,
  className = '',
  onLoad,
  onError,
  height = '800px',
}: EmbeddedPageProps) {
  const { isAuthenticated, isLoading, login } = useConfluenceAuth();
  const [pageError, setPageError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Validate configuration
  useEffect(() => {
    if (!config.pageUrl || !config.siteUrl) {
      const error = new ConfluenceError(
        'Invalid configuration: pageUrl and siteUrl are required',
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
      setPageError('Please log in to Confluence to view this page.');
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
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handlePageLoad = () => {
    setIsPageLoading(false);
    onLoad?.();
  };

  const handlePageError = (error: Error) => {
    setPageError(error.message);
    onError?.(error);
  };

  // Loading state
  if (isLoading || isPageLoading) {
    return (
      <div className={`confluence-page-container ${className}`} style={{ height }}>
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
      <div className={`confluence-page-container ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md p-6 bg-subtle rounded-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">Unable to Load Page</h3>
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

  // TODO: Replace with actual @atlaskit/embedded-confluence component once package is installed
  // For now, showing a placeholder that demonstrates the integration pattern
  return (
    <div className={`confluence-page-container ${className}`} style={{ height }}>
      <div className="w-full h-full border border-subtle rounded-lg overflow-hidden">
        {/* 
          This will be replaced with the actual Embedded Confluence component:
          
          import { EmbeddedConfluence } from '@atlaskit/embedded-confluence';
          
          <EmbeddedConfluence
            contentId={config.pageId}
            hostname={config.siteUrl}
            onLoad={handlePageLoad}
            onError={handlePageError}
          />
        */}
        <div className="flex items-center justify-center h-full bg-subtle">
          <div className="text-center max-w-md p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">
              Embedded Confluence Page
            </h3>
            <p className="text-sm text-ink-secondary mb-2">
              Configuration: {config.siteUrl}
            </p>
            <p className="text-xs text-ink-secondary/70">
              Install @atlaskit/embedded-confluence package to enable this feature
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg text-left">
              <p className="text-xs font-mono text-ink-secondary">
                npm install @atlaskit/embedded-confluence --legacy-peer-deps
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
