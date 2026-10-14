import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPlugin } from './build/seoPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), seoPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'build/**/*.test.ts'],
    css: false,
  },
})
