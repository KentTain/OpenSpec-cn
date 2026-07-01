# 命令是如何工作的

**唯一需要记住的事：OpenSpec 有两种命令，它们运行在两个不同的地方。**

- `openspec ...` 命令在**终端**里运行。（例子：`openspec-cn init`。）
- `/opsx:...` 命令在**AI 助手的聊天**里运行。（例子：`/opsx:propose`。）

如果你把 `/opsx:propose` 输进终端却什么都没发生，原因就在这里。你和 OpenSpec 的另一半在说话。斜杠命令不是终端命令。它们是你给 AI 编程助手的指令，输入的地方和你平时打"加一个登录表单"是同一个对话框。

这一处区别是新用户最常见的绊脚石，所以我们把它讲透。

## 两个半边

OpenSpec 是一个项目戴两顶帽子。

**CLI（终端那半）。** 一个叫 `openspec` 的程序，你在 shell 里安装并运行。它设置项目、列出与校验 change、显示仪表盘、归档已完成的工作。你在 iTerm、VS Code 终端、PowerShell 里输入这些命令，任何能跑 `git` 或 `npm` 的地方都行���

```bash
openspec-cn init        # 在本项目设置 OpenSpec
openspec-cn list        # 查看活跃 changes
openspec-cn view        # 打开交互式仪表盘
```

**斜杠命令（聊天那半）。** 像 `/opsx:propose` 和 `/opsx:apply` 这样的短命令，你输入到 AI 助手里。它们告诉 AI 跟随 OpenSpec 工作流：起草 proposal、写 specs、按 task 清单构建、完成后归档。你在 Claude Code、Cursor、Windsurf、Copilot 或任何你用的助手里输入这些。

```text
/opsx:propose add-dark-mode    （在 AI 聊天里输入）
/opsx:apply                    （在 AI 聊天里输入）
/opsx:archive                  （在 AI 聊天里输入）
```

一张图说清心智模型：

```text
        你的终端                            你的 AI 助手聊天
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec-cn init │   安装        │  /opsx:propose add-dark-mode  │
   │  $ openspec-cn list │  ──────────►  │  /opsx:apply                  │
   │  $ openspec-cn view │   命令与      │  /opsx:archive                │
   └──────────────────────┘    skill      └──────────────────────────────┘
        在这里运行 openspec                   在这里运行 /opsx:*
```

注意箭头。在终端里运行 `openspec-cn init` 会把斜杠命令*安装*到你的 AI 工具里。终端那半设置好聊天那半。之后，日常驱动主要发生在聊天里。

## "我怎么启动交互模式？"

**没有单独的交互模式要启动。** 这个问题很常见，值得正面回答。

你不需要进入某种特殊的 OpenSpec 模式。你照常打开 AI 编程助手，在聊天里输入斜杠命令即可。斜杠命令*就是*你"进入"OpenSpec 的方式。你的助手识别它，加载对应的 OpenSpec skill，然后开始跟随工作流。

所以真正的步骤是：

1. 在你的项目里打开 AI 编程助手（Claude Code、Cursor、Windsurf 等）。
2. 在它的聊天里输入 `/opsx:propose`，和你平时提任何其他请求的地方一样。
3. 看自动补全：如果 OpenSpec 已安装，你输入斜杠时会看到 `/opsx:propose`、`/opsx:apply` 等出现。

就这样。没有要切换的模式、没有要启动的守护进程、没有单独的窗口。

唯一*真正*交互式的东西在终端里：`openspec-cn view`。它打开一个仪表盘，浏览你的 specs 和 changes。但那是一个查看器，不是你用来 propose 和 build 的东西。构建是通过聊天里的斜杠命令完成的。

## 为什么有这种分工

值得理解，因为它解释了 OpenSpec 为什么能兼容 25+ 种不同的 AI 工具。

CLI 是**引擎**。它知道规则：change 文件夹长什么样、哪些制品依赖哪些、如何把 delta spec 合并进真相源。它在所有工具里都是一样的。

斜杠命令是**方向盘**，每个 AI 工具的方向盘略有不同。Claude Code 叫它们 commands。Cursor 和 Windsurf 有自己的格式。有些工具叫它们 skills。你运行 `openspec-cn init` 时，OpenSpec 为你选的每个工具生成对应类型的文件，所以无论你用哪个助手，同一个 `/opsx:propose` 意图都能工作。

这个设计的优势：你学一次工作流，跨工具通用。代价：命令的确切语法在不同工具之间略有不同，这就是下一节。

## 各工具的斜杠命令语法

