/**
 * 类型定义统一导出
 * ⚠️ 使用时请全局替换 "Template" 为你的实际卡片类型名称
 */

// 配置类型
export type { TemplateCardConfig, TemplateLayoutConfig } from './config';

// 状态类型
export type { TemplateRendererState, TemplateEditorState } from './state';

// 命令类型
export type { TemplateCommand } from './commands';

// 事件类型
export type { TemplateChangeEvent, EditorEvents, RendererEvents } from './events';

// 选项类型
export type { RenderOptions, EditorOptions } from './options';

// 验证类型
export type { ValidationError, ValidationResult } from './validation';

// 常量
export { DEFAULT_CONFIG, CSS_PREFIX, CSS_VARS } from './constants';

// 错误类型和错误码
export {
  TemplateErrorCode,
  ChipsError,
  ConfigError,
  ResourceError,
  UploadError,
} from './errors';
