import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.png', 'pwa-512.png', 'pwa-maskable-512.png'],
      manifest: {
        name: 'EmpireGuichet',
        short_name: 'EmpireGuichet',
        description: "Application de gestion de guichet mobile money pour agents et chefs d'agence",
        theme_color: '#1B2A41',
        background_color: '#1B2A41',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Précache le "coquille" de l'application (JS/CSS/HTML) pour qu'elle
        // s'ouvre même sans connexion. Les données (Supabase) restent en ligne.
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        // Laisse toujours les appels réseau réels (Supabase) passer normalement ;
        // le cache ne sert qu'à afficher l'appli quand il n'y a pas de réseau du tout.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
