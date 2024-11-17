import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'erkin-unlu',
      project: 'groceries',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
