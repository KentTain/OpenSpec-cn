import type { ProjectConfig } from './project-config.js';

/**
 * 将配置序列化为带中文注释的 YAML 字符串。
 *
 * @param config - 部分配置对象（schema 必填，其他字段可选）
 * @returns 可直接写入文件的 YAML 字符串
 */
export function serializeConfig(config: Partial<ProjectConfig>): string {
  const lines: string[] = [];

  // Schema（必填）
  lines.push(`schema: ${config.schema}`);
  lines.push('');

  if (config.context !== undefined) {
    lines.push('context: |');
    for (const line of config.context.split('\n')) {
      lines.push(`  ${line}`);
    }
    lines.push('');
  } else {
    // Context section with comments
    lines.push('# 项目上下文（可选）');
    lines.push('# 只添加应当约束 OpenSpec 产出物和工作流的要求。');
    lines.push('# 包含 AI 无法通过阅读代码推断出的约束。');
    lines.push('# 不要放通用的项目文档和可从代码中发现的事实。');
    lines.push('# 示例：');
    lines.push('#   context: |');
    lines.push('#     设计和任务必须覆盖 Windows、macOS 和 Linux');
    lines.push('#     所有产出物使用中文撰写');
    lines.push('');
  }

  // 规则段落（带注释）
  lines.push('# 按产出物的规则（可选）');
  lines.push('# 为特定产出物添加自定义规则。');
  lines.push('# 示例：');
  lines.push('#   rules:');
  lines.push('#     proposal:');
  lines.push('#       - 提案保持在 500 字以内');
  lines.push('#       - 始终说明范围之外的内容');
  lines.push('#     tasks:');
  lines.push('#       - 将任务拆分为每次不超过 2 小时的工作块');
  lines.push('');

  // 操作指南段落（带注释）
  lines.push('# 按操作的指南（可选）');
  lines.push('# 为 apply 和 archive 操作添加咨询性指南。');
  lines.push('# 此段落独立于上述的产出物规则。');
  lines.push('# 示例：');
  lines.push('#   operations:');
  lines.push('#     apply:');
  lines.push('#       guidance:');
  lines.push('#         - 测试摘要保持简洁');
  lines.push('#     archive:');
  lines.push('#       guidance:');
  lines.push('#         - 完成前总结归档结果');

  return lines.join('\n') + '\n';
}
