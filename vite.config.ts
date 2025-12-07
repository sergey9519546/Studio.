// vite.config.ts - Production Optimizations
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

const iconCorePath = resolve(__dirname, "node_modules/@atlaskit/icon/core");
const iconEsmPath = resolve(__dirname, "node_modules/@atlaskit/icon/dist/esm");
const iconGlyphPath = resolve(__dirname, "node_modules/@atlaskit/icon/glyph");

export default defineConfig({
  plugins: [react()],

  build: {
    // Production optimizations
    target: "es2015",
    outDir: "build/client",
    emptyOutDir: false, // Prevent file locking issues on Windows
    sourcemap: false,
    minify: "esbuild", // Use esbuild for faster, more reliable minification

    // Code splitting for better caching and CLS prevention
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react"],
          "query-vendor": ["@tanstack/react-query"],
        },
        // Optimize chunk loading
        inlineDynamicImports: false,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // CSS code splitting
    cssCodeSplit: true,
  },

  server: {
    port: 5173,
    proxy: {
      // Proxy API v1 requests to backend
      "/api/v1": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Legacy fallback for non-versioned API calls (if any remain)
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // Resolve options
  resolve: {
    alias: [
      {
        find: "@atlaskit/icon/utility/migration/cross-circle",
        replacement: `${iconCorePath}/migration/cross-circle.js`,
      },
      {
        find: "@atlaskit/icon/utility/migration",
        replacement: `${iconCorePath}/migration`,
      },
      {
        find: "@atlaskit/icon/utility",
        replacement: iconEsmPath,
      },
      {
        find: /^@atlaskit\/icon\/core\/(.+)/,
        replacement: `${resolve(
          __dirname,
          "node_modules/@atlaskit/icon/glyph"
        )}/$1.js`,
      },
      {
        find: "@atlaskit/editor-core/node_modules/@atlaskit/adf-schema/dist/esm/schema/inline-nodes",
        replacement: "/shims/atlaskit-inline-nodes.js",
      },
      { find: "@", replacement: "/src" },
    ],
    dedupe: [
      "@atlaskit/media-client",
      "@atlaskit/tokens",
      "@atlaskit/editor-common",
      "@atlaskit/adf-utils",
      "@atlaskit/media-ui",
      "@atlaskit/icon",
      "@atlaskit/icon-object",
    ],
  },
});
