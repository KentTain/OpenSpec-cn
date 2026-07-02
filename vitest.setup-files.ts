// vitest threads pool 不支持 process.chdir()。
// polyfill chdir/cwd，并确保 execSync/spawn 等使用正确的 cwd。
import { execSync as origExecSync } from 'node:child_process';

let cwd = process.cwd();

try {
  process.chdir(cwd);
} catch {
  Object.defineProperty(process, 'chdir', {
    value: (dir: string) => { cwd = dir; },
    writable: true,
    configurable: true,
  });
  Object.defineProperty(process, 'cwd', {
    value: () => cwd,
    writable: true,
    configurable: true,
  });
}

// 包装 execSync，确保默认 cwd 使用 polyfill 追踪的值
const cp = require('node:child_process');
const _execSync = cp.execSync;
cp.execSync = function (command: string, options?: any) {
  if (!options?.cwd) {
    options = { ...options, cwd };
  }
  return _execSync(command, options);
};
