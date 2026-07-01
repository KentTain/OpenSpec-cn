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
  getExploreSkillTemplate: '1b4b6f30ed1427713a1f4d3e972441184f12406e3d1048e42552bee8c057d8de',
  getNewChangeSkillTemplate: '7a20b236a401caf7c241973f25341e7e097133f576957f7a649610af5e23eed2',
  getContinueChangeSkillTemplate: 'bb7b0c0eb594d0c062c9ba794bf393bb5ac5d3f3137b55eb54a7e88d22df13e0',
  getApplyChangeSkillTemplate: '2ba4a4df834e71121c97306e307d3b353dee4f022f64b44c8289b16b5c375f9d',
  getFfChangeSkillTemplate: '2162764bf4d3f49e0677da1880be51b1a9293371e51f19742b1e79657857ec56',
  getSyncSpecsSkillTemplate: 'bc2d57ab936d7034eb50f702c3be27f214ab22e652b337b4fa8810209a411466',
  getOnboardSkillTemplate: '39834adea260a302ed0d18df5d8dbd30b5ec3f21923b6f03caf8bf76cba0f18b',
  getOpsxExploreCommandTemplate: '3dcd537a5ff6b39843ffceb6ab28e13babcc2df2cfef2052f6af59e8dd491ee5',
  getOpsxNewCommandTemplate: 'd11b2d3c83625ad7b2b8036ecf8022b34adef4bfb3fb685e6ed6b8dc35b2677c',
  getOpsxContinueCommandTemplate: 'b244c56d5038f4c5fb199f384c01afebd4e3c856a73966f54a855bac3eee6b45',
  getOpsxApplyCommandTemplate: '7d70a75175d3653f903af3d65144409fc698bf2da2cb351c60db4f3442f56cdb',
  getOpsxFfCommandTemplate: 'de94cb117a4cb3fc0ca96345554c6f1eead7462f71fcb689a1c507f821d3b91a',
  getArchiveChangeSkillTemplate: '6e7f39364326c239d246b930ecd29b4877c4474b12f98094080fcc053c11f3a4',
  getBulkArchiveChangeSkillTemplate: '4c722c8393f475eb10b5905802cdf93a557a14a3b4d9133ea62a9c7e660987ae',
  getOpsxSyncCommandTemplate: '284a1323d367f833202944d65104a62eaff0552211635dd56eeee166f7cbd8d0',
  getVerifyChangeSkillTemplate: '04571b4431c1054f1fc5264a32335e03e6a18b3a23261af87d94873552e31eb7',
  getOpsxArchiveCommandTemplate: '6020ac179f72885d4d20ff288b73025bb25dede8c1ed540aef569b8e8896a6d5',
  getOpsxOnboardCommandTemplate: 'e6cae6140498e7b30a9b27051db5450a089df1abe27e0db34a80af7f09930553',
  getOpsxBulkArchiveCommandTemplate: 'f3e3478367a47d0724ef2e6f25549af244d1a4ea2bc203e6ed8727463f2001c4',
  getOpsxVerifyCommandTemplate: 'f92b50f3c4eba136b5eac3b05f5905bd5864c177ce69eb3fe0ae797e2130ad05',
  getOpsxProposeSkillTemplate: '60d7ee16cbd11dda228897f8645ef3e9885e97e0c95807a1dc308acd719bc6d5',
  getOpsxProposeCommandTemplate: '2e953c9e2023d87edf5894a99800200e8d0fcfba85a79d567f9702066c2da2d4',
  getFeedbackSkillTemplate: 'a2ee906458fa2cad42096fe0ec40000f3acfd5534d91bd48079ff3a19af914e3',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': 'b5cece96baf954bff09e7075e3124130753ac7f2e2f5515310b9d0e9a064f22c',
  'openspec-new-change': '4f0211f7d5db3b365823bad84367903a69ed8c1412c0406c5e5e2a94d26fa812',
  'openspec-continue-change': 'be2463220503b8fd8e97b154d2eec8ac20dd6a81d530e7cc29e2a98a140e169d',
  'openspec-apply-change': 'd8f6dd3833c29e0be6de204655618385b77235c286119f71fe1393b6607fcd8b',
  'openspec-ff-change': '48a0621e86b215c4e675c5e3a078ea6afb74b626bd397a4067e8c706bbdfbcc9',
  'openspec-sync-specs': '45358814cb0213e753796917ecc313e3e0919f3ed8661e9ac7bb698499cf97c4',
  'openspec-archive-change': '65c11c1be87e37a89cc29735d91f025f127c00544f5b6ecc97cf1797ae30d7bd',
  'openspec-bulk-archive-change': '11cb45fb7ae97fabfff3e68e22b5cc6283e3cebe93e5c5f28ef15c9b5068f1a0',
  'openspec-verify-change': '7f895ab5ba375a289eb70a63b8790080d28d5f51be05eaa5ee969d03d2cd8a98',
  'openspec-onboard': 'd174b8dc11dc626162e4b4ffb9bf6a82f02ea7325566c2283993752df01a02fb',
  'openspec-propose': 'e291937dd4f7db3ff544cc85bb7f9d22b124ab725dea6f7d858e1f19f356adf6',
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
