# CLI 参考

OpenSpec CLI（`openspec-cn`）提供用于项目设置、校验、状态检查和管理的终端命令。这些命令与 AI 斜杠命令（如 `/opsx:propose`，见 [命令](commands.md)）互补。

## 总览

| 类别 | 命令 | 用途 |
|----------|----------|---------|
| **设置** | `init`、`update` | 在项目中初始化与更新 OpenSpec |
| **Stores（独立 OpenSpec 仓库）** | `store setup`、`store register`、`store unregister`、`store remove`、`store list`、`store doctor` | 管理已注册的 store |
| **健康检查** | `doctor` | 报告解析出的根目录的关系健康状态 |
| **工作上下文** | `context` | 组装工作集（根 + 被引用的 store） |
| **个人 workset** | `workset create`、`workset list`、`workset open`、`workset remove` | 保存并打开你工具里的个人本地工作视图 |
| **浏览** | `list`、`view`、`show` | 浏览 changes 和 specs |
| **校验** | `validate` | 检查 changes 和 specs 的问题 |
| **生命周期** | `archive` | 归档已完成的 changes |
| **工作流** | `new change`、`status`、`instructions`、`templates`、`schemas` | 制品驱动工作流支持 |
| **Schema** | `schema init`、`schema fork`、`schema validate`、`schema which` | 创建和管理自定义工作流 |
| **配置** | `config` | 查看与修改设置 |
| **工具** | `feedback`、`completion` | 反馈与 shell 集成 |

---

## 人类命令与 Agent 命令

大多数 CLI 命令面向**人类在终端里使用**。部分命令通过 JSON 输出也支持 **agent/脚本** 使用。

### 仅人类命令

这些命令是交互式的，面向终端使用：

| 命令 | 用途 |
|---------|---------|
| `openspec-cn init` | 初始化项目（交互式提示） |
| `openspec-cn view` | 交互式仪表盘 |
| `openspec-cn workset open <name>` | 打开已保存的 workset（编辑器窗口或终端 agent 会话） |
| `openspec-cn config edit` | 在编辑器中打开配置 |
| `openspec-cn feedback` | 通过 GitHub 提交反馈 |
| `openspec-cn completion install` | 安装 shell 补全 |

### 兼容 Agent 的命令

这些命令支持 `--json` 输出，供 AI agent 和脚本程序化使用：

| 命令 | 人类用途 | Agent 用途 |
|---------|-----------|-----------|
| `openspec-cn list` | 浏览 changes/specs | `--json` 获取结构化数据 |
| `openspec-cn show <item>` | 读取内容 | `--json` 供解析 |
| `openspec-cn validate` | 检查问题 | `--all --json` 批量校验 |
| `openspec-cn status` | 看制品进度 | `--json` 获取结构化状态 |
| `openspec-cn instructions` | 获取下一步 | `--json` 获取 agent 指令 |
| `openspec-cn templates` | 查找模板路径 | `--json` 解析路径 |
| `openspec-cn schemas` | 列出可用 schema | `--json` 发现 schema |
| `openspec-cn store setup <id>` | 创建并注册本地 store | `--json` 加显式输入，获取结构化 setup 输出 |
| `openspec-cn store register <path>` | 注册已有 store | `--json` 获取结构化注册输出 |
| `openspec-cn store unregister <id>` | 注销本地 store 注册 | `--json` 获取结构化清理输出 |
| `openspec-cn store remove <id>` | 删除已注册的本地 store 文件夹 | `--yes --json` 非交互式删除 |
| `openspec-cn store list` | 浏览已注册 store | `--json` 获取结构化注册信息 |
| `openspec-cn store doctor` | 检查本地 store 设置 | `--json` 获取结构化诊断 |
| `openspec-cn new change <id>` | 创建仓库本地 change 脚手架 | `--json`，可加 `--store <id>` 用已注册 store 作为 OpenSpec 根 |
| `openspec-cn workset create [name]` | 组合个人工作视图 | `--member <path> --json` 非交互式组合 |
| `openspec-cn workset list` | 浏览已保存的 workset | `--json` 获取结构化视图 |
| `openspec-cn workset remove <name>` | 删除已保存的视图 | `--yes --json` 非交互式删除 |

