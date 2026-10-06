import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = fs.readFileSync(
  path.join(REPO_ROOT, 'docs-lab', 'reference', 'skills.md'),
  'utf-8'
);
const ARCHIVE_SECTION = SKILLS.split('## openspec-archive-change')[1].split(
  '## openspec-new-change'
)[0];

describe('skills documentation', () => {
  it('documents archive sync with and without the sync workflow (#1975)', () => {
    expect(ARCHIVE_SECTION).toContain('当 `openspec-sync-specs` 已安装时');
    expect(ARCHIVE_SECTION).toContain('否则，它自行把增量规范合并进主 specs');
  });
});
