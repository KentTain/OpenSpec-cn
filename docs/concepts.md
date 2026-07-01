# 概念

本指南解释 OpenSpec 背后的核心 idea 以及它们如何拼在一起。实战用法见 [快速开始](getting-started.md) 和 [工作流](workflows.md)。

## 哲学

OpenSpec 围绕四条原则构建：

```
fluid not rigid         — 没有阶段门槛，做当下合理的事
iterative not waterfall — 边建边学，边走边精炼
easy not complex        — 轻量设置，最少仪式
brownfield-first        — 适配已有代码库，不只是全新项目
```

### 为什么这些原则重要

**流式而非僵硬。** 传统 spec 系统把你锁进阶段：先规划、再实现、再完成。OpenSpec 更灵活——你可以按对当前工作合理的任意顺序创建制品。

**迭代而非瀑布。** 需求会变。理解会加深。开头看起来好的方案，看了代码后未必站得住。OpenSpec 拥抱这个现实。

**简单而非复杂。** 一些 spec 框架需要大量设置、僵硬的格式或重型流程。OpenSpec 不挡你的路。几秒初始化、立即开工、只在需要时自定义。

**Brownfield-first。** 大多数软件工作不是从零开始——是改已有系统。OpenSpec 基于 delta 的方式让你方便地描述对已有行为的修改，而不只是描述新系统。

## 全景

OpenSpec 把你的工作组织成两个主要区域：

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** 是真相源——它们描述系统当前如何运转。

**Changes** 是提议中的修改——它们各自待在独立文件夹里，直到你准备好合并。

这种分离是关键。你可以并行做多个 change 而不冲突。你可以在 change 影响主 spec 之前审查它。当你归档一个 change 时，它的 delta 干净地合并进真相源。

## Specs

Specs 用结构化的 requirement 和 scenario 描述系统行为。

### 结构

```
openspec/specs/
├── auth/
│   └── spec.md           # 认证行为
├── payments/
│   └── spec.md           # 支付处理
├── notifications/
│   └── spec.md           # 通知系统
└── ui/
    └── spec.md           # UI 行为与主题
```

按 domain 组织 specs——对系统有意义的逻辑分组。常见模式：

- **按功能区域**：`auth/`、`payments/`、`search/`
- **按组件**：`api/`、`frontend/`、`workers/`
- **按 bounded context**：`ordering/`、`fulfillment/`、`inventory/`

### Spec 格式

一份 spec 包含 requirement，每个 requirement 又包含 scenario：

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**关键元素：**

| 元素 | 用途 |
|---------|---------|
| `## Purpose` | 这份 spec 的 domain 的高层描述 |
| `### Requirement:` | 系统必须具备的某条具体行为 |
| `#### Scenario:` | 该 requirement 的具体示例 |
| SHALL/MUST/SHOULD | RFC 2119 关键字，表示 requirement 的严格程度 |

### 为什么这样结构化 spec

**Requirement 是"做什么"**——它陈述系统该做什么，不指定实现。

**Scenario 是"什么时候"**——它提供可验证的具体示例。好的 scenario：
- 可测试（你能为它写自动化测试）
- 覆盖 happy path 和边缘情况
- 使用 Given/When/Then 或类似结构化格式

**RFC 2119 关键字**（SHALL、MUST、SHOULD、MAY）传达意图：
- **MUST/SHALL** —— 绝对要求
- **SHOULD** —— 推荐，但允许例外
- **MAY** —— 可选

### spec 是什么（与不是）

spec 是**行为契约**，不是实现计划。

好的 spec 内容：
- 用户或下游系统依赖的可观察行为
- 输入、输出与错误条件
- 外部约束（安全、隐私、可靠性、兼容性）
- 可测试或可显式校验的 scenario

避免在 spec 里写：
- 内部类/函数名
- 库或框架选型
- 逐步实现细节
- 详细的执行计划（那些属于 `design.md` 或 `tasks.md`）

