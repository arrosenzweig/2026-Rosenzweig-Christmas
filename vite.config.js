import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works from GitHub Pages, a subfolder, or file://
export default defineConfig({
  base: './',
  plugins: [react()],
});
