/**
 * Shared store-selection guidance for skill template workflows.
 *
 * Interpolated into every workflow's instructions so generated skills
 * consistently teach how to target a registered store with `--store <id>`.
 */
export const STORE_SELECTION_GUIDANCE = `**Store 选择：** 如果用户指定了 Store（Store 是已注册在此计算机上的独立 OpenSpec 仓库），或者当前工作位于某个 Store 中，请运行 \`openspec-cn store list --json\` 以发现已注册的 Store ID，然后在读写规范和变更的命令（\`new change\`、\`status\`、\`instructions\`、\`list\`、\`show\`、\`validate\`、\`archive\`、\`doctor\`、\`context\`）中传递 \`--store <id>\`。其他命令不需要此标志。命令打印的提示信息已包含该标志；请在后续操作中保留它。如果没有 Store，命令将作用于最近的本地 \`openspec/\` 根目录。`;
