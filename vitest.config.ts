import { defineConfig } from 'vitest/config';
import os from 'node:os';

function resolveMaxWorkers(): number | undefined {
  const raw = process.env.VITEST_MAX_WORKERS;
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  const cpuCount = typeof os.availableParallelism === 'function'
    ? os.availableParallelism()
    : os.cpus().length;
  return Math.min(4, Math.max(1, cpuCount));
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './vitest.setup.ts',
    setupFiles: ['./vitest.setup-files.ts'],
    // threads pool 配合 deps.external 避免 vitest transform 汉化版中文文件时 OOM。
    // vitest fork worker 的 transform 管线处理含中文的文件存在内存泄漏，
    // 即使单 worker 16GB 堆也会在 98 个测试文件后耗尽。
    pool: 'threads',
    maxWorkers: resolveMaxWorkers(),
    include: ['test/**/*.test.ts'],
    server: {
      deps: {
        external: [/dist\//],
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'bin/',
        '*.config.ts',
        'build.js',
        'test/**'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 3000
  }
});
