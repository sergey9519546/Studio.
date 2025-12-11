// Shim for missing createMediaSpec export in @atlaskit/adf-schema media.js
export const createMediaSpec = () => ({
  attrs: {
    id: {},
    type: {},
    collection: {},
    url: {},
    alt: {},
    title: {}
  },
  parseDOM: [],
  toDOM: () => ['div']
});

export const defaultAttrs = {
  id: '',
  type: 'file',
  collection: '',
  url: '',
  alt: '',
  title: ''
};
