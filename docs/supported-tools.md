# 支持的工具

OpenSpec 可配合许多 AI 编程助手使用。当你运行 `openspec-cn init` 时,OpenSpec 会使用你的活跃 profile/工作流选择以及交付模式来配置所选工具。

## 工作原理

对每个选中的工具,OpenSpec 可安装:

1. **Skills**(若交付方式包含 skills):`.../skills/openspec-*/SKILL.md`
2. **Commands**(若交付方式包含 commands):各工具特定的 `opsx-*` 命令文件

默认情况下,OpenSpec 使用 `core` profile,包含:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

你可以通过 `openspec-cn config profile` 启用扩展工作流(`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`),然后运行 `openspec-cn update`。

## 工具目录参考

| 工具 (ID) | Skills 路径模式 | Command 路径模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 不生成(无命令适配器;使用基于 skill 的 `/openspec-*` 调用) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx-<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | 不生成(无命令适配器;使用基于 skill 的 `/skill:openspec-*` 调用) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx-<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 不生成(无命令适配器;使用基于 skill 的 `/openspec-*` 调用) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx-<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex 命令安装在全局 Codex home(`$CODEX_HOME/prompts/`,若设置了该变量;否则 `~/.codex/prompts/`)中,而非你的项目目录。

\*\* GitHub Copilot prompt 文件在 IDE 扩展(VS Code、JetBrains、Visual Studio)中被识别为自定义 slash command。Copilot CLI 目前不直接消费 `.github/prompts/*.prompt.md`。

## 非交互式安装

对于 CI/CD 或脚本化安装,使用 `--tools`(以及可选的 `--profile`):

```bash
# 配置指定工具
openspec-cn init --tools claude,cursor

# 配置所有支持的工具
openspec-cn init --tools all

# 跳过工具配置
openspec-cn init --tools none

# 本次 init 运行覆盖 profile
openspec-cn init --profile core
```

**可用工具 ID(`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## 依赖工作流的安装

OpenSpec 根据所选工作流安装工作流制品:

- **Core profile(默认):** `propose`、`explore`、`apply`、`sync`、`archive`
- **自定义选择:** 所有工作流 ID 的任意子集:
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

换言之,skill/命令的数量取决于 profile 和交付方式,而非固定不变。

## 生成的 Skill 名称

当被 profile/工作流配置选中时,OpenSpec 生成以下 skills:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

命令行为见 [Commands](commands.md),`init`/`update` 选项见 [CLI](cli.md)。

## 相关文档

- [CLI Reference](cli.md) — 终端命令
- [Commands](commands.md) — Slash command 与 skills
- [Getting Started](getting-started.md) — 首次设置