快速判断：
- 如果实现可以在不改变外部可见行为的前提下换方式，它大概不属于 spec。

### 保持轻量：渐进式严格

OpenSpec 不想变成官僚主义。用仍能让变更可验证的最轻量级别。

**Lite spec（默认）：**
- 简短的行为优先 requirement
- 清晰的范围与非目标
- 几条具体的验收检查

**Full spec（用于更高风险）：**
- 跨团队或跨仓库的变更
- API/契约变更、迁移、安全/隐私相关
- 歧义可能引发昂贵返工的变更

大多数变更应保持在 Lite 模式。

### 人 + Agent 协作

在很多团队里，人探索、agent 起草制品。预期循环是：

1. 人提供意图、上下文与约束。
2. Agent 把它转成行为优先的 requirement 和 scenario。
3. Agent 把实现细节放在 `design.md` 和 `tasks.md`，不放进 `spec.md`。
4. 校验在实现之前确认结构与清晰度。

这样能让 spec 对人可读、对 agent 一致。

## Changes

一个 change 是对系统的一次提议修改，打包成一个文件夹，里面包含理解和实现它所需的一切。

### Change 结构

```
openspec/changes/add-dark-mode/
├── proposal.md           # 为什么与做什么
├── design.md             # 怎么做（技术方案）
├── tasks.md              # 实现清单
├── .openspec.yaml        # Change 元数据（可选）
└── specs/                # Delta spec
    └── ui/
        └── spec.md       # ui/spec.md 里在变什么
```

每个 change 自包含。它有：
- **Artifacts** —— 捕获意图、design 和 task 的文档
- **Delta spec** —— 关于新增、修改、删除什么的规范
- **Metadata** —— 针对该 change 的可选配置

### 为什么 change 是文件夹

把 change 打包成文件夹有几个好处：

1. **一切在一起。** Proposal、design、tasks 和 spec 放在一处。不必到处找。

2. **并行工作。** 多个 change 可同时存在不冲突。一边做 `add-dark-mode`，一边 `fix-auth-bug` 也在进行。

3. **干净的历史。** 归档时，change 移到 `changes/archive/`，完整上下文保留。你可以回看，理解不止是改了什么，还有为什么。

4. **便于审查。** 一个 change 文件夹容易审查——打开它，读 proposal，查 design，看 spec delta。

## Artifacts

制品是 change 内部指导工作的文档。

### 制品流

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

制品互相喂养。每个为下一个提供上下文。

### 制品类型

#### Proposal（`proposal.md`）

proposal 在高层捕获**意图**、**范围**和**方案**。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**何时更新 proposal：**
- 范围变化（收窄或扩大）
- 意图更清楚（对问题理解更好）
- 方案根本转变

#### Specs（`specs/` 中的 delta spec）

