import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Test-only config. The production build still uses vite.config.ts; this file
// exists so Vitest gets the React plugin and the `@` alias without pulling in
// the Tailwind plugin or the manual chunk splitting, which tests don't need.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
