/**
 * Unsplash API Service - Visual Similarity Discovery
 * Phase 2: AI-Suggested Similar Images
 */


const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  color: string;
}

/**
 * Generate search queries from asset analysis using AI
 */
export async function generateSearchQueries(analysis: any): Promise<string[]> {
  // Gemini query generation (stub implementation)
  const queries = [];
  
  if (analysis.lighting) {
    queries.push(analysis.lighting);
  }
  
  if (analysis.mood &&analysis.mood.length > 0) {
    queries.push(analysis.mood.join(' '));
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
  perPage: number = 12
): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch similar images:', error);
    return [];
  }
}

/**
 * Find images similar to an existing asset
 */
export async function findSimilarImages(
  assetAnalysis: any
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
 */
export async function trackDownload(downloadLocation: string): Promise<void> {
  if (!downloadLocation) return;
  
  try {
    await fetch(downloadLocation);
  } catch (error) {
    console.error('Failed to track download:', error);
  }
}
