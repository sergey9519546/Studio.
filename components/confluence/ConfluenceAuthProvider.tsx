import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ConfluenceAuthState, ConfluenceCookies, ConfluenceError, ConfluenceErrorCode, ConfluenceLoginOptions } from '../../types/confluence.types';

interface ConfluenceAuthContextValue extends ConfluenceAuthState {
  login: (options?: ConfluenceLoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const ConfluenceAuthContext = createContext<ConfluenceAuthContextValue | undefined>(undefined);

interface ConfluenceAuthProviderProps {
  children: ReactNode;
  siteUrl: string;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

/**
 * Provider component for Confluence authentication
 * Manages authentication state and cookie synchronization
 */
export function ConfluenceAuthProvider({ 
  children, 
  siteUrl,
  onAuthChange 
}: ConfluenceAuthProviderProps) {
  const [authState, setAuthState] = useState<ConfluenceAuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * Check if Confluence cookies are present and valid
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Check for required Confluence cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const hasRequiredCookies = 
        cookies['atl.xsrf.token'] && 
        cookies['cloud.session.token'];

      if (hasRequiredCookies) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          cookies: {
            'atl.xsrf.token': cookies['atl.xsrf.token'],
            'cloud.session.token': cookies['cloud.session.token'],
          },
        });
        return true;
      }

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    } catch (error) {
      console.error('Error checking Confluence auth:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication status',
      });
      return false;
    }
  };

  /**
   * Initiate Confluence login flow
   * This will trigger the Storage Access API and Atlassian login
   */
  const login = async (options?: ConfluenceLoginOptions): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

      // Request storage access (required for 3rd party cookies)
      if ('requestStorageAccess' in document) {
        try {
          await (document as any).requestStorageAccess();
        } catch (storageError) {
          throw new ConfluenceError(
            'Storage access denied. Please enable 3rd party cookies in your browser settings.',
            ConfluenceErrorCode.STORAGE_ACCESS_DENIED
          );
        }
      }

      // The actual login will be handled by the @atlaskit/embedded-confluence component
      // This is a placeholder for coordination with the embedded page's auth flow
      // The component will show the Atlassian login prompt when needed

      // Recheck auth status after login attempt
      const isAuthenticated = await checkAuth();
      
      if (isAuthenticated) {
        const cookies = authState.cookies as ConfluenceCookies;
        options?.onSuccess?.(cookies);
        onAuthChange?.(true);
      } else {
        throw new ConfluenceError(
          'Login failed. Please try again.',
          ConfluenceErrorCode.NOT_AUTHENTICATED
        );
      }
    } catch (error) {
      const errorMessage = error instanceof ConfluenceError 
        ? error.message 
        : 'An unexpected error occurred during login';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      options?.onError?.(error as Error);
      throw error;
    }
  };

  /**
   * Logout from Confluence
   */
  const logout = async (): Promise<void> => {
    try {
      // Clear Confluence cookies
      document.cookie = 'atl.xsrf.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'cloud.session.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        cookies: undefined,
      });

      onAuthChange?.(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue: ConfluenceAuthContextValue = {
    ...authState,
    login,
    logout,
    checkAuth,
  };

  return (
    <ConfluenceAuthContext.Provider value={contextValue}>
      {children}
    </ConfluenceAuthContext.Provider>
  );
}

/**
 * Hook to access Confluence authentication context
 */
export function useConfluenceAuth(): ConfluenceAuthContextValue {
  const context = useContext(ConfluenceAuthContext);
  if (!context) {
    throw new Error('useConfluenceAuth must be used within a ConfluenceAuthProvider');
  }
  return context;
}
