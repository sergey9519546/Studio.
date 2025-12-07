/**
 * CustomEmojiProvider
 * 
 * Implements the EmojiProvider using @atlaskit/emoji's EmojiResource
 * Configured to use a custom emoji dataset instead of Atlassian's CDN.
 * 
 * Architecture: Per the architectural document, we can either:
 * 1. Host emoji assets on our own CDN/S3
 * 2. Use Atlassian's public emoji CDN (acceptable for non-GDPR-strict use cases)
 * 3. Use a minimal unicode emoji set
 * 
 * This implementation uses approach #2 (Atlassian public CDN) for simplicity,
 * but can be easily swapped to self-hosted.
 */

import { EmojiProvider, EmojiResource } from '@atlaskit/emoji';

interface EmojiConfig {
  providers?: Array<{
    url: string;
  }>;
  allowUpload?: boolean;
}

/**
 * Create Emoji Provider using EmojiResource
 * 
 * The EmojiResource handles:
 * - Loading emoji sprite sheets
 * - Typeahead search when user types :
 * - Rendering emoji in the editor
 */
export const createEmojiProvider = (): Promise<EmojiProvider> => {
  // Option 1: Use Atlassian's public emoji CDN (simple, no hosting required)
  const emojiResource = new EmojiResource({
    providers: [
      {
        // Atlassian's public emoji service
        url: 'https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard',
      },
    ],
    allowUpload: false, // Disable custom emoji upload for now
  });

  /* Option 2: Use self-hosted emoji data (for full data sovereignty)
   * 
   * 1. Download emoji sprite sheets and JSON data
   * 2. Upload to your S3 bucket or CDN
   * 3. Configure provider URL:
   * 
   * const emojiResource = new EmojiResource({
   *   providers: [{
   *     url: 'https://your-cdn.com/emojis/standard'
   *   }],
   *   allowUpload: false,
   * });
   */

  /* Option 3: Use a minimal static emoji set
   * 
   * Create a simple JSON file with common emojis:
   * {
   *   "emojis": [
   *     { "id": "1f600", "name": "grinning", "fallback": "😀", "shortName": ":grinning:" },
   *     { "id": "1f602", "name": "joy", "fallback": "😂", "shortName": ":joy:" },
   *     ...
   *   ]
   * }
   * 
   * Host this file and point the provider to it.
   */

  return Promise.resolve(emojiResource);
};

/**
 * Alternative: Minimal Emoji Provider (no external dependencies)
 * 
 * If you want complete control and minimal dependencies,
 * you can create a simple provider that just returns a static list.
 * 
 * Note: This won't have the full emoji picker UI, but will allow
 * basic emoji insertion via shortcuts like :smile:
 */
export const createMinimalEmojiProvider = (): Promise<any> => {
  const commonEmojis = [
    { id: '1f600', shortName: ':grinning:', fallback: '😀', name: 'grinning face' },
    { id: '1f602', shortName: ':joy:', fallback: '😂', name: 'face with tears of joy' },
    { id: '1f604', shortName: ':smile:', fallback: '😄', name: 'grinning face with smiling eyes' },
    { id: '2764', shortName: ':heart:', fallback: '❤️', name: 'red heart' },
    { id: '1f44d', shortName: ':+1:', fallback: '👍', name: 'thumbs up' },
    { id: '1f44e', shortName: ':-1:', fallback: '👎', name: 'thumbs down' },
    { id: '1f4af', shortName: ':100:', fallback: '💯', name: 'hundred points' },
    { id: '1f680', shortName: ':rocket:', fallback: '🚀', name: 'rocket' },
    { id: '1f389', shortName: ':tada:', fallback: '🎉', name: 'party popper' },
    { id: '1f4a1', shortName: ':bulb:', fallback: '💡', name: 'light bulb' },
  ];

  const minimalProvider = {
    filter: async (query: string) => {
      if (!query) return commonEmojis;
      
      const lowerQuery = query.toLowerCase();
      return commonEmojis.filter(emoji =>
        emoji.shortName.toLowerCase().includes(lowerQuery) ||
        emoji.name.toLowerCase().includes(lowerQuery)
      );
    },
    findByShortName: async (shortName: string) => {
      return commonEmojis.find(emoji => emoji.shortName === shortName);
    },
    findById: async (id: string) => {
      return commonEmojis.find(emoji => emoji.id === id);
    },
  };

  return Promise.resolve(minimalProvider);
};

export default createEmojiProvider;
