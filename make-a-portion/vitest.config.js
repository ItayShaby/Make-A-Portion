import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

const KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_TEST_EMAIL', 'VITE_TEST_PASSWORD'];

// In CI (GitHub Actions) the values arrive as real environment variables (from
// repository secrets). Locally they come from .env / .env.test. Local files
// take precedence when both are present.
const fromProcess = Object.fromEntries(
  KEYS.filter((k) => process.env[k] != null).map((k) => [k, process.env[k]]),
);
const fromFiles = loadEnv('test', process.cwd(), '');

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 20000,
    env: { ...fromProcess, ...fromFiles },
  },
});
