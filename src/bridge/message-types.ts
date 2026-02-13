/**
 * 卡片插件 iframe 通信消息类型定义
 *
 * 定义 iframe 与宿主应用之间的 postMessage 通信协议。
 * 遵循《插件系统技术规格》第 10 节"卡片插件 iframe 运行时协议"。
 *
 * @packageDocumentation
 * @module CardIframeBridge
 */

/**
 * 协议版本常量
 */
export const PROTOCOL_NAME = 'chips-card-runtime' as const;
export const PROTOCOL_VERSION = '1.0.0' as const;

/**
 * 消息类型枚举
 *
 * 定义所有支持的消息类型：
 * - 宿主 -> iframe: init, bridge-response, resource-response, theme-update, dispose
 * - iframe -> 宿主: ready, bridge-request, resource-request, resize, error, config-change
 */
export type CardMessageType =
  | 'init'
  | 'ready'
  | 'bridge-request'
  | 'bridge-response'
  | 'resource-request'
  | 'resource-response'
  | 'resize'
  | 'theme-update'
  | 'config-change'
  | 'dispose'
  | 'error';

/**
 * 卡片运行时消息基础结构
 *
 * 所有 postMessage 消息的统一格式
 */
export interface CardRuntimeMessage<T = unknown> {
  /** 协议标识，固定为 'chips-card-runtime' */
  protocol: typeof PROTOCOL_NAME;
  /** 协议版本 */
  version: typeof PROTOCOL_VERSION;
  /** 消息唯一标识，用于请求-响应匹配 */
  messageId: string;
  /** 消息类型 */
  type: CardMessageType;
  /** ISO 8601 时间戳 */
  timestamp: string;
  /** 消息负载 */
  payload: T;
}

// ============================================
// 宿主 -> iframe 消息负载类型
// ============================================

/**
 * 初始化消息负载
 *
 * 宿主在 iframe 发送 ready 后发送此消息
 */
export interface InitPayload {
  /** 卡片配置数据 */
  config: Record<string, unknown>;
  /** 当前主题 ID */
  themeId: string;
  /** 主题 CSS 变量 */
  themeVariables: Record<string, string>;
  /** 当前语言 */
  locale: string;
  /** 资源映射表（资源 ID -> 可访问 URL） */
  resourceMap: Record<string, string>;
  /** 插件 ID */
  pluginId: string;
  /** 插件版本 */
  pluginVersion: string;
  /** 运行模式 */
  mode: 'renderer' | 'editor';
  /** 是否为只读模式（仅 renderer） */
  readonly?: boolean;
  /** 宿主版本 */
  hostVersion: string;
}

/**
 * Bridge 响应消息负载
 *
 * 宿主代调 Bridge API 后返回的结果
 */
export interface BridgeResponsePayload {
  /** 对应的请求 ID */
  requestId: string;
  /** 是否成功 */
  success: boolean;
  /** 成功时的返回数据 */
  data?: unknown;
  /** 失败时的错误信息 */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  /** 执行耗时（毫秒） */
  durationMs: number;
}

/**
 * 资源响应消息负载
 *
 * 宿主解析资源请求后返回的结果
 */