delta spec 描述相对当前 spec **在变什么**。见下面 [Delta Specs](#delta-specs)。

#### Design（`design.md`）

design 捕获**技术方案**与**架构决策**。

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**何时更新 design：**
- 实现发现方案行不通
- 发现更好的方案
- 依赖或约束变化

#### Tasks（`tasks.md`）

task 是**实现清单**——带复选框的具体步骤。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**task 的好实践：**
- 把相关 task 分到标题下
- 用层级编号（1.1、1.2 等）
- 每个 task 保持小到一次能做完
- 完成后勾掉

## Delta Specs

delta spec 是让 OpenSpec 擅长已有代码库开发的关键概念。它描述**在变什么**，而不是重述整份 spec。

### 格式

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Delta 段落

| 段落 | 含义 | 归档时发生什么 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新行为 | 追加到主 spec |
| `## MODIFIED Requirements` | 变更的行为 | 替换现有 requirement |
| `## REMOVED Requirements` | 废弃的行为 | 从主 spec 删除 |

### 为什么用 delta 而不是整份 spec

**清晰。** delta 准确显示在变什么。读整份 spec，你得在脑子里和当前版本做 diff。

**避免冲突。** 两个 change 可以触同一份 spec 文件而不冲突，只要它们改不同的 requirement。

**审查效率。** 审查者看到的是变化，不是未变的上下文。聚焦在重要之处。

**适配已有代码库。** 大多数工作是修改已有行为。delta 让修改变成一等公民，而不是事后补丁。

## Schemas

schema 定义一个工作流的制品类型及其依赖。

### schema 如何工作

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # 无依赖，可最先创建

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # 需要先有 proposal

  - id: design
    generates: design.md
    requires: [proposal]      # 可与 specs 并行创建

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # 需要先有 specs 和 design
```

**制品形成依赖图：**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**依赖是 enabler，不是 gate。** 它们显示什么可以创建，而不是你接下来必须创建什么。你不需要 design 时可以跳过。你可以在 design 之前或之后创建 specs——两者都只依赖 proposal。

### 内置 schema

**spec-driven**（默认）

规范驱动开发的标准工作流：

```
proposal → specs → design → tasks → implement
```

最适合：你想在实现前对 spec 达成共识的大多数功能开发。

### 自定义 schema

为你的团队工作流创建自定义 schema：

```bash
# 从零创建
openspec-cn schema init research-first

# 或复制现有的
openspec-cn schema fork spec-driven research-first
```

**自定义 schema 示例：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 先做研究

  - id: proposal
    generates: proposal.md
    requires: [research]   # proposal 由研究支撑

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # 跳过 specs/design，直接到 task
```

完整细节见 [自定义](customization.md)。

## Archive

归档通过把 delta spec 合并进主 spec 并保留 change 供历史查阅来完成一个 change。

### 归档时发生什么

```
归档前：

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


归档后：

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 现在包含 2FA requirement
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 保留供历史
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 归档过程

1. **合并 delta。** 每个 delta spec 段落（ADDED/MODIFIED/REMOVED）应用到对应主 spec。

2. **移到 archive。** change 文件夹移到 `changes/archive/`，带日期前缀按时间排序。

3. **保留上下文。** 所有制品在 archive 中保持完整。你随时可以回头看一个 change 为何而做。

### 归档为什么重要

**干净的状态。** 活跃 changes（`changes/`）只显示进行中的工作。已完成的工作移走。

**审计轨迹。** archive 保留每个 change 的完整上下文——不止是改了什么，还有解释为什么的 proposal、解释怎么做的 design、展示做了什么的 task。

**Spec 演进。** 随着变更归档，spec 自然生长。每次归档合并它的 delta，逐步积累成一份全面的规范。

## 整体如何拼起来

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY      │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**良性循环：**

1. Spec 描述当前行为
2. Change 提议修改（以 delta 形式）
3. 实现让修改成真
4. 归档把 delta 合并进 spec
5. Spec 现在描述新行为
6. 下一个 change 基于更新后的 spec

## 术语表

| 术语 | 定义 |
|------|------------|
| **Artifact** | change 内的一份文档（proposal、design、task 或 delta spec） |
| **Archive** | 完成一个 change 并把其 delta 合并进主 spec 的过程 |
| **Change** | 对系统的一次提议修改，打包成包含制品的文件夹 |
| **Delta spec** | 相对当前 spec 描述变化（ADDED/MODIFIED/REMOVED）的 spec |
| **Domain** | spec 的逻辑分组（如 `auth/`、`payments/`） |
| **Requirement** | 系统必须具备的某条具体行为 |
| **Scenario** | requirement 的具体示例，通常用 Given/When/Then 格式 |
| **Schema** | 制品类型及其依赖的定义 |
| **Spec** | 描述系统行为的规范，包含 requirement 和 scenario |
| **Source of truth** | `openspec/specs/` 目录，存放当前公认的行为 |

## 下一步

- [快速开始](getting-started.md) —— 实战入门
- [工作流](workflows.md) —— 常见模式与何时用哪个
- [命令](commands.md) —— 完整命令参考
- [自定义](customization.md) —— 创建自定义 schema 并配置你的项目
