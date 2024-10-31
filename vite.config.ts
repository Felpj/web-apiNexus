import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#fe6000', // Cor primária (laranja)
          '@body-background': '#0f172a', // Background
          '@component-background': '#1e293b', // Secondary background
          '@text-color': '#ffffff', // Cor do texto
          '@heading-color': '#ffffff', // Cor dos títulos
          '@layout-body-background': '#0f172a',
          '@layout-header-background': '#1e293b',
          '@layout-sider-background': '#1e293b',
        },
      },
    },
  },
});
