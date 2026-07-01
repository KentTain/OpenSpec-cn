# OpenSpec 并行 Delta 补救计划

## 问题概述
- 活跃变更在归档时执行 requirement 级别的替换。当两个变更涉及同一个 requirement 时，后归档的变更会覆盖前者，并静默丢弃 scenario（例如 Windsurf 与 Kilo Code 斜杠命令更新）。
- 归档工作流（`src/core/archive.ts:191` 和 `src/core/archive.ts:501`）通过用变更 delta 中的内容替换整个 requirement 块来重建主 spec。delta 格式（`src/core/parsers/requirement-blocks.ts:113`）没有基线版本或 scenario 级操作的概念。
- 工具无法检测变更作者的起点与实时 spec 之间的差异，因此并行开发会在没有警告的情况下破坏真相源（source of truth）。

## 观察到的失败模式
- 变更 A（`add-windsurf-workflows`）在 `Slash Command Configuration` 下新增了一个 Windsurf scenario。
- 变更 B（`add-kilocode-workflows`）在同一个 requirement 上新增了一个 Kilo Code scenario，起点是 Windsurf 之前的 spec。
- 变更 A 归档后，主 spec 同时包含两个 scenario。
- 变更 B 归档时，`buildUpdatedSpec` 看到 `Slash Command Configuration` 的 `MODIFIED` 块，并用该变更中带的四 scenario 变体替换该 requirement。由于该文件从未感知 Windsurf 的存在，Windsurf scenario 消失了。
- 没有任何警告、diff 或冲突提示——归档成功完成，真相源 spec 中已缺失一个已发布的 scenario。

## 根本原因
1. **仅替换语义。** `buildUpdatedSpec` 对 requirement 块执行哈希表替换，无法合并或比较单个 scenario（`src/core/archive.ts:455`-`src/core/archive.ts:526`）。
2. **缺失基线指纹。** 变更不保留其作者撰写时所基于的 requirement 内容，因此归档步骤无法判断实时 spec 是否已发生偏离。
3. **单一粒度。** delta 语言只理解 requirement 级别。即便我们引入 scenario 级解析，没有配套的合并策略仍会丢失同级编辑。
4. **缺乏冲突 UX。** CLI 从不强制贡献者调和并行更新。没有 `git merge`、`git rebase` 或冲突标记的等价物。

## 设计目标
- 无论归档顺序如何，保留每一个已批准的 scenario。
- 在实时 spec 偏离作者基线时检测并阻止投机性归档。
- 提供确定性、可审查的冲突解决流程，对齐源代码控制的最佳实践。
- 保持作者体验的人性化：delta 应仍是人类��编辑的 Markdown。
- 支持增量采用，使现有仓库可以向前迁移而不会破坏正在进行的工作。

## 拟议修复：分层补救

### Phase 0 —— 止血（检测与护栏）
1. **在每个变更旁持久化 requirement 指纹。**
   - 在脚手架生成或校验变更时，为每个 `MODIFIED`/`REMOVED`/`RENAMED` 条目捕获当前 requirement 正文，写入 `changes/<id>/meta.json`。
   - 存储基线 requirement 内容的稳定哈希（例如 SHA-256）以及原始文本，以供后续合并使用。
2. **归档时校验指纹。**
   - 在 `buildUpdatedSpec` 修改 spec 之前，从实时 spec 重新计算 requirement 哈希。
   - 如果哈希与存储的基线不同，则中止并指示用户 rebase。这样可让破坏性路径变得不可能。
3. **在 CLI 输出中暴露意图。**
   - 显示哪些 requirement 已过期、何时偏离、以及哪个变更最后触及了它们。
4. **记录临时手动缓解措施。**
   - 更新 `openspec/AGENTS.md` 和文档，让贡献者知道在其他变更落地后应重新运行 `openspec change sync`（见 Phase 1）。

_结果：_ 我们立即防止数据丢失，同时着手开发更完善的合并方案。

