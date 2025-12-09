/**
 * CustomEmojiProvider
 *
 * Emoji handling using Emoji Mart for TipTap editor
 * Simplified approach without Atlaskit dependencies
 */

import React from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

/**
 * Emoji picker component for TipTap editor
 * Uses Emoji Mart for a full-featured emoji picker
 */
export const EmojiPicker = ({ onSelect }: { onSelect: (emoji: any) => void }) => {
  return React.createElement('div', { style: { width: '320px', height: '400px' } },
    React.createElement(Picker, {
      onSelect: onSelect,
      theme: "light",
      set: "twitter",
      style: { width: '100%', height: '100%' }
    })
  );
};

/**
 * Simple emoji provider for TipTap
 * Returns common emojis for mention-style insertion
 */
export const createEmojiProvider = () => {
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
    { id: '1f60a', shortName: ':blush:', fallback: '😊', name: 'smiling face with smiling eyes' },
    { id: '1f60d', shortName: ':heart_eyes:', fallback: '😍', name: 'smiling face with heart-eyes' },
    { id: '1f618', shortName: ':kissing_heart:', fallback: '😘', name: 'face blowing a kiss' },
    { id: '1f61c', shortName: ':wink:', fallback: '😉', name: 'winking face' },
    { id: '1f62a', shortName: ':sleepy:', fallback: '😪', name: 'sleepy face' },
  ];

  return {
    getEmojis: () => commonEmojis,
    findEmojiByShortName: (shortName: string) => {
      return commonEmojis.find(emoji => emoji.shortName === shortName);
    },
    findEmojiById: (id: string) => {
      return commonEmojis.find(emoji => emoji.id === id);
    },
    searchEmojis: (query: string) => {
      if (!query) return commonEmojis;
      const lowerQuery = query.toLowerCase();
      return commonEmojis.filter(emoji =>
        emoji.shortName.toLowerCase().includes(lowerQuery) ||
        emoji.name.toLowerCase().includes(lowerQuery)
      );
    }
  };
};

/**
 * Minimal emoji provider (no external dependencies)
 * Returns a simple set of common emojis
 */
export const createMinimalEmojiProvider = () => {
  return createEmojiProvider(); // Same implementation for now
};

export default {
  EmojiPicker,
  createEmojiProvider,
  createMinimalEmojiProvider,
};
