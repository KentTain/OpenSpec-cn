import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readPage(relativePath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, ...relativePath.split('/')), 'utf-8');
}

const CLI_INIT = readPage('docs-lab/reference/cli.md')
  .split('## openspec-cn init')[1]
  .split('## openspec-cn update')[0];
const STORE_INTEGRATIONS = readPage('docs-lab/multi-repo/stores.md')
  .split('### 在仅有 store 的仓库中安装集成')[1]
  .split('### 你机器上的 `defaultStore`')[0];

describe('store-only init documentation', () => {
  it.each([
    ['CLI reference', CLI_INIT],
    ['Stores guide', STORE_INTEGRATIONS],
  ])('keeps the complete pointer-repository contract in the %s', (_name, section) => {
    expect(section).toContain('仓库根目录');
    expect(section).toContain('逐字节保留');
    expect(section).toContain('`openspec/specs/` 和 `openspec/changes/`');
    expect(section).toContain('不会在代码仓库中创建');
    expect(section).toContain('`--language`');
    expect(section).toContain('外部 store 的配置');
  });
});