意图在所有工具里完全一致，标点不同。用与你助手匹配的形式。

| 工具 | 怎么输入 |
|------|-----------------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| GitHub Copilot（IDE） | `/opsx-propose`、`/opsx-apply` |
| Kimi CLI | skill 形式，如 `/skill:openspec-propose` |
| Trae | skill 形式，如 `/openspec-propose` |

大多数工具用冒号形式（`/opsx:propose`）或短横形式（`/opsx-propose`）。少数工具把 OpenSpec 暴露为具名 skill 而非斜杠命令；那种情况下你按名字调用 skill。完整的各工具列表（包括具体文件写到哪儿）见 [支持的工具](supported-tools.md)。

不确定时，在 AI 聊天里输入一个斜杠看自动补全。你的工具会显示它期望的形式。

## 命令是怎么到那里的：skill 与 command

你运行 `openspec-cn init`（或 `openspec-cn update`）时，OpenSpec 会向你的项目写入一些小文件，让你的 AI 工具能找到工作流。根据你的工具和设置，这些是 **skill**、**command**，或两者都有。

- **Skill** 位于像 `.claude/skills/openspec-*/SKILL.md` 的地方。它们是正在成形的跨工具标准：一个你的助手自动探测的指令文件夹。
- **Command** 位于像 `.claude/commands/opsx/<id>.md` 的地方。它们是较老的、按工具分的斜杠命令文件。

你不必关心你的工具用的是哪种。你只要输入斜杠命令，它就能工作。但知道这些文件存在有助于排查问题：如果命令消失了，通常意味着这些文件缺失或过期，`openspec-cn update` 会重新生成它们。

各工具的具体路径见 [支持的工具](supported-tools.md)，skill 如何取代旧的"仅 command"方式见 [迁移指南](migration-guide.md)。

## 确认已安装

快速检查，最快的排前面：

1. **在 AI 聊天里输入一个斜杠。** 开始打 `/opsx` 并看自动补全建议。如果出现，就装好了。
2. **看文件。** 对 Claude Code，检查 `.claude/skills/` 是否包含 `openspec-*` 文件夹。其他工具用各自目录（[支持的工具](supported-tools.md) 有列表）。
3. **重跑设置。** 在项目根目录运行 `openspec-cn update`。这会为你配置的每个工具重新生成 skill 和命令文件。
4. **重启助手。** 许多工具在启动时扫描 skill 和命令，所以新开一个窗口可能就是缺的那一步。

## 我到底装了哪些命令？

默认情况下，OpenSpec 安装 **core** 斜杠命令集：

- `/opsx:explore`：在提交 change 前与 AI 一起想清楚（不确定时是很好的起点）
- `/opsx:propose`：一步创建 change 并起草它全部的规划制品
- `/opsx:apply`：按 task 清单构建 change
- `/opsx:sync`：把一个 change 的 spec 更新合并进主 spec（通常自动）
- `/opsx:archive`：完成 change 并归档

好的默认节奏：想清楚要做什么时用 `explore`，然后 `propose`、`apply`、`archive`。[先做探索](explore.md) 解释了为什么开头那一步值得。

还有一个 **expanded** 命令集，给想要更精细控制的人（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。用 `openspec-cn config profile` 打开，再用 `openspec-cn update` 应用。

第一次接触？`/opsx:onboard`（在扩展集里）会在你自己的代码库上带你走完一个完整的 change，每一步都有讲解。这是最友好的入门方式。

每条命令详细做什么见 [命令](commands.md)。何时用哪条见 [工作流](workflows.md)。

## 一次干净的首次运行

把上面合起来，下面是完整序列，每一步标注了发生地点。

```text
TERMINAL   $ npm install -g @studyzy/openspec-cn@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec-cn init
              （把斜杠命令安装到你的 AI 工具）

AI CHAT      /opsx:explore
              （可选：先和 AI 一起把想法想清楚）

AI CHAT      /opsx:propose add-dark-mode
              （AI 起草 proposal、specs、design、tasks）

AI CHAT      /opsx:apply
              （AI 构建，逐项勾掉 task）

AI CHAT      /opsx:archive
              （change 合并进你的 specs 并归档）
```

两步终端配置，之后你就活在聊天里。这就是节奏。

## 相关

- [快速开始](getting-started.md)：完整的首次变更演练
- [命令](commands.md)：每条斜杠命令的详解
- [CLI](cli.md)：每条终端命令的详解
- [支持的工具](supported-tools.md)：各工具的语法和文件位置
- [常见问题](faq.md)：更多快速回答
- [故障排查](troubleshooting.md)：命令不出现时的修复