---

## 全局选项

以下选项对所有命令生效：

| 选项 | 说明 |
|--------|-------------|
| `--version`、`-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`、`-h` | 显示命令帮助 |

---

## 设置命令

### `openspec-cn init`

在你的项目中初始化 OpenSpec。创建文件夹结构并配置 AI 工具集成。

默认行为使用全局配置默认值：profile `core`、delivery `both`、workflows `propose, explore, apply, sync, archive`。

```
openspec-cn init [path] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--tools <list>` | 非交互式配置 AI 工具。可用 `all`、`none` 或逗号分隔列表 |
| `--force` | 自动清理旧版文件无需提示 |
| `--profile <profile>` | 覆盖本次 init 的全局 profile（`core` 或 `custom`） |

`--profile custom` 使用全局配置（`openspec-cn config profile`）中当前选中的 workflows。

**支持的工具 ID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`vibe`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`

> 该列表对应 `src/core/config.ts` 中的 `AI_TOOLS`。每个工具的 skill 和命令路径见 [支持的工具](supported-tools.md)。

**示例：**

```bash
# 交互式初始化
openspec-cn init

# 在指定目录初始化
openspec-cn init ./my-project

# 非交互式：为 Claude 和 Cursor 配置
openspec-cn init --tools claude,cursor

# 为所有支持的工具配置
openspec-cn init --tools all

# 覆盖本次运行的 profile
openspec-cn init --profile core

# 跳过提示并自动清理旧版文件
openspec-cn init --force
```

**创建内容：**

```
openspec/
├── specs/              # 你的规范（真相源）
├── changes/            # 提议的变更
└── config.yaml         # 项目配置

.claude/skills/         # Claude Code skill（若选中 claude）
.cursor/skills/         # Cursor skill（若选中 cursor）
.cursor/commands/       # Cursor OPSX 命令（若 delivery 包含命令）
... （其他工具配置）
```

---

### `openspec-cn update`

升级 CLI 后更新 OpenSpec 指令文件。用当前全局 profile、选中的 workflows 和 delivery 模式重新生成 AI 工具配置文件。

```
openspec-cn update [path] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 即使文件已是最新也强制更新 |

**示例：**

```bash
# npm 升级后更新指令文件
npm update @studyzy/openspec-cn
openspec-cn update
```

---

## Stores（独立 OpenSpec 仓库）

> **Beta。** Stores 及其上构建的功能（reference、工作上下文、workset）是新功能；命令名、标志、文件格式和 JSON 输出可能在版本间变化。按问题切入的 walkthrough 见 [stores 指南](stores-beta/user-guide.md)。

store 是你在这台机器上注册过的独立 OpenSpec 仓库——例如一个规划仓库或契约仓库。注册 store 后，普通命令（`list`、`show`、`status`、`validate`、`new change`、`archive`……）可通过 `--store <id>` 在任何位置操作它。

### `openspec-cn store setup`

创建并注册本地 store。在终端中不带参数时，OpenSpec 会引导用户完成设置。Agent 和脚本应传入显式输入并使用 `--json`。

```bash
openspec-cn store setup [id] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--path <path>` | store 存放位置（例如 `~/openspec/<id>`） |
| `--remote <url>` | 在新 store 的 `store.yaml` 中记录规范远程仓库 |
| `--init-git` | 初始化 Git 仓库并做首次提交（默认） |
| `--no-init-git` | 跳过所有 Git 动作：不 init、不提交 |
| `--json` | 输出 JSON |

非交互运行（`--json`、脚本、agent）必须同时提供 store id 和 `--path`。在交互终端中，setup 会提示位置，并在可见、用户拥有的地方给出可编辑建议（例如 `~/openspec/<id>`）；它从不默认到 OpenSpec 的托管数据目录。

示例：

