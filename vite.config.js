import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/Image',
  server: {
    allowedHosts: [
      'b29a2ea76bce.ngrok-free.app', // 👈 your ngrok domain
    ],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});