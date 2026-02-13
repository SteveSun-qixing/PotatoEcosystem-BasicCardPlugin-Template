/**
 * 卡片插件 iframe 通信桥接层
 *
 * 封装 iframe 内部与宿主应用之间的 postMessage 通信。
 * 提供类似 window.chips.* 的 API，但通过 postMessage 中转。
 *
 * @packageDocumentation
 * @module CardIframeBridge
 */

import {
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  IframeBridgeErrorCode,
  type CardRuntimeMessage,
  type CardMessageType,
  type InitPayload,
  type BridgeRequestPayload,
  type BridgeResponsePayload,
  type ResourceRequestPayload,
  type ResourceResponsePayload,
  type ResizePayload,
  type ErrorPayload,
  type ThemeUpdatePayload,
  type ConfigChangePayload,
  type HostToIframeMessage,
} from './message-types';

/**
 * 生成唯一消息 ID
 */
function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * 创建标准消息结构
 */
function createMessage<T>(type: CardMessageType, payload: T): CardRuntimeMessage<T> {
  return {
    protocol: PROTOCOL_NAME,
    version: PROTOCOL_VERSION,
    messageId: generateMessageId(),
    type,
    timestamp: new Date().toISOString(),
    payload,
  };
}

/**
 * 验证消息是否为有效的卡片运行时消息
 */
function isValidCardMessage(data: unknown): data is CardRuntimeMessage {
  if (!data || typeof data !== 'object') return false;
  const msg = data as Record<string, unknown>;
  return (
    msg.protocol === PROTOCOL_NAME &&
    typeof msg.version === 'string' &&
    typeof msg.messageId === 'string' &&
    typeof msg.type === 'string' &&
    typeof msg.timestamp === 'string'
  );
}

/**
 * 待处理请求信息
 */
interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

/**
 * Bridge 错误类
 */
export class IframeBridgeError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'IframeBridgeError';
  }
}

/**
 * 事件监听器类型
 */
type EventListener<T = unknown> = (payload: T) => void;

/**
 * iframe 通信桥接类
 *
 * 在 iframe 内部使用，提供与宿主通信的能力。
 */
export class IframeBridge {
  /** 是否已初始化 */
  private initialized = false;

  /** 初始化数据 */
  private initData: InitPayload | null = null;

  /** 待处理的请求 */
  private pendingRequests = new Map<string, PendingRequest>();

  /** 事件监听器 */
  private eventListeners = new Map<string, Set<EventListener>>();

  /** 默认请求超时（毫秒） */
  private readonly defaultTimeout = 10000;

