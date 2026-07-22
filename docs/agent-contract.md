# OpenSpec Agent 契约

`openspec` CLI 中机器可读的接口表面，已对照 `src/` 校验（capstone audit，2026-06-11）。下文每一个结构都源自实际产出它的代码。

## 1. 通用约定

- **每次调用输出一个 JSON 文档。** 在 `--json` 模式下，stdout 恰好输出一个 JSON 文档（2 空格缩进美化）。人类可读的描述、进度提示、store banner 等都输出到 stderr。
- **Store banner。** 在人类模式下，当由 store 选定根目录时，stderr 会打印 `Using OpenSpec root: <id> (<path>)`。在 JSON 模式下从不打印。
- **键名大小写因接口而异**（见"已知不一致"）：store / doctor / context 的 payload 使用 `snake_case`；工作流 payload（`status`、`instructions`、`new change`、`validate`、`list`）使用 `camelCase`，但内嵌的 `root` 对象始终使用 `store_id`。
- **可选键被省略而非 null**，大多数 payload 都如此（例如 `root.store_id`、`member.path`）。少数显式使用 `null` 的例外会在对应结构处标注（store doctor 的 `git.*`、失败 payload）。

## 2. 诊断信封

所有机器可读的诊断信息共用一个信封结构（`StoreDiagnostic`）：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (可选)",
  "fix": "one actionable sentence/command (可选)"
}
```

诊断信息出现在两处：**status 数组**（顶层或每个条目的 `status: StoreDiagnostic[]`）用于健康检查结果；**抛出错误**在命令失败时被转换为单元素 `status` 数组。

## 3. 根目录解析与 `RootOutput`

所有解析根目录的命令（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`new change`、`archive`、`doctor`、`context`）都按以下优先级解析出一个 OpenSpec 根目录：

1. `--store <id>` → 该已注册 store 的根（`source: "store"`）。
2. 否则，最近的包含 `openspec/` 的祖先目录：若为规划形态 → `source: "nearest"`（带有 `store:` 指针时会被忽略并在 stderr 警告）；若为仅有配置的目录且带有效 `store:` 指针 → 该 store，`source: "declared"`。
3. 没有最近根目录但存在已注册 store → 错误 `no_root_with_registered_stores`。
4. 既无根目录也无 store：脚手架类命令把 cwd 视为 `source: "implicit"`；诊断类命令（`doctor`、`context`）则失败并返回 `no_openspec_root` —— 它们只检查，不创建脚手架。

成功的 JSON payload 会内嵌根目录信息：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (仅当由 store 选定时)" }
```

**根目录解析失败契约：** 在 JSON 模式下，解析失败会在 stdout 打印 `{ ...commandNullShape, "status": [diagnostic] }` 并以退出码 1 退出。