```bash
openspec-cn store setup
openspec-cn store setup team-context
openspec-cn store setup team-context --path ~/openspec/team-context --no-init-git
openspec-cn store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec-cn store register`

注册一个已有的本地 store 文件夹。

```bash
openspec-cn store register [path] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--id <id>` | store id；默认取 store 元数据或文件夹名 |
| `--yes` | 确认为健康的 OpenSpec 根创建 store 身份元数据 |
| `--json` | 输出 JSON |

### `openspec-cn store unregister`

注销本地 store 注册，不删除文件。

```bash
openspec-cn store unregister <id> [--json]
```

当 store 已移动、克隆到别处，或不应再被本机 OpenSpec 显示时使用。

### `openspec-cn store remove`

注销本地 store 注册并删除其本地文件夹。

```bash
openspec-cn store remove <id> [--yes] [--json]
```

在交互终端中，`remove` 删除前会显示确切文件夹。Agent、脚本和 JSON 调用方必须传 `--yes` 确认删除。OpenSpec 拒绝删除不包含匹配 store 元数据的文件夹。

### `openspec-cn store list`

列出本地已注册的 store。

```bash
openspec-cn store list [--json]
openspec-cn store ls [--json]
```

### `openspec-cn store doctor`

检查本地 store 注册、元数据和 Git 状态。

```bash
openspec-cn store doctor [id] [--json]
```

doctor 仅做诊断；它报告缺失的根���元数据不匹配和无效的本地注册状态，不修改 store。

### 从项目中引用 store

项目仓库可在 `openspec/config.yaml` 中声明它依赖哪些 store：

```yaml
schema: spec-driven
references:
  - team-context
```

从那时起，该仓库里的 `openspec-cn instructions` 输出（per-artifact 和 `apply` 两个接口，JSON 与人类模式都包括）会带上每个被引用 store 的 spec 索引——spec id、来自每份 spec Purpose 段的一行摘要，以及获取命令（`openspec-cn show <spec-id> --type spec --store <id>`）。索引每次运行时从已注册的本地 checkout 实时构建；spec 内容从不被复制进输出。

reference 是只读上下文。它们从不改变命令在哪里执行：工作仍留在仓库自己的根里，向被引用的 store 写入仍需显式 `--store` 动作。无法解析的 reference（例如本机未注册的 store）在索引中降级为带确切修复指引的警告，instructions 仍会生成。`openspec-cn doctor` 在一处报告 reference 健康状态。

### 记录 store 从哪里克隆

store 可在其提交的身份文件中记录其规范克隆源，这样入门永远不会卡在"注册 store"这一步：

```bash
openspec-cn store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

remote 落到初始提交里的 `.openspec-store/store.yaml`，所以每个克隆天生就知道它。对于已有 store，手动编辑 `store.yaml` 并提交。`store doctor` 会显示已记录的 remote（以及 checkout 观测到的 Git origin）；setup/register ���共享指引会提到它；register 会把 checkout 的 origin 记录到机器本地注册表中。

reference 声明也可以携带克隆源，这样还没有该 store 的队友会得到一条完整、可粘贴的修复命令（`git clone <remote> <path> && openspec-cn store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

记录 remote 不是同步：OpenSpec 从不自行 clone、pull 或 push。

### 声明默认 store

规划完全外部化的仓库——没有本地 `openspec/specs/` 或 `openspec/changes/`——可以一次性声明它的 store，而不必每条命令都传 `--store`：

```yaml
# openspec/config.yaml（openspec/ 下唯一的文件）
store: team-context
```

普通命令随后自动解析到声明的 store；根 banner 和 JSON `root` 块报告 `source: "declared"` 与 store id，打印的提示仍带 `--store <id>`。声明是 fallback，从不覆盖：显式 `--store` 总是优先，带真实规划文件夹的目录会忽略该指针（并给警告）。要把指针仓库转成本地 OpenSpec 根，删掉 `store:` 行并运行 `openspec-cn init`——声明存在时 init 拒绝脚手架生成。

## Doctor（关系健康）

