# 安装

## 前置条件

- **Node.js 20.19.0 或更高版本** —— 查看版本：`node --version`

## 包管理器

### npm

```bash
npm install -g @studyzy/openspec-cn@latest
```

### pnpm

```bash
pnpm add -g @studyzy/openspec-cn@latest
```

### yarn

```bash
yarn global add @studyzy/openspec-cn@latest
```

### bun

Bun 可以全局安装 OpenSpec，但 OpenSpec 当前运行在 Node.js 上。
你仍需要在 `PATH` 中提供 Node.js 20.19.0 或更高版本。

```bash
bun add -g @studyzy/openspec-cn@latest
```

## Nix

无需安装，直接运行 OpenSpec：

```bash
nix run github:studyzy/OpenSpec-cn -- init
```

或者安装到 profile：

```bash
nix profile install github:studyzy/OpenSpec-cn
```

或者在 `flake.nix` 中加入到开发环境：

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:studyzy/OpenSpec-cn";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## 验证安装

```bash
openspec-cn --version
```

## 更新

升级包版本，然后刷新每个项目生成的文件：

```bash
npm install -g @studyzy/openspec-cn@latest   # 或对应的 pnpm/yarn/bun 命令
openspec-cn update                            # 在每个项目内运行
```

`openspec-cn update` 会重新生成你已配置工具的 skill 和命令文件，让你的斜杠命令与已安装版本保持一致。

## 卸载

OpenSpec 没有 `openspec uninstall` 命令，因为它只是一个全局包加上你项目里的一些文件。卸载只需几个手动步骤，且这些步骤都不会触碰你的源代码。

**1. 移除全局包：**

```bash
npm uninstall -g @studyzy/openspec-cn   # 或：pnpm rm -g / yarn global remove / bun rm -g
```

**2. 从项目中移除 OpenSpec（可选）。** 如果你不再需要 specs 和 changes，删除 `openspec/` 目录即可：

```bash
rm -rf openspec/
```

动手前请三思：`openspec/specs/` 和 `openspec/changes/archive/` 记录了系统如何运转以及为何如此演进。如果你可能需要这段历史，即使卸载后也请保留该目录（或保留在 git 中）。

**3. 移除生成的 AI 工具文件��可选）。** OpenSpec 会把 skill 和命令文件写入各工具的目录，例如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等等。针对你配置过的工具，删除 `openspec-*` skill 与 `opsx-*` 命令即可。每个工具的具体路径见 [支持的工具](supported-tools.md)。

如果你在 `CLAUDE.md` 或 `AGENTS.md` 等文件中也有 OpenSpec 标记块，请手动删除这些块；这些文件中你自己写的内容仍归你所有。

## 下一步

安装完成后，在你的项目中初始化 OpenSpec：

```bash
cd your-project
openspec-cn init
```

完整流程请参见 [快速上手](getting-started.md)。
