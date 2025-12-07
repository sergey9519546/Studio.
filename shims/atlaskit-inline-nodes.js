// Shim for missing inline-nodes export in @atlaskit/adf-schema
// The upstream package sometimes omits dist/esm/schema/inline-nodes.js.
// This lightweight fallback keeps the bundle building; update to upstream
// once the package is aligned.
export const inlineNodes = new Set();
