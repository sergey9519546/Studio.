/**
 * CustomMentionProvider
 * 
 * Implements the MentionProvider interface to enable @mentions
 * in the Atlassian Editor, backed by our custom user directory API.
 * 
 * Architecture: Per the architectural document, this provider
 * queries /api/v1/users/search instead of Atlassian's Bifrost service.
 */

export interface MentionDescription {
  id: string;
  name: string;
  mentionName: string;
  avatarUrl?: string;
  nickname?: string;
  lozenge?: string;
}

export interface MentionProvider {
  filter(query: string): Promise<MentionDescription[]>;
  recordMentionSelection?(mention: MentionDescription): void;
  shouldHighlightMention?(mention: MentionDescription): boolean;
}

class CustomMentionProvider implements MentionProvider {
  /**
   * Filter users based on search query
   * Called when user types @ in the editor
   */
  async filter(query: string): Promise<MentionDescription[]> {
    try {
      // Empty query - return recent/suggested users
      if (!query || query.trim().length === 0) {
        return this.getSuggestedUsers();
      }

      // Search users via our API
      const response = await fetch(`/api/v1/users/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.error('Failed to fetch users for mentions:', response.status);
        return [];
      }

      const users = await response.json();
      
      // Transform to MentionDescription format
      return users.map((user: any) => ({
        id: user.id,
        name: user.name || user.displayName,
        mentionName: user.username || user.email.split('@')[0],
        avatarUrl: user.avatar || user.profilePicture,
        nickname: user.displayName,
        lozenge: user.role === 'admin' ? 'Admin' : undefined,
      }));
    } catch (error) {
      console.error('Error filtering mentions:', error);
      return [];
    }
  }

  /**
   * Get suggested users for empty query
   * Could be recent collaborators, team members, etc.
   */
  private async getSuggestedUsers(): Promise<MentionDescription[]> {
    try {
      const response = await fetch('/api/v1/users/suggested');
      
      if (!response.ok) {
        return [];
      }

      const users = await response.json();
      
      return users.slice(0, 5).map((user: any) => ({
        id: user.id,
        name: user.name || user.displayName,
        mentionName: user.username || user.email.split('@')[0],
        avatarUrl: user.avatar,
        nickname: user.displayName,
      }));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      return [];
    }
  }

  /**
   * Record mention selection for analytics
   * Optional - implement if you want to track mention usage
   */
  recordMentionSelection(mention: MentionDescription): void {
    // Optional: Send analytics event
    console.log('Mention selected:', mention.mentionName);
  }

  /**
   * Determine if a mention should be highlighted
   * Useful for highlighting the current user's mentions
   */
  shouldHighlightMention(mention: MentionDescription): boolean {
    // Could check if mention.id matches current user
    // For now, highlight all mentions
    return true;
  }
}

/**
 * Create and export the mention provider instance
 * Must be wrapped in a Promise as required by @atlaskit/editor-core
 */
export const createMentionProvider = (): Promise<MentionProvider> => {
  return Promise.resolve(new CustomMentionProvider());
};

export default createMentionProvider;
