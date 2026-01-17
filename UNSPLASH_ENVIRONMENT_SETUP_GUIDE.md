# Unsplash API Environment Setup Guide

## Overview
This guide documents the configuration of the Unsplash API environment variables for the Studio Roster application, ensuring proper setup of the `UNSPLASH_ACCESS_KEY` in the API environment.

## Configuration Summary

### Environment Variables
The application now supports two environment variables for Unsplash integration:

1. **`UNSPLASH_ACCESS_KEY`** (Primary - API Environment)
   - **Purpose**: Used by the backend API service
   - **Location**: Server-side environment
   - **Priority**: Primary (preferred over VITE_UNSPLASH_ACCESS_KEY)
   - **Usage**: Backend API integration with Unsplash services

2. **`VITE_UNSPLASH_ACCESS_KEY`** (Fallback - Frontend Environment)
   - **Purpose**: Used by the frontend build process
   - **Location**: Client-side environment (Vite build)
   - **Priority**: Fallback when UNSPLASH_ACCESS_KEY is not available
   - **Usage**: Frontend environment variable substitution

### Implementation Details

#### Service Configuration (`apps/api/src/modules/integrations/unsplash/unsplash.service.ts`)
```typescript
const accessKey =
  this.configService.get<string>('UNSPLASH_ACCESS_KEY') ||
  this.configService.get<string>('VITE_UNSPLASH_ACCESS_KEY');
```

The service prioritizes `UNSPLASH_ACCESS_KEY` and falls back to `VITE_UNSPLASH_ACCESS_KEY` if the primary key is not available.

#### Environment Configuration (`.env.example`)
Updated to include both variables with clear documentation:
```bash
# Unsplash API (for moodboard image discovery)
# Get your free API key from: https://unsplash.com/developers
# Primary key for API environment (preferred)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
# Fallback key for frontend (Vite environment)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## Deployment Configuration

### Docker Setup
- **Container**: Production-ready Docker configuration
- **Environment**: Supports both environment variables
- **Security**: Non-root user, minimal attack surface
- **Health Checks**: Built-in health monitoring

### Firebase Hosting
- **Frontend**: Built and deployed via Firebase Hosting
- **API**: Backend deployed via App Hosting
- **Environment Variables**: Configured through deployment environment

### Development Setup
1. Copy `.env.example` to `.env`
2. Set `UNSPLASH_ACCESS_KEY` with your Unsplash API key
3. Optionally set `VITE_UNSPLASH_ACCESS_KEY` for frontend builds
4. Start the development server

## Getting Your Unsplash API Key

1. **Create Account**: Visit [Unsplash Developers](https://unsplash.com/developers)
2. **Register Application**: Create a new application
3. **Get Access Key**: Copy your Access Key from the application dashboard
4. **Configure**: Add the key to your environment variables

## Security Best Practices

### Production Environment
- Use `UNSPLASH_ACCESS_KEY` as the primary key
- Store sensitive keys securely (environment variables, secrets management)
- Never commit API keys to version control
- Rotate keys periodically

### Development Environment
- Use separate keys for development and production
- Limit API key permissions in Unsplash developer dashboard
- Monitor API usage and quotas

## API Integration Features

The Unsplash service provides:
- **Photo Search**: Search photos by query
- **Photo Details**: Get specific photo information
- **Curated Photos**: Featured photo collections
- **Popular Photos**: Trending photo collections
- **Download Tracking**: Attribution and usage tracking

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `UNSPLASH_ACCESS_KEY` is set in environment
   - Check service initialization logs
   - Verify environment variable loading

2. **API Rate Limiting**
   - Monitor API usage in Unsplash dashboard
   - Implement request caching if needed
   - Consider upgrading API plan for higher limits

3. **CORS Issues**
   - Ensure proper domain configuration in Unsplash app settings
   - Check Firebase hosting domain configuration

### Verification Steps
1. Start the application
2. Check logs for "Unsplash API initialized successfully"
3. Test photo search functionality
4. Verify API responses and error handling

## Environment Variable Priority

The application follows this priority order for loading Unsplash access keys:

1. **`UNSPLASH_ACCESS_KEY`** (Server environment)
2. **`VITE_UNSPLASH_ACCESS_KEY`** (Fallback - client environment)

This ensures that the API service always uses the most appropriate environment variable for server-side operations.

## Conclusion

The Unsplash API integration is now properly configured with:
- ✅ Environment variable prioritization
- ✅ Clear documentation
- ✅ Secure deployment configuration
- ✅ Comprehensive error handling
- ✅ Production-ready setup

For any questions or issues, refer to the [Unsplash API Documentation](https://unsplash.com/documentation) or check the application logs for detailed error messages.