export interface ResourceResponsePayload {
  /** 对应的请求 ID */
  requestId: string;
  /** 是否成功 */
  success: boolean;
  /** 资源可访问 URL（成功时） */
  url?: string;
  /** 资源 MIME 类型 */
  mimeType?: string;
  /** 失败时的错误信息 */
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 主题更新消息负载
 *
 * 宿主通知 iframe 主题已变更
 */
export interface ThemeUpdatePayload {
  /** 新主题 ID */
  themeId: string;
  /** 新主题 CSS 变量 */
  themeVariables: Record<string, string>;
}

/**
 * 销毁消息负载
 *
 * 宿主通知 iframe 即将被销毁
 */
export interface DisposePayload {
  /** 销毁原因 */
  reason: 'unload' | 'navigation' | 'close';
}

// ============================================
// iframe -> 宿主 消息负载类型
// ============================================

/**
 * 就绪消息负载
 *
 * iframe 加载完成后发送
 */
export interface ReadyPayload {
  /** iframe 运行模式 */
  mode: 'renderer' | 'editor';
  /** 支持的协议版本 */
  protocolVersion: string;
}

/**
 * Bridge 请求消息负载
 *
 * iframe 请求宿主代调 Bridge API
 */
export interface BridgeRequestPayload {
  /** 请求 ID，用于匹配响应 */
  requestId: string;
  /** 服务命名空间 */
  namespace: string;
  /** 动作名称 */
  action: string;
  /** 调用参数 */
  params?: unknown;
}

/**
 * 资源请求消息负载
 *
 * iframe 请求宿主解析资源
 */
export interface ResourceRequestPayload {
  /** 请求 ID */
  requestId: string;
  /** 资源标识（可以是相对路径或资源 ID） */
  resourceId: string;
  /** 资源类型提示 */
  type?: 'image' | 'video' | 'audio' | 'file' | 'other';
}

/**
 * 尺寸变化消息负载
 *
 * iframe 内容高度变化时通知宿主
 */
export interface ResizePayload {
  /** 内容宽度 */
  width: number;
  /** 内容高度 */
  height: number;
  /** 是否为自然尺寸（非强制） */
  natural?: boolean;
}

/**
 * 错误消息负载
 *
 * iframe 内部发生错误时上报
 */
export interface ErrorPayload {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: unknown;
  /** 错误堆栈（仅开发模式） */
  stack?: string;
  /** 是否可恢复 */
  recoverable: boolean;
}

/**
 * 配置变更消息负载（编辑器专用）
 *
 * 编辑器修改配置后通知宿主
 */
export interface ConfigChangePayload {
  /** 新配置 */
  config: Record<string, unknown>;
  /** 是否为最终保存（false 表示实时预览） */
  final: boolean;
}

// ============================================
// 类型化消息定义
// ============================================

/** 初始化消息 */
export type InitMessage = CardRuntimeMessage<InitPayload>;

/** 就绪消息 */
export type ReadyMessage = CardRuntimeMessage<ReadyPayload>;

/** Bridge 请求消息 */
export type BridgeRequestMessage = CardRuntimeMessage<BridgeRequestPayload>;

/** Bridge 响应消息 */
export type BridgeResponseMessage = CardRuntimeMessage<BridgeResponsePayload>;

/** 资源请求消息 */
export type ResourceRequestMessage = CardRuntimeMessage<ResourceRequestPayload>;

/** 资源响应消息 */
export type ResourceResponseMessage = CardRuntimeMessage<ResourceResponsePayload>;

/** 尺寸变化消息 */
export type ResizeMessage = CardRuntimeMessage<ResizePayload>;

/** 主题更新消息 */
export type ThemeUpdateMessage = CardRuntimeMessage<ThemeUpdatePayload>;

/** 销毁消息 */
export type DisposeMessage = CardRuntimeMessage<DisposePayload>;

/** 错误消息 */
export type ErrorMessage = CardRuntimeMessage<ErrorPayload>;

/** 配置变更消息 */
export type ConfigChangeMessage = CardRuntimeMessage<ConfigChangePayload>;

// ============================================
// 消息联合类型
// ============================================

/** 宿主发送的所有消息类型 */
export type HostToIframeMessage =
  | InitMessage
  | BridgeResponseMessage
  | ResourceResponseMessage
  | ThemeUpdateMessage
  | DisposeMessage;

/** iframe 发送的所有消息类型 */
export type IframeToHostMessage =
  | ReadyMessage
  | BridgeRequestMessage
  | ResourceRequestMessage
  | ResizeMessage
  | ErrorMessage
  | ConfigChangeMessage;

/** 所有消息类型 */
export type AnyCardMessage = HostToIframeMessage | IframeToHostMessage;

// ============================================
// 错误代码常量
// ============================================

/**
 * iframe 通信错误代码
 */
export const IframeBridgeErrorCode = {
  /** 协议版本不匹配 */
  PROTOCOL_MISMATCH: 'IFRAME_PROTOCOL_MISMATCH',
  /** 消息格式无效 */
  INVALID_MESSAGE: 'IFRAME_INVALID_MESSAGE',
  /** 请求超时 */
  REQUEST_TIMEOUT: 'IFRAME_REQUEST_TIMEOUT',
  /** 未初始化 */
  NOT_INITIALIZED: 'IFRAME_NOT_INITIALIZED',
  /** Bridge 调用失败 */
  BRIDGE_CALL_FAILED: 'IFRAME_BRIDGE_CALL_FAILED',
  /** 资源加载失败 */
  RESOURCE_LOAD_FAILED: 'IFRAME_RESOURCE_LOAD_FAILED',
  /** 配置无效 */
  INVALID_CONFIG: 'IFRAME_INVALID_CONFIG',
  /** 渲染失败 */
  RENDER_FAILED: 'IFRAME_RENDER_FAILED',
  /** 未知错误 */
  UNKNOWN_ERROR: 'IFRAME_UNKNOWN_ERROR',
} as const;

export type IframeBridgeErrorCodeType =
  (typeof IframeBridgeErrorCode)[keyof typeof IframeBridgeErrorCode];
