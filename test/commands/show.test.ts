import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('top-level show command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-show-command-tmp');
  const changesDir = path.join(testDir, 'openspec', 'changes');
  const specsDir = path.join(testDir, 'openspec', 'specs');
  const openspecBin = path.join(projectRoot, 'bin', 'openspec.js');

  // threads pool 不支持 process.chdir()，用 cwd 参数替代
  const cwd = testDir;

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    const changeContent = `# Change: Demo\n\n## Why\nBecause reasons.\n\n## What Changes\n- **auth:** Add requirement\n`;
    await fs.mkdir(path.join(changesDir, 'demo'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'demo', 'proposal.md'), changeContent, 'utf-8');

    const specContent = `## Purpose\nAuth spec.\n\n## Requirements\n\n### Requirement: User Authentication\nText\n`;
    await fs.mkdir(path.join(specsDir, 'auth'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'auth', 'spec.md'), specContent, 'utf-8');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('prints hint and non-zero exit when no args and non-interactive', () => {
    const originalEnv = { ...process.env };
    try {
      process.env.OPEN_SPEC_INTERACTIVE = '0';
      let err: any;
      try {
        execSync(`node ${openspecBin} show`, { encoding: 'utf-8', cwd });
      } catch (e) { err = e; }
      expect(err).toBeDefined();
      expect(err.status).not.toBe(0);
      const stderr = err.stderr.toString();
      expect(stderr).toContain('没有可显示的内容');
      expect(stderr).toContain('openspec-cn show <item>');
      expect(stderr).toContain('openspec-cn change show');
      expect(stderr).toContain('openspec-cn spec show');
    } finally {
      process.env = originalEnv;
    }
  });

  it('auto-detects change id and supports --json', () => {
    const output = execSync(`node ${openspecBin} show demo --json`, { encoding: 'utf-8', cwd });
    const json = JSON.parse(output);
    expect(json.id).toBe('demo');
    expect(Array.isArray(json.deltas)).toBe(true);
  });

  it('auto-detects spec id and supports spec-only flags', () => {
    const output = execSync(`node ${openspecBin} show auth --json --requirements`, { encoding: 'utf-8', cwd });
    const json = JSON.parse(output);
    expect(json.id).toBe('auth');
    expect(Array.isArray(json.requirements)).toBe(true);
  });

  it('handles ambiguity and suggests --type', async () => {
    await fs.mkdir(path.join(changesDir, 'foo'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'foo', 'proposal.md'), '# Change: Foo\n\n## Why\n\n## What Changes\n', 'utf-8');
    await fs.mkdir(path.join(specsDir, 'foo'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'foo', 'spec.md'), '## Purpose\n\n## Requirements\n\n### Requirement: R\nX', 'utf-8');

    let err: any;
    try {
      execSync(`node ${openspecBin} show foo`, { encoding: 'utf-8', cwd });
    } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).not.toBe(0);
    const stderr = err.stderr.toString();
    expect(stderr).toContain('模糊的项目');
    expect(stderr).toContain('--type change|spec');
  });

  it('prints nearest matches when not found', () => {
    let err: any;
    try {
      execSync(`node ${openspecBin} show unknown-item`, { encoding: 'utf-8', cwd });
    } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).not.toBe(0);
    const stderr = err.stderr.toString();
    expect(stderr).toContain("未知项目");
    expect(stderr).toContain('你是否想输入：');
  });
});
