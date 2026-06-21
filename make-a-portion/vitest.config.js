import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

// Tests run in Node and talk to the real Supabase project (integration tests).
// We load .env + .env.test explicitly (empty prefix = all VITE_* vars) so the
// test credentials are reliably available — Vitest doesn't always pick up the
// mode-specific .env.test on its own.
export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 20000,
    env: loadEnv('test', process.cwd(), ''),
  },
});
