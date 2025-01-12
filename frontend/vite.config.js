import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'NewsM',
        short_name: 'YourNews',
        description: 'A news app built with React',
        start_url: '/', // Add this
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // Add this for better icon support
          },
          {
            src: '/icon-512x512.png',
            sizes: '384X384',
            type: 'image/png',
            purpose: 'any maskable' // Add this for better icon support
          },
        ],
      },
      devOptions: {
        enabled: true // Enable PWA in development
      },
      // Add workbox configuration
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    }),
  ],
});