# 给 Agent 的 OpenSpec CLI 行动手册

Beta 说明：workspace 和 initiative 流程可用，但仍然很小。优先使用普通命令、清晰的路径和简短的状态报告。

## 从解析上下文开始

需要精确路径时用 JSON。

```bash
openspec-cn context-store list --json
openspec-cn initiative list --json
openspec-cn initiative show <store>/<initiative> --json
openspec-cn workspace doctor --json
```

当用户正从一个已打开的 workspace 工作时，把 workspace 当作本地视图。用 `workspace doctor --json` 读取关联的仓库/文件夹和选中的 initiative。不要假设当前目录就是应该拥有实现制品的仓库。

## 用非交互方式搭建 Context Store

人类可以运行 `openspec-cn context-store setup` 并回答提示。Agent 应该显式传入 setup 输入。

```bash
openspec-cn context-store setup team-context --no-init-git --json
openspec-cn context-store setup team-context --path /path/to/team-context --init-git --json
```

用 `context-store unregister <id> --json` 来忘记一个本地注册，同时保留文件不动。只有在用户明确要求删除本地 context-store 文件夹时，才用 `context-store remove <id> --yes --json`。

## 在 Context Store 里创建 Initiative

在 context store 里创建共享的协调上下文。

```bash
openspec-cn initiative create billing-launch --store team-context --title "Billing Launch" --summary "Get billing live without losing the plot."
```

然后在 context store 里编辑 initiative 文件：

- `requirements.md`
- `design.md`
- `decisions.md`
- `questions.md`
- `tasks.md`

## 从 Workspace 探索或提案

当用户要求从 workspace 探索或起草工作时：

1. 用 `openspec-cn workspace doctor --json` 解析 workspace。
2. 用 `openspec-cn initiative show <store>/<initiative> --json` 解析 initiative。
3. 检查关联的仓库或文件夹，找出可能的所属仓库。
4. 如果归属不明确，问用户哪个关联仓库应该拥有这个 repo-local 的 OpenSpec 变更。
5. 从所属仓库运行探索/提案工作流命令，而不是从 workspace 根目录。

Workspace 是对话的驾驶舱。它不是实现计划的持久归宿。

## 从所属仓库创建变更

Repo-local 变更属于拥有这项工作的仓库。

```bash
openspec-cn new change add-billing-api --initiative team-context/billing-launch
```

以所属仓库为当前工作目录运行这个命令。不要让用户来输入它，也不要从 workspace 根目录运行 initiative 关联的变更创建。如果你只知道 workspace，先解析关联的仓库路径。

创建变更后，报告所创建文件的绝对路径和你使用的 initiative 链接。

## 在猜测之前先用 Doctor

```bash
openspec-cn workspace doctor --workspace billing-launch --json
openspec-cn context-store doctor --json
```

## 暂时还不要承诺

- 自动 sync、pull、push 或冲突处理。
- Clone 仓库。
- 创建分支、worktree 或 submodule。
- Workspace 的 apply、verify 或 archive。
- 进度仪表盘。
- 强制的编辑边界。
