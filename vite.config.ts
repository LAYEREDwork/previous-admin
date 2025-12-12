import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 2342,
  },
  preview: {
    host: '0.0.0.0',
    port: 2342,
    allowedHosts: ['cube.local', 'next.local', 'localhost', '127.0.0.1'],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
