# 术语表

OpenSpec 的所有术语集中一处，用平实的语言定义。通读一遍，剩下的文档就读得更快了。

术语按主题分组，组内按字母序排列。

## 核心名词

**Spec（规范）。** 一份描述你系统某部分如何运转的文档。Specs 存放在 `openspec/specs/`，按 domain 组织，由 requirement 和 scenario 构成。spec 是"这份软件做什么"的公认答案。见 [概念](concepts.md#specs)。

**Source of truth（真相源）。** 整个 `openspec/specs/` 目录。它持有系统当前、公认的行为。变更提议对它的编辑；归档应用这些编辑。

**Change（变更）。** 一个工作单元，打包为 `openspec/changes/<name>/` 下的一个文件夹。一个 change 容纳关于那件工作的全部内容：proposal、design、tasks，以及它引入的 spec 编辑。一个 change，一个 feature 或 fix。

**Artifact（制品）。** change 内部的一份文档。标准制品是 proposal、delta spec、design 和 tasks。它们按依赖顺序创建，并互相喂养。

**Delta spec（增量 spec）。** change 内部的一种 spec，只描述变化，使用 `ADDED`、`MODIFIED`、`REMOVED` 段落，而不重述整份 spec。这是 OpenSpec 干净编辑已有系统的方式。见 [概念](concepts.md#delta-specs)。

**Domain（领域）。** specs 的一种逻辑分组，如 `auth/`、`payments/` 或 `ui/`。你按自己思考系统的方式选择 domain。

## spec 内部

**Requirement（需求）。** 系统必须具备的一条行为，通常用 RFC 2119 关键字书写："The system SHALL expire sessions after 30 minutes." Requirement 说的是 *what*，不是 *how*。

**Scenario（场景）。** 一条 requirement 的具体、可测试示例，通常以 Given/When/Then 形式书写。Scenario 让 requirement 可验证：你可以从一条 scenario 写出自动化测试。

**RFC 2119 关键字。** MUST、SHALL、SHOULD、MAY 这几个词，它们带有关于 requirement 严格程度的标准含义。MUST 和 SHALL 是绝对的。SHOULD 是推荐的，允许例外。MAY 是可选的。这个名称来自定义它们的互联网标准文档。

## 制品

**Proposal（`proposal.md`）。** 一个 change 的 *why* 和 *what*：意图、范围、高层方案。你创建的第一份制品。

**Design（`design.md`）。** *how*：技术方案、架构决策、你预期会触及的文件。对于简单 change 可选。

**Tasks（`tasks.md`）。** 实现清单，带复选框。AI 在 `/opsx:apply` 期间逐项处理并勾掉。

## 生命周期

**Archive（归档）。** 完成一个 change 的动作。它的 delta spec 合并进主 spec，change 文件夹移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。归档后，你的 spec 描述新的现实。见 [概念](concepts.md#archive)。

**Sync（同步）。** 把一个 change 的 delta spec 合并进主 spec，但 *不* 归档该 change。通常是自动的（archive 会主动提出做这件事），但也可单独用 `/opsx:sync` 处理长期运行的变更。见 [命令](commands.md#opsxsync)。

## 工作流与命令

**OPSX。** OpenSpec 当前的标准工作流，围绕流式动作而非僵硬阶段构建。它的斜杠命令都以 `/opsx:` 开头。见 [OPSX 工作流](opsx.md)。

**Slash command（斜杠命令）。** 你在 AI 助手聊天里输入的命令，如 `/opsx:propose`。斜杠命令驱动工作流。它们不是终端命令。见 [命令是如何工作的](how-commands-work.md)。

**Explore（`/opsx:explore`）。** 思考伙伴命令。它读你的代码库、比较选项，把模糊想法厘清成具体计划，不创建任何制品、不写任何代码。当你有问题但还没有方案时，这是推荐的起点。见 [先做探索](explore.md)。

**CLI。** 你在终端里运行的 `openspec` 程序。它设置项目、列出与校验 change、打开仪表盘、归档。OpenSpec 的终端那一半。见 [CLI](cli.md)。

**Skill。** 一组指令文件夹（`.../skills/openspec-*/SKILL.md`），你的 AI 助手会自动探测并遵循。Skills 是把 OpenSpec 工作流交付给助手的、正在成形的跨工具标准。

**Command file（命令文件）。** 按工具分的斜杠命令文件（`.../commands/opsx-*`）。较老的交付机制，仍与 skills 并行支持。你很少需要直接动它。

**Profile。** 安装到你项目的斜杠命令集合。**Core**（默认）是 `propose`、`explore`、`apply`、`sync`、`archive`。**Expanded** 额外提供 `new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`。用 `openspec config profile` 切换。

**Delivery（交付方式）。** OpenSpec 为你的工具安装 skill、命令文件，还是两者都装。全局配置，用 `openspec update` 应用。

## 自定义

**Schema。** 一个工作流拥有哪些制品、它们如何互相依赖的定义。内置默认是 `spec-driven`（proposal → specs → design → tasks）。你可以复制或自写。见 [自定义](customization.md#custom-schemas)。

**Template（模板）。** schema 内部的一份 Markdown 文件，塑造 AI 为某制品生成什么。编辑模板会立即改变 AI 的输出，无需重新构建。

**Project config（`openspec/config.yaml`）。** 按项目的设置：默认 schema、注入每个规划请求的 `context:`、按制品的 `rules:`。教会 OpenSpec 你的技术栈和约定的最简单方式。见 [自定义](customization.md#project-configuration)。

**Context injection（上下文注入）。** 把项目背景放进 `config.yaml` 的 `context:` 字段，让它自动加到 AI 生成的每份制品里。比指望 AI 去读另一份文件更可靠。

**Dependency graph（依赖图）。** 由制品 `requires:` 关系形成的有向图。它是一个 DAG（有向无环图：箭头只向前指，绝不成环），OpenSpec 用它知道你接下来可以创建什么。

**Enablers, not gates（是 enabler 不是 gate）。** 关于制品依赖的原则：依赖表示接下来什么变 *可能*，而不是接下来 *必须* 做什么。你随时可以回头编辑任何制品。见 [核心概念一览](overview.md#enablers-not-gates)。

## 跨仓库协作（beta）

下面这些术语只在你跨多个仓库规划时才适用。它们是 beta。大多数用户可以忽略。见 [Stores 用户指南](stores-beta/user-guide.md)。

**Store。** 一个独立仓库，唯一职责是规划。它拥有你已熟悉的 `openspec/` 形态（specs 和 changes），加一份小小的身份文件。你在自己机器上按名字注册一次，之后任何 OpenSpec 命令都能在任何位置工作于它。

**Reference。** 代码仓库的 `openspec/config.yaml` 里对某个 store 的声明，表示该仓库依赖它。Reference 是只读的：仓库保留自己的根，`openspec instructions` 会获得一份被引用 store 的 spec 索引，每条带精确的获取命令。

**Working context（工作上下文）。** `openspec context` 为当前仓库组装出的东西：它的 OpenSpec 根加上它引用的每个 store，以及如何获取它们。这是"我在和什么一起工作？"的答案。

**Workset（工作集）。** 你个人、机器本地一组一起打开的文件夹（一个 store 加上你工作的代码仓库）。用 `openspec workset create` 显式创建；这些本地路径不会被提交到共享的规划仓库。

## 另见

- [核心概念一览](overview.md)：五个 idea，一页纸
- [概念](concepts.md)：长文解释
- [命令是如何工作的](how-commands-work.md)：斜杠命令 vs CLI
