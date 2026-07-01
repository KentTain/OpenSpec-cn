# Stores：在独立仓库中规划

> **Beta。** Stores、references、working context 和 worksets 是新功能。命令名、标志、文件格式和 JSON 输出可能在版本间变化。下面每一段 walkthrough 都是基于当前构建跑过的，但升级后请重读本指南。

## 解决什么问题

OpenSpec 通常住在一个代码仓库里：一个与代码同级的 `openspec/` 文件夹，存着该仓库的 specs 和 changes。

当你的规划比一个仓库更大时，这种模型就不够用了：

- 你的工作跨多个仓库——一个功能同时触及 API server、web app 和共享库。计划该放在谁的 `openspec/` 文件夹里？
- 你的团队在代码存在之前就规划，或规划永远不变成*这个*仓库里的代码。
- Requirement 由一个团队拥有、被其他团队消费。Wiki 版本会漂移，而你的 coding agent 又读不了它。

**store** 就是答案：一个唯一职责是规划的独立仓库。它有你已熟悉的 `openspec/` 形态——specs 和 changes——加一个小小的身份文件。你在你的机器上按名字注册一次，之后每个普通 OpenSpec 命令都能在任何位置操作它。

## 形态

```
            team-plans  (一个 store：在独立仓库里规划)
            ├── .openspec-store/store.yaml     身份："我是 team-plans"
            └── openspec/
                ├── specs/      真相是什么
                └── changes/    正在推进什么
                      ▲
                      │ 在每台机器上按名字注册；
                      │ 通过 push/clone 像普通仓库一样共享
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (代码仓库)    (代码仓库)     (代码仓库)
```

两条规则让这件事保持简单：

1. **store 就是一个 git 仓库。** 你自己 commit、push、pull、review 它。OpenSpec 从不自行 clone、sync 或 push 任何东西。
2. **声明，不是机器。** 仓库可以*声明*它们与 store 的关系（见下）。声明改变的是 OpenSpec 能告诉你什么——从不改变你的命令在哪里执行。

## 五分钟到你的第一个 store

两条命令带你从零到一个可工作的、store 范围的 change：

```bash
openspec-cn store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec-cn new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec-cn new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec-cn status --change add-login --store team-plans
```

这就是全部模型。从这里开始，生命周期就是你熟悉的那套——`status`、`instructions`、`validate`、`archive`——每条命令加 `--store team-plans`，每个打印的提示都替你带上这个 flag。`Using OpenSpec root:` 这一行总是告诉你命令正在哪里执行。

## 故事：一个团队，一个规划仓库

一个团队把 specs 和 changes 放在 `team-plans` 里，而不是散落在各代码仓库中。

**第一天（谁搭环境谁来跑）：**

```bash
openspec-cn store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

传 `--remote` 会在初始提交里把 clone URL 记进 store 自己的身份文件（`.openspec-store/store.yaml`）。每个未来的 clone 天生知道它从哪儿来，所以健康检查和错误消息能为还没有它的队友打印一条完整、可粘贴的修复命令。

**每个队友（每台机器一次）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec-cn store register ~/openspec/team-plans
```

从此，每个人都按名字在同一个规划仓库里工作：

```bash
openspec-cn status --store team-plans --change add-login
openspec-cn show add-login --store team-plans
```

**共享工作是 git，故意的。** 你创建的 change 在你 commit 并 push 之前只存在于你的 checkout 里——和代码一样。计划白得 branch、pull request 和 review，因为 store 就是一个普通仓库。

**把团队的代码仓库连起来。** 一个规划完全外部化的代码仓库只需要一行，放在 `openspec/config.yaml` 里：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

现在在 `web-app` 里运行的每条 OpenSpec 命令都会在 `team-plans` 上执行，无需任何 flag：

```bash
cd ~/src/web-app
openspec-cn status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

这个指针是 fallback，从不覆盖：显式 `--store` 总是优先，如果仓库长出了真实的规划文件夹，那些优先（并附一条移除过期指针的警告）。

## 故事：跨团队边界的需求

一个平台团队拥有 requirement。产品团队在他们自己的仓库里、用自己的 design 来实现。一个 reference 描述这种关系而不移动任何人的工作。

```
   platform-reqs (store)                 api-server (代码仓库)
   由平台团队拥有                       由产品团队拥有
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ 读取     │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (他们自己的 design)    │
   │   平台工作                │          │ openspec/changes/        │
   │                          │          │   (他们自己的工作)        │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**产品团队在它仓库的 `openspec/config.yaml` 里声明它依赖什么：**

```yaml
references:
  - platform-reqs
```