  /** 运行模式 */
  private mode: 'renderer' | 'editor' = 'renderer';

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * 启动桥接
   *
   * 开始监听 postMessage 并发送 ready 消息
   */
  start(mode: 'renderer' | 'editor'): Promise<InitPayload> {
    this.mode = mode;

    return new Promise((resolve, reject) => {
      // 设置初始化超时
      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', this.handleMessage);
        reject(
          new IframeBridgeError(
            IframeBridgeErrorCode.REQUEST_TIMEOUT,
            'Initialization timeout'
          )
        );
      }, this.defaultTimeout);

      // 保存初始化回调
      const initCallback = (data: InitPayload) => {
        clearTimeout(timeoutId);
        this.initialized = true;
        this.initData = data;
        resolve(data);
      };

      // 临时存储初始化回调
      this.pendingRequests.set('__init__', {
        resolve: initCallback as (value: unknown) => void,
        reject,
        timeoutId,
      });

      // 开始监听消息
      window.addEventListener('message', this.handleMessage);

      // 发送 ready 消息
      this.sendReady();
    });
  }

  /**
   * 停止桥接
   */
  stop(): void {
    window.removeEventListener('message', this.handleMessage);

    // 清理所有待处理请求
    for (const [, request] of this.pendingRequests) {
      clearTimeout(request.timeoutId);
      request.reject(new Error('Bridge stopped'));
    }
    this.pendingRequests.clear();

    // 清理事件监听器
    this.eventListeners.clear();

    this.initialized = false;
    this.initData = null;
  }

  /**
   * 获取初始化数据
   */
  getInitData(): InitPayload | null {
    return this.initData;
  }

  /**
   * 获取当前配置
   */
  getConfig(): Record<string, unknown> | null {
    return this.initData?.config ?? null;
  }

  /**
   * 获取主题变量
   */
  getThemeVariables(): Record<string, string> {
    return this.initData?.themeVariables ?? {};
  }

  /**
   * 获取资源 URL
   */
  getResourceUrl(resourceId: string): string | undefined {
    return this.initData?.resourceMap[resourceId];
  }

  /**
   * 调用 Bridge API
   *
   * 通过 postMessage 请求宿主代调 window.chips.invoke
   */
  async invoke<T = unknown>(
    namespace: string,
    action: string,
    params?: unknown,
    timeout?: number
  ): Promise<T> {
    if (!this.initialized) {
      throw new IframeBridgeError(
        IframeBridgeErrorCode.NOT_INITIALIZED,
        'Bridge not initialized'
      );
    }

    const requestId = generateMessageId();
    const effectiveTimeout = timeout ?? this.defaultTimeout;

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(
          new IframeBridgeError(
            IframeBridgeErrorCode.REQUEST_TIMEOUT,
            `Request timeout: ${namespace}.${action}`
          )
        );
      }, effectiveTimeout);

      this.pendingRequests.set(requestId, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeoutId,
      });

      const payload: BridgeRequestPayload = {
        requestId,
        namespace,
        action,
        params,
      };

      this.postMessage('bridge-request', payload);
    });
  }

  /**
   * 请求资源
   *
   * 通过 postMessage 请求宿主解析资源
   */
  async requestResource(
    resourceId: string,
    type?: 'image' | 'video' | 'audio' | 'file' | 'other'
  ): Promise<{ url: string; mimeType?: string }> {
    if (!this.initialized) {
      throw new IframeBridgeError(
        IframeBridgeErrorCode.NOT_INITIALIZED,
        'Bridge not initialized'
      );
    }

    const requestId = generateMessageId();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(
          new IframeBridgeError(
            IframeBridgeErrorCode.REQUEST_TIMEOUT,
            `Resource request timeout: ${resourceId}`
          )
        );
      }, this.defaultTimeout);

      this.pendingRequests.set(requestId, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeoutId,
      });

      const payload: ResourceRequestPayload = {
        requestId,
        resourceId,
        type,
      };

      this.postMessage('resource-request', payload);
    });
  }

  /**
   * 通知尺寸变化
   */
  notifyResize(width: number, height: number, natural = true): void {
    const payload: ResizePayload = { width, height, natural };
    this.postMessage('resize', payload);
  }

  /**
   * 报告错误
   */
  reportError(
    code: string,
    message: string,
    details?: unknown,
    recoverable = true
  ): void {
    const payload: ErrorPayload = {
      code,
      message,
      details,
      recoverable,
    };

    // 开发模式下包含堆栈
    if (process.env.NODE_ENV === 'development') {
      payload.stack = new Error().stack;
    }

    this.postMessage('error', payload);
  }

  /**
   * 通知配置变更（编辑器专用）
   */
  notifyConfigChange(config: Record<string, unknown>, final = false): void {
    if (this.mode !== 'editor') {
      console.warn('notifyConfigChange is only available in editor mode');
      return;
    }

    const payload: ConfigChangePayload = { config, final };
    this.postMessage('config-change', payload);
  }

  /**
   * 监听事件
   */
  on<T = unknown>(event: string, listener: EventListener<T>): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener as EventListener);

    // 返回取消订阅函数
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(listener as EventListener);
        if (listeners.size === 0) {
          this.eventListeners.delete(event);
        }
      }
    };
  }

  /**
   * 监听一次事件
   */
  once<T = unknown>(event: string, listener: EventListener<T>): () => void {
    const wrappedListener: EventListener<T> = (payload) => {
      unsubscribe();
      listener(payload);
    };
    const unsubscribe = this.on(event, wrappedListener);
    return unsubscribe;
  }

  // ============================================
  // 私有方法
  // ============================================

  /**
   * 发送 ready 消息
   */
  private sendReady(): void {
    this.postMessage('ready', {
      mode: this.mode,
      protocolVersion: PROTOCOL_VERSION,
    });
  }

  /**
   * 发送 postMessage
   */
  private postMessage<T>(type: CardMessageType, payload: T): void {
    const message = createMessage(type, payload);
    window.parent.postMessage(message, '*');
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(event: MessageEvent): void {
    // 验证消息格式
    if (!isValidCardMessage(event.data)) {
      return;
    }

    const message = event.data as HostToIframeMessage;

    // 验证协议版本
    if (message.protocol !== PROTOCOL_NAME) {
      return;
    }

    switch (message.type) {
      case 'init':
        this.handleInit(message.payload as InitPayload);
        break;
      case 'bridge-response':
        this.handleBridgeResponse(message.payload as BridgeResponsePayload);
        break;
      case 'resource-response':
        this.handleResourceResponse(message.payload as ResourceResponsePayload);
        break;
      case 'theme-update':
        this.handleThemeUpdate(message.payload as ThemeUpdatePayload);
        break;
      case 'dispose':
        this.handleDispose();
        break;
    }
  }

  /**
   * 处理初始化消息
   */
  private handleInit(payload: InitPayload): void {
    const pending = this.pendingRequests.get('__init__');
    if (pending) {
      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete('__init__');
      pending.resolve(payload);
    }
  }

  /**
   * 处理 Bridge 响应
   */
  private handleBridgeResponse(payload: BridgeResponsePayload): void {
    const pending = this.pendingRequests.get(payload.requestId);
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(payload.requestId);

    if (payload.success) {
      pending.resolve(payload.data);
    } else {
      pending.reject(
        new IframeBridgeError(
          payload.error?.code ?? IframeBridgeErrorCode.BRIDGE_CALL_FAILED,
          payload.error?.message ?? 'Bridge call failed',
          payload.error?.details
        )
      );
    }
  }

  /**
   * 处理资源响应
   */
  private handleResourceResponse(payload: ResourceResponsePayload): void {
    const pending = this.pendingRequests.get(payload.requestId);
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(payload.requestId);

    if (payload.success && payload.url) {
      pending.resolve({ url: payload.url, mimeType: payload.mimeType });
    } else {
      pending.reject(
        new IframeBridgeError(
          payload.error?.code ?? IframeBridgeErrorCode.RESOURCE_LOAD_FAILED,
          payload.error?.message ?? 'Resource load failed'
        )
      );
    }
  }

  /**
   * 处理主题更新
   */
  private handleThemeUpdate(payload: ThemeUpdatePayload): void {
    if (this.initData) {
      this.initData.themeId = payload.themeId;
      this.initData.themeVariables = payload.themeVariables;
    }

    // 触发事件
    this.emit('theme-update', payload);
  }

  /**
   * 处理销毁通知
   */
  private handleDispose(): void {
    this.emit('dispose', undefined);
    this.stop();
  }

  /**
   * 触发事件
   */
  private emit(event: string, payload: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
  }
}

/**
 * 全局 bridge 实例
 */
let globalBridge: IframeBridge | null = null;

/**
 * 获取全局 bridge 实例
 */
export function getBridge(): IframeBridge {
  if (!globalBridge) {
    globalBridge = new IframeBridge();
  }
  return globalBridge;
}

/**
 * 初始化并启动 bridge
 */
export async function initBridge(mode: 'renderer' | 'editor'): Promise<InitPayload> {
  const bridge = getBridge();
  return bridge.start(mode);
}

/**
 * 停止 bridge
 */
export function stopBridge(): void {
  if (globalBridge) {
    globalBridge.stop();
    globalBridge = null;
  }
}

// 导出类型
export type { InitPayload, ThemeUpdatePayload };
