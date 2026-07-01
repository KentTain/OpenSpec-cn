# 在已有项目中使用 OpenSpec

**你不需要为了开始而给整个代码库写文档。你只为即将要改动的部分写 spec。** 这是引入 OpenSpec 时最需要记住的一点，也是 OpenSpec 把自己设计成"brownfield-first（先有代码再加规范）"的原因。

一种常见的担心是："我的应用已经 8 万行了。我必须先把所有代码都写 spec，OpenSpec 才有用吗？"不必。你不会想那么干，我们也不想。OpenSpec 一次一个变更地积累你的 specs。你的第一个变更只记录它触及的那一片，下一个变更记录它那一片，几个月后，specs 自然围绕你实际做过的工作铺展开来。

本指南教你如何在不"煮海"的前提下，从第一天开始上手。

## 30 秒版本

```bash
$ cd your-existing-project
$ openspec-cn init      # 添加 openspec/ 目录以及你 AI 工具的命令
```

然后，在你的 AI 聊天里：

```text
/opsx:explore            # 可选：让 AI 阅读你将要改���的区域
/opsx:propose <一个你真正需要的、真实的小变更>
/opsx:apply
/opsx:archive
```

现在你的 specs 准确描述了那次变更触及的系统部分，仅此而已。这是对的。其他 8 万行你暂时不用操心。

## 为什么 delta-first 是关键

OpenSpec 的变更以 **delta** 形式书写：`ADDED`、`MODIFIED`、`REMOVED`。delta 描述的是相对当前行为的变更，而不是整个系统。

这恰好是已有代码库需要的。你很少从零开始。你是在加一个字段、修一个重定向、收紧一个超时。delta 让你精确地描述这一次变更，而不必先写一份 40 页的、覆盖周围一切的 spec。

因此你的 `openspec/specs/` 目录并非一开始就完整无缺。它几乎空着开始，逐步累积。每个归档的变更把它的 delta 合并进来。`auth/` 的 spec 只有在你做过几次 auth 变更之后才会变得详尽——而那恰好是你需要它详尽的时候。

