import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'zustand'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
    setupFiles: './src/test/setup.ts',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'copy-hostinger-rewrite',
      closeBundle() {
        const source = path.resolve(__dirname, 'public/.htaccess')
        const target = path.resolve(__dirname, 'dist/.htaccess')

        if (existsSync(source)) {
          copyFileSync(source, target)
        }
      },
    },
  ],
})