### Phase 1 —— 新增 Rebase 工作流（作者侧合并）
1. **引入 `openspec change sync <id>`（或 `rebase`）。**
   - 读取存储的基线快照、当前 spec，以及作者的 delta。
   - 对每个 requirement 执行三方合并。初期可采用朴素的 diff3 按 Markdown 行合并，因为我们已经在 requirement 大小的块上操作。
   - 如果合并干净，用合并后的文本重写 `MODIFIED` 块并刷新存储的指纹。
   - 如有冲突，在变更 delta 内写入冲突标记（类似 Git），要求作者在重新运行校验前手动编辑。
2. **增强校验器信息。**
   - `openspec validate` 应标记未解决的冲突标记或指纹不匹配，让错误在工作流的早期就暴露。
3. **可选：** 提供 `--rewrite-scenarios` 助手，用于合并 scenario 的项目符号列表，减少手动编辑的噪声。

_结果：_ 贡献者可以在归档前安全地将自己的工作与最新 spec 调和，恢复真正的并行开发。

### Phase 2 —— 提升 Delta 粒度
1. **用 scenario 级指令扩展 delta 语言。**
   - 允许 `## MODIFIED Requirements` + `## ADDED Scenarios` / `## MODIFIED Scenarios` 区段嵌套在 requirement 标题下。
   - 由存储在 `meta.json` 中的稳定 scenario 标识符（显式 ID 或生成的哈希）支撑。这让系统能够对单个 scenario 进行推理。
2. **让解析器理解嵌套操作。**
   - 更新 `parseDeltaSpec`，在 requirement 块之外额外发出 scenario 级操作。
   - 更新 `buildUpdatedSpec`（或其替代品），以合并 scenario 列表，保留顺序的同时以确定性方式插入新条目。
3. **自动化迁移。**
   - 提供一次性命令，检查每个现有 spec，注入 scenario ID，并将进行中的变更 delta 重写为更丰富的格式。
4. **当两个变更编辑同一个 scenario 正文或描述时，仍继续依赖 Phase 1 的 rebase 流程处理冲突。**

_结果：_ 大多数并发更新变得可交换，大幅降低人工合并的概率。

### Phase 3 —— 结构化 Spec 图（长期）
1. **定义稳定的 requirement ID。**
   - 在 spec 中嵌入 `Requirement ID: <uuid>` 标记，使重命名和移动可被追踪。
   - 这将启用未来功能，如跨能力引用和更好的 diff 可视化。
2. **将 spec 编辑建模为对 AST 的操作。**
   - 为 requirement / scenario / 元数据构建中间表示（IR）。
   - 使用操作变换或类 CRDT 技术以保证合并的结合性。
3. **与 Git 直接集成。**
   - 提供可选的 `openspec branch` 脚手架，将 spec 变更与 Git 分支对齐，让团队利用 Git 的冲突编辑器处理 Markdown IR。

_结果：_ OpenSpec 从基于替换的更新升级为一个具备韧性、保留意图的 spec 管理平台。

## 迁移与产品影响
- **回填元数据：** 在初始发布期间，为所有活跃变更和当前主 spec 添加哈希。
- **CLI UX：** 新命令（`change sync`、增强版 `archive`）需要文档、帮助文本和发布说明。
- **文档与 AGENTS 更新：** 强化 rebase 工作流，并向 AI 助手解释冲突解决。
- **测试：** 引入覆盖分叉 requirement 指纹和合并解决逻辑的固件。
- **遥测（可选）：** 记录指纹不匹配，以便我们观察团队在发布后多久遇到一次冲突。

## 待解问题 / 风险
- 当多个变更在不同位置插入 scenario 时，应如何排序？（考虑可选的 `position` 元数据或确定性的字母序回退。）
- 如果贡献者删除了 `meta.json` 文件，优雅的失败模式是什么？（CLI 应按需重建指纹。）
- 是否需要支持在归档前无法轻松重新运行 sync 命令的离线作者？（潜在应急方案：`--accept-outdated` 逃生舱。）
- 已归档的历史变更如何处理？我们可能需要一个迁移脚本，追溯性地嵌入指纹以使重新校验成功。

## 即时后续步骤
1. 在 `openspec change validate` 期间原型化指纹捕获，并在不匹配时阻止归档。
2. 发布带基于行 diff3 合并与冲突标记的 `openspec change sync`。
3. 更新贡献者文档和 AI 指令，强制在归档前运行 `sync`。
4. 作为后续 RFC，规划 scenario 级 delta 扩展与迁移路径。