想了解更深入的机制，见 [概念：Delta Specs](concepts.md#delta-specs)。

## 在真实代码库上的第一个变更

挑一个又小又真实的。不要玩具，不要重写。挑你这周本来就要做的变更。小型的首次变更能让你在低风险下学会工作流。

**第 1 步：让 AI 阅读相关区域。** 在不熟悉或大型代码库上，`/opsx:explore` 在这一步最能体现价值。把它指向你即将触及的部分，让它先摸清现状再提建议。

```text
You: /opsx:explore

AI:  你想探索什么？

You: 我需要给公共 API 加速率限制，但我不确定
     请求目前是怎么穿过中间件层的。

AI:  让我追一下…… [阅读 router、middleware 栈和 config]
     请求进入 Express，经过 auth 中间件，然后到你的
     controller。目前没有限流层。最干净的插入点
     是紧跟 auth 之后的中间件。要我把它写成提案吗？
```

注意 AI 现在理解了你真实的结构，所以它写的 proposal 会贴合你的代码，而不是套用通用模板。在大型代码库上，单是这个习惯就能省掉最多的痛苦。见 [先做探索](explore.md)。

**第 2 步：提出变更。** proposal 和它的 delta spec 只捕获这一次变更。

```text
You: /opsx:propose add-api-rate-limiting
```

**第 3 步：构建并归档** 用 `/opsx:apply` 和 `/opsx:archive`，和任何变更一样。归档之后，你就有了一份关于限流行为的真实 spec，它出自一个你本来就要做的变更。

## 想要一次带讲解的引导？用 onboard

如果你更想看着整个循环在你自己的代码上跑一遍、配着旁白，扩展命令 `/opsx:onboard` 正合适：它扫描你的代码库，找一个又小又安全的改进，然后带你走完提案、构建、归档，每一步都讲清楚。

先打开扩展命令：

```bash
$ openspec-cn config profile   # 选择扩展工作流
$ openspec-cn update           # 把它应用到本项目
```

然后在聊天里：

```text
/opsx:onboard
```

这是在真实项目上最温和的入门方式，完成后你会留下一个真实（小型）的变更，可留可弃。见 [命令：`/opsx:onboard`](commands.md#opsxonboard)。

## "可我已经有需求文档了"

也许你有一份 PRD、一份 SRS、一份正式 spec，甚至 TLA+ 模型。很好。你不需要整体导入它们，也不需要扔掉它们。

把现有文档当作 **exploration 的素材**，而不是要转换的 spec。当你开始一个变更时，把相关章节粘贴或指向 AI，让它从中提炼出一份聚焦的 OpenSpec delta。delta 以 OpenSpec 可测试的 requirement-and-scenario 形式，捕获你现在要改的行为。原始文档原地不动，作为背景。

诚实的理由：OpenSpec 的 specs 刻意写成行为优先、并限定在变更范围内。一份 40 页的 PRD 是另一种制品，承担另一种职责。强行一次性批量转换，往往产生一份大而没人信的过时 spec。让 specs 从真实变更中生长，才能保持准确。

```text
You: /opsx:explore
You: 这是 PRD 里关于 checkout 的章节。我下一步要做
     "guest checkout" 那条需求。
     [粘贴相关需求]
AI:  [阅读，问澄清性问题，然后帮忙圈定一个变更]
You: /opsx:propose add-guest-checkout
```

## 在大型代码库中组织 specs

Specs 存放在 `openspec/specs/`，按 **domain（领域）** 分组：一个与你团队对系统的认知相匹配的逻辑区域。你不必预先设计整套分类。当你在某个区域的第一次变更需要时，再建一个 domain 文件夹即可。

常见的 domain 切分方式：

- **按功能区域：** `auth/`、`payments/`、`search/`
- **按组件：** `api/`、`frontend/`、`workers/`
- **按 bounded context：** `ordering/`、`fulfillment/`、`inventory/`

选一个让新人会心一笑的方式就好。以后可以再调整。见 [概念：Specs](concepts.md#specs)。

## Monorepo 与跨仓库工作

对于 monorepo，最简单的模型是在仓库根目录放一个 `openspec/` 目录，domain 映射到你的 packages 或 services。这能满足大多数团队。

如果你的工作确实跨 **多个仓库**（或你把几个 package 当作独立仓库对待），OpenSpec 提供了 beta 阶段的 **stores** 功能：规划放在它自己的独立仓库里，任何一个代码仓库都可以引用它，这样计划就不必塞进某一个仓库的 `openspec/` 文件夹。它是 beta，所以相关命令和状态仍在演进。从 [Stores 用户指南](stores-beta/user-guide.md) 入手，了解心智模型和最小可用路径。

## 几条诚实的提醒

- **抵制"补全一切"的冲动。** 为你不会改动的代码写 spec 看上去很有效率，通常不是。这些 spec 会过时，因为没有东西逼着它们贴合现实。让真实变更驱动你的 specs。
- **早期变更保持小型。** 你的头几个变更既是交付，也是在学节奏。范围紧凑能让循环快、学费低。
- **把 `openspec/` 提交进 git。** 你的 specs 和 archive 应该和它们描述的代码一起进版本控制。
- **给 AI 上下文。** 在一个有强约定的大型代码库上，填好 `openspec/config.yaml` 的 `context:`，让每个 proposal 都尊重你的技术栈和模式。见 [自定义](customization.md#project-configuration)。

## 接下来去哪儿

- [先做探索](explore.md) —— 改代码前先理解代码的关键习惯
- [快速开始](getting-started.md) —— 完整的首次变更演练
- [编辑与迭代变更](editing-changes.md) —— 边学边调你的变更
- [概念：Delta Specs](concepts.md#delta-specs) —— 为什么 delta 让已有代码库的工作干净利落
- [自定义](customization.md) —— 教会 OpenSpec 你项目的约定