一个只读问题，一处答���：OpenSpec 根是否健康，它引用的 store 在本机是否可用？

```bash
openspec-cn doctor [--store <id>] [--json]
```

报告把根健康、store 元数据健康（包括记录的 remote 与 checkout origin 不一致时的提示）、以及 reference 健康（instructions 显示的同样诊断，附带未解析 reference 的克隆修复）分开。任何严重级别的健康发现都退出 0——agent 读 `status` 数组；只有命令失败（无根、未知 store）才退出 1。doctor 从不 clone、同步或修复。要获取组装好的集合本身而非其健康状态，用 `openspec-cn context`。

## 工作上下文（组装好的集合）

这份工作通过 OpenSpec 声明关联到的一切，放在一个工作集里：OpenSpec 根与它引用的 store。

```bash
openspec-cn context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 简报可被 agent 消费（每个可用的被引用 store 带其获取配方；未解析的成员带与 instructions 和 doctor 相同的修复）。`--code-workspace` 额外写一份 VS Code workspace 文件，包含根加上可用的被引用 store（`ref:<id>` 文件夹）——这是该命令唯一的写操作，文件存在时拒绝执行，除非加 `--force`。不可用的成员会被报告，绝不猜测。

"工作上下���"是组装好的集合；`openspec/config.yaml` 里的 `context:` 字段是注入到 instructions 中的项目背景——两件不同的东西。`openspec-cn doctor` 回答集合是否健康；`openspec-cn context` 回答集合是什么。

## 个人 workset

> **Beta。** Workset 属于新的 beta 表面；命令、标志和文件格式可能在版本间变化。walkthrough 见 [stores 指南](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)。

workset 是一组你一起工作的文件夹的个人命名视图——一个规划根加上你选的其他文件夹——保存在你的机器上，按名字在你的工具里重新打开。它纯本地：从不提交、从不共享、从不从声明派生，删除一个 workset 从不触碰成员文件夹。

```bash
openspec-cn workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec-cn workset list [--json]
openspec-cn workset open <name> [--tool <id>]
openspec-cn workset remove <name> [--yes] [--json]
```

`create` 跑一段简短的引导流程（或非交互地接受 `--member` 标志；第一个成员是主成员——会话从那里开始）。`open` 启动选中的工具：编辑器（VS Code、Cursor）打开一个包含每个成员的窗口并返回；CLI agent（Claude Code、codex）接管这个终端作为带每个成员附加的会话，不预填任何提示，退出时结束。打开时缺失的成员文件夹会被跳过并注释；其余照常打开。保存的工具偏好可在每次 open 时用 `--tool` 覆盖。

支持新工具是配置，不是代码。每个工具属于两种启动风格之一——`workspace-file`（用生成的 `.code-workspace` 启动）或 `attach-dirs`（每个成员一个 attach 标志）——全局 `config.json`（用 `openspec-cn config edit` 打开）里的 `openers` 键可按字段添加工具或调整内置项：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有 workset 状态位于全局数据目录的 `worksets/` 文件夹下（保存的视图加上生成的 `<name>.code-workspace` 文件，每次 open 时重新生成）；删除该文件夹会移除所有痕迹。

---

## 浏览命令

### `openspec-cn list`

列出项目中的 changes 或 specs。

```
openspec-cn list [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--specs` | 列出 specs 而非 changes |
| `--changes` | 列出 changes（默认） |
| `--sort <order>` | 按 `recent`（默认）或 `name` 排序 |
| `--json` | 输出 JSON |

**示例：**

```bash
# 列出所有活跃 changes
openspec-cn list

# 列出所有 specs
openspec-cn list --specs

# 供脚本使用的 JSON 输出
openspec-cn list --json
```

**输出（文本）：**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec-cn view`

显示一个交互式仪表盘，用于浏览 specs 和 changes。

```
openspec-cn view
```

打开一个基于终端的界面，导航你项目的规范和变更。

---

### `openspec-cn show`

显示一个 change 或 spec 的详情。

```
openspec-cn show [item-name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | change 或 spec 的名称（省略时提示） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（无歧义时自动检测） |
| `--json` | 输出 JSON |
| `--no-interactive` | 禁用提示 |

**change 专用选项：**

| 选项 | 说明 |
|--------|-------------|
| `--deltas-only` | 仅显示 delta spec（JSON 模式） |

**spec 专用选项：**

| 选项 | 说明 |
|--------|-------------|
| `--requirements` | 仅显示 requirement，排除 scenario（JSON 模式） |
| `--no-scenarios` | 排除 scenario 内容（JSON 模式） |
| `-r, --requirement <id>` | 按 1 起始索引显示指定 requirement（JSON 模式） |

**示例：**

```bash
# 交互式选择
openspec-cn show

# 显示指定 change
openspec-cn show add-dark-mode

# 显示指定 spec
openspec-cn show auth --type spec

# 供解析的 JSON 输出
openspec-cn show add-dark-mode --json
```

---

## 校验命令

### `openspec-cn validate`

校验 changes 和 specs 的结构性问题。

```
openspec-cn validate [item-name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | 指定校验条目（省略时提示） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 校验所有 changes 和 specs |
| `--changes` | 校验所有 changes |
| `--specs` | 校验所有 specs |
| `--type <type>` | 名称歧义时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格校验模式 |
| `--json` | 输出 JSON |
| `--concurrency <n>` | 最大并行校验数（默认 6，或 `OPENSPEC_CONCURRENCY` 环境变量） |
| `--no-interactive` | 禁用提示 |

**示例：**

```bash
# 交互式校验
openspec-cn validate

# 校验指定 change
openspec-cn validate add-dark-mode

# 校验所有 changes
openspec-cn validate --changes

# 校验全部并输出 JSON（用于 CI/脚本）
openspec-cn validate --all --json

# 严格校验并提高并行度
openspec-cn validate --all --strict --concurrency 12
```

**输出（文本）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**输出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 生命周期命令

### `openspec-cn archive`

归档已完成的 change 并把 delta spec 合并进主 spec。

```
openspec-cn archive [change-name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的 change（省略时提示） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 跳过 spec 更新（用于基础设施/工具/仅文档的变更） |
| `--no-validate` | 跳过校验（需要确认） |

**示例：**

```bash
# 交互式归档
openspec-cn archive

# 归档指定 change
openspec-cn archive add-dark-mode

# 无提示归档（CI/脚本）
openspec-cn archive add-dark-mode --yes

# 归档一个不影响 spec 的工具变更
openspec-cn archive update-ci-config --skip-specs
```

**它做什么：**

1. 校验 change（除非 `--no-validate`）
2. 提示确认（除非 `--yes`）
3. 把 delta spec 合并进 `openspec/specs/`
4. 把 change 文件夹移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流命令

这些命令支持制品驱动的 OPSX 工作流。既适用于人类查看进度，也适用于 agent 决定下一步。

### `openspec-cn new change`

在解析出的 OpenSpec 根中创建 change 目录和可选的已提交元数据。

```bash
openspec-cn new change <name> [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--description <text>` | 加入 `README.md` 的描述 |
| `--goal <text>` | 可选的目标元数据，与 change 一起存储 |
| `--schema <name>` | 要用的工作流 schema |
| `--store <id>` | 作为 OpenSpec 根的 store id（store 是你已注册的独立 OpenSpec 仓库） |
| `--json` | 输出 JSON |

示例：

```bash
openspec-cn new change add-billing-api
openspec-cn new change add-billing-api --store team-context --json
```

### `openspec-cn status`

显示一个 change 的制品完成状态。

```
openspec-cn status [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--change <id>` | change 名（省略时提示） |
| `--schema <name>` | 覆盖 schema（从 change 的 config 自动检测） |
| `--json` | 输出 JSON |

**示例：**

```bash
# 交互式状态检查
openspec-cn status

# 指定 change 的状态
openspec-cn status --change add-dark-mode

# 供 agent 使用的 JSON
openspec-cn status --change add-dark-mode --json
```

**输出（文本）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**输出（JSON）：**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec-cn instructions`

获取用于创建制品或应用 task 的增强指令。AI agent 用它知道接下来创建什么。

```
openspec-cn instructions [artifact] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `artifact` | 否 | 制品 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--change <id>` | change 名（非交互模式必填） |
| `--schema <name>` | 覆盖 schema |
| `--json` | 输出 JSON |

**特殊情况：** 用 `apply` 作为制品获取 task 实现指令。

**示例：**

```bash
# 获取下一个制品的指令
openspec-cn instructions --change add-dark-mode

# 获取指定制品的指令
openspec-cn instructions design --change add-dark-mode

# 获取 apply/实现指令
openspec-cn instructions apply --change add-dark-mode

# 供 agent 消费的 JSON
openspec-cn instructions design --change add-dark-mode --json
```

**输出包括：**

- 制品的模板内容
- 来自 config 的项目上下文
- 来自依赖制品的内容
- 来自 config 的 per-artifact 规则

---

### `openspec-cn templates`

显示一个 schema 中所有制品的已解析模板路径。

```
openspec-cn templates [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--schema <name>` | 要查看的 schema（默认 `spec-driven`） |
| `--json` | 输出 JSON |

**示例：**

```bash
# 显示默认 schema 的模板路径
openspec-cn templates

# 显示自定义 schema 的模板
openspec-cn templates --schema my-workflow

# 供程序使用的 JSON
openspec-cn templates --json
```

**输出（文本）：**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec-cn schemas`

列出可用的工作流 schema 及其描述和制品流。

```
openspec-cn schemas [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--json` | 输出 JSON |

**示例：**

```bash
openspec-cn schemas
```

**输出：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema 命令

用于创建和管理自定义工作流 schema 的命令。

### `openspec-cn schema init`

创建一个新的项目本地 schema。

```
openspec-cn schema init <name> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 是 | schema 名（kebab-case） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--description <text>` | schema 描述 |
| `--artifacts <list>` | 逗号分隔的制品 ID（默认 `proposal,specs,design,tasks`） |
| `--default` | 设为项目默认 schema |
| `--no-default` | 不提示设为默认 |
| `--force` | 覆盖已有 schema |
| `--json` | 输出 JSON |

**示例：**

```bash
# 交互式创建 schema
openspec-cn schema init research-first

# 非交互式，指定制品
openspec-cn schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**创建内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema 定义
└── templates/
    ├── proposal.md       # 每个制品的模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec-cn schema fork`

复制一个已有 schema 到你的项目以做自定义。

```
openspec-cn schema fork <source> [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `source` | 是 | 要复制的 schema |
| `name` | 否 | 新 schema 名（默认 `<source>-custom`） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 覆盖已有目标 |
| `--json` | 输出 JSON |

**示例：**

```bash
# 复制内置 spec-driven schema
openspec-cn schema fork spec-driven my-workflow
```

---

### `openspec-cn schema validate`

校验一个 schema 的结构与模板。

```
openspec-cn schema validate [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | 要校验的 schema（省略时校验全部） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--verbose` | 显示详细校验步骤 |
| `--json` | 输出 JSON |

**示例：**

```bash
# 校验指定 schema
openspec-cn schema validate my-workflow

# 校验所有 schema
openspec-cn schema validate
```

---

### `openspec-cn schema which`

显示一个 schema 从哪里解析（用于调试优先级）。

```
openspec-cn schema which [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | schema 名 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 列出所有 schema 及其来源 |
| `--json` | 输出 JSON |

**示例：**

```bash
# 检查一个 schema 从哪里来
openspec-cn schema which spec-driven
```

**输出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@studyzy/openspec-cn/schemas/spec-driven
```

**Schema 优先级：**

1. 项目：`openspec/schemas/<name>/`
2. 用户：`~/.local/share/openspec/schemas/<name>/`
3. 包：内置 schema

---

## 配置命令

### `openspec-cn config`

查看与修改全局 OpenSpec 配置。

```
openspec-cn config <subcommand> [options]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `path` | 显示配置文件位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取指定值 |
| `set <key> <value>` | 设置一个值 |
| `unset <key>` | 删除一个键 |
| `reset` | 重置为默认 |
| `edit` | 在 `$EDITOR` 中打开 |
| `profile [preset]` | 交互式或按预设配置工作流 profile |

**示例：**

```bash
# 显示配置文件路径
openspec-cn config path

# 列出所有设置
openspec-cn config list

# 获取指定值
openspec-cn config get telemetry.enabled

# 设置一个值
openspec-cn config set telemetry.enabled false

# 显式设置字符串值
openspec-cn config set user.name "My Name" --string

# 删除自定义设置
openspec-cn config unset user.name

# 重置所有配置
openspec-cn config reset --all --yes

# 在编辑器中编辑配置
openspec-cn config edit

# 用基于动作的向导配置 profile
openspec-cn config profile

# 快速预设：把工作流切到 core（保持 delivery 模式）
openspec-cn config profile core
```

`openspec-cn config profile` 以当前状态摘要开始，然后让你选择：
- 同时改 delivery + workflows
- 仅改 delivery
- 仅改 workflows
- 保持当前设置（退出）

如果你保持当前设置，不会写入任何改动，也不会显示更新提示。如果配置没变化但当前项目文件与全局 profile/delivery 不同步，OpenSpec 会显示警告并建议 `openspec-cn update`。按 `Ctrl+C` 也会干净地取消流程（无栈跟踪）并以退出码 `130` 退出。在工作流清单中，`[x]` 表示该工作流已在全局配置中选中。要把选择应用到项目文件，运行 `openspec-cn update`（或在项目内提示时选 `Apply changes to this project now?`）。

**交互式示例：**

```bash
# 仅更新 delivery
openspec-cn config profile
# 选择：Change delivery only
# 选择 delivery：Skills only

# 仅更新 workflows
openspec-cn config profile
# 选择：Change workflows only
# 在清单里切换 workflows，然后确认
```

---

## 工具命令

### `openspec-cn feedback`

提交关于 OpenSpec 的反馈。创建一个 GitHub issue。

```
openspec-cn feedback <message> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `message` | 是 | 反馈消息 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--body <text>` | 详细描述 |

**要求：** 必须安装并已认证 GitHub CLI（`gh`）。

**示例：**

```bash
openspec-cn feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec-cn completion`

管理 OpenSpec CLI 的 shell 补全。

```
openspec-cn completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `generate [shell]` | 输出补全脚本到 stdout |
| `install [shell]` | 为你的 shell 安装补全 |
| `uninstall [shell]` | 移除已安装的补全 |

**支持的 shell：** `bash`、`zsh`、`fish`、`powershell`

**示例：**

```bash
# 安装补全（自动检测 shell）
openspec-cn completion install

# 为指定 shell 安装
openspec-cn completion install zsh

# 生成脚本用于手动安装
openspec-cn completion generate bash > ~/.bash_completion.d/openspec

# 卸载
openspec-cn completion uninstall
```

---

## 退出码

| 码 | 含义 |
|------|---------|
| `0` | 成功 |
| `1` | 错误（校验失败、缺失文件等） |

---

## 环境变量

| 变量 | 说明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 设为 `0` 禁用遥测 |
| `DO_NOT_TRACK` | 设为 `1` 禁用遥测（标准 DNT 信号） |
| `OPENSPEC_CONCURRENCY` | 批量校验的默认并发数（默认 6） |
| `EDITOR` 或 `VISUAL` | `openspec-cn config edit` 使用的编辑器 |
| `NO_COLOR` | 设置时禁用彩色输出 |

---

## 相关文档

- [命令](commands.md) —— AI 斜杠命令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流](workflows.md) —— 常见模式与何时用哪个命令
- [自定义](customization.md) —— 创建自定义 schema 和模板
- [快速开始](getting-started.md) —— 首次设置指南
