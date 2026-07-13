import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxUpdateCommandTemplate,
  getOpsxVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getUpdateChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import {
  generateSkillContent,
  getCommandContents,
  getSkillTemplates,
} from '../../../src/core/shared/skill-generation.js';
import { STORE_SELECTION_GUIDANCE } from '../../../src/core/templates/workflows/store-selection.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '16640b84e8ed5fb8aa9589e4c0611f0dd3802763d6a7a48932f827905ca1769f',
  getNewChangeSkillTemplate: '9c1c15bb0c22835b3eb0cbb04256fc4884d9e27877c31570b62b6b20ad0e5d92',
  getContinueChangeSkillTemplate: '62863188a67f6828862ed8f806ac62e2095dfd12968c08186c3fb7c78d70f70a',
  getApplyChangeSkillTemplate: 'f27411e312d00704cd958278d6cfa9f92ec85218187d57456538a20dc9e1ba2e',
  getFfChangeSkillTemplate: 'bd60b9425c5706e4e26909510c9843fa3269719324f8e9f0f3406f2ff29a5f06',
  getSyncSpecsSkillTemplate: '8e3061128a30ae43644606f3e3bd0153986290aeefa1af5dd7c92e8c90e5781b',
  getOnboardSkillTemplate: '9215f63e6da5ae760a9989331d93ad6956362301b78aff52ec5c3ce930fdaab0',
  getOpsxExploreCommandTemplate: 'b171f4d641dfd1fbfae6c78f1fcde8640453a6ee9a63953b7a9c5406f7c24085',
  getOpsxNewCommandTemplate: '5ed6b38606a643acbccc65badda35c766ce260e2d5cda6c55ea88adc82f4fe13',
  getOpsxContinueCommandTemplate: '8d3f9b339fd274400ed95970034c5abbf2d8e9b26000cbf6c5494fb519fac1a1',
  getOpsxApplyCommandTemplate: 'f769064145973329109a9c42560a6e1ffd01bdab4351d5500ca12d98f2f9cf70',
  getOpsxFfCommandTemplate: '6ad02e411b19df8143ece2120bb8f9731c6d6784a58113ff00c6b8c68591e979',
  getArchiveChangeSkillTemplate: '000ea894e51f8ae6a3957a0d6f8fd36fc892d6c84aafd02b7b77294c5e17c933',
  getBulkArchiveChangeSkillTemplate: 'a6b01ea2d4222c0b34d332a9ed3772f7958cc55de980e7f1821cdb30e4b3cba2',
  getOpsxSyncCommandTemplate: '71dc2adf5c3715e01beea756ec99618aada36472012a62c71fe15153418ecde5',
  getVerifyChangeSkillTemplate: 'eabb64f6d2399f0450470a7c0a2b0c69776992936d4f809d2a1cf6908aa9a10e',
  getOpsxArchiveCommandTemplate: 'fd779c792e509c66237ca262d50ad110052ac4759a9c0a84958372531bcf4e63',
  getOpsxOnboardCommandTemplate: '5a68cd4e3d17d317037f599c44801df675f8720c5caf4f1935cb0aeee8a0f335',
  getOpsxBulkArchiveCommandTemplate: 'f89ca5e13e4f594336db79957599c307b832611170aee87aef90b30f570a3ef9',
  getOpsxVerifyCommandTemplate: 'd06eb96014c36ef85cc1a73eef68aac3d273f25e9ac0a07bbd7c5d143f718837',
  getOpsxProposeSkillTemplate: '540bfd286891e6c854cdad783fe77fb9407462545270e6930252c1718cd00c18',
  getOpsxProposeCommandTemplate: '6a08bc0a352df683d4d8c8688bd0f75b67d690fdecd8612dfe682a502099d106',
  getFeedbackSkillTemplate: '7e8493e4fc577fb4ecb44056e1085abb697f91b2eeb176cc4f8ab7085cbf481f',
  getUpdateChangeSkillTemplate: 'fe2e8edaf973d42dc7fc7dfd846105c4c3cfec0437606e582ec644985cd4e81d',
  getOpsxUpdateCommandTemplate: 'e55ac5774203a7d9037d2d588889c97c53f3f930da49497cc79e865375920da7',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': 'ba099821631ce75ee70af370917bbddbc88d0882ad0e50e91ed687d2185102ef',
  'openspec-new-change': 'd5b8909bea70a33b7a312b38ce204a91f40b6bb2bff12c4c06b3e11641b6a689',
  'openspec-continue-change': '39b4467a4873cde7c97d52c80d53ac647b220bf7c9d96f4e6505f3188e1a1642',
  'openspec-apply-change': '09c0e1cdf5ccc82416d0969d6bd715cc70616bdbc3531358a5c36057f78be55a',
  'openspec-ff-change': '8d5a8890eccbd97d714fbab1d73472f79ad9104b519e000264ae43d752cdf631',
  'openspec-sync-specs': 'f6a1581eb11a30061795c42582db6fa4f5e1f213b4b7cad9f3cbfbe3e9fb2d97',
  'openspec-archive-change': '1821aee5a06afd895d59d1e1d16495e484b6087ecf59ec93460d7d5e7851e772',
  'openspec-bulk-archive-change': '7b09b04a440809dd7dbf0b1d7b695cbb8c41184d8d104eb32e82d7cdfb476d18',
  'openspec-verify-change': '9a8735eaaa34c278d2193eb32fa736f4b111d1c47e675971c8df40f81d20c8c3',
  'openspec-onboard': 'b1b6fc9a1b3ff64dafe9b8c39a761ee1bd001b542d47b4e4deaf058e0aa21256',
  'openspec-propose': '0cfc9278123d973929cb4da3ea7ac8ae1b6c84b472eed4fb753657b8347eaeb9',
  'openspec-update-change': '77ff4d1f1cd08a57649cce1f25e0ebc4f55d6d032dfde5c301d1b479561b72fa',
};

