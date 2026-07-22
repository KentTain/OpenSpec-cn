# 安装

## 前置条件

- **Node.js 20.19.0 或更高版本** — 检查你的版本:`node --version`

## 包管理器

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun 可以全局安装 OpenSpec,但 OpenSpec 目前运行在 Node.js 上。
你仍需要在 `PATH` 中提供 Node.js 20.19.0 或更高版本。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

直接运行 OpenSpec,无需安装:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

或安装到你的 profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

或在 `flake.nix` 中加入你的开发环境:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
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
openspec --version
```

## 更新

升级包,然后刷新每个项目生成的文件:

```bash
npm install -g @fission-ai/openspec@latest   # 或 pnpm/yarn/bun 的等价命令
openspec-cn update                              # 在每个项目内运行
```

`openspec-cn update` 会为你已配置的工具重新生成 skill 和 command 文件,使你的 slash command 与已安装版本保持同步。

## 卸载

没有 `openspec-cn uninstall` 命令,因为 OpenSpec 只是一个全局包加上你项目中的一些文件。移除它需要几个手动步骤,这里没有任何操作会触及你的源代码。

**1. 移除全局包:**

```bash
npm uninstall -g @fission-ai/openspec   # 或: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 从项目中移除 OpenSpec(可选)。** 如果你不再需要其中的 specs 和变更,删除 `openspec/` 目录:

```bash
rm -rf openspec/
```

动手前请三思:`openspec/specs/` 和 `openspec/changes/archive/` 是系统行为及其变更原因的记录。若你可能需要那段历史,即便在卸载后也请保留该文件夹(或保留在 git 中)。

**3. 移除生成的 AI 工具文件(可选)。** OpenSpec 会将 skill 和 command 文件写入各工具的目录,如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等。删除你所配置工具对应的 `openspec-*` skills 和 `opsx-*` commands。各工具的准确路径列于 [Supported Tools](supported-tools.md)。

如果你还在 `CLAUDE.md` 或 `AGENTS.md` 之类的文件中有 OpenSpec 标记块,请手动移除它们;这些文件中你自己的内容由你保留。

## 下一步

安装后,在你的项目中初始化 OpenSpec:

```bash
cd your-project
openspec-cn init
```

完整导览见 [Getting Started](getting-started.md)。
