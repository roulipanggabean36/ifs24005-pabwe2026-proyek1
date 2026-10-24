import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['frontend/tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['frontend/src/**/*.js'],
    },
  },
});