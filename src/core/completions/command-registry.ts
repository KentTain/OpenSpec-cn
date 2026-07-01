import { COMMON_FLAGS } from './shared-flags.js';
import type { CommandDefinition } from './types.js';

export const COMMAND_REGISTRY: CommandDefinition[] = [
  {
    name: 'init',
    description: '在您的项目中初始化 OpenSpec',
    acceptsPositional: true,
    positionalType: 'path',
    positionals: [{ name: 'path', type: 'path', optional: true }],
    flags: [
      {
        name: 'tools',
        description: '非交互式配置 AI 工具（例如 "all"、"none" 或以逗号分隔的工具 ID 列表）',
        takesValue: true,
      },
      {
        name: 'force',
        description: '自动清理旧文件，无需提示',
      },
      {
        name: 'profile',
        description: '覆盖全局配置档案（core 或 custom）',
        takesValue: true,
        values: ['core', 'custom'],
      },
    ],
  },
  {
    name: 'update',
    description: '更新 OpenSpec 指令文件',
    acceptsPositional: true,
    positionalType: 'path',
    positionals: [{ name: 'path', type: 'path', optional: true }],
    flags: [
      {
        name: 'force',
        description: '即使工具已是最新也强制更新',
      },
    ],
  },
  {
    name: 'list',
    description: '列出项目（默认列出变更，使用 --specs 列出规范）',
    flags: [
      {
        name: 'specs',
        description: '列出规范而非变更',
      },
      {
        name: 'changes',
        description: '明确列出变更（默认）',
      },
      {
        name: 'sort',
        description: '排序方式："recent"（默认，按最近）或 "name"（按名称）',
        takesValue: true,
        values: ['recent', 'name'],
      },
      COMMON_FLAGS.json,
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'view',
    description: '显示规范和变更的交互式仪表板',
    flags: [],
  },
  {
    name: 'validate',
    description: '验证变更和规范',
    acceptsPositional: true,
    positionalType: 'change-or-spec-id',
    positionals: [{ name: 'item-name', type: 'change-or-spec-id', optional: true }],
    flags: [
      {
        name: 'all',
        description: '验证所有变更和规范',
      },
      {
        name: 'changes',
        description: '验证所有变更',
      },
      {
        name: 'specs',
        description: '验证所有规范',
      },
      COMMON_FLAGS.type,
      COMMON_FLAGS.strict,
      COMMON_FLAGS.jsonValidation,
      {
        name: 'concurrency',
        description: '最大并发验证数（默认为环境变量 OPENSPEC_CONCURRENCY 或 6）',
        takesValue: true,
      },
      COMMON_FLAGS.noInteractive,
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'show',
    description: '显示变更或规范',
    acceptsPositional: true,
    positionalType: 'change-or-spec-id',
    positionals: [{ name: 'item-name', type: 'change-or-spec-id', optional: true }],
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.type,
      COMMON_FLAGS.noInteractive,
      {
        name: 'deltas-only',
        description: '仅显示增量（仅限 JSON，针对变更）',
      },
      {
        name: 'requirements-only',
        description: '--deltas-only 的别名（已弃用，针对变更）',
      },
      {
        name: 'requirements',
        description: '仅显示需求，排除场景（仅限 JSON，针对规范）',
      },
      {
        name: 'no-scenarios',
        description: '排除场景内容（仅限 JSON，针对规范）',
      },
      {
        name: 'requirement',
        short: 'r',
        description: '按 ID 显示特定需求（仅限 JSON，针对规范）',
        takesValue: true,
      },
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'archive',
    description: '归档已完成的变更并更新主规范',
    acceptsPositional: true,
    positionalType: 'change-id',
    positionals: [{ name: 'change-name', type: 'change-id', optional: true }],
    flags: [
      {
        name: 'yes',
        short: 'y',
        description: '跳过确认提示',
      },
      {
        name: 'skip-specs',
        description: '跳过规范更新操作',
      },
      {
        name: 'no-validate',
        description: '跳过验证（不推荐）',
      },
      {
        name: 'json',
        description: '以 JSON 格式输出（非交互模式）',
      },
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'status',
    description: '显示变更的产出物完成状态',
    flags: [
      {
        name: 'change',
        description: '要显示状态的变更名称',
        takesValue: true,
      },
      {
        name: 'schema',
        description: 'Schema 覆盖',
        takesValue: true,
      },
      COMMON_FLAGS.json,
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'instructions',
    description: '输出用于创建产出物或应用任务的丰富指令',
    acceptsPositional: true,
    positionals: [{ name: 'artifact', optional: true }],
    flags: [
      {
        name: 'change',
        description: '变更名称',
        takesValue: true,
      },
      {
        name: 'schema',
        description: 'Schema 覆盖',
        takesValue: true,
      },
      COMMON_FLAGS.json,
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'templates',
    description: '显示 Schema 中所有产出物的已解析模板路径',
    flags: [
      {
        name: 'schema',
        description: '要使用的 Schema',
        takesValue: true,
      },
      COMMON_FLAGS.json,
    ],
  },
  {
    name: 'schemas',
    description: '列出可用的工作流 Schema 及其描述',
    flags: [
      COMMON_FLAGS.json,
    ],
  },
  {
    name: 'new',
    description: '创建新项目',
    flags: [],
    subcommands: [
      {
        name: 'change',
        description: '创建新的变更目录',
        acceptsPositional: true,
        positionals: [{ name: 'name' }],
        flags: [
          {
            name: 'description',
            description: '添加到 README.md 的描述',
            takesValue: true,
          },
          {
            name: 'goal',
            description: '与变更一起存储的可选目标元数据',
            takesValue: true,
          },
          {
            name: 'schema',
            description: '要使用的工作流 Schema',
            takesValue: true,
          },
          COMMON_FLAGS.json,
          COMMON_FLAGS.store,
        ],
      },
    ],
  },
  {
    name: 'store',
    description:
      '创建和管理 Store（已注册的独立 OpenSpec 仓库）',
    flags: [],
    subcommands: [
      {
        name: 'setup',
        description: '创建或注册本地 Store',
        acceptsPositional: true,
        positionals: [{ name: 'id', optional: true }],
        flags: [
          {
            name: 'path',
            description: 'Store 要使用的目录',
            takesValue: true,
          },
          {
            name: 'init-git',
            description: '在 Store 中初始化 Git 仓库',
          },
          {
            name: 'no-init-git',
            description: '跳过 Git 仓库初始化',
          },
          {
            name: 'remote',
            description: '记录在 store.yaml 中的规范克隆源',
            takesValue: true,
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'register',
        description: '注册现有的 Store 目录',
        acceptsPositional: true,
        positionals: [{ name: 'path', type: 'path', optional: true }],
        flags: [
          {
            name: 'id',
            description: 'Store ID',
            takesValue: true,
          },
          {
            name: 'yes',
            description: '确认创建 Store 标识元数据',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'unregister',
        description: '取消注册本地 Store 但不删除文件',
        acceptsPositional: true,
        positionals: [{ name: 'id' }],
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'remove',
        description: '取消注册本地 Store 并删除其本地文件夹',
        acceptsPositional: true,
        positionals: [{ name: 'id' }],
        flags: [
          {
            name: 'yes',
            description: '确认删除本地 Store 文件夹',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'list',
        description: '列出已注册的 Store',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'ls',
        description: '列出已注册的 Store',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'doctor',
        description: '检查本地 Store 注册和元数据',
        acceptsPositional: true,
        positionals: [{ name: 'id', optional: true }],
        flags: [
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'context',
    description: '打印已解析的 OpenSpec 根目录的工作上下文',
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.store,
      {
        name: 'code-workspace',
        description: '同时为工作集写入 VS Code 工作区文件',
        takesValue: true,
      },
      {
        name: 'force',
        description: '覆盖现有的 --code-workspace 文件',
      },
    ],
  },
  {
    name: 'doctor',
    description: '报告已解析的 OpenSpec 根目录的关系健康状况',
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.store,
    ],
  },
  {
    name: 'workset',
    description: '组合、保存并打开个人工作视图（纯本地）',
    flags: [],
    subcommands: [
      {
        name: 'create',
        description: '组合并保存你选择的文件夹的命名工作视图',
        acceptsPositional: true,
        positionals: [{ name: 'name', optional: true }],
        flags: [
          {
            name: 'member',
            description:
              '成员文件夹，格式为 <路径> 或 <名称>=<路径>；可重复，第一个为主文件夹',
            takesValue: true,
          },
          {
            name: 'tool',
            description: '打开此工作集的首选工具',
            takesValue: true,
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'list',
        description: '显示已保存的工作集及其成员',
        flags: [COMMON_FLAGS.json],
      },
      {
        name: 'ls',
        description: '显示已保存的工作集及其成员',
        flags: [COMMON_FLAGS.json],
      },
      {
        name: 'open',
        description:
          '在你的工具中打开已保存的工作集（编辑器窗口或 agent 会话）',
        acceptsPositional: true,
        positionals: [{ name: 'name' }],
        flags: [
          {
            name: 'tool',
            description: '仅本次使用此工具打开',
            takesValue: true,
          },
        ],
      },
      {
        name: 'remove',
        description: '删除已保存的工作集（成员文件夹不会被改动）',
        acceptsPositional: true,
        positionals: [{ name: 'name' }],
        flags: [
          {
            name: 'yes',
            description: '非交互式确认删除',
          },
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'feedback',
    description: '提交关于 OpenSpec 的反馈',
    acceptsPositional: true,
    positionals: [{ name: 'message' }],
    flags: [
      {
        name: 'body',
        description: '反馈的详细描述',
        takesValue: true,
      },
    ],
  },
  {
    name: 'change',
    description: '管理 OpenSpec 变更提案（已弃用）',
    flags: [],
    subcommands: [
      {
        name: 'show',
        description: '显示变更提案',
        acceptsPositional: true,
        positionalType: 'change-id',
        positionals: [{ name: 'change-name', type: 'change-id', optional: true }],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'deltas-only',
            description: '仅显示增量（仅限 JSON）',
          },
          {
            name: 'requirements-only',
            description: '--deltas-only 的别名（已弃用）',
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'list',
        description: '列出所有活动变更（已弃用）',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'long',
            description: '显示 ID、标题及计数',
          },
        ],
      },
      {
        name: 'validate',
        description: '验证变更提案',
        acceptsPositional: true,
        positionalType: 'change-id',
        positionals: [{ name: 'change-name', type: 'change-id', optional: true }],
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'spec',
    description: '管理 OpenSpec 规范',
    flags: [],
    subcommands: [
      {
        name: 'show',
        description: '显示规范',
        acceptsPositional: true,
        positionalType: 'spec-id',
        positionals: [{ name: 'spec-id', type: 'spec-id', optional: true }],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'requirements',
            description: '仅显示需求，排除场景（仅限 JSON）',
          },
          {
            name: 'no-scenarios',
            description: '排除场景内容（仅限 JSON）',
          },
          {
            name: 'requirement',
            short: 'r',
            description: '按 ID 显示特定需求（仅限 JSON）',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'list',
        description: '列出所有规范',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'long',
            description: '显示 ID、标题及计数',
          },
        ],
      },
      {
        name: 'validate',
        description: '验证规范',
        acceptsPositional: true,
        positionalType: 'spec-id',
        positionals: [{ name: 'spec-id', type: 'spec-id', optional: true }],
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'completion',
    description: '管理 OpenSpec CLI 的 Shell 补全',
    flags: [],
    subcommands: [
      {
        name: 'generate',
        description: '为指定的 Shell 生成补全脚本（输出到 stdout）',
        acceptsPositional: true,
        positionalType: 'shell',
        positionals: [{ name: 'shell', type: 'shell', optional: true }],
        flags: [],
      },
      {
        name: 'install',
        description: '安装指定 Shell 的补全脚本',
        acceptsPositional: true,
        positionalType: 'shell',
        positionals: [{ name: 'shell', type: 'shell', optional: true }],
        flags: [
          {
            name: 'verbose',
            description: '显示详细安装输出',
          },
        ],
      },
      {
        name: 'uninstall',
        description: '卸载指定 Shell 的补全脚本',
        acceptsPositional: true,
        positionalType: 'shell',
        positionals: [{ name: 'shell', type: 'shell', optional: true }],
        flags: [
          {
            name: 'yes',
            short: 'y',
            description: '跳过确认提示',
          },
        ],
      },
    ],
  },
  {
    name: 'config',
    description: '查看并修改全局 OpenSpec 配置',
    flags: [
      {
        name: 'scope',
        description: '配置作用域（目前仅支持 "global"）',
        takesValue: true,
        values: ['global'],
      },
    ],
    subcommands: [
      {
        name: 'path',
        description: '显示配置文件位置',
        flags: [],
      },
      {
        name: 'list',
        description: '显示当前所有设置',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'get',
        description: '获取特定值（原始格式，可用于脚本）',
        acceptsPositional: true,
        positionals: [{ name: 'key' }],
        flags: [],
      },
      {
        name: 'set',
        description: '设置值（自动转换类型）',
        acceptsPositional: true,
        positionals: [{ name: 'key' }, { name: 'value' }],
        flags: [
          {
            name: 'string',
            description: '强制将值存为字符串',
          },
          {
            name: 'allow-unknown',
            description: '允许设置未知的键',
          },
        ],
      },
      {
        name: 'unset',
        description: '移除键（恢复为默认值）',
        acceptsPositional: true,
        positionals: [{ name: 'key' }],
        flags: [],
      },
      {
        name: 'reset',
        description: '将配置重置为默认值',
        flags: [
          {
            name: 'all',
            description: '重置所有配置（必填）',
          },
          {
            name: 'yes',
            short: 'y',
            description: '跳过确认提示',
          },
        ],
      },
      {
        name: 'edit',
        description: '在 $EDITOR 中打开配置文件',
        flags: [],
      },
      {
        name: 'profile',
        description: '配置工作流档案（交互式选择器或预设快捷方式）',
        acceptsPositional: true,
        positionals: [{ name: 'preset', optional: true }],
        flags: [],
      },
    ],
  },
  {
    name: 'schema',
    description: '管理工作流 Schema',
    flags: [],
    subcommands: [
      {
        name: 'which',
        description: '显示 Schema 从何处解析',
        acceptsPositional: true,
        positionalType: 'schema-name',
        positionals: [{ name: 'name', type: 'schema-name', optional: true }],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'all',
            description: '列出所有 Schema 及其解析来源',
          },
        ],
      },
      {
        name: 'validate',
        description: '验证 Schema 结构和模板',
        acceptsPositional: true,
        positionalType: 'schema-name',
        positionals: [{ name: 'name', type: 'schema-name', optional: true }],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'verbose',
            description: '显示详细的验证步骤',
          },
        ],
      },
      {
        name: 'fork',
        description: '复制现有 Schema 到项目以进行自定义',
        acceptsPositional: true,
        positionalType: 'schema-name',
        positionals: [
          { name: 'source', type: 'schema-name' },
          { name: 'name', optional: true },
        ],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'force',
            description: '覆盖现有目标',
          },
        ],
      },
      {
        name: 'init',
        description: '创建新的项目本地 Schema',
        acceptsPositional: true,
        positionals: [{ name: 'name' }],
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'description',
            description: 'Schema 描述',
            takesValue: true,
          },
          {
            name: 'artifacts',
            description: '逗号分隔的产出物 ID',
            takesValue: true,
          },
          {
            name: 'default',
            description: '设置为项目默认 Schema',
          },
          {
            name: 'no-default',
            description: '不提示设置为默认',
          },
          {
            name: 'force',
            description: '覆盖现有 Schema',
          },
        ],
      },
    ],
  },
];
