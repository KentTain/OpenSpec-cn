# 核心概念一览

**OpenSpec 是你和 AI 之间的一层轻量协议。** 你写下变更应该做什么，AI 起草细节，双方对照同一份计划，然后才写代码。本页把整个心智模型塞进一屏。当你想要长版本，[概念](concepts.md) 在那里。

整个 idea 用五个词概括：**先对齐，再放心地构建。**

## 五个核心 idea

OpenSpec 的一切都由五个概念构建。学会这五个，剩下都是细节。

**1. Specs 是真相。** spec 描述你的系统*现在*如何运转。它住在 `openspec/specs/`，按 domain 组织（`auth/`、`payments/`、`ui/`）。Specs 由 requirement（"系统 SHALL 在 30 分钟后过期 session"）和 scenario（具体的 given/when/then 示例）构成。把 specs 想成"这份软件做什么"的唯一公认答案。

**2. 一个 change 是一个工作单元。** 当你要加、改、删行为时，就创建一个 change：`openspec/changes/` 下的一个文件夹，把那件工作的所有东西放在一起。一份 proposal、一份 design、一份 task 清单，以及 spec 编辑。一个 change，一个文件夹，一个 feature。

**3. Delta spec 描述变化，不是整个世界。** 在一个 change 里，你不重写整个 spec。你写一小段 delta：`ADDED` 这条 requirement，`MODIFIED` 那条，`REMOVED` 另一条。这是让 OpenSpec 擅长改已有系统、而不只是从零起项目的关键。你描述 diff，不描述终点。

**4. 制品互相支撑。** 一个 change 包含几份文档，按自然顺序创建，每份喂养下一份：

```text
proposal ──► specs ──► design ──► tasks ──► implement
   为什么      做什么     怎么做     步骤       动手
```

你随时可以回头改任何一份。它们是 enabler，不是 gate。（下面会详细说。）

**5. 归档把 change 折回真相。** 工作完成后，你 archive 这个 change。它的 delta spec 合并进主 spec，change 文件夹移到 `changes/archive/` 并加上日期戳。现在你的 specs 描述新的现实，你准备好下一个变更。循环闭合。

## 一张图

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

两个文件夹。`specs/` 是真相。`changes/` 是你正在提案的东西。归档把一份 proposal 变成真相。

## 你实际会跑的循环

在默认设置下，你的一天长这样。可选地先想清楚；然后一条命令起草计划，你读它，下一条构建，最后一条把它归档。

```text
/opsx:explore                   →  (可选) 先和 AI 一起想清楚
/opsx:propose add-dark-mode     →  AI 起草 proposal、specs、design、tasks
        (你阅读并调整计划)
/opsx:apply                     →  AI 构建，逐项勾掉 tasks
/opsx:archive                   →  specs 更新，change 归档
```

**不确定时，从探索开始。** `/opsx:explore` 是一个零成本思考伙伴：它读你的代码，列出选项，并在任何制品存在之前把模糊想法变成具体计划。它是对 AI 不然就会从模糊提示里造出*某种东西*的最好解药。已经确切知道想要什么？直接跳到 `/opsx:propose`。无论哪种，explore 都在默认 profile 里，随时可用。见 [Explore 指南](explore.md)。

以上是斜杠命令，在你的 AI 助手聊天里输入。安装（`openspec-cn init`）在终端里。如果这种分工对你来说是新的，先读 [命令是如何工作的](how-commands-work.md)；它是最常见的困惑点。

## "是 enabler，不是 gate"

这句话在 OpenSpec 里到处出现，所以这里用人话解释一下。

老派 spec 流程是瀑布：完成规划，*然后*才允许实现，回头很痛苦。OpenSpec 拒绝这种做法。`proposal → specs → design → tasks` 这个顺序表示接下来什么变*可能*，而不是你*被迫*做什么。

实现中发现 design 错了？改 `design.md`，继续。发现范围要收窄？更新 proposal。没有锁。依赖存在的唯一理由是让 AI 拿到它需要的上下文（没有 specs 做基础，你写不出好的 tasks），不是为了把你关进去。

这里的优势是诚实：真实的工作是 messy、迭代的，OpenSpec 允许它 messy。代价是纪律：因为没东西逼你前进，保持 change 聚焦不蔓延靠你自己。[Workflows](workflows.md) 指南有一些好习惯。

## 为什么这点小开销值得

大实话：OpenSpec 多加了一步。你在构建前写一份短计划。那你能得到什么？

- **在错误造成代价之前拦住它。** 在一段话的 proposal 里修一个误解是免费的。在 AI 写了 400 行之后修，就不免费了。
- **计划和代码留在同一个仓库。** 半年后，spec 会告诉你（以及下一个 AI session）系统为什么这样运转。
- **变更可审查。** 一个 change 文件夹是一个整齐的包裹：读 proposal，扫 delta，查 tasks。不必在聊天历史里考古。
- **它适配已有代码库。** delta 意味着你可以为一个 5 万行的应用描述一次变更，而不必先把整个系统写文档。

诚实的权衡：对于一个真正一次性的单行修复，这套仪式可能不值，那也没关系。OpenSpec 设计得轻量，但不是免费的。在"对齐重要"的场景用它——结果你会发现，和一个会自信地造出你模糊要求的任何东西的 AI 共事时，这几乎是大多数场景。

## 接下来去哪儿

- 新来？[快速开始](getting-started.md) 完整走一遍第一个变更。
- 还不知道要做什么？[先做探索](explore.md) 是起点。
- 搞不清命令在哪里运行？[命令是如何工作的](how-commands-work.md)。
- 想要上面所有东西的深度版？[概念](concepts.md)。
- 看例子学？[示例与配方](examples.md)。
- 需要查术语？[术语表](glossary.md)。
