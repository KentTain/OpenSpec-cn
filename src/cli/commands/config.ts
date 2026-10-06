import { Command } from 'commander';

/**
 * Register the config command and all its subcommands.
 *
 * @param program - The Commander program instance
 */
export function registerConfigCommand(program: Command): void {
  const configCmd = program
    .command('config')
    .description('查看并修改全局 OpenSpec 配置')
    .option('--scope <scope>', '配置范围（目前仅支持 "global"）')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.scope && opts.scope !== 'global') {
        console.error('错误：项目级配置尚未实现');
        process.exit(1);
      }
    });

  // config path
  configCmd
    .command('path')
    .description('显示配置文件位置')
    .action(async () => {
      const { configPathCommand } = await import('../../commands/config.js');
      configPathCommand();
    });

  // config list
  configCmd
    .command('list')
    .description('显示当前所有设置')
    .option('--json', '以 JSON 格式输出')
    .action(async (options: { json?: boolean }) => {
      const { configListCommand } = await import('../../commands/config.js');
      configListCommand(options);
    });

  // config get
  configCmd
    .command('get <key>')
    .description('获取特定值（原始格式，可用于脚本）')
    .action(async (key: string) => {
      const { configGetCommand } = await import('../../commands/config.js');
      configGetCommand(key);
    });

  // config set
  configCmd
    .command('set <key> <value>')
    .description('设置值（自动转换类型）')
    .option('--string', '强制将值存为字符串')
    .option('--allow-unknown', '允许设置未知键')
    .action(async (key: string, value: string, options: { string?: boolean; allowUnknown?: boolean }) => {
      const { configSetCommand } = await import('../../commands/config.js');
      configSetCommand(key, value, options);
    });

  // config unset
  configCmd
    .command('unset <key>')
    .description('移除键（恢复为默认值）')
    .action(async (key: string) => {
      const { configUnsetCommand } = await import('../../commands/config.js');
      configUnsetCommand(key);
    });

  // config reset
  configCmd
    .command('reset')
    .description('将配置重置为默认值')
    .option('--all', '重置所有配置（必填）')
    .option('-y, --yes', '跳过确认提示')
    .action(async (options: { all?: boolean; yes?: boolean }) => {
      const { configResetCommand } = await import('../../commands/config.js');
      await configResetCommand(options);
    });

  // config edit
  configCmd
    .command('edit')
    .description('在 $EDITOR 中打开配置')
    .action(async () => {
      const { configEditCommand } = await import('../../commands/config.js');
      await configEditCommand();
    });

  // config profile [preset]
  configCmd
    .command('profile [preset]')
    .description('配置工作流档案（交互式选择器或预设快捷方式）')
    .action(async (preset?: string) => {
      const { configProfileCommand } = await import('../../commands/config.js');
      await configProfileCommand(preset);
    });
}
