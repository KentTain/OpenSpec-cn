# 从旧版工作流迁移

> 从旧版 `/openspec:*` 命令迁移到 OPSX。

<!-- WIP, on the todo list: this page is not written yet and is held back from the
site (its section is commented out in website/docs.sync.config.mjs, 2026-08-21). The
file stays so the structure and inbound links survive; re-list it in the sync config
once the prose lands. -->

<!-- Skeleton: headings only. -->

## 发生了什么变化，为什么

## 命令映射

## 迁移项目

### 清理前备份自定义内容

**待移除文件** 下列出的文件将被完全删除。接受清理前请备份任何自定义内容。

- **`openspec/AGENTS.md`**：仅凭存在与否检测；清理不检查其内容。
- **根目录的 `AGENTS.md`、`CLAUDE.md` 及其他配置文件**：清理会移除 OpenSpec 标记块，并保留这些块之外的内容。
- **旧版命令目录**：清理会保留它无法识别为生成命令的文件。

## 行为差异
