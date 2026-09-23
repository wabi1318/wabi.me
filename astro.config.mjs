import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  integrations: [react()],
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
})
