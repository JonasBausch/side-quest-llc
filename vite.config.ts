import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Project page at https://jonasbausch.github.io/side-quest-llc/ — the base path
// must match the repo name so built asset URLs resolve on GitHub Pages.
export default defineConfig({
  base: '/side-quest-llc/',
  plugins: [react()],
  // Suite is pure logic (content validation, serialize, session resets), so the
  // default node environment is enough — no jsdom/happy-dom needed.
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
