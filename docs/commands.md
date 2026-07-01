# 命令

这是 OpenSpec 斜杠命令的参考。这些命令在你的 AI 编程助手的聊天界面里调用（例如 Claude Code、Cursor、Windsurf）。

工作流模式与何时用哪条命令见 [工作流](workflows.md)。CLI 命令见 [CLI](cli.md)。

## 快速参考

### 默认快速路径（`core` profile）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 一步创建 change 并生成规划制品 |
| `/opsx:explore` | 在提交 change 前把想法想清楚 |
| `/opsx:apply` | 实现 change 的 task |
| `/opsx:sync` | 把 delta spec 合并进主 spec |
| `/opsx:archive` | 归档已完成的 change |

### 扩展工作流命令（自定义工作流选择）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 起一个新 change 脚手架 |
| `/opsx:continue` | 按依赖创建下一份制品 |
| `/opsx:ff` | 快进：一次性创建所有规划制品 |
| `/opsx:verify` | 校验实现是否匹配制品 |
| `/opsx:bulk-archive` | 批量归档多个 change |
| `/opsx:onboard` | 带讲解的完整工作流引导教程 |

默认全局 profile 是 `core`。要启用扩展工作流命令，运行 `openspec-cn config profile`，选择 workflows，然后在你的项目里运行 `openspec-cn update`。

---

## 命令参考

### `/opsx:propose`

创建一个新 change 并一步生成规划制品。这是 `core` profile 的默认起步命令。

**语法：**
```text
/opsx:propose [change-name-or-description]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | kebab-case 名称或自然语言的变更描述 |

**做什么：**
- 创建 `openspec/changes/<change-name>/`
- 生成实现前需要的制品（对 `spec-driven`：proposal、specs、design、tasks）
- change 准备好 `/opsx:apply` 时停止

**示例：**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**提示：**
- 想要最快的端到端路径就用这个
- 想逐步控制制品创建，启用扩展工作流，用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **不确定时从这里开始。** explore 是一个零成本思考伙伴：它读你的代码库、比较选项，在任何 change 存在之前把模糊想法变成具体计划。它在默认 profile 里。完整理由和更多示例见 [先做探索](explore.md)。

在提交 change 前把想法想清楚、调查问题、厘清需求。

**语法：**
```
/opsx:explore [topic]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `topic` | 否 | 你想探索或调查的内容 |

**做什么：**
- 开启一场无结构要求的探索性对话
- 调查代码库以回答问题
- 比较选项和方案
- 生成图示厘清思路
- 洞察清晰后可转交给 `/opsx:propose`（默认）或 `/opsx:new`（扩展工作流）

**示例：**
```text
You: /opsx:explore

AI:  你想探索什么？

You: How should we handle authentication for the mobile app?

AI:  让我看看你现在的 auth 设置……
     [分析代码库]

     我看到你在 web 端用的是 session 认证。
     移动端我们有三条主要路线：

     1. JWT tokens（无状态，离线可用）
     2. OAuth2（如果需要第三方登录）
     3. 扩展现有 session（更简单，但需要连接）

     你的 API 已经配了 CORS。你倾向哪个方向？

You: 用 JWT。可以为它开一个 change 吗？

AI:  随时。运行 /opsx:propose add-jwt-auth 开始。
```

**提示：**
- 需求不清楚或需要调查时用
- 探索期间不创建任何制品
- 适合在决定前比较多种方案
- 可以读文件、搜索代码库

---

### `/opsx:new`

起新 change 脚手架。创建 change 文件夹，等你用 `/opsx:continue` 或 `/opsx:ff` 生成制品。

此命令属于扩展工作流集（默认 `core` profile 不包含）。

**语法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | change 文件夹名（不给时会提示） |
| `--schema` | 否 | 要用的工作流 schema（默认：来自 config 或 `spec-driven`） |

**做什么：**
- 创建 `openspec/changes/<change-name>/` 目录
- 在 change 文件夹里创建 `.openspec.yaml` 元数据文件
- 显示第一份制品模板，准备创建
- 不提供时提示 change 名和 schema

