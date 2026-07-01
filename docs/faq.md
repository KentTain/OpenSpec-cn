# 常见问题

大家最常问的问题的快速回答。如果你的问题其实是"某个东西坏了"，[故障排查](troubleshooting.md) 更合适。如果你想查术语，见 [术语表](glossary.md)。

## 基础

### 一句话解释 OpenSpec 是什么？

一层轻量协议，让你和你的 AI 编程助手在写任何代码之前，就以书面形式对要构建什么达成共识。

### 为什么我需要它？

因为 AI 助手哪怕错了也很自信。当需求只存在于聊天记录中时，AI 会用猜测填补空白，等代码写完你才发现。OpenSpec 把"对齐"这件事提前到修复成本最低的时刻。完整理由见 [核心概念一览](overview.md)。

### 什么事情都得用它吗？

不必。在"对齐重要"的场景用它，这通常也就是大多数非平凡工作。对于一个字符级的错别字修复，这套仪式可能不值，那也没关系。

### 只能用在全新项目上，还是也能用在大型已有代码库？

已有代码库才是主战场。OpenSpec 是 brownfield-first（先有代码再加规范）的：你不需要预先给整个应用写文档。你只为每个 change 触及的部分写 spec，specs 会随着你实际做过的工作自然铺开。有一份专门的指南：[在已有项目中使用 OpenSpec](existing-projects.md)。

### 它绑定某个 AI 工具吗？

不。OpenSpec 兼容 25+ 种助手，包括 Claude Code、Cursor、Windsurf、GitHub Copilot、Gemini CLI、Codex 等。完整列表与各工具细节见 [支持的工具](supported-tools.md)。

## 运行命令

### 我应该在哪里输入 `/opsx:propose`？

在你的 AI 助手的聊天里，不是终端。这是最常见的困惑点，所以它有专门一页：[命令是如何工作的](how-commands-work.md)。简短版：`openspec ...` 在终端里运行，`/opsx:...` 在聊天里运行。

### 怎么"启动交互模式"？

没有单独的"模式"要启动。你照常打开 AI 助手，在它的聊天里输入斜杠命令即可。斜杠命令就是"进入"OpenSpec 的方式。（唯一真正交互式的终端功能是 `openspec view`，一个浏览 specs 和 changes 的仪表盘。）完整解释见 [命令是如何工作的](how-commands-work.md)。

### 我输入了斜杠命令但什么都没发生。为什么？

