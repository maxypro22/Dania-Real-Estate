import { defineConfig, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Serve the Decap CMS shell (public/dashboard/index.html) for the /dashboard
// directory path. Without this, Vite's SPA fallback rewrites /dashboard/ to the
// app's index.html and React Router shows its 404 instead of the CMS.
// (In production Vercel serves the static file directly, before its rewrite.)
function serveDashboard() {
  const file = path.resolve(__dirname, 'public/dashboard/index.html')
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url ?? '').split('?')[0]
    if (url === '/dashboard' || url === '/dashboard/') {
      res.setHeader('Content-Type', 'text/html')
      res.end(fs.readFileSync(file))
      return
    }
    next()
  }
  return {
    name: 'serve-dashboard-html',
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [serveDashboard(), react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    target: 'esnext',           // ship modern JS — no legacy polyfills
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
        },
      },
    },
  },
})
