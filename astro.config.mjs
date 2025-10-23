// @ts-check
import { defineConfig } from 'astro/config';

const BASE_URL = '/maven';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    base: BASE_URL,
    redirects: {
        '/': {
            status: 302,
            destination: `${BASE_URL}/browse/`,
        },
    },
});