最可能是你输在了终端里而不是 AI 聊天里，或者命令还没安装。在项目里运行 `openspec update`，重启助手，然后在聊天里试着输入 `/opsx` 看自动补全是否出现。[故障排查](troubleshooting.md#commands-dont-show-up) 有完整清单。

### 为什么一个工具里是 `/opsx:propose`，另一个工具里是 `/opsx-propose`？

每个 AI 工具暴露自定义命令的方式略有不同。意图完全一致，只是标点不同。在聊天里输入一个斜杠，自动补全会显示你的工具期望的写法。各工具对照表见 [命令是如何工作的](how-commands-work.md#slash-command-syntax-by-tool)。

### skill 和 command 有什么区别？

两者都是 OpenSpec 写入的文件，让你的助手能跑工作流。Skills（`.../skills/openspec-*/SKILL.md`）是较新的跨工具标准；commands（`.../commands/opsx-*`）是较老的、按工具分的斜杠文件。你不需要二选一。你只要输入斜杠命令，OpenSpec 会装上你的工具使用的那一种。

## 工作流

### 不确定要做什么时，从哪里开始？

从 `/opsx:explore` 开始。它是一个零成本思考伙伴，会阅读你的代码库、列出选项、把模糊问题变成具体计划——这一切都发生在任何 change 或代码存在之前。它在默认 profile 中，随时可用。计划清晰后，它把工作交给 `/opsx:propose`。这是最值得养成的习惯，因为它能在 AI 自信地造错东西之前拦住它。见 [先做探索](explore.md)。

### 最简单的流程是什么？

```text
/opsx:explore (可选)   然后   /opsx:propose <你想要什么>   然后   /opsx:apply   然后   /opsx:archive
```

Explore 想清楚，propose 起草计划，apply 构建，archive 归档。已经确切知道想要什么时跳过 explore。

### `/opsx:propose` 和 `/opsx:new` 有什么区别？

`/opsx:propose` 是默认的一步式命令：它创建 change 并一次性起草所有规划制品。`/opsx:new` 属于扩展命令集，只脚手架生成一个空 change，让你用 `/opsx:continue` 逐个创建制品（或用 `/opsx:ff` 一次性全部创建）。除非你想逐步控制，否则用 propose。见 [命令](commands.md)。

### `core` 和 expanded profile 是什么？

profile 决定安装哪些斜杠命令。**Core**（默认）给你 `propose`、`explore`、`apply`、`sync`、`archive`。**Expanded** 额外提供 `new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`，用于更精细的控制。用 `openspec config profile` 切换，再用 `openspec update` 应用。

### 我需要运行 `/opsx:sync` 吗？

通常不需要。sync 把一个 change 的 delta spec 合并进主 spec，而 `/opsx:archive` 会主动提出帮你做。只有当你想在归档前就让 spec 合并好时（比如一个长期运行的变更）才手动运行 sync。见 [命令](commands.md#opsxsync)。

### 开始之后，怎么编辑 proposal、spec 或 task？

直接编辑文件即可。每个制品都是 `openspec/changes/<name>/` 下的纯 Markdown，没有锁定的阶段或特殊的编辑模式。手动改，或者让 AI 修订（"把 design 改成用队列"），然后继续。AI 总是从文件的当前内容开始工作。完整指南：[编辑与迭代变更](editing-changes.md)。

### 实现了一部分之后，还能回头改计划吗？

可以，随时。工作流是流式的，审查和编辑不是会被锁出去的阶段。编辑制品，然后继续。如果你想要一个结构化的检查，确认代码仍然匹配计划，运行 `/opsx:verify`。见 [编辑与迭代变更](editing-changes.md#how-do-i-go-back-to-review-after-implementing)。

### 我手动改了代码。怎么和 spec 调和？

在归档前把它们重新对齐，因为归档会让 specs 成为真相记录。如果代码是对的，更新 delta spec 以匹配你交付的内容；如果 spec 是对的，继续构建直到代码一致。`/opsx:verify` 会暴露不匹配处。见 [编辑与迭代变更](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec)。

### 什么时候应该更新现有 change，什么时候应该新开一个？

当它是同一件工作的细化时，更新。当意图根本改变，或范围爆炸成不同工作时，新开。[Workflows](workflows.md#when-to-update-vs-start-fresh) 有决策流程图和示例。

### 如果我的会话上下文耗尽，或者实现中途需求变了怎么办？

这正是 specs 体现价值的地方。因为计划在文件里（不只是聊天历史里），你可以清空上下文、开一个新的 AI 会话，然后用 `/opsx:apply` 接续；它会读制品并从第一个未勾选的 task 恢复。如果需求变了，编辑制品以匹配新现实再继续。保持干净的上下文窗口也带来更好的结果；实现前清空它。

### 我应该把 `openspec/` 文件夹提交进 git 吗？

应该。你的 specs、活跃 changes 和 archive 都是你项目历史的一部分。像其他源代码一样提交它们。archive 尤其会变成"系统为什么这样运转"的长期记录。

## Specs 和 changes

### spec 和 design 各放什么？

spec 描述可观察的行为：系统做什么、输入输出、错误条件。design 描述你打算���么构建：技术方案、架构决策、文件改动。如果某件事可以在不改变外部可见行为的前提下换实现方式，它属于 design 而非 spec。[概念](concepts.md#what-a-spec-is-and-is-not) 有更深入的解释。

### delta spec 是什么？

一种只描述变化的 spec，使用 `ADDED`、`MODIFIED`、`REMOVED` 段落，而不是重述整份 spec。这是 OpenSpec 干净处理已有系统编辑的方式。见 [概念](concepts.md#delta-specs)。

### 归档后的 changes 去哪儿了？

到 `openspec/changes/archive/YYYY-MM-DD-<name>/`，所有制品保留。不会删除任何东西；change 只是移出活跃列表。

## 配置与自定义

### 怎么把我的技术栈告诉 AI？

写进 `openspec/config.yaml` 的 `context:` 下。那段文字会被注入到每个规划请求里，所以 AI 总知道你的技术栈和约定。见 [自定义](customization.md#project-configuration)。

### 可以用英语以外的语言生成 spec 吗？

可以。在 config 的 `context:` 里加一条语言指令。[多语言](multi-language.md) 有几种语言的复制即用片段。

### 我可以改工作流本身吗？

可以，用自定义 schema。schema 定义存在哪些制品、它们如何互相依赖。用 `openspec schema fork spec-driven my-workflow` 复制默认 schema，然后编辑。见 [自定义](customization.md#custom-schemas)。

## 模型、隐私、升级

### 我该用哪个 AI 模型？

OpenSpec 更适合高推理模型。README 推荐在规划与实现阶段都使用 Codex 5.5 和 Opus 4.7。同时保持上下文窗口干净：实现前清空它以获得最佳结果。

### OpenSpec 收集数据吗？

它收集匿名使用统计：仅命令名和版本号。不含参数、路径、内容或个人数据，且 CI 中自动关闭。用 `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1` 退出。

### 怎么升级？

两步。升级包（`npm install -g @studyzy/openspec-cn@latest`），然后在每个项目里运行 `openspec-cn update` 刷新生成的 skill 和命令文件。

### 怎么卸载 OpenSpec？

没有卸载命令，因为它只是一个全局包加上项目里的文件。移除包（`npm uninstall -g @studyzy/openspec-cn`），可选地删除 `openspec/` 目录和生成的工具文件。逐步说明（包括哪些东西保留是安全的）见 [安装：卸载](installation.md#uninstalling)。

## 获取帮助

### 我在哪里提问或报 Bug？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/studyzy/OpenSpec-cn/issues](https://github.com/studyzy/OpenSpec-cn/issues)
- **从终端：** `openspec-cn feedback "你的留言"` 会为你打开一个 GitHub issue。

### 这些文档有错或让人困惑。怎么办？

告诉我们，或者直接修。文档 PR 欢迎且有价值。开一个 issue 或提交一个 pull request。
