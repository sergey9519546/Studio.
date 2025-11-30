import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    root: '.',
    build: {
      outDir: 'build/client',
      emptyOutDir: true,
    },

    define: {
      'process.env': {
        API_KEY: JSON.stringify(process.env.API_KEY || env.API_KEY || ''),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    }
  }
});
