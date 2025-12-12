import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApi } from 'unsplash-js';

export interface UnsplashSearchParams {
  query: string;
  page?: number;
  per_page?: number;
  order_by?: 'relevant' | 'latest' | 'oldest' | 'popular';
  content_filter?: 'low' | 'high';
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  likes: number;
  description: string | null;
  alt_description: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    portfolio_url?: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
    };
  };
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

@Injectable()
export class UnsplashService {
  private readonly logger = new Logger(UnsplashService.name);
  private unsplashApi: ReturnType<typeof createApi> | null = null;

  constructor(private configService: ConfigService) {
    this.initializeUnsplash();
  }

  private initializeUnsplash() {
    try {
      const accessKey =
        this.configService.get<string>('UNSPLASH_ACCESS_KEY') ||
        this.configService.get<string>('VITE_UNSPLASH_ACCESS_KEY');
      
      if (!accessKey) {
        this.logger.warn('Unsplash access key not found in environment variables (UNSPLASH_ACCESS_KEY)');
        return;
      }

      this.unsplashApi = createApi({
        accessKey,
        fetch: fetch,
      });

      this.logger.log('Unsplash API initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Unsplash API', error);
    }
  }

  /**
   * Search for photos on Unsplash
   */
  async searchPhotos(params: UnsplashSearchParams): Promise<UnsplashSearchResponse> {
    if (!this.unsplashApi) {
      throw new Error('Unsplash API not initialized. Check your access key configuration.');
    }

    try {
      this.logger.log(`Searching photos for query: "${params.query}"`);

      const response = await this.unsplashApi.search.getPhotos({
        query: params.query,
        page: params.page || 1,
        perPage: params.per_page || 12,
        orderBy: (params.order_by as any) || 'relevant',
        contentFilter: params.content_filter as any || 'low',
        orientation: params.orientation as any,
      });

      if (response.errors) {
        this.logger.error('Unsplash API errors:', response.errors);
        throw new Error(`Unsplash API error: ${response.errors.join(', ')}`);
      }

      const searchResponse = response.response;
      if (!searchResponse) {
        throw new Error('No response from Unsplash API');
      }

      this.logger.log(`Found ${searchResponse.total} photos for "${params.query}"`);

      return {
        total: searchResponse.total,
        total_pages: searchResponse.total_pages,
        results: searchResponse.results.map(this.mapUnsplashPhoto),
      };
    } catch (error) {
      this.logger.error('Error searching photos:', error);
      throw error;
    }
  }

  /**
   * Get a specific photo by ID
   */
  async getPhoto(photoId: string): Promise<UnsplashPhoto> {
    if (!this.unsplashApi) {
      throw new Error('Unsplash API not initialized. Check your access key configuration.');
    }

    try {
      this.logger.log(`Getting photo with ID: ${photoId}`);

      const response = await this.unsplashApi.photos.get({ photoId });

      if (response.errors) {
        this.logger.error('Unsplash API errors:', response.errors);
        throw new Error(`Unsplash API error: ${response.errors.join(', ')}`);
      }

      const photo = response.response;
      if (!photo) {
        throw new Error('Photo not found');
      }

      this.logger.log(`Retrieved photo: ${photo.id}`);

      return this.mapUnsplashPhoto(photo);
    } catch (error) {
      this.logger.error('Error getting photo:', error);
      throw error;
    }
  }

  /**
   * Get curated photos (featured photos)
   */
  async getCuratedPhotos(params?: {
    page?: number;
    per_page?: number;
    order_by?: 'latest' | 'oldest' | 'popular';
  }): Promise<UnsplashSearchResponse> {
    if (!this.unsplashApi) {
      throw new Error('Unsplash API not initialized. Check your access key configuration.');
    }

    try {
      this.logger.log('Getting curated photos');

      const response = await this.unsplashApi.photos.list({
        page: params?.page || 1,
        perPage: params?.per_page || 12,
        orderBy: (params?.order_by as any) || 'popular',
      });

      if (response.errors) {
        this.logger.error('Unsplash API errors:', response.errors);
        throw new Error(`Unsplash API error: ${response.errors.join(', ')}`);
      }

      const photos = response.response;
      if (!photos) {
        throw new Error('No response from Unsplash API');
      }

      this.logger.log(`Retrieved ${photos.results.length} curated photos`);

      return {
        total: photos.total,
        total_pages: Math.ceil(photos.total / (params?.per_page || 12)),
        results: photos.results.map(this.mapUnsplashPhoto),
      };
    } catch (error) {
      this.logger.error('Error getting curated photos:', error);
      throw error;
    }
  }

  /**
   * Get popular photos
   */
  async getPopularPhotos(params?: {
    page?: number;
    per_page?: number;
    order_by?: 'latest' | 'oldest' | 'popular';
  }): Promise<UnsplashSearchResponse> {
    if (!this.unsplashApi) {
      throw new Error('Unsplash API not initialized. Check your access key configuration.');
    }

    try {
      this.logger.log('Getting popular photos');

      const response = await this.unsplashApi.photos.list({
        page: params?.page || 1,
        perPage: params?.per_page || 12,
        orderBy: (params?.order_by as any) || 'popular',
      });

      if (response.errors) {
        this.logger.error('Unsplash API errors:', response.errors);
        throw new Error(`Unsplash API error: ${response.errors.join(', ')}`);
      }

      const photos = response.response;
      if (!photos) {
        throw new Error('No response from Unsplash API');
      }

      this.logger.log(`Retrieved ${photos.results.length} popular photos`);

      return {
        total: photos.total,
        total_pages: Math.ceil(photos.total / (params?.per_page || 12)),
        results: photos.results.map(this.mapUnsplashPhoto),
      };
    } catch (error) {
      this.logger.error('Error getting popular photos:', error);
      throw error;
    }
  }

  /**
   * Track download for attribution (simplified approach)
   */
  async trackDownload(photoId: string): Promise<{ url: string }> {
    try {
      this.logger.log(`Tracking download for photo: ${photoId}`);
      
      // Return the download URL directly from the photo links
      // The actual download tracking happens when the user accesses this URL
      const photo = await this.getPhoto(photoId);
      
      return { url: photo.links.download };
    } catch (error) {
      this.logger.error('Error tracking download:', error);
      throw error;
    }
  }

  /**
   * Map Unsplash photo response to our interface
   */
  private mapUnsplashPhoto(photo: any): UnsplashPhoto {
    return {
      id: photo.id,
      created_at: photo.created_at,
      width: photo.width,
      height: photo.height,
      color: photo.color,
      likes: photo.likes,
      description: photo.description,
      alt_description: photo.alt_description,
      user: {
        id: photo.user.id,
        username: photo.user.username,
        name: photo.user.name,
        first_name: photo.user.first_name,
        last_name: photo.user.last_name,
        portfolio_url: photo.user.portfolio_url,
        profile_image: {
          small: photo.user.profile_image.small,
          medium: photo.user.profile_image.medium,
          large: photo.user.profile_image.large,
        },
        links: {
          self: photo.user.links.self,
          html: photo.user.links.html,
          photos: photo.user.links.photos,
          likes: photo.user.links.likes,
        },
      },
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
      links: {
        self: photo.links.self,
        html: photo.links.html,
        download: photo.links.download,
      },
    };
  }
}
