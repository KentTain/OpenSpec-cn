import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseSchema } from '../../../src/core/artifact-graph/schema.js';
import { MAX_REQUIREMENT_TEXT_LENGTH } from '../../../src/core/validation/constants.js';

// `openspec validate` flags requirement text over MAX_REQUIREMENT_TEXT_LENGTH,
// but the specs instruction never told agents the limit, so they kept writing
// requirements that tripped it (#1976). Keep the stated limit tied to the
// validator's constant so the two cannot drift.
describe('specs instruction requirement length (#1976)', () => {
  it('states the validator limit and how to stay under it', () => {
    const schema = parseSchema(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'schemas', 'spec-driven', 'schema.yaml'),
        'utf-8'
      )
    );
    const instruction = schema.artifacts.find(a => a.id === 'specs')?.instruction ?? '';

    expect(instruction).toContain(`${MAX_REQUIREMENT_TEXT_LENGTH} 个字符以内`);
    expect(instruction).toContain('把覆盖多种行为的需求拆分为');
    // Existing requirements under MODIFIED must be copied whole (scenario-loss
    // validation rejects a split), and the limit is a warning that fails --strict.
    expect(instruction).toContain('`openspec-cn validate --strict` 会失败');
    expect(instruction).toContain('在 MODIFIED 下，保持既有需求块完整');
    // Strict CI catches new requirements before archive, and an existing long
    // requirement has a split path that keeps every scenario (#1976).
    expect(instruction).toContain('会在 ADDED 需求和主 spec 中标记更长的描述');
    expect(instruction).toContain('保留其标题和每个场景');
  });
});