## 4. 命令 JSON 结构

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` —— 注意此处每个 change 的 `status` 是字符串枚举。`--specs`：`{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
Change：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。Spec：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。任一条目失败时退出码为 1。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`。无活跃变更时：`{ "changes": [], "message", "root" }`，退出码 0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`。

`ReferenceIndexEntry`：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` —— 已解析条目带 root/specs/fetch；未解析条目只有 store_id 和警告 status。索引上限 50KB（`reference_index_truncated`）。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失败：`{ "change": null, "status": [d] }`，退出码 1。

### 4.8 `archive <name> --json`
成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失败：`{ "archive": null, "root"?, "status": [d] }`，退出码 1。JSON 模式严格非交互：每个提示点都会变成 `archive_*` 代码。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`。任何严重级别的健康检查结果退出码均为 0。失败 payload：`{ "root": null, "store": null, "references": [], "status": [d] }`，退出码 1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = path 存在且 status 为空。`--code-workspace <path>` 写入 `{folders:[{name,path}]}`（仅包含可用的 referenced store，带 `ref:` 前缀）；在 JSON 模式下，写入先于打印，因此即使写入失败 stdout 也只输出一个文档。失败：`{ "root": null, "members": [], "status": [d] }`，退出码 1。

### 4.11 `store ... --json`
setup/register：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list：`{ "stores": [{id, root}], "status": [] }`。doctor：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` = 未知 / 未探测）。健康检查结果退出码 0；失败退出码 1 并返回对应的 null-shape。提示取消退出码 130。

### 4.12 `schemas --json` / `templates --json`
`schemas`：纯数组 `[ {name, description, artifacts, source} ]`。`templates`：以 artifactId 为键的对象 `{ "<artifactId>": {path, source} }`。两者都基于 cwd，不含 root/status 键。

## 5. 退出码契约

| 情况 | 退出码 | stdout |
|---|---|---|
| 成功，包括健康检查结果（doctor / context / store doctor） | 0 | payload |
| `--json` 模式下命令失败 | 1 | 一个 JSON 文档，含 `status: [d]` 及命令的 null-shape |
| `validate` 中有失败条目 | 1 | 完整报告 |
| 提示取消（`store` 命令组，人类模式） | 130 | 仅 stderr |

## 6. 诊断代码目录

### 解析
`no_openspec_root`、`no_root_with_registered_stores`、`no_registered_stores`、`unknown_store`、`store_identity_mismatch`、`unhealthy_store_root`、`store_path_not_supported`、`invalid_store_pointer`、`initiative_option_removed`、`areas_option_removed`；透传：`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`。

### OpenSpec 根目录健康（error，无 fix）
`openspec_store_root_missing`、`openspec_store_root_not_directory`、`openspec_root_missing`、`openspec_root_not_directory`、`openspec_config_missing`、`openspec_config_not_file`、`openspec_specs_not_directory`、`openspec_changes_not_directory`、`openspec_archive_not_directory`。在 stores beta 期间，`openspec/specs/`、`openspec/changes/` 和 `openspec/changes/archive/` 在健康的根目录中可能不存在；只有当它们存在但不是目录时才是健康错误。

### Store 注册 / 身份 / 状态
`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`、`store_registry_busy`、`store_not_found`、`no_store_registry`、`store_registry_changed`、`store_metadata_missing`、`store_metadata_id_mismatch`、`store_metadata_invalid`、`store_id_conflict`、`store_path_conflict`、`store_already_registered`（info）。

### Store setup / register / remove
`store_setup_id_required`、`store_setup_path_required`、`store_setup_path_not_directory`、`store_setup_inside_git_repo`、`store_setup_non_empty_directory`、`store_setup_cancelled`、`store_path_required`、`store_path_missing`、`store_path_not_directory`、`store_root_pointer_declared`、`store_register_root_unhealthy`、`store_register_identity_confirmation_required`、`store_register_cancelled`、`store_remote_empty`、`store_remote_requires_hand_edit`、`store_remove_confirmation_required`、`store_remove_cancelled`、`store_remove_path_not_directory`、`store_remove_metadata_missing`、`store_root_missing`（remove 中为 warning，doctor 中为 error）、`store_root_not_directory`。

### Store git
`store_git_init_failed`、`store_git_identity_missing`、`store_git_commit_failed`、`store_git_no_commits`（warning）、`store_clone_fragile_directories`（warning）、`store_remote_divergence`（info，doctor）。

### References（warning）
`reference_invalid_id`、`reference_registry_unreadable`、`reference_unresolved`、`reference_root_unhealthy`、`reference_index_truncated`。

### Relationships（warning；doctor；context 仅保留 registry 相关）
`relationship_registry_unreadable`、`root_pointer_ignored`、`root_pointer_invalid`、`pointer_declarations_inert`。

### Archive（JSON 模式）
`archive_change_name_required`、`archive_change_not_found`、`archive_validation_failed`、`archive_confirmation_required`、`archive_tasks_incomplete`、`archive_spec_update_failed`、`archive_spec_validation_failed`、`archive_target_exists`、`archive_error`。

### Context 写入
`context_file_exists`、`context_output_dir_missing`。

### 兜底
`doctor_failed`、`context_failed`、`store_error`、`change_error`、`archive_error`。

## 已知不一致

由 capstone audit 记录；已发布键名的重命名是本次发布之后才决定的产品决策：

1. ~~在 `--json` 模式下，多个失败路径只打印 stderr 而没有 JSON 文档。~~ 已在 capstone gauntlet 轮中修复：`show`/`validate` 的未知与歧义项会输出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 中抛出的错误会经 JSON 感知的失败助手路由（命令的 null-shape + `status`）；`store <unknown subcommand> --json` 输出 `{status:[{code: unknown_store_subcommand}]}`；`list` 在解析失败时返回其 `{changes|specs: [], root: null}` null-shape。
2. `store_root_missing` 以两种严重级别发出（remove 中为 warning，store doctor 中为 error）—— 上下文相关，已在上方说明。
3. snake_case（store 命令组）vs camelCase（工作流命令组）的键名大小写；`root.store_id` 在所有位置都使用 snake_case。
4. `src` 中存在四份并列的信封类型声明；archive 诊断从不携带 `target`。
5. `list --json` 把 `status` 键复用为每个 change 的字符串枚举。
6. 仅 `validate` 输出带 `version` 字段。
7. `schemas`/`templates` 忽略根目录选择（基于 cwd，不接受 `--store`）。
8. 已弃用的名词形态（`change`/`spec` 子命令）输出不带 `root`/`status` 的非信封 payload。
