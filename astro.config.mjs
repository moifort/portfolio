import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

export default defineConfig({
  site: 'https://mottet.me',
  trailingSlash: 'never',
  integrations: [sitemap(), icon()],
})
