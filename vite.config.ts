import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 2342,
    allowedHosts: ['cube.local', 'next.local', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: '0.0.0.0',
    port: 2342,
    allowedHosts: ['cube.local', 'next.local', 'localhost', '127.0.0.1'],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@shared': resolve(__dirname, './shared'),
      '@frontend': resolve(__dirname, './frontend'),
    },
  },
});
