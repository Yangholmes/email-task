/**
 * @file vitest.config.ts
 * @author Yangholmes 2025-03-02
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'v8'
      include: ['src/**/*.{js,ts}'],
    },
    testTimeout: 10e3
  },
});
