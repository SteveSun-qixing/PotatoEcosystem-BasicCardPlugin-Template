/**
 * 命令类型定义
 *
 * 定义编辑器支持的操作命令，每个命令通过 `executeCommand()` 执行。
 * 命令驱动的设计便于实现撤销/重做功能。
 *
 * ⚠️ 根据你的卡片功能定义命令类型
 */

/**
 * 模板命令
 *
 * ⚠️ 替换为你的实际命令类型
 *
 * @example 图片卡片命令示例：
 * ```typescript
 * export type ImageCommand =
 *   | { type: 'add_image'; image: ImageItem }
 *   | { type: 'remove_image'; imageId: string }
 *   | { type: 'move_image'; imageId: string; targetIndex: number }
 *   | { type: 'set_layout_type'; layoutType: LayoutType };
 * ```
 *
 * @example 富文本卡片命令示例：
 * ```typescript
 * export type FormatCommand =
 *   | { type: 'bold' }
 *   | { type: 'italic' }
 *   | { type: 'heading'; level: 1 | 2 | 3 }
 *   | { type: 'color'; value: string };
 * ```
 */
export type TemplateCommand =
  | { type: 'sample_command'; value: string }
  | { type: 'another_command'; options: Record<string, unknown> };
  // ⚠️ 添加你的命令类型
