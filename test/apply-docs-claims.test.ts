import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = fs.readFileSync(
  path.join(REPO_ROOT, 'docs-lab', 'reference', 'cli.md'),
  'utf-8'
);
const SKILLS = fs.readFileSync(
  path.join(REPO_ROOT, 'docs-lab', 'reference', 'skills.md'),
  'utf-8'
);
const APPLY_INSTRUCTIONS = CLI.split('## openspec-cn instructions')[1].split(
  '## openspec-cn templates'
)[0];
const APPLY_SKILL = SKILLS.split('## openspec-apply-change')[1].split(
  '## openspec-update-change'
)[0];

describe('apply documentation', () => {
  it('documents every task source-location field in the CLI contract', () => {
    const taskFields = ['`id`', '`description`', '`done`', '`sourcePath`', '`line`'];

    for (const field of taskFields) {
      expect(APPLY_INSTRUCTIONS).toContain(field);
    }

    expect(APPLY_INSTRUCTIONS).toContain('被追踪文件的绝对路径');
    expect(APPLY_INSTRUCTIONS).toContain('该任务复选框在文件中从 1 开始的行号');
  });

  it('documents that the apply skill can update tasks across tracked files', () => {
    expect(APPLY_SKILL).toContain(
      '由 `sourcePath` 和从 1 开始的 `line` 定位的被追踪文件'
    );
    expect(APPLY_SKILL).toContain('跨多个文件追踪任务');
    expect(APPLY_SKILL).not.toContain('只更新 tasks 文件');
  });
});
