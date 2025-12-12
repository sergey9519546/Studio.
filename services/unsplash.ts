/**
 * Unsplash API Service - Visual Similarity Discovery
 * Phase 2: AI-Suggested Similar Images
 */


const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

export function isUnsplashConfigured(): boolean {
  return Boolean(UNSPLASH_ACCESS_KEY);
}

export interface UnsplashImage {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  downloads?: number;
  likes: number;
  description: string | null;
  alt_description: string | null;
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
    download_location: string; // CRITICAL for API compliance
  };
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url?: string;
    bio?: string;
    location?: string;
    links: {
      self: string;
      html: string;
      photos: string;
    };
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export type UnsplashOrderBy = "latest" | "oldest" | "popular";

/**
 * Asset Analysis Interface
 */
export interface AssetAnalysis {
  lighting?: string;
  mood?: string[];
  styleReferences?: string[];
}

/**
 * Generate search queries from asset analysis using AI
 */
export async function generateSearchQueries(
  analysis: AssetAnalysis
): Promise<string[]> {
  // Gemini query generation (stub implementation)
  const queries = [];

  if (analysis.lighting) {
    queries.push(analysis.lighting);
  }

  if (analysis.mood && analysis.mood.length > 0) {
    queries.push(analysis.mood.join(" "));
  }

  if (analysis.styleReferences && analysis.styleReferences.length > 0) {
    queries.push(...analysis.styleReferences);
  }

  return queries.slice(0, 3); // Top 3 queries
}

/**
 * Search Unsplash for similar images
 */
export async function searchSimilarImages(
  query: string,
  perPage: number = 12,
  page: number = 1,
  color?: string,
  orientation?: string
): Promise<UnsplashSearchResponse> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key not configured (VITE_UNSPLASH_ACCESS_KEY)");
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage.toString(),
      page: page.toString(),
    });

    if (color) {
      params.set("color", color);
    }

    if (orientation) {
      params.set("orientation", orientation);
    }

    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as UnsplashSearchResponse;
    return data;
  } catch (error) {
    console.error("Failed to fetch similar images:", error);
    throw error;
  }
}

/**
 * Find images similar to an existing asset
 */
export async function findSimilarImages(
  assetAnalysis: AssetAnalysis
): Promise<UnsplashImage[]> {
  const queries = await generateSearchQueries(assetAnalysis);

  if (queries.length === 0) {
    return [];
  }

  // Search with first query (most relevant)
  const results = await searchSimilarImages(queries[0]);

  return results;
}

/**
 * Download Unsplash image tracking (required by API terms)
 * IMPORTANT: Must be called when user downloads/uses an image
 */
export async function trackDownload(image: UnsplashImage): Promise<void> {
  if (!image.links?.download_location) {
    console.warn("No download_location available for tracking");
    return;
  }

  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("Unsplash API key not configured");
    return;
  }

  try {
    // Per Unsplash API guidelines, trigger download tracking
    await fetch(image.links.download_location, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch (error) {
    console.error("Failed to track download:", error);
  }
}

/**
 * Photo Statistics Interface
 */
export interface PhotoStatistics {
  id: string;
  downloads: {
    total: number;
    historical: {
      change: number;
      resolution: string;
      quantity: number;
      values: { date: string; value: number }[];
    };
  };
  views: {
    total: number;
    historical: {
      change: number;
      resolution: string;
      quantity: number;
      values: { date: string; value: number }[];
    };
  };
  likes: {
    total: number;
    historical: {
      change: number;
      resolution: string;
      quantity: number;
      values: { date: string; value: number }[];
    };
  };
}

/**
 * Get a single photo by ID
 */
export async function getPhoto(photoId: string): Promise<UnsplashImage | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key not configured (VITE_UNSPLASH_ACCESS_KEY)");
  }

  if (!photoId) {
    throw new Error("photoId is required to fetch an Unsplash photo");
  }

  try {
    const response = await fetch(`${UNSPLASH_API_BASE}/photos/${photoId}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as UnsplashImage;
  } catch (error) {
    console.error("Failed to fetch Unsplash photo:", error);
    throw error;
  }
}

/**
 * Get photo statistics (views, downloads, likes)
 * Useful for showing popular/trending images
 */
export async function getPhotoStatistics(
  photoId: string
): Promise<PhotoStatistics | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key not configured (VITE_UNSPLASH_ACCESS_KEY)");
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos/${photoId}/statistics`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch photo statistics:", error);
    return null;
  }
}

/**
 * List photos (pagination, orderable)
 */
export async function listPhotos(
  page: number = 1,
  perPage: number = 12,
  orderBy: UnsplashOrderBy = "latest"
): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key not configured (VITE_UNSPLASH_ACCESS_KEY)");
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: orderBy,
    });

    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list photos: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as UnsplashImage[];
  } catch (error) {
    console.error("Failed to list Unsplash photos:", error);
    throw error;
  }
}
