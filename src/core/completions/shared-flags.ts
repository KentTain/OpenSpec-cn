import type { FlagDefinition } from './types.js';

/**
 * Common flags used across multiple commands.
 */
export const COMMON_FLAGS = {
  json: {
    name: 'json',
    description: 'Output as JSON',
  } as FlagDefinition,
  jsonValidation: {
    name: 'json',
    description: 'Output validation results as JSON',
  } as FlagDefinition,
  strict: {
    name: 'strict',
    description: 'Enable strict validation mode',
  } as FlagDefinition,
  noInteractive: {
    name: 'no-interactive',
    description: 'Disable interactive prompts',
  } as FlagDefinition,
  type: {
    name: 'type',
    description: 'Specify item type when ambiguous',
    takesValue: true,
    values: ['change', 'spec'],
  } as FlagDefinition,
  store: {
    name: 'store',
    description:
      '用作 OpenSpec 根目录的 store id（store 是您在本机上注册的独立 OpenSpec 仓库）',
    takesValue: true,
  } as FlagDefinition,
} as const;
