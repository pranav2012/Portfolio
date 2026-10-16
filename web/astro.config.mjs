import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://pranav-agarwal.com',
    output: 'static',
    integrations: [sitemap()],
    image: {
        // YouTube thumbnails, downloaded and optimised at build time.
        remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com' }]
    },
    prefetch: { prefetchAll: true },
    vite: { plugins: [tailwindcss()] }
});
