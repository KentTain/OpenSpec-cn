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
  getExploreSkillTemplate: 'bfeb3969b5fea41bffde5b2492882f9c11fd38eb1d7230fa7e1691afe9a06d92',
  getNewChangeSkillTemplate: '9c1c15bb0c22835b3eb0cbb04256fc4884d9e27877c31570b62b6b20ad0e5d92',
  getContinueChangeSkillTemplate: '62863188a67f6828862ed8f806ac62e2095dfd12968c08186c3fb7c78d70f70a',
  getApplyChangeSkillTemplate: 'f27411e312d00704cd958278d6cfa9f92ec85218187d57456538a20dc9e1ba2e',
  getFfChangeSkillTemplate: 'bd60b9425c5706e4e26909510c9843fa3269719324f8e9f0f3406f2ff29a5f06',
  getSyncSpecsSkillTemplate: '949fe6b2349854f87c210e3d75ebc693be219d00944b1e9dbde8c61e7fd1b681',
  getOnboardSkillTemplate: '9215f63e6da5ae760a9989331d93ad6956362301b78aff52ec5c3ce930fdaab0',
  getOpsxExploreCommandTemplate: 'b171f4d641dfd1fbfae6c78f1fcde8640453a6ee9a63953b7a9c5406f7c24085',
  getOpsxNewCommandTemplate: '36d1058bec358013454d13d907a07588f33c0b1068d59fc15bcf1a96b998d207',
  getOpsxContinueCommandTemplate: '8d3f9b339fd274400ed95970034c5abbf2d8e9b26000cbf6c5494fb519fac1a1',
  getOpsxApplyCommandTemplate: 'f769064145973329109a9c42560a6e1ffd01bdab4351d5500ca12d98f2f9cf70',
  getOpsxFfCommandTemplate: '6ad02e411b19df8143ece2120bb8f9731c6d6784a58113ff00c6b8c68591e979',
  getArchiveChangeSkillTemplate: '000ea894e51f8ae6a3957a0d6f8fd36fc892d6c84aafd02b7b77294c5e17c933',
  getBulkArchiveChangeSkillTemplate: 'a6b01ea2d4222c0b34d332a9ed3772f7958cc55de980e7f1821cdb30e4b3cba2',
  getOpsxSyncCommandTemplate: 'dd1feb35a3a34752830b048553502dba3bf68b54cae4fc4fb8ec6748d810d803',
  getVerifyChangeSkillTemplate: 'eabb64f6d2399f0450470a7c0a2b0c69776992936d4f809d2a1cf6908aa9a10e',
  getOpsxArchiveCommandTemplate: 'fd779c792e509c66237ca262d50ad110052ac4759a9c0a84958372531bcf4e63',
  getOpsxOnboardCommandTemplate: '5a68cd4e3d17d317037f599c44801df675f8720c5caf4f1935cb0aeee8a0f335',
  getOpsxBulkArchiveCommandTemplate: '910cb1e0d1e1e746c5748a12a6f11873c1e9e638d55f57710477a43669014ad7',
  getOpsxVerifyCommandTemplate: 'd06eb96014c36ef85cc1a73eef68aac3d273f25e9ac0a07bbd7c5d143f718837',
  getOpsxProposeSkillTemplate: '540bfd286891e6c854cdad783fe77fb9407462545270e6930252c1718cd00c18',
  getOpsxProposeCommandTemplate: '6a08bc0a352df683d4d8c8688bd0f75b67d690fdecd8612dfe682a502099d106',
  getFeedbackSkillTemplate: '7e8493e4fc577fb4ecb44056e1085abb697f91b2eeb176cc4f8ab7085cbf481f',
  getUpdateChangeSkillTemplate: '70b2af5690f8f96f735526bfad2e0432bfc15b463c7a313f15c0d42bc54d5268',
  getOpsxUpdateCommandTemplate: '39c6c38741bb560590e0463adc307ba5317579a9f1ab2e580f7c1af5cab18ee0',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': '5ea434c60bee293c2254ada1198f06c5bafba09bb8228933fcc2ea82a8576f62',
  'openspec-new-change': '2ebf79bfc559cb2bc8291a872979b2dc7d401d1e4f246e442f5f2ffda7d992ec',
  'openspec-continue-change': '7310b65a328b93152bf20f018f694cdae574d0384efec17204b91807b9a77c65',
  'openspec-apply-change': '8863a66feec956f5fdd7cc509602eb24b50845d066d73bc7ec5956b0bb16380c',
  'openspec-update-change': '69972f3ffb38724cc79c4bded6f5fbf91fc997d0968201f52dfe541600994eee',
  'openspec-ff-change': '6c366a624179fcda2d3b43ded87ff392350fbcbbe6f5f3938df3651eb9d73611',
  'openspec-sync-specs': 'bb47f63f12030c5f62bc8897418bcc4708b615512202714a06bc609f8f9bac74',
  'openspec-archive-change': '9ee5f907f5b7d8b75b13dfb99677a322eb11213557a0ae9b7a285439b44da8b0',
  'openspec-bulk-archive-change': '682e396956b8518e48e63a91b6a8a3a4e56ecdee23798fe61e5e8a9e2c4d56ac',
  'openspec-verify-change': '757aa8733bf50ab91e7964a02c7077d4977fde38eb37b81893f4189cd309395d',
  'openspec-onboard': 'cfb94144c767b2edf7be6b6a14cf1039d4d9a9942616ca56ec42dde72ac46155',
  'openspec-propose': 'faf6398df13a3975cea9ca25f0ca737f9554944c349e47b2561d73698f1009a9',
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
      expect(content, dirName).toContain('allowed-tools: Bash(openspec-cn:*)');
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
