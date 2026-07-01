# OpenSpec 脚本

OpenSpec 维护与开发用的实用脚本。

## update-flake.sh

自动更新 `flake.nix` 的 pnpm 依赖哈希。

**何时使用**：更新依赖后（`pnpm install`、`pnpm update`）。

**用法**：
```bash
./scripts/update-flake.sh
```

**做什么**：
1. 从 `package.json` 读取版本号（`flake.nix` 会动态使用）
2. 自动计算正确的 pnpm 依赖哈希
3. 更新 `flake.nix` 中的哈希
4. 验证构建是否成功

**示例流程**：
```bash
# 更新依赖后
pnpm install
./scripts/update-flake.sh
git add flake.nix
git commit -m "chore: update flake.nix dependency hash"
```

## postinstall.js

包安装完成后运行的安装后脚本。

## pack-version-check.mjs

发布前校验包版本一致性。
