# OpenSpec 文档

欢迎。这里是 OpenSpec 的一切所在。

OpenSpec 帮助你和你的 AI 编程助手**在写任何代码之前就对要构建什么达成共识。** 你描述变更，AI 起草一份简短的 spec 和任务清单，双方对照同一份计划，然后才开始动手。再也不用等到中途才发现 AI 做错了方向。

如果你只读两页文档，就读这两页：

1. [快速开始](getting-started.md)：安装、初始化，并交付你的第一个变更。
2. [命令是如何工作的](how-commands-work.md)：在哪里输入 `/opsx:propose`（提示：在你的 AI 聊天里，不是终端）。这一步几乎每个人都会被绊倒一次。

第二点比看上去更重要。OpenSpec 有两半：一个你在终端里运行的命令行工具，以及一组你发给 AI 助手的斜杠命令。知道哪个是哪个，可以省掉最常见的困惑时刻。

> **最值得先养成的习惯：当你不确定要做什么时，从 `/opsx:explore` 开始。** 它是一个零成本的思考伙伴，会阅读你的代码、权衡选项，并在任何制品或代码存在之前，把模糊的想法打磨成具体的计划。[先做探索](explore.md) 指南给出了理由。

## 按需取用

**我是新手。** 从 [快速开始](getting-started.md) 开始，然后浏览 [核心概念一览](overview.md)。当某个东西感觉神秘时，[常见问题](faq.md) 和 [术语表](glossary.md) 就在身边。

**我有一个问题但还没有方案。** 这是最常见的情况，也有专门的答案：[先做探索](explore.md)。用 `/opsx:explore` 在做出任何承诺前与 AI 一起想清楚。

**我有一个大型已有代码库。** 你不必为所有代码写文档。[在已有项目中使用 OpenSpec](existing-projects.md) 讲解如何在不"煮海"的前提下，在真实的老项目上起步。

**我只是想让它跑起来。** [安装](installation.md)，运行 `openspec-cn init`，然后读 [命令是如何工作的](how-commands-work.md)，确保你的第一个斜杠命令落在对的地方。

**我看例子学。** [示例与配方](examples.md) 页面带你走完真实的变更：一个小功能、一个 Bug 修复、一次重构、一次探索。

**我是从旧工作流迁过来的。** [迁移指南](migration-guide.md) 解释了什么变了、为什么变，并保证你已有的工作是安全的。

**我想让它贴合我团队的过程。** [自定义](customization.md) 涵盖项目配置、自定义 Schema 和共享上下文。

**出了问题。** [故障排查](troubleshooting.md) 收集了大家真实遇到过的失败，以及修复方法。

## 完整地图

### 从这里开始

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [快速开始](getting-started.md) | 安装、初始化并端到端跑完你的第一个变更 |
| [先做探索](explore.md) | 在动手前用 `/opsx:explore` 把一个想法想清楚 |
| [命令是如何工作的](how-commands-work.md) | 斜杠命令在哪里运行、"交互模式"是什么意思、终端 vs 聊天 |
| [核心概念一览](overview.md) | 一页纸讲清整个心智模型：specs、changes、deltas、archive |
| [安装](installation.md) | npm、pnpm、yarn、bun、Nix，以及如何验证安装成功 |

### 日常使用

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [工作流](workflows.md) | 常见模式以及何时选择哪个命令 |
| [示例与配方](examples.md) | 真实变更的完整演练，可复制粘贴 |
| [在已有项目中使用 OpenSpec](existing-projects.md) | 在大型老代码库上引入 OpenSpec |
| [编辑与迭代变更](editing-changes.md) | 更新制品、回退、调和手动修改 |
| [命令](commands.md) | 每一条 `/opsx:*` 斜杠命令的参考 |
| [CLI](cli.md) | 每一条 `openspec` 终端命令的参考 |

### 深入理解

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [概念](concepts.md) | 对 specs、changes、artifacts、schemas、archive 的长文解释 |
| [OPSX 工作流](opsx.md) | 为什么工作流是流式的而不是阶段锁定的，以及架构深度剖析 |
| [术语表](glossary.md) | 所有术语集中定义 |

### 打造你自己的

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [自定义](customization.md) | 项目配置、自定义 Schema、共享上下文 |
| [多语言](multi-language.md) | 用英语之外的语言生成制品 |
| [支持的工具](supported-tools.md) | OpenSpec 集成的 25+ 种 AI 工具，以及文件落在何处 |

### 需要帮助时

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [常见问题](faq.md) | 大家最常问的问题的快速回答 |
| [故障排查](troubleshooting.md) | 针对具体失败的具体修复 |
| [迁移指南](migration-guide.md) | 从旧工作流迁移到 OPSX |

### 跨仓库协作（beta）

| 文档 | 你能从中得到什么 |
|-----|-------------------|
| [Stores：用户指南](stores-beta/user-guide.md) | 当你的工作跨多个仓库或团队时，把规划放在独立的仓库里 |
| [Agent 契约](agent-contract.md) | Agent 驱动的机器可读 CLI 接口 |

## 三十秒版本

```text
1. 安装           npm install -g @studyzy/openspec-cn@latest
2. 初始化         cd your-project && openspec-cn init
3. 探索           (在 AI 聊天中)  /opsx:explore           ← 可选，但是个好习惯
4. 提案           (在 AI 聊天中)  /opsx:propose add-dark-mode
5. 构建           (在 AI 聊天中)  /opsx:apply
6. 归档           (在 AI 聊天中)  /opsx:archive
```

第 1、2 步在终端里完成，其余步骤在 AI 助手的聊天里完成。这个分工是唯一值得记住的事，[命令是如何工作的](how-commands-work.md) 详细解释了原因。第 3 步是可选的，但当你不确定时从 `/opsx:explore` 开始，是最值得养成的习惯。

## 其他求助渠道

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用于提问、想法和求助。
- **GitHub Issues：** [github.com/studyzy/OpenSpec-cn/issues](https://github.com/studyzy/OpenSpec-cn/issues) 用于 Bug 和功能请求。
- **`openspec-cn feedback "你的留言"`** 直接从你的终端发送反馈（会打开一个 GitHub Issue）。

发现文档里有错误、过期或令人困惑的地方？那就是 Bug。开一个 Issue 或 PR 吧。文档改进是你能做出的最有价值的贡献之一。
