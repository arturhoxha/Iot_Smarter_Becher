import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()], // Vue-Plugin einfügen
  server: {
    proxy: {
      '/api': 'http://localhost:7071', // Lokale Azure Functions URL
    },
  },
});
