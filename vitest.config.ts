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
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'], // Optional: Setup file
    include: ['frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './shared'),
      '@frontend': resolve(__dirname, './frontend'),
      '@': '/src',
    },
  },
})