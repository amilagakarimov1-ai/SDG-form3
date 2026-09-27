import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  
  // Base URL — always '/' for Vercel
  base: '/',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Increase warning limit to suppress the Mapbox/Leaflet chunk warning
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks for better caching
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'map-vendor':    ['leaflet', 'react-leaflet'],
          'chart-vendor':  ['recharts'],
          'ui-vendor':     ['zustand', 'react-hot-toast', 'lucide-react', 'axios'],
        },
      },
    },
  },
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}));
