import { defineConfig } from 'vitest/config';

// Tes backend dan frontend dijalankan dari root agar cocok dengan Jenkinsfile (npx vitest run --coverage).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['backend/tests/**/*.test.js', 'frontend/tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['backend/src/**/*.js', 'frontend/src/**/*.js'],
      exclude: ['frontend/src/main.js'],
    },
  },
});
