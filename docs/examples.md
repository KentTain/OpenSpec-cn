# 示例与配方

真实变更，从开始到结束。每个配方展示你会输入的命令和看到的反馈，让你把自己的情况对号入座并复制。这些使用默认的 **core** 命令（`propose`、`explore`、`apply`、`sync`、`archive`）；扩展集有帮助的地方会标注。

开始前一个提醒：像 `/opsx:propose` 这样的斜杠命令在你的 **AI 助手聊天** 里输入，`openspec` 命令在 **终端** 里输入。如果是新概念，先读 [命令是如何工作的](how-commands-work.md)。下面的对话记录里，`You:` 和 `AI:` 是聊天，以 `$` 开头的行是终端。

> **还不确定要构建什么？** 大多数配方如果你先用 `/opsx:explore` 想清楚会更锋利。[配方 3](#recipe-3-exploring-before-you-commit) 展示了它的实战，[先做探索](explore.md) 给出完整理由。

## 配方 1：一个小功能，快速路径

**何时用：** 你知道想要什么，且是一块范围可控的工作。这是最常见的配方。

整个过程就三条命令。propose、构建、归档。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — 为什么与做什么
     ✓ specs/      — 新的 requirement 和它的 scenario
     ✓ design.md   — 技术方案
     ✓ tasks.md    — 实现清单
     Ready for implementation. Run /opsx:apply.
```

现在读计划。打开 proposal 和 delta spec。这正是 OpenSpec 为之而生的时刻：在一个错误假设还只是一段话时拦住它，而不是 400 行代码之后。哪里不对就直接编辑任何制品，然后继续。

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

就这样。登出行为现在是你的 spec 的一部分，change 连同完整上下文归档。

## 配方 2：一个 Bug 修复

**何时用：** 东西坏了，你想把修复记录成一次对行为的刻意变更，而不是一个谜之 commit。

Bug 修复和功能一模一样。差别在于你怎么写 proposal：描述*正确*的行为，而不只是"修 bug"。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

因为修复以一条 `MODIFIED` requirement 加一个全新 scenario 的形式落地，下一个人（或下一个 AI session）不仅看到你修了它，还看到"正确"是什么意思。然后照常 `/opsx:apply` 和 `/opsx:archive`。

提示：对于修复，一条好 scenario 就是用散文写的回归测试。"GIVEN 一个已登出用户，WHEN 提交有效凭证，THEN 落在 dashboard 且不再被重定向。"写下它，实现就有了明确目标。

## 配方 3：提交前先探索

**何时用：** 你有一个问题但还没有方案。你不确定要构建什么，或哪种方案对。

从 `/opsx:explore` 开始。它是一个无结构、不创建任何制品的思考伙伴。它读你的代码库帮你决定。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

探索在你为它花一个 change 之前厘清思路。洞察清晰后，propose，AI 会把上下文带进制品。

## 配方 4：同时处理两个 change

**何时用：** 你正在做一个功能中途，一个紧急修复插队。

change 是独立文件夹，所以并行工作不冲突。开修复、发掉、然后回到功能刚才停下的地方。

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

`/opsx:apply add-dark-mode` 里点名 change 是你在多个活跃 change 时把 AI 指向某个 change 的方式。因为 task 完成状态在 `tasks.md` 里追踪，AI 知道你停在哪里。

当几个 change 同时完成时，扩展的 `/opsx:bulk-archive` 一次性归档并检查实际实现解决 spec 冲突。见 [工作流](workflows.md#parallel-changes)。

## 配方 5：一次不改变行为的重构

**何时用：** 你在重构代码，且外部可见行为应保持不变。

这是有意思的情况，因为纯重构对 spec *没有东西可加*。行为契约不变，只有实现变。所以工作在 design 和 task 里，spec delta 为空或缺席。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

归档一个不触及 spec 的 change 时，可以告诉终端命令跳过 spec 步骤：

```bash
$ openspec-cn archive refactor-payment-module --skip-specs
```

这个 flag 也适用于工具、CI 和仅文档变更。原则：spec 描述行为，行为没变，spec 也不应变。见 [概念](concepts.md#what-a-spec-is-and-is-not)。

## 配方 6：逐步控制（扩展命令）

**何时用：** 复杂或高风险的变更，你想在继续前审查每份制品。

core 的 `/opsx:propose` 一次性起草一切。想一步走一步时，打开扩展命令：

```bash
$ openspec-cn config profile      # 选择扩展工作流
$ openspec-cn update              # 应用到本项目
```

现在你可以脚手架生成并增量构建：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

每份制品落地时审查它、随意编辑、满意后继续。想一次性起草剩余部分时，`/opsx:ff` 会快进通过剩下的规划制品。归档前，`/opsx:verify` 检查实现是否真的匹配 spec。见 [工作流](workflows.md#opsxff-vs-opsxcontinue)。

## 配方 7：亲手学完整循环

**何时用：** 你装了 OpenSpec，想用自己的代码*感受*工作流，不是玩具示例。

打开扩展命令（见配方 6），然后：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 找一个真实（小型）改进、为它创建 change、实现并归档，每一步都有旁白。约 15-30 分钟，留下一个真实 change，可留可弃。这是最温和的学习方式。见 [命令](commands.md#opsxonboard)。

## 从终端检查你的工作

随时可以在终端里检查状态：

```bash
$ openspec-cn list                      # 活跃 change
$ openspec-cn show add-dark-mode        # 某个 change 详情
$ openspec-cn validate add-dark-mode    # 检查结构
$ openspec-cn view                      # 交互式仪表盘
```

这些是只读检查工具。提案与构建仍通过聊天里的斜杠命令进行。完整细节见 [CLI 参考](cli.md)。

## 接下来去哪儿

- [先做探索](explore.md)：不确定时推荐的起点
- [工作流](workflows.md)：上面的模式，附何时用哪个的决策指引
- [命令](commands.md)：每条斜杠命令的详解
- [快速开始](getting-started.md)：规范的首次变更演练
- [概念](concepts.md)：各部分为何这样拼在一起
