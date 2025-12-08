import { UnsplashImage } from "../../services/unsplash";

const getDefaultApiBase = () => {
  if (typeof window !== "undefined") {
    // Relative path works with Vite dev proxy and when served behind the API domain
    return "/api/v1";
  }
  // Node/test environments fall back to the local API port
  return "http://localhost:3001/api/v1";
};

export const API_BASE = import.meta.env.VITE_API_URL || getDefaultApiBase();

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

// Type definitions for moodboard-related data
export interface MoodboardItem {
  id: string;
  unsplashId?: string;
  imageUrl: string;
  photographerName: string;
  photographerUrl: string;
  description?: string;
  altDescription?: string;
  color?: string;
  width: number;
  height: number;
  isFavorite?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
}

// Input validation helper
function validateId(id: string, name: string): void {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    throw new Error(`${name} must be a non-empty string`);
  }
}

function validateName(name: string, param: string): void {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new Error(`${param} must be a non-empty string`);
  }
}

// Generic helper function for API requests with improved error handling
async function apiRequest<T = void>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(
        `Request failed (${response.status} ${response.statusText}): ${message || "Unknown error"}`
      );
    }

    // For void returns (no body expected)
    if (response.status === 204) return undefined as T;

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    console.error("API Request failed:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Save Unsplash image to moodboard.
 * @param projectId - The project ID to associate the image with
 * @param image - The Unsplash image to save
 */
export async function saveUnsplashImage(
  projectId: string,
  image: UnsplashImage
): Promise<void> {
  validateId(projectId, 'projectId');

  const dto = {
    projectId,
    unsplashId: image.id,
    imageUrl: image.urls.regular,
    photographerName: image.user.name,
    photographerUrl: image.user.links.html,
    description: image.description,
    altDescription: image.alt_description,
    color: image.color,
    width: image.width,
    height: image.height,
  };

  await apiRequest(`/moodboard/${projectId}/from-unsplash`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Toggle favorite status for a moodboard item.
 * @param itemId - The item ID to toggle
 * @param isFavorite - The new favorite status
 */
export async function toggleFavorite(
  itemId: string,
  isFavorite: boolean
): Promise<void> {
  validateId(itemId, 'itemId');

  await apiRequest(`/moodboard/${itemId}/favorite`, {
    method: "PATCH",
    body: JSON.stringify({ isFavorite }),
  });
}

/**
 * Get all favorites for a project.
 * @param projectId - The project ID to fetch favorites for
 * @returns Array of favorite moodboard items
 */
export async function getFavorites(
  projectId: string
): Promise<MoodboardItem[]> {
  validateId(projectId, 'projectId');

  return apiRequest<MoodboardItem[]>(`/moodboard/${projectId}/favorites`);
}

/**
 * Create a new collection for a project.
 * @param projectId - The project ID to create the collection in
 * @param name - The name of the collection
 * @param description - Optional description of the collection
 * @returns The created collection
 */
export async function createCollection(
  projectId: string,
  name: string,
  description?: string
): Promise<Collection> {
  validateId(projectId, 'projectId');
  validateName(name, 'name');

  return apiRequest<Collection>(`/moodboard/${projectId}/collections`, {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

/**
 * Get all collections for a project.
 * @param projectId - The project ID to fetch collections for
 * @returns Array of collections
 */
export async function getCollections(projectId: string): Promise<Collection[]> {
  validateId(projectId, 'projectId');

  return apiRequest<Collection[]>(`/moodboard/${projectId}/collections`);
}

/**
 * Add a moodboard item to a collection.
 * @param itemId - The item ID to add
 * @param collectionId - The collection ID to add to
 */
export async function addToCollection(
  itemId: string,
  collectionId: string
): Promise<void> {
  validateId(itemId, 'itemId');
  validateId(collectionId, 'collectionId');

  await apiRequest(`/moodboard/${itemId}/collection/${collectionId}`, {
    method: "PATCH",
  });
}
