import { describe, expect, it } from 'vitest';

import { serializeConfig } from '../../src/core/config-prompts.js';

describe('config prompts', () => {
  it('guides agents toward context they cannot infer from the codebase', () => {
    const config = serializeConfig({ schema: 'spec-driven' });

    expect(config).toContain('只添加应当约束 OpenSpec 产出物和工作流的要求');
    expect(config).toContain('包含 AI 无法通过阅读代码推断出的约束');
    expect(config).toContain('不要放通用的项目文档和可从代码中发现的事实');
    expect(config).toContain('设计和任务必须覆盖 Windows、macOS 和 Linux');
    expect(config).toContain('所有产出物使用中文撰写');
    expect(config).toContain('始终说明范围之外的内容');
    expect(config).not.toContain('Always include a "Non-goals" section');
    expect(config).not.toContain('Add your tech stack');
    expect(config).not.toContain('Domain: e-commerce platform');
  });
});
