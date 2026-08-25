import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page at https://jonasbausch.github.io/side-quest-llc/ — the base path
// must match the repo name so built asset URLs resolve on GitHub Pages.
export default defineConfig({
  base: '/side-quest-llc/',
  plugins: [react()],
});
