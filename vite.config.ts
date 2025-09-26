import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://futeur.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            console.log('Headers being forwarded:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't externalize Clerk modules
        if (id.includes('@clerk')) {
          return false;
        }
        return false;
      },
      output: {
        manualChunks: {
          'clerk': ['@clerk/clerk-react'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['@clerk/clerk-react'],
  },
}));
