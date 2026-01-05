/// <reference types="vitest" />
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Use jsdom for frontend tests, node for backend tests
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'backend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
    ],
    // Configure for both frontend and backend
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './shared'),
      '@frontend': resolve(__dirname, './frontend'),
      '@backend': resolve(__dirname, './backend'),
      '@': '/src',
    },
  },
})