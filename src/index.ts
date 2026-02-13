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
export { TemplateEditor, UndoManager } from './editor';

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

  // 事件类型
  TemplateChangeEvent,
  EditorEvents,
  RendererEvents,

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
  CSS_VARS,
} from './types';

// ============================================
// 导出错误类型
// ============================================
export {
  TemplateErrorCode,
  ChipsError,
  ConfigError,
  ResourceError,
  UploadError,
} from './types';

// ============================================
// 导出工具函数
// ============================================
export {
  validateConfig,
  getDefaultConfig,
  mergeDefaults,
  t,
  hasKey,
  getAllKeys,
  generateId,
  escapeHtml,
  debounce,
  throttle,
  arrayMove,
} from './utils';

// ============================================
// 导出 Bridge 模块（iframe 通信）
// ============================================
export {
  // 消息类型常量
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  IframeBridgeErrorCode,
  // Bridge 类和工具函数
  IframeBridge,
  IframeBridgeError,
  getBridge,
  initBridge,
  stopBridge,
} from './bridge';

// 导出 Bridge 相关类型
export type {
  CardMessageType,
  CardRuntimeMessage,
  InitPayload,
  BridgeRequestPayload,
  BridgeResponsePayload,
  ResourceRequestPayload,
  ResourceResponsePayload,
  ResizePayload,
  ErrorPayload,
  ThemeUpdatePayload,
  ConfigChangePayload,
  ReadyPayload,
  DisposePayload,
  HostToIframeMessage,
  IframeToHostMessage,
  AnyCardMessage,
  IframeBridgeErrorCodeType,
} from './bridge';