// Intentionally excludes getFeedbackSkillTemplate: this list only models templates
// deployed via generateSkillContent, while feedback is covered in function payload parity.
const GENERATED_SKILL_FACTORIES: Array<[string, () => SkillTemplate]> = [
  ['openspec-explore', getExploreSkillTemplate],
  ['openspec-new-change', getNewChangeSkillTemplate],
  ['openspec-continue-change', getContinueChangeSkillTemplate],
  ['openspec-apply-change', getApplyChangeSkillTemplate],
  ['openspec-ff-change', getFfChangeSkillTemplate],
  ['openspec-sync-specs', getSyncSpecsSkillTemplate],
  ['openspec-archive-change', getArchiveChangeSkillTemplate],
  ['openspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
  ['openspec-verify-change', getVerifyChangeSkillTemplate],
  ['openspec-onboard', getOnboardSkillTemplate],
  ['openspec-propose', getOpsxProposeSkillTemplate],
  ['openspec-update-change', getUpdateChangeSkillTemplate],
];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('skill templates split parity', () => {
  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getOpsxExploreCommandTemplate,
      getOpsxNewCommandTemplate,
      getOpsxContinueCommandTemplate,
      getOpsxApplyCommandTemplate,
      getOpsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOpsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOpsxArchiveCommandTemplate,
      getOpsxOnboardCommandTemplate,
      getOpsxBulkArchiveCommandTemplate,
      getOpsxVerifyCommandTemplate,
      getOpsxProposeSkillTemplate,
      getOpsxProposeCommandTemplate,
      getFeedbackSkillTemplate,
      getUpdateChangeSkillTemplate,
      getOpsxUpdateCommandTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    const actualHashes = Object.fromEntries(
      GENERATED_SKILL_FACTORIES.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });

  // Iterating the production registries (not a local list) means a newly
  // added workflow is covered automatically; the full-constant containment
  // check fails if any template's interpolation drifts.
  it('teaches store selection in every deployed skill template', () => {
    for (const { template, dirName } of getSkillTemplates()) {
      const content = generateSkillContent(template, 'PARITY-BASELINE');
      expect(content, dirName).toContain(STORE_SELECTION_GUIDANCE);
    }
  });

  // Auto-approve the OpenSpec CLI: every generated skill carries
  // `allowed-tools: Bash(openspec:*)` so agents that honor it stop prompting
  // on each `openspec` call. Iterating the registry covers new skills too.
  it('pre-approves the openspec CLI via allowed-tools in every deployed skill', () => {
    for (const { template, dirName } of getSkillTemplates()) {
      const content = generateSkillContent(template, 'PARITY-BASELINE');
      expect(content, dirName).toContain('allowed-tools: Bash(openspec:*)');
    }
  });

  it('teaches store selection in every deployed opsx command template', () => {
    for (const entry of getCommandContents()) {
      expect(entry.body, entry.id).toContain(STORE_SELECTION_GUIDANCE);
    }

    // Feedback has no store-capable command and intentionally carries no
    // store teaching; it ships outside both registries.
    expect(getFeedbackSkillTemplate().instructions).not.toContain('**Store selection:**');
  });

  it('generates no workspace-planning residue in any workflow template (4.1)', () => {
    const allSkills: Array<[string, () => SkillTemplate]> = [
      ['openspec-apply-change', getApplyChangeSkillTemplate],
      ['openspec-sync-specs', getSyncSpecsSkillTemplate],
      ['openspec-archive-change', getArchiveChangeSkillTemplate],
      ['openspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['openspec-verify-change', getVerifyChangeSkillTemplate],
    ];

    for (const [dirName, createTemplate] of allSkills) {
      const content = generateSkillContent(createTemplate(), 'PARITY-BASELINE');
      expect(content, dirName).not.toContain('workspace-planning');
      expect(content, dirName).not.toContain('Workspace guard');
    }
  });
});
