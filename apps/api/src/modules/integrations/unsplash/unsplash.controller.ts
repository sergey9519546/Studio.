import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Query
} from '@nestjs/common';
import { UnsplashSearchParams, UnsplashService } from './unsplash.service.js';

interface SearchQueryDto {
  query: string;
  page?: number;
  per_page?: number;
  order_by?: 'relevant' | 'latest' | 'oldest' | 'popular';
  content_filter?: 'low' | 'high';
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

interface PaginationQueryDto {
  page?: number;
  per_page?: number;
  order_by?: 'latest' | 'oldest' | 'popular';
}

@Controller('api/v1/unsplash')
export class UnsplashController {
  private readonly logger = new Logger(UnsplashController.name);

  constructor(private readonly unsplashService: UnsplashService) {}

  /**
   * Search for photos on Unsplash
   * GET /api/v1/unsplash/search
   */
  @Get('search')
  async searchPhotos(@Query() query: SearchQueryDto) {
    try {
      if (!query.query || query.query.trim().length === 0) {
        throw new BadRequestException('Query parameter is required');
      }

      const searchParams: UnsplashSearchParams = {
        query: query.query.trim(),
        page: query.page || 1,
        per_page: query.per_page || 12,
        order_by: query.order_by || 'relevant',
        content_filter: query.content_filter || 'low',
        orientation: query.orientation,
      };

      this.logger.log(`Searching photos: "${searchParams.query}" (page ${searchParams.page})`);
      
      const result = await this.unsplashService.searchPhotos(searchParams);
      
      return {
        success: true,
        data: result,
        meta: {
          query: searchParams.query,
          page: searchParams.page,
          per_page: searchParams.per_page,
          order_by: searchParams.order_by,
        },
      };
    } catch (error) {
      this.logger.error('Error in searchPhotos:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to search photos');
    }
  }

  /**
   * Get a specific photo by ID
   * GET /api/v1/unsplash/photos/:id
   */
  @Get('photos/:id')
  async getPhoto(@Param('id') photoId: string) {
    try {
      if (!photoId || photoId.trim().length === 0) {
        throw new BadRequestException('Photo ID is required');
      }

      this.logger.log(`Getting photo: ${photoId}`);
      
      const photo = await this.unsplashService.getPhoto(photoId.trim());
      
      return {
        success: true,
        data: photo,
      };
    } catch (error) {
      this.logger.error('Error in getPhoto:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to get photo');
    }
  }

  /**
   * Get curated/featured photos
   * GET /api/v1/unsplash/photos/curated
   */
  @Get('photos/curated')
  async getCuratedPhotos(@Query() query: PaginationQueryDto) {
    try {
      const params = {
        page: query.page || 1,
        per_page: query.per_page || 12,
        order_by: query.order_by || 'popular',
      };

      this.logger.log(`Getting curated photos (page ${params.page})`);
      
      const result = await this.unsplashService.getCuratedPhotos(params);
      
      return {
        success: true,
        data: result,
        meta: {
          page: params.page,
          per_page: params.per_page,
          order_by: params.order_by,
        },
      };
    } catch (error) {
      this.logger.error('Error in getCuratedPhotos:', error);
      throw new InternalServerErrorException('Failed to get curated photos');
    }
  }

  /**
   * Get popular photos
   * GET /api/v1/unsplash/photos/popular
   */
  @Get('photos/popular')
  async getPopularPhotos(@Query() query: PaginationQueryDto) {
    try {
      const params = {
        page: query.page || 1,
        per_page: query.per_page || 12,
        order_by: query.order_by || 'popular',
      };

      this.logger.log(`Getting popular photos (page ${params.page})`);
      
      const result = await this.unsplashService.getPopularPhotos(params);
      
      return {
        success: true,
        data: result,
        meta: {
          page: params.page,
          per_page: params.per_page,
          order_by: params.order_by,
        },
      };
    } catch (error) {
      this.logger.error('Error in getPopularPhotos:', error);
      throw new InternalServerErrorException('Failed to get popular photos');
    }
  }

  /**
   * Track photo download for attribution
   * POST /api/v1/unsplash/photos/:id/download
   */
  @Post('photos/:id/download')
  @HttpCode(HttpStatus.OK)
  async trackDownload(@Param('id') photoId: string) {
    try {
      if (!photoId || photoId.trim().length === 0) {
        throw new BadRequestException('Photo ID is required');
      }

      this.logger.log(`Tracking download for photo: ${photoId}`);
      
      const result = await this.unsplashService.trackDownload(photoId.trim());
      
      return {
        success: true,
        data: result,
        message: 'Download tracked successfully',
      };
    } catch (error) {
      this.logger.error('Error in trackDownload:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to track download');
    }
  }

  /**
   * Health check endpoint
   * GET /api/v1/unsplash/health
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      success: true,
      status: 'healthy',
      service: 'unsplash',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get API information
   * GET /api/v1/unsplash/info
   */
  @Get('info')
  getApiInfo() {
    return {
      success: true,
      data: {
        service: 'Unsplash API Integration',
        version: '1.0.0',
        endpoints: {
          search: 'GET /api/v1/unsplash/search',
          photo: 'GET /api/v1/unsplash/photos/:id',
          curated: 'GET /api/v1/unsplash/photos/curated',
          popular: 'GET /api/v1/unsplash/photos/popular',
          download: 'POST /api/v1/unsplash/photos/:id/download',
          health: 'GET /api/v1/unsplash/health',
        },
        parameters: {
          search: {
            query: 'string (required) - Search query',
            page: 'number (optional) - Page number (default: 1)',
            per_page: 'number (optional) - Results per page (default: 12)',
            order_by: 'string (optional) - relevant|latest|oldest|popular',
            content_filter: 'string (optional) - low|high',
            orientation: 'string (optional) - landscape|portrait|squarish',
          },
          pagination: {
            page: 'number (optional) - Page number (default: 1)',
            per_page: 'number (optional) - Results per page (default: 12)',
            order_by: 'string (optional) - latest|oldest|popular',
          },
        },
      },
    };
  }
}
