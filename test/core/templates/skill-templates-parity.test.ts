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
  getOpsxVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import {
  generateSkillContent,
  getCommandContents,
  getSkillTemplates,
} from '../../../src/core/shared/skill-generation.js';
import { STORE_SELECTION_GUIDANCE } from '../../../src/core/templates/workflows/store-selection.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: 'd71c3b60afdd1814005e318df73660863e7bd378de477269634366a007c8d066',
  getNewChangeSkillTemplate: 'eb0c45fdc8106e0b0aa66f77db739700ccb6434a53f0fc86273893aeb3562889',
  getContinueChangeSkillTemplate: '83794bb254557f68693a572ccb2961caf1bbf54ed97bedc2b90afe758e909fd6',
  getApplyChangeSkillTemplate: 'e4fd9af7bfb4343de4a86eb77f0c6bc17c3b101bb718444a4979472205e804c1',
  getFfChangeSkillTemplate: '80d4e4dc6863d3bb3932e066b525288577b9953e0492e812f3d96f7aac0fa620',
  getSyncSpecsSkillTemplate: '8e3061128a30ae43644606f3e3bd0153986290aeefa1af5dd7c92e8c90e5781b',
  getOnboardSkillTemplate: 'b1231e68a3eb0e2cac076ec725ca89f319d9ed98c4b777a39da6bb1790bbc749',
  getOpsxExploreCommandTemplate: 'b171f4d641dfd1fbfae6c78f1fcde8640453a6ee9a63953b7a9c5406f7c24085',
  getOpsxNewCommandTemplate: '8c81ab694bd0e9f66ad1a227507488183dd71c3ca898fee64e3b7887129c2bae',
  getOpsxContinueCommandTemplate: '71c35c4f37c80d46d2aa52e69fc872380f7db5026c264d43f86042084f793db7',
  getOpsxApplyCommandTemplate: '2e8c0541b203873eed70aeb082108040c6743d329fc0f45100593dcf4a78b602',
  getOpsxFfCommandTemplate: '1fdc454150fbd287b764043d889ee20e55e64a59630a2f6bd8c769122943eb64',
  getArchiveChangeSkillTemplate: 'aa317a49f4979b194da2765fa47cf28a1a5126d86ddc4aeff2f7e449608399e3',
  getBulkArchiveChangeSkillTemplate: '55e6540eed3d726ae35de207774d8fb0c389a919306afbdb99ce10ed998e12b1',
  getOpsxSyncCommandTemplate: '71dc2adf5c3715e01beea756ec99618aada36472012a62c71fe15153418ecde5',
  getVerifyChangeSkillTemplate: '2e270d3a6f837f8b9ee970cef71cdfa1c6d49f9cbd4e4241990311c2720f31c0',
  getOpsxArchiveCommandTemplate: '20664bd6cc8d049fac85890e5ca6e6fcc1a7f9f94e8363fb30653959327fb8f0',
  getOpsxOnboardCommandTemplate: '6bcad63a769eb39bab112a2460076099b34590c73b57865d8886406ceda2509b',
  getOpsxBulkArchiveCommandTemplate: 'f89ca5e13e4f594336db79957599c307b832611170aee87aef90b30f570a3ef9',
  getOpsxVerifyCommandTemplate: 'd06eb96014c36ef85cc1a73eef68aac3d273f25e9ac0a07bbd7c5d143f718837',
  getOpsxProposeSkillTemplate: '540bfd286891e6c854cdad783fe77fb9407462545270e6930252c1718cd00c18',
  getOpsxProposeCommandTemplate: '6a08bc0a352df683d4d8c8688bd0f75b67d690fdecd8612dfe682a502099d106',
  getFeedbackSkillTemplate: 'd7d83c5f7fc2b92fe8f4588a5bf2d9cb315e4c73ec19bcd5ef28270906319a0d',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': 'd52623ebe07c9b8ab83aa8923a82a66a2a577eee677c038e23c57c4dbbbdc7d1',
  'openspec-new-change': 'd45d8cfa93b4f22a291285c92dc958a16b2368d4ecd38e01a0db494e5b28b89a',
  'openspec-continue-change': 'e6824cc8bdf5380df23ec2f410e2a1608ac3fd2081af924be66772a20aa7d47c',
  'openspec-apply-change': 'f084b391101e865db8ff6fbe5ec2ec4fb5b49207597bf8bdbb1372b3977aaf00',
  'openspec-ff-change': '30a12a56f528785fcf3c4d959dd677e0f79882b67b765d18744bb73b00ae4fc3',
  'openspec-sync-specs': 'd7c7460c311cd28405365c465082a704e6844ba198d2e17f45c12b182d0481c5',
  'openspec-archive-change': '3285d9b6a01dcc22fcf22bdaff4695e98112be65998c33a3244bb2419066f05c',
  'openspec-bulk-archive-change': '7ad51fca2ae4d5808dd0963aa3100441a515d81693ad052ac6e9e0f7ee82d885',
  'openspec-verify-change': '58a46dba0428f548ba109260eabbb571d4b5c4cffaaf5de8bea3c0feca6d4a56',
  'openspec-onboard': 'e6ca5cf9f16146377e268aa741e4809aac969b2db4847b5aded972784cdc24b0',
  'openspec-propose': '01cc07040db65cddbfd94a05b34c937023c58cc78ea59f421543eaadbfbd60e4',
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
