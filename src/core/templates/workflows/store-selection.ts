/**
 * Shared store-selection guidance for skill template workflows.
 *
 * Interpolated into every workflow's instructions so generated skills
 * consistently teach how to target a registered store with `--store <id>`.
 */
export const STORE_SELECTION_GUIDANCE = `**Store 选择：** 如果用户指定了某个 Store（Store 是在本机注册的独立 OpenSpec 仓库），或者工作位于某个 Store 中，请运行 \`openspec-cn store list --json\` 来查找已注册的 Store ID，然后在读写规范和变更的命令上传递 \`--store <id>\` 参数（\`new change\`、\`status\`、\`instructions\`、\`list\`、\`show\`、\`validate\`、\`archive\`、\`doctor\`、\`context\`）。其他命令不需要此参数。命令输出的提示信息中已包含该参数；请在后续操作中保留它。如果没有指定 Store，命令将对最近的本地 \`openspec/\` 根目录生效。`;
