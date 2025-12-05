// vite.config.ts - Production Optimizations
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // Resolve options
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
