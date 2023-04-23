import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './webSocketPluginVite.js';

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/*': {
                target: 'http://192.168.1.18:3001',
                changeOrigin: true,
                secure: false
            }
        }
    },
    preview: { port: 3000 },
    plugins: [sveltekit(), webSocketServer],
    resolve: {
        alias: {
            "xmlhttprequest-ssl": "./node_modules/engine.io-client/lib/xmlhttprequest.js"
        }
    },
    // build: {
    //     sourcemap: false,
    //     minify: false
    // } Uncomment for debugging prod chefB
});
