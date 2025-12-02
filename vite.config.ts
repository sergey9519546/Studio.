// vite.config.ts - Production Optimizations
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    // Production optimizations
    target: 'es2015',
    outDir: 'build/client',
    emptyOutDir: false, // Prevent file locking issues on Windows
    sourcemap: false,
    minify: false, // Disable minification for debugging

    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // Resolve options
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
