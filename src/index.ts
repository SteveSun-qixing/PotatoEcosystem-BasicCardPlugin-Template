/**
 * 基础卡片插件模板
 *
 * @packageDocumentation
 * @module TemplateCardPlugin
 * 
 * ⚠️ 使用说明：
 * 1. 全局替换 "Template" 为你的卡片类型
 * 2. 更新导出的类型和函数
 */

// ============================================
// 导出插件主类
// ============================================
export { TemplateCardPlugin, default } from './plugin';

// ============================================
// 导出渲染器
// ============================================
export { TemplateRenderer } from './renderer';

// ============================================
// 导出编辑器
// ============================================
export { TemplateEditor } from './editor';

// ============================================
// 导出类型
// ============================================
export type {
  // 配置类型
  TemplateCardConfig,
  TemplateLayoutConfig,
  
  // 状态类型
  TemplateRendererState,
  TemplateEditorState,
  
  // 命令类型
  TemplateCommand,
  
  // 选项类型
  RenderOptions,
  EditorOptions,
  
  // 验证类型
  ValidationError,
  ValidationResult,
} from './types';

// ============================================
// 导出常量
// ============================================
export {
  DEFAULT_CONFIG,
  CSS_PREFIX,
  ERROR_CODES,
} from './types';

// ============================================
// 导出工具函数
// ============================================
export {
  validateConfig,
  getDefaultConfig,
  mergeDefaults,
} from './utils';
