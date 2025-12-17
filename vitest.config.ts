import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      exclude: [
        'node_modules/',
        'src/test.ts',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      all: true,
      skipFull: false
    }
  }
});
