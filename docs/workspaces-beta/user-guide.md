# 与你的编码 Agent 一起使用 OpenSpec

Beta 说明：这是最小可用路径。本地设置由你来做。OpenSpec 工作由你的 Agent 管理。

## 1. 创建共享空间

```bash
openspec-cn context-store setup
```

OpenSpec 会询问 context store 的名字、放在哪里、是否初始化 Git。除非你想把 store 放在某个特定位置，否则按回车使用托管的本地数据目录。

## 2. 让你的 Agent 创建 Initiative

> 在 `team-context` 里创建一个叫 `billing-launch` 的 OpenSpec initiative。保持简短有用。

## 3. 打开你的本地工作台

```bash
openspec-cn workspace open
```

从选择器里选 initiative。如果你还没有对应的本地 workspace 视图，OpenSpec 会为它创建一个。创建新视图时，它还会询问要包含哪些本地仓库或文件夹。

打开的编辑器视图会先显示关联的仓库和文件夹，附加上 initiative 上下文，最后是一个小的 `OpenSpec workspace` 文件夹，内含 `AGENTS.md`、`.openspec-workspace/view.yaml` 和生成的 `.code-workspace` 文件。

当你想跳过选择器时，用 `openspec-cn workspace open --initiative team-context/billing-launch --editor`。当你想直接打开一个 Agent 时，用 `--agent codex-cli`、`--agent claude` 或 `--agent github-copilot` 代替 `--editor`。

## 4. 检查本地上下文

在规划工作之前，让你的 Agent 检查打开的 workspace：

> 检查这个 OpenSpec workspace。解析选中的 initiative，列出关联的仓库或文件夹，并在我们探索工作之前告诉我是否缺了什么重要的东西。

如果缺了某个仓库或文件夹，告诉 Agent 应该关联哪个本地路径。OpenSpec 不会 clone 任何东西。

## 5. 在创建制品之前先探索

把 workspace 当作对话发生的地方：

> 用 initiative `team-context/billing-launch`，在这个 workspace 里探索工作。先读 initiative 上下文和关联的仓库上下文。先不要创建变更；帮我决定应该提案什么、OpenSpec 制品应该放在哪里。

## 6. 准备好时请求起草

当探索收敛了，让 Agent 在正确的位置创建正确的制品：

> 为所属关联仓库创建一个 repo-local 的 OpenSpec proposal 草稿，并把它关联到 `team-context/billing-launch`。你自己解析 workspace 和 initiative 上下文，从正确的仓库运行需要的 OpenSpec 命令，并报告你创建的文件。

## 小提示框

在这个 beta 流程中，OpenSpec 不会 clone、sync、创建分支或跟踪进度仪表盘。它给你的是共享的 initiative 上下文、一个本地 workspace 视图，以及绑回更大目标的 repo-local 计划。Workspace 是你和 Agent 一起工作的地方；持久的规划制品应该活在 context store 的 initiative 里，或活在所属仓库里，而不是活在 workspace 根目录里。
