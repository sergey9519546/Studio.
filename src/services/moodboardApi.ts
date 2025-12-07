import { UnsplashImage } from '../services/unsplash';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Save Unsplash image to moodboard
 */
export async function saveUnsplashImage(
  projectId: string,
  image: UnsplashImage
): Promise<void> {
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

  const response = await fetch(`${API_BASE}/moodboard/${projectId}/from-unsplash`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('Failed to save Unsplash image');
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  itemId: string,
  isFavorite: boolean
): Promise<void> {
  const response = await fetch(`${API_BASE}/moodboard/${itemId}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isFavorite }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }
}

/**
 * Get all favorites for a project
 */
export async function getFavorites(projectId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE}/moodboard/${projectId}/favorites`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return response.json();
}

/**
 * Create a collection
 */
export async function createCollection(
  projectId: string,
  name: string,
  description?: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/moodboard/${projectId}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error('Failed to create collection');
  }

  return response.json();
}

/**
 * Get all collections for a project
 */
export async function getCollections(projectId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE}/moodboard/${projectId}/collections`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }
  
  return response.json();
}

/**
 * Add item to collection
 */
export async function addToCollection(
  itemId: string,
  collectionId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/moodboard/${itemId}/collection/${collectionId}`,
    { method: 'PATCH' }
  );

  if (!response.ok) {
    throw new Error('Failed to add to collection');
  }
}
