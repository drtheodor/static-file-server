// @ts-check
import { writeIndex } from '@/util/files';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    prefetch: true,
    integrations: [
        {
            name: 'Generate index',
            hooks: {
                'astro:build:start': writeIndex,
            },
        },
    ],
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
