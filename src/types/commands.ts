/**
 * 命令类型定义
 * ⚠️ 定义你的卡片编辑命令
 */

/**
 * 模板命令
 * ⚠️ 根据你的卡片功能定义命令类型
 */
export type TemplateCommand =
  | { type: 'sample_command'; value: string }
  | { type: 'another_command'; options: Record<string, unknown> };
  // ⚠️ 添加你的命令类型
  // 示例：
  // | { type: 'bold' }
  // | { type: 'italic' }
  // | { type: 'set_color'; color: string }
