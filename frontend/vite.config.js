import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Saat development, request /api diteruskan ke Express (npm run dev:api)
    proxy: { '/api': 'http://localhost:3000' },
  },
});
