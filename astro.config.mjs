// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    prefetch: true,
    vite: {
        plugins: [tailwindcss()]
    },
    redirects: {
        '/': {
            status: 302,
            destination: `browse/`,
        },
    },
});
