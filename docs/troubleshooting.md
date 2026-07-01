# 故障排查

针对具体问题的具体修复。每一条先说症状，一句话解释可能原因，然后给出修复方法。如果你在这里找不到你的问题，[常见问题](faq.md) 可能帮上忙，[Discord](https://discord.gg/YctCnvvshC) 一定可以。

## 安装与设置

### `openspec-cn: command not found`

CLI 没装上，或者你的 shell 找不到它。全局安装并检查：

```bash
npm install -g @studyzy/openspec-cn@latest
openspec-cn --version
```

如果装了仍找不到，多半是你的全局 npm bin 目录不在 `PATH` 里。运行 `npm bin -g` 查看全局二进制文件的位置，并确保该路径在你的 shell 配置里。

### "Requires Node.js 20.19.0 or higher"

OpenSpec 运行在 Node 20.19.0+。检查你的版本并按需升级：

```bash
node --version
```

如果你用 bun 安装 OpenSpec，注意 OpenSpec 仍然*运行在* Node 上，所以无论如何你都需要在 `PATH` 里提供 Node 20.19.0+。见 [安装](installation.md)。

### `openspec-cn init` 没有配置我的 AI 工具

init 会问你要设置哪些工具。如果你跳过了某个工具或想再加一个，再跑一次，或用非交互形式：

```bash
openspec-cn init --tools claude,cursor
```

完整的工具 ID 列表见 [支持的工具](supported-tools.md)。用 `--tools all` 选全部，`--tools none` 跳过工具设置。

## 命令没出现

如果 `/opsx:propose`（或你工具的等价命令）没出现或没反应，按下面清单查。最快查的排前面。

1. **你可能输错了地方。** 斜杠命令应该输入在 AI 助手的聊天里，不是终端。如果你在 shell 里输入 `/opsx:propose`，那就是问题所在。见 [命令是如何工作的](how-commands-work.md)。

2. **重新生成文件。** 在项目根目录运行：

   ```bash
   openspec-cn update
   ```

   这会重写你已配置的每个工具的 skill 和命令文件。

3. **重启助手。** 大多数工具在启动时扫描 skill 和命令。新开一个窗口往往就好了。

4. **确认文件存在。** 对 Claude Code，检查 `.claude/skills/` 下是否包含 `openspec-*` 文件夹。其他工具使用各自的目录，全部列在 [支持的工具](supported-tools.md)。

5. **确认你初始化过这个项目。** skill 是按项目写入的。如果你克隆了一个仓库或切换了文件夹，在那里运行 `openspec-cn init`（或 `openspec-cn update`）。

6. **确认你的工具支持命令文件。** 少数工具（Kimi CLI、Trae、ForgeCode、Mistral Vibe）不会生成 `opsx-*` 命令文件；它们改用基于 skill 的调用方式。各工具的形式不同：见 [支持的工具](supported-tools.md) 和 [命令是如何工作的](how-commands-work.md#slash-command-syntax-by-tool)。

## 处理变更

### "Change not found"

命令无法判断你指的哪个 change。显式命名它，或看看有哪些：

```bash
openspec-cn list                    # 查看活跃 changes
/opsx:apply add-dark-mode        # 在聊天里点名 change
```

同时确认你在正确的项目目录里。

### "No artifacts ready"

每个制品要么已经创建，要么在等依赖。看看什么在阻塞：

```bash
openspec-cn status --change <name>
```

然后先创建缺失的依赖。记住顺序：proposal 启用 specs 和 design；specs 与 design 一起启用 tasks。

### `openspec-cn validate` 报告警告或错误

校验会检查 specs 和 changes 的结构性问题。读消息：它会点出文件和问题。

```bash
openspec-cn validate <name>           # 校验一个条目
openspec-cn validate --all            # 校验全部
openspec-cn validate --all --strict   # 更严格的检查，适合 CI
```

常见原因是缺少必填段（比如 spec 没有 scenario）或 delta 头格式错误。修好文件再重跑。[CLI 参考](cli.md#openspec-validate) 记录了输出格式。

### AI 生成了不完整或错误的制品

AI 没拿到足够的上下文。几个杠杆能帮上忙：

- 在 `openspec/config.yaml` 里加项目上下文，让你的技术栈和约定注入每个请求。见 [自定义](customization.md#project-configuration)。
- 加 per-artifact 的 `rules:`，用于只对某制品（比如 spec）生效的指引。
- 提案时给更详细的描述。
- 用扩展的 `/opsx:continue` 一次创建一个制品并逐个审查，而不是用 `/opsx:ff` 一次性全部生成。

### 归档无法完成，或提示有未完成任务

归档不会在任务未完成时*阻塞*你，但它会警告你，因为归档通常意味着工作做完了。如果任务故意留着（你是在归档一个部分完成的 change），继续即可。否则先完成任务。归档还会主动提出帮你把 delta spec 合并进主 spec（如果你还没 sync 过）；除非有理由不，否则答应它。

## 配置

### 我的 `config.yaml` 没生效

三个常见嫌疑：

1. **文件名错了。** 必须是 `openspec/config.yaml`，不是 `.yml`。
2. **YAML 不合法。** 用任意一 YAML 校验器跑一遍；CLI 也会带行号报告语法错误。
3. **你以为需要重启。** 不需要。配置改动立即生效。

### "Unknown artifact ID in rules: X"

`rules:` 下某个键不在你的 schema 里的任何 artifact 上。对默认 `spec-driven` schema，合法的 ID 是 `proposal`、`specs`、`design`、`tasks`。查看任意 schema 的 ID：

```bash
openspec-cn schemas --json
```

### "Context too large"

`context:` 字段上限 50KB，这是故意的，因为它会注入每个请求。把它精简，或链接到更长的文档而不是粘贴。精简的上下文也带来更好、更快的结果。

### "Schema not found"

你引用的 schema 名不存在。列出可用的并检查拼写：

```bash
openspec-cn schemas                    # 列出可用 schema
openspec-cn schema which <name>        # 看某个 schema 从哪里解析
openspec-cn schema init <name>         # 创建自定义 schema
```

见 [自定义](customization.md#custom-schemas)。

## 从旧工作流迁移

### "Legacy files detected in non-interactive mode"

你在 CI 或非交互 shell 里，OpenSpec 发现了要清理的旧文件但不能提示你。自动批准：

```bash
openspec-cn init --force
```

### 迁移后命令没出现

重启 IDE。skill 在启动时被探测。如果仍不出现，运行 `openspec-cn update` 并检查 [支持的工具](supported-tools.md) 里的文件位置。

### 我的旧 `project.md` 没被迁移

这是故意的。OpenSpec 从不自动删除 `project.md`，因为它可能存着你写的上下文。把有用的部分搬到 `config.yaml` 的 `context:` 段，然后自己删掉它。[迁移指南](migration-guide.md#migrating-projectmd-to-configyaml) 有完整步骤，包括一段你可以交给 AI 去做提炼的提示。

## 还是不行？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/studyzy/OpenSpec-cn/issues](https://github.com/studyzy/OpenSpec-cn/issues)
- **从终端：** `openspec-cn feedback "出了什么问题"` 会为你打开一个 issue。

报问题时，请附上你的 OpenSpec 版本（`openspec-cn --version`）、Node 版本（`node --version`）、AI 工具，以及具体的命令和输出。这能让帮助快得多。
