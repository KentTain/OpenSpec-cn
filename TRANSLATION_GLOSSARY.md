# OpenSpec-cn 翻译术语表

本文件为 `@studyzy/openspec-cn`(OpenSpec 简体中文汉化分支)的翻译对照表。
供 AI Agent 或人工在汉化本项目文档、界面文字、模板时使用,确保术语统一。

## 项目基本规则

- 项目 npm 名:`@studyzy/openspec-cn`;CLI 命令:`openspec-cn`(不是 `openspec`)。
- 目录名仍为 `openspec`(如 `openspec/specs/`、`openspec/changes/`)。
- 技能名保持 `openspec-XXX` 不变(不改成 `openspec-cn-XXX`)。
- **Schema** 作为特殊计算机词汇,不翻译,保持 `Schema` / `schema`。
- 代码中的注释不翻译(保持英文)。
- 界面文字、文档、模板需要汉化。

## 通用汉化原则

1. 所有界面说明文字、段落、列表项、表头/表格内容、标题 → 汉化为简体中文。
2. 以下**保持英文原样,不要翻译**:
   - 代码块内内容(``` 包裹)、YAML 内容、bash 命令、文件名、目录路径
   - CLI 命令名及参数(如 `openspec-cn init`、`/opsx:propose`、`proposal.md`、`schema.yaml`)
   - 专有名词(见下表"保持英文"列)
   - RFC 2119 关键词:`SHALL` / `MUST` / `SHOULD` / `MAY`
   - 内部代码标识符、JSON 字段名
3. 保持 Markdown 结构、标题层级、代码块、表格不变;只翻译文字,不改写技术含义。
4. 文档内相对链接路径保持不变,链接显示文字可汉化。

## 术语对照表

| 英文 | 简体中文 | 说明 |
|------|----------|------|
| OpenSpec | OpenSpec | 保持(项目/框架名) |
| openspec-cn | openspec-cn | 保持(汉化版 CLI/包名) |
| openspec (目录) | openspec | 保持(目录名) |
| schema / schemas | schema / schemas | 保持(Schema 计算机词汇不译) |
| spec / specs | spec / specs | 保持(文件名/制品名);概念语境可写"规范" |
| spec.md | spec.md | 保持(文件名) |
| proposal | proposal | 保持(制品名/文件名) |
| design | design | 保持(制品名/文件名) |
| tasks | tasks | 保持(制品名/文件名) |
| artifact | 制品 | 概念译"制品" |
| artifacts | 制品 | 概念译"制品" |
| change | 变更 | — |
| changes | 变更 | 目录 `changes/` 保持英文 |
| delta spec | 增量规范(delta spec) | 首次出现可注英文 |
| delta specs | 增量规范(delta specs) | — |
| store / stores | store / stores | 保持(专用名词) |
| CLI | CLI | 保持 |
| Agent Skills | Agent Skills | 保持 |
| slash command | 斜杠命令 | 命令本身(如 `/opsx:propose`)保持英文 |
| scenario | 场景 | — |
| requirement | 需求 | — |
| requirements | 需求 | — |
| workflow | 工作流 | — |
| archive | 归档 | 动词/名词 |
| verify | 验证 | — |
| validate | 校验 / 验证 | — |
| implementation | 实现 | — |
| source of truth | 事实来源 / 单一事实来源 | — |
| brownfield | 存量 / 既有代码库 | 语境:`brownfield-first` 译"存量优先" |
| greenfield | 全新 / 从零开始 | — |
| capability | 能力 | — |
| profile | profile | 保持(`core`/`custom` profile) |
| flag | 标志 | CLI 标志 |
| option | 选项 | CLI 选项 |
| configuration | 配置 | — |
| context | 上下文 / 语境 | — |
| requirement strength | 需求强度 | — |
| ADDED / MODIFIED / REMOVED Requirements | ADDED/MODIFIED/REMOVED Requirements | 保持(YAML 区块名) |
| GIVEN / WHEN / THEN | GIVEN / WHEN / THEN | 保持(场景格式关键词) |
| intent | 意图 | — |
| scope | 范围 / 范畴 | — |
| domain | 领域 | specs 的逻辑分组 |
| enabler | 促成因素 / 赋能者 | — |
| idempotency | 幂等性 | — |
| brownfield-first | 存量优先 | — |
| exploration | 探索 | — |
| delivery | 交付 / 交付方式 | — |
| scaffolding | 脚手架 | — |
| onboarding | 引导 / 入门 | — |
| source of truth | 事实来源 | — |
| monorepo | 单体仓库 | — |
| prompt | 提示 / 提示词 | — |
| feedback | 反馈 | — |
| telemetry | 遥测 | — |
| OPSX | OPSX | 保持(工作流名称) |
| reference | 引用 | store 相关概念 |
| workset | 工作集 | 个人本地文件夹组合 |
| root | 根目录 | — |
| initiative | 倡议 / initiative | beta 功能,保留英文 |
| context store | context store | 保持(beta 功能名) |
| workspace | workspace / 工作台 | beta 功能 |
| doctor | doctor | 保持(CLI 子命令) |
| lifecycle | 生命周期 | — |
| recipe | 配方 | 文档中的示例模式 |
| tradeoff | 权衡 | — |
| edge case | 边界情况 | — |
| happy path | 正常路径 | — |
| checklist | 清单 | — |
| dashboard | 仪表盘 | — |
| guardrail | 护栏 / 约束 | — |

## 特殊文件注意事项

- `docs/multi-language.md`:多语言配置指南,其中各语言示例(葡萄牙语、西班牙语、日语、法语、德语等)的 YAML `context` 块内容**保留原文**,不翻译;只汉化说明性文字。
- `docs/glossary.md`:术语表,左侧术语列保持英文,右侧定义列汉化。
- 测试相关:`EXPECTED_FUNCTION_HASHES` 与 `EXPECTED_GENERATED_SKILL_CONTENT_HASHES` 因汉化改变,相关 UT 需在所有汉化完成后重算 Hash 修复(见 CODEBUDDY.md 注意项)。

## 翻译风格

- 简洁、准确,技术文档语气,不口语化、不添加原意没有的内容。
- 优先使用动词+宾语的短句(如"创建变更"、"合并增量规范")。
- 同一术语全项目统一,以上表为准。
