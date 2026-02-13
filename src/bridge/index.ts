/**
 * Bridge 模块导出
 *
 * 提供 iframe 与宿主通信的所有类型和工具
 */

// 导出消息类型
export {
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  IframeBridgeErrorCode,
  type CardMessageType,
  type CardRuntimeMessage,
  type InitPayload,
  type BridgeRequestPayload,
  type BridgeResponsePayload,
  type ResourceRequestPayload,
  type ResourceResponsePayload,
  type ResizePayload,
  type ErrorPayload,
  type ThemeUpdatePayload,
  type ConfigChangePayload,
  type ReadyPayload,
  type DisposePayload,
  type HostToIframeMessage,
  type IframeToHostMessage,
  type AnyCardMessage,
  type IframeBridgeErrorCodeType,
} from './message-types';

// 导出 Bridge 类和工具函数
export {
  IframeBridge,
  IframeBridgeError,
  getBridge,
  initBridge,
  stopBridge,
} from './iframe-bridge';
