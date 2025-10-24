// @ts-check
import { defineConfig } from 'astro/config';

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    prefetch: true,
    redirects: {
        '/': {
            status: 302,
            destination: `browse/`,
        },
    },
});