reference 是只读上下文。仓库保留自己的 `openspec/` 根；工作留在那里。变的是：该仓库里的 `openspec-cn instructions` 现在包含被引用 store 的 spec 索引——每条带一行摘要和确切的获取命令（`openspec-cn show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 里工作的 agent 能找到上游的 payment requirement，引用它，并在仓库自己的根里写低层 design——不需要任何人粘贴上下文。

reference 可携带 clone 源，这样还没有该 store 的队友得到的是一条完整修复而不是死胡同：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**当你想让计划和代码一起打开时，做一个 workset。** 这是个人且显式的：每个人选自己机器上真正一起工作的文件夹。这些本地 checkout 路径不会被提交到共享规划仓库。

```bash
openspec-cn workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 你总能问的两个问题

**"我的设置健康吗？"** —— `openspec-cn doctor` 检查当前根和它引用的 store，只读，每个发现带一条可粘贴的修复：

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec-cn store register '/Users/you/openspec/design-system' --id design-system

```

**"我在和什么一起工作？"** —— `openspec-cn context` 从 OpenSpec 声明组装出工作集：根和它引用的 store。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec-cn show <spec-id> --type spec --store platform-reqs
```

两者都支持 `--json` 供 agent 使用。`openspec-cn context --code-workspace <path>` 额外写一份包含整个集合的 VS Code workspace 文件——这是该命令唯一的写操作。

## Workset：把你一起工作的文件夹重新打开

与以上所有分开：大多数人每个会话都打开同样几个文件夹——规划仓库加两三个代码仓库。一个 **workset** 就是这种个人、命名的视图，用一条命令在你选的工具里重新打开。

```
  workset "platform"                 openspec-cn workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       三个都在你的工具里打开
```

```bash
openspec-cn workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec-cn workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec-cn workset open platform` 然后启动保存的工具：编辑器（VS Code、Cursor）打开一个包含每个成员的窗口并返回。第一个成员是主成员。任何时候用 `--tool <id>` 覆盖工具。

workset 刻意*不是*共享状态。它住在你机器上、从不提交、对工作不做任何声明——它只记录你喜欢一起打开什么。删除一个 workset 从不触碰成员文件夹。新工具是配置，不是代码：任何能用 workspace 文件或 per-folder attach 标志启动的工具，都能在全局 config（`openspec-cn config edit`）的 `openers` 键下添加。

## 命令如何决定在哪里执行

每条普通命令按同样顺序解析它的根：

```
1. --store <id>          你显式说了            → 那个 store
2. nearest openspec/     这里有真实规划根      → 这个仓库
   (从 cwd 向上找)
3. store: pointer        config.yaml 声明一个  → 那个 store
4. 以上都不是            这台机器上注册过       → 报错并给选择提示
                         store？
                         没注册过 store？       → 当前目录
                                                 （经典行为）
```

`Using OpenSpec root:` 这一行（以及 `--json` 输出里的 `root` 块）告诉你你在哪种情况里。

## 已知限制

- **Beta 形态。** 本页所有内容可能在版本间变化——名字、标志、文件格式、JSON 键。
- **每个 store id 每台机器一个 checkout。** 在同一个 id 下注册第二个 checkout 会失败，提示先 `store unregister`。
- **永远不 sync——故意的。** OpenSpec 从不 clone、pull 或 push。一个过期 checkout 显示过期的 spec，直到*你* pull；reference 是从磁盘上实际存在的内容实时索引的。
- **某些命令留在原地。** `view`、`templates`、`schemas` 和已弃用的名词形式（`openspec change show`……）只在当前目录执行——不接受 `--store`。
- **每机状态是每机的。** store 注册表和 workset 是本地设置。关于你机器布局的任何信息都不会被提交到共享规划中。
- **workset 有两种启动风格。** 不能用 workspace 文件或 per-folder attach 标志启动的工具，不能作为 opener 添加。
- **Agent JSON 有已知的大小写分歧**（store 家族键用 snake_case，workflow 家族用 camelCase）。在 [agent contract](../agent-contract.md) 中有记录；统一它推迟到版本化发布。

## 东西放在哪里

| 什么 | 哪里 | 共享？ |
|---|---|---|
| 一个 store 的规划 | `<store>/openspec/`（specs、changes） | 是——commit 并 push |
| 一个 store 的身份 | `<store>/.openspec-store/store.yaml` | 是——随 store 一起提交 |
| store 注册表 | `<data dir>/openspec/stores/registry.yaml` | 否——仅本机 |
| workset | `<data dir>/openspec/worksets/` | 否——仅本机 |

`<data dir>` 在 macOS 和 Linux 上是 `~/.local/share/openspec`（或设置了 `$XDG_DATA_HOME` 时为 `$XDG_DATA_HOME/openspec`），在 Windows 上是 `%LOCALAPPDATA%\openspec`。

## 参考

本页每条命令的确切 flag 和 JSON 形状：
[CLI 参考](../cli.md)（Stores、Doctor、Working context、Personal worksets）和 [agent contract](../agent-contract.md)。
