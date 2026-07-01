# OpenSpec 测试指南

适用于 `test/` 下的测试。

## 运行测试

- 聚焦单个文件：`pnpm exec vitest run test/path/to/file.test.ts`
- 聚焦单个用例：`pnpm exec vitest run test/path/to/file.test.ts -t "case name"`
- 完整测试套件：`pnpm test`
- 当实现变更可能让 `dist/` 过期时，在运行聚焦 CLI 测试前先跑 `pnpm run build`。

## 跨平台路径

- 除非实现刻意输出 POSIX 路径，否则不要在 CLI 输出预期中硬编码 Unix 路径分隔符。
- 对于文件系统路径，用 `path.join(...)`、`path.relative(...)` 或 `FileSystemUtils.joinPath(...)` 构建预期值。
- 对于人类可读输出，要么断言一种刻意规范化的显示格式，要么在比较前规范化实际值与预期值（例如用 `FileSystemUtils.toPosixPath()` 把反斜杠转成正斜杠，保证跨平台一致）。
- 触及路径行为时，加一条在 Windows 路径分隔符上会失败的覆盖。

## 路径规范化

路径同一性是反复出现的 CI 失败模式：Windows 短/长路径、symlink 或 junction 别名、以及大小写不敏感的文件系统可能把同一个已存在的目录拼写成不同形式。

在把已存在的文件系统路径当作同一性断言时，先规范化实际值与预期值。项目代码中优先用 `FileSystemUtils.canonicalizeExistingPath()`，仅在测试预期里用 `fs.realpathSync.native()`。

触及路径同一性逻辑时加一条别名路径回归测试。如果保留用户输入的路径拼写是刻意的，把它与同一性比较分开单独断言。
