# Atlassian Confluence Embedded Pages Integration Guide

This guide explains how to integrate and use Atlassian's Embedded Confluence feature in the Studio Roster application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Authentication Flow](#authentication-flow)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## Overview

The Embedded Confluence integration allows you to display Confluence pages directly within the Studio Roster application. This feature uses Atlassian's `@atlaskit/embedded-confluence` package and includes:

- Seamless authentication flow with Confluence
- Cookie management for session persistence
- Error handling and loading states
- Integration with existing JWT authentication

## Prerequisites

Before you can use the Embedded Confluence feature, ensure you have:

### 1. Atlassian Tenant
- An active Atlassian account
- A Confluence tenant with published pages
- User permissions to access the pages you want to embed

### 2. Domain Allowlisting
**CRITICAL**: You must contact Atlassian to allowlist your application domain(s).

1. Visit the [Atlassian Service Desk](https://support.atlassian.com/contact/)
2. Submit a request to allowlist your domains:
   - Production domain (e.g., `https://studio.yourcompany.com`)
   - Development domain (e.g., `http://localhost:5173`)
   - Any staging domains

Without domain allowlisting, the embedded pages will not load.

### 3. Browser Requirements
Users must:
- Use a modern browser (Chrome, Firefox, Safari, or Edge - latest versions)
- Allow 3rd party cookies
- Enable storage access (users will be prompted automatically)

### 4. Node.js Version
- Node.js v16.14.2 or higher

## Setup Instructions

### 1. Install Dependencies

The package should already be installed, but if needed:

```bash
npm install @atlaskit/embedded-confluence --legacy-peer-deps
```

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Atlassian Confluence Configuration
CONFLUENCE_SITE_URL="https://your-site.atlassian.net"
CONFLUENCE_CLOUD_ID="your-cloud-id"
CONFLUENCE_SPACE_KEY="YOUR_SPACE"

# Optional: For Confluence API integration
CONFLUENCE_API_TOKEN="your-api-token"
CONFLUENCE_USER_EMAIL="your-email@domain.com"
```

**How to find these values:**

- **CONFLUENCE_SITE_URL**: Your Confluence cloud URL (e.g., `https://yourcompany.atlassian.net`)
- **CONFLUENCE_CLOUD_ID**: Found in Confluence Admin → Settings → System
- **CONFLUENCE_SPACE_KEY**: The key of your Confluence space (visible in space settings)
- **CONFLUENCE_API_TOKEN**: (Optional) Generate from [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
- **CONFLUENCE_USER_EMAIL**: Your Atlassian account email

### 3. Restart the Application

After updating environment variables:

```bash
npm run dev
```

## Usage

### Basic Example

```tsx
import EmbeddedConfluencePage from '@/components/confluence/EmbeddedConfluencePage';
import { ConfluenceAuthProvider } from '@/components/confluence/ConfluenceAuthProvider';

function MyComponent() {
  const pageConfig = {
    pageUrl: 'https://your-site.atlassian.net/wiki/spaces/SPACE/pages/123456789/Page+Title',
    siteUrl: 'https://your-site.atlassian.net',
    pageId: '123456789', // Optional
  };

  return (
    <ConfluenceAuthProvider siteUrl={pageConfig.siteUrl}>
      <EmbeddedConfluencePage
        config={pageConfig}
        height="800px"
        onLoad={() => console.log('Page loaded')}
        onError={(error) => console.error('Error loading page:', error)}
      />
    </ConfluenceAuthProvider>
  );
}
```

### With Authentication Handling

```tsx
import { useConfluenceAuth } from '@/components/confluence/ConfluenceAuthProvider';

function MyComponent() {
  const { isAuthenticated, isLoading, login, error } = useConfluenceAuth();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in to Confluence to view this content.</p>
        <button onClick={() => login()}>Log in to Confluence</button>
      </div>
    );
  }

  return (
    <EmbeddedConfluencePage
      config={{
        pageUrl: 'https://your-site.atlassian.net/wiki/spaces/SPACE/pages/123456789',
        siteUrl: 'https://your-site.atlassian.net',
      }}
    />
  );
}
```

## Authentication Flow

The Embedded Confluence integration uses a multi-step authentication process:

### 1. Storage Access Request
When a user first accesses a Confluence page, the browser will prompt them to allow storage access (for 3rd party cookies). This is a browser-level permission.

### 2. Atlassian Login
If the user is not already logged into Confluence, they'll see an Atlassian login prompt. This uses the Atlassian Identity Platform for secure authentication.

### 3. Cookie Management
After successful login, two cookies are set:
- `atl.xsrf.token`: XSRF protection token
- `cloud.session.token`: Session token for Confluence

These cookies are automatically managed by the `ConfluenceAuthProvider`.

### 4. Session Persistence
Sessions persist across browser refreshes. Users only need to authenticate once per browser session.

### Authentication State Diagram

```
[Page Load] → [Check Cookies] → [Has Valid Cookies?]
                                        ↓ No
                                [Request Storage Access]
                                        ↓
                                [User Allows?]
                                        ↓ Yes
                                [Show Atlassian Login]
                                        ↓
                                [User Enters Credentials]
                                        ↓
                                [Set Confluence Cookies]
                                        ↓
                                [Authenticated ✓]
```

## Troubleshooting

### Issue: "Storage access denied"

**Cause**: User declined storage access or 3rd party cookies are blocked.

**Solution**:
1. Enable 3rd party cookies in browser settings
2. Reload the page and allow storage access when prompted

### Issue: "Cannot find module @atlaskit/embedded-confluence"

**Cause**: Package not installed.

**Solution**:
```bash
npm install @atlaskit/embedded-confluence --legacy-peer-deps
```

### Issue: Embedded page not loading

**Possible causes**:
1. Domain not allowlisted with Atlassian
2. Invalid Confluence URL
3. User doesn't have permission to view the page

**Solution**:
1. Verify domain allowlisting with Atlassian
2. Check that the page URL is correct and accessible
3. Ensure user has Confluence access permissions

### Issue: "Page not found" error

**Cause**: The page ID or URL is incorrect, or the page doesn't exist.

**Solution**:
1. Verify the page exists in Confluence
2. Check the page URL/ID is correct
3. Ensure the page is published (not draft)

### Issue: Authentication loop (keeps asking to log in)

**Cause**: Cookies are being blocked or cleared.

**Solution**:
1. Check browser's cookie settings
2. Disable browser extensions that block cookies
3. Clear cache and cookies, then try again

## API Reference

### Types

#### `ConfluencePageConfig`
```typescript
interface ConfluencePageConfig {
  pageUrl: string;      // Full URL to the Confluence page
  siteUrl: string;      // Base Confluence site URL
  pageId?: string;      // Optional page ID
  cloudId?: string;     // Optional cloud ID
}
```

#### `ConfluenceAuthState`
```typescript
interface ConfluenceAuthState {
  isAuthenticated: boolean;    // Whether user is authenticated
  isLoading: boolean;          // Whether auth check is in progress
  error?: string;              // Error message if auth failed
  userEmail?: string;          // Authenticated user's email
  cookies?: Partial<ConfluenceCookies>;  // Current cookies
}
```

### Components

#### `<ConfluenceAuthProvider>`
Provides authentication context for Confluence.

**Props:**
- `children`: ReactNode - Child components
- `siteUrl`: string - Confluence site URL
- `onAuthChange?`: (isAuthenticated: boolean) => void - Callback fired when auth state changes

**Example:**
```tsx
<ConfluenceAuthProvider 
  siteUrl="https://your-site.atlassian.net"
  onAuthChange={(isAuth) => console.log('Auth changed:', isAuth)}
>
  {/* Your app */}
</ConfluenceAuthProvider>
```

#### `<EmbeddedConfluencePage>`
Displays an embedded Confluence page.

**Props:**
- `config`: ConfluencePageConfig - Page configuration
- `className?`: string - Optional CSS class
- `height?`: string | number - Height of embedded iframe (default: "800px")
- `onLoad?`: () => void - Callback when page loads
- `onError?`: (error: Error) => void - Callback on error

**Example:**
```tsx
<EmbeddedConfluencePage
  config={{
    pageUrl: 'https://site.atlassian.net/wiki/spaces/SPACE/pages/123',
    siteUrl: 'https://site.atlassian.net',
  }}
  height="600px"
  onLoad={() => console.log('Loaded')}
  onError={(err) => console.error(err)}
/>
```

### Hooks

#### `useConfluenceAuth()`
Access Confluence authentication state and methods.

**Returns:**
```typescript
{
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  userEmail?: string;
  cookies?: Partial<ConfluenceCookies>;
  login: (options?: ConfluenceLoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}
```

**Example:**
```tsx
const { isAuthenticated, login, logout } = useConfluenceAuth();

if (!isAuthenticated) {
  return <button onClick={login}>Log in</button>;
}

return <button onClick={logout}>Log out</button>;
```

### Backend Endpoints

#### GET `/api/v1/confluence/health`
Health check for Confluence integration.

**Response:**
```json
{
  "status": "ok",
  "message": "Confluence integration configured"
}
```

#### GET `/api/v1/confluence/config`
Get Confluence configuration (requires authentication).

**Response:**
```json
{
  "siteUrl": "https://your-site.atlassian.net",
  "cloudId": "your-cloud-id"
}
```

#### GET `/api/v1/confluence/pages/:pageId/access`
Validate user access to a specific page (requires authentication).

**Response:**
```json
{
  "hasAccess": true
}
```

#### GET `/api/v1/confluence/pages/:pageId`
Get page metadata (requires authentication).

**Response:**
```json
{
  "id": "123456789",
  "siteUrl": "https://your-site.atlassian.net",
  "cloudId": "your-cloud-id"
}
```

## Best Practices

1. **Always wrap with ConfluenceAuthProvider**: Ensure all embedded pages are wrapped in the auth provider.

2. **Handle errors gracefully**: Provide clear error messages to users when pages fail to load.

3. **Use loading states**: Show loading indicators while pages are loading for better UX.

4. **Respect user permissions**: Only embed pages that users have permission to view in Confluence.

5. **Monitor authentication**: Keep track of authentication state and prompt users to re-authenticate if needed.

6. **Cache page configurations**: Store frequently used page URLs in your configuration or database.

## Security Considerations

- All authentication happens through Atlassian's secure OAuth flow
- Cookies are httpOnly and secure in production environments
- No Confluence credentials are stored in the frontend
- Backend API tokens (if used) must be stored securely in environment variables
- JWTauthentication is required for all backend API endpoints

## Support

For issues related to:
- **Confluence setup**: Contact your Atlassian administrator
- **Domain allowlisting**: Submit a request to [Atlassian Support](https://support.atlassian.com)
- **Integration bugs**: Check the application logs or contact the development team

## Additional Resources

- [Atlassian Embedded Confluence Documentation](https://developer.atlassian.com/cloud/confluence/embedded-confluence/)
- [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API)
- [Atlassian Identity Platform](https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/)
