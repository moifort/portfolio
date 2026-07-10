import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://mottet.me',
  trailingSlash: 'never',
  integrations: [sitemap()],
})
