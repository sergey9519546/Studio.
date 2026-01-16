/**
 * SERVICE: Recent Searches Manager
 * PURPOSE: Manage search history using browser LocalStorage
 * STORAGE KEY: "moodboard_recent_searches"
 * MAX ITEMS: 10 (FIFO queue)
 */

const STORAGE_KEY = 'moodboard_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

/**
 * FUNCTION: Get recent searches from LocalStorage
 * RETURNS: Array of search queries (most recent first)
 */
export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const searches: RecentSearch[] = JSON.parse(stored);
    return searches.map(s => s.query);
  } catch (error) {
    console.error('Failed to read recent searches:', error);
    return [];
  }
}

/**
 * FUNCTION: Add a search query to recent searches
 * LOGIC:
 *   1. Remove duplicates (if query already exists)
 *   2. Prepend new query to beginning
 *   3. Limit to MAX_RECENT_SEARCHES
 *   4. Persist to LocalStorage
 */
export function addRecentSearch(query: string): void {
  if (!query.trim()) return;

  try {
    const searches = getRecentSearches();

    // STEP 1: Remove duplicate if exists
    const filtered = searches.filter(q => q.toLowerCase() !== query.toLowerCase());

    // STEP 2: Prepend new query (most recent first)
    const updated = [query, ...filtered];

    // STEP 3: Limit to MAX size (FIFO queue)
    const limited = updated.slice(0, MAX_RECENT_SEARCHES);

    // STEP 4: Convert to timestamped format
    const withTimestamps: RecentSearch[] = limited.map(q => ({
      query: q,
      timestamp: Date.now()
    }));

    // STEP 5: Persist to LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamps));
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
}

/**
 * FUNCTION: Clear all recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent searches:', error);
  }
}

/**
 * FUNCTION: Remove a specific search from recent list
 */
export function removeRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(q => q !== query);

    const withTimestamps: RecentSearch[] = filtered.map(q => ({
      query: q,
      timestamp: Date.now()
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamps));
  } catch (error) {
    console.error('Failed to remove recent search:', error);
  }
}