**创建什么：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change 元数据（schema、创建日期）
```

**示例：**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示：**
- 用描述性名字：`add-feature`、`fix-bug`、`refactor-module`
- 避免泛名：`update`、`changes`、`wip`
- schema 也可在项目配置里设（`openspec/config.yaml`）

---

### `/opsx:continue`

按依赖链创建下一份制品。一次创建一份，增量推进。

**语法：**
```
/opsx:continue [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要继续的 change（不提供时从上下文推断） |

**做什么：**
- 查询制品依赖图
- 显示哪些制品 ready、哪些被阻塞
- 创建第一份 ready 的制品
- 读依赖文件作为上下文
- 显示创建后什么变得可用

**示例：**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**提示：**
- 想在继续前审查每份制品时用
- 适合复杂 change、想要控制
- 多份制品可能同时变 ready
- 创建后你可以编辑制品再继续

---

### `/opsx:ff`

快进式创建制品。一次性创建所有规划制品。

**语法：**
```
/opsx:ff [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要快进的 change（不提供时从上下文推断） |

**做什么：**
- 按依赖顺序创建所有制品
- 通过 todo 清单跟踪进度
- 所有 `apply-required` 制品完成时停止
- 创建每份制品前读其依赖

**示例：**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**提示：**
- 对要构建什么有清晰画面时用
- 对直接 change 比 `/opsx:continue` 更快
- 事后仍可编辑制品
- 适合中小型功能

---

### `/opsx:apply`

实现 change 的 task。按 task 清单逐项��理，写代码并勾掉条目。

**语法：**
```
/opsx:apply [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要实现的 change（不提供时从上下文推断） |

**做什么：**
- 读 `tasks.md`，识别未完成 task
- 逐项处理 task
- 按需写代码、创建文件、跑测试
- 用复选框 `[x]` 标记完成

**示例：**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**提示：**
- 中断后可从上次继续
- 用 change 名可实现并行 change
- 完成状态在 `tasks.md` 的复选框里追踪

---

### `/opsx:verify`

校验实现是否匹配你的 change 制品。检查完整性、正确性、一致性。

**语法：**
```
/opsx:verify [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要校验的 change（不提供时从上下文推断） |

**做什么：**
- 检查实现质量的三个维度
- 搜索代码库寻找实现证据
- 把问题分类为 CRITICAL、WARNING、SUGGESTION 报告
- 不阻塞归档，但暴露问题

**校验维度：**

| 维度 | 校验什么 |
|-----------|-------------------|
| **完整性** | 所有 task 完成、所有 requirement 已实现、scenario 已覆盖 |
| **正确性** | 实现匹配 spec 意图、边缘情况已处理 |
| **一致性** | design 决策反映在代码中、模式一致 |

**示例：**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**提示：**
- 归档前跑一次，早发现不匹配
- 警告不阻塞归档，但提示潜在问题
- 适合在提交前审查 AI 的工作
- 可暴露制品与实现之间的漂移

---

### `/opsx:sync`

**可选命令。** 把 change 的 delta spec 合并进主 spec。归档时如需 sync 会主动提示，所以通常不必手动运行。

**语法：**
```
/opsx:sync [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要 sync 的 change（不提供时从上下文推断） |

**做什么：**
- 从 change 文件夹读 delta spec
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 段落
- 把变化合并进主 `openspec/specs/` 目录
- 保留 delta 未提及的现有内容
- 不归档 change（仍保持活跃）

**示例：**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**何时手动用：**

| 场景 | 用 sync？ |
|----------|-----------|
| 长期运行的 change，想在归档前就让 spec 在主 spec 里 | 是 |
| 多个并行 change 需要更新后的基线 spec | 是 |
| 想单独预览/审查合并 | 是 |
| 快速 change，直接归档 | 否（归档会处理） |

**提示：**
- sync 是智能合并，不是复制粘贴
- 可为已有 requirement 加 scenario 而不重复
- sync 后 change 仍保持活跃（未归档）
- 多数人永远不需要直接调它——归档时会提示

---

### `/opsx:archive`

归档已完成的 change。完成 change 并把它移到 archive 文件夹。

**语法：**
```
/opsx:archive [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的 change（不提供时从上下文推断） |

**做什么：**
- 检查制品完成状态
- 检查 task 完成（未完成会警告）
- 如未 sync，主动提出 sync delta spec
- 把 change 文件夹移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有制品用于审计

**示例：**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**提示：**
- 归档不会因 task 未完成而阻塞，但会警告
- delta spec 可在归档时 sync 或提前 sync
- 归档的 change 保留供历史
- 先跑 `/opsx:verify` 可提前发现问题

---

### `/opsx:bulk-archive`

批量归档多个已完成 change。处理 change 之间的 spec 冲突。

**语法：**
```
/opsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-names` | 否 | 要归档的指定 change（不提供时提示选择） |

**做什么：**
- 列出所有已完成 change
- 归档前校验每个 change
- 检测跨 change 的 spec 冲突
- 通过检查实际实现来解决冲突
- 按时间顺序归档

**示例：**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**提示：**
- 适合并行工作流
- 冲突解决是 agent 式的（检查代码库）
- change 按创建顺序归档
- 覆盖 spec 内容前会提示

---

### `/opsx:onboard`

带讲解的完整 OpenSpec 工作流引导。用你的真实代码库做交互式教程。

**语法：**
```
/opsx:onboard
```

**做什么：**
- 旁白式带你走完完整的工作流循环
- 扫描你的代码库找真实的改进机会
- 创建一个真实的 change 与真实制品
- 实现真实工作（小型、安全的变更）
- 归档完成的 change
- 每一步都解释发生���什么

**阶段：**
1. 欢迎与代码库分析
2. 找一个改进机会
3. 创建 change（`/opsx:new`）
4. 写 proposal
5. 创建 specs
6. 写 design
7. 创建 tasks
8. 实现 tasks（`/opsx:apply`）
9. 校验实现
10. 归档 change
11. 总结与下一步

**示例：**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**提示：**
- 最适合新用户学工作流
- 用真实代码，不是玩具示例
- 创建一个真实 change，可留可弃
- 约需 15-30 分钟完成

---

## 各工具的命令语法

不同 AI 工具的命令语法略有不同。用与你助手匹配的形式：

| 工具 | 语法示例 |
|------|----------------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| Copilot（IDE） | `/opsx-propose`、`/opsx-apply` |
| Kimi CLI | 基于 skill 的调用，如 `/skill:openspec-propose`、`/skill:openspec-apply-change`（不生成 `opsx-*` 命令文件） |
| Trae | 基于 skill 的调用，如 `/openspec-propose`、`/openspec-apply-change`（不生成 `opsx-*` 命令文件） |

各工具的意图相同，只是命令暴露方式因集成而异。

> **注意：** GitHub Copilot 命令（`.github/prompts/*.prompt.md`）仅在 IDE 扩展（VS Code、JetBrains、Visual Studio）中可用。GitHub Copilot CLI 目前不支持自定义 prompt 文件——详见 [支持的工具](supported-tools.md) 中的说明和替代方案。

---

## 旧版命令

这些命令使用较老的"一次性"工作流。它们仍然可用，但推荐使用 OPSX 命令。

| 命令 | 做什么 |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有制品（proposal、specs、design、tasks） |
| `/openspec:apply` | 实现 change |
| `/openspec:archive` | 归档 change |

**何时用旧版命令：**
- 使用旧工作流的已有项目
- 不需要逐步创建制品的简单变更
- 偏好一次性方式

**迁移到 OPSX：**
旧版 change 可用 OPSX 命令继续。制品结构是兼容的。

---

## 故障排查

### "Change not found"

命令无法识别要在哪个 change 上工作。

**解决：**
- 显式指定 change 名：`/opsx:apply add-dark-mode`
- 检查 change 文件夹是否存在：`openspec-cn list`
- 确认你在正确的项目目录

### "No artifacts ready"

所有制品要么已完成，要么被缺失依赖阻塞。

**解决：**
- 运行 `openspec-cn status --change <name>` 看什么在阻塞
- 检查需要的制品是否存在
- 先创建缺失的依赖制品

### "Schema not found"

指定的 schema 不存在。

**解决：**
- 列出可用 schema：`openspec-cn schemas`
- 检查 schema 名拼写
- 若是自定义 schema，创建它：`openspec-cn schema init <name>`

### 命令未识别

AI 工具不识别 OpenSpec 命令。

**解决：**
- 确认 OpenSpec 已初始化：`openspec-cn init`
- 重新生成 skill：`openspec-cn update`
- 检查 `.claude/skills/` 目录是否存在（Claude Code）
- 重启 AI 工具以加载新 skill

### 制品生成不正常

AI 创建了不完整或错误的制品。

**解决：**
- 在 `openspec/config.yaml` 里加项目上下文
- 加 per-artifact rules 提供具体指引
- 在 change 描述里提供更多细节
- 用 `/opsx:continue` 替代 `/opsx:ff` 获得更多控制

---

## 下一步

- [工作流](workflows.md) —— 常见模式与何时用哪个命令
- [CLI](cli.md) —— 管理与校验的终端命令
- [自定义](customization.md) —— 创建自定义 schema 与工作流
