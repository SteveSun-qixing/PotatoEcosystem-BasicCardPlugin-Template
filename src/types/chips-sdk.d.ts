/**
 * @chips/sdk 类型声明存根
 *
 * 这是一个类型声明存根文件，用于在开发时提供类型支持。
 * 实际的 @chips/sdk 包将在运行时由宿主应用提供。
 *
 * ⚠️ 注意：这些类型定义应与实际 SDK 保持同步
 */

declare module '@chips/sdk' {
  /**
   * 插件元数据
   */
  export interface PluginMetadata {
    /** 插件唯一标识符 */
    id: string;
    /** 插件名称 */
    name: string;
    /** 插件版本 */
    version: string;
    /** 薯片协议版本 */
    chipStandardsVersion?: string;
    /** 卡片类型 */
    cardType?: string;
    /** 插件描述 */
    description?: string;
    /** 插件作者 */
    author?: string;
    /** 插件图标 */
    icon?: string;
    /** 支持的语言 */
    supportedLocales?: string[];
    /** 最低内核版本要求 */
    minCoreVersion?: string;
    /** 插件标签 */
    tags?: string[];
  }

  /**
   * 内核请求参数
   */
  export interface CoreRequest {
    /** 服务名称 */
    service: string;
    /** 方法名称 */
    method: string;
    /** 请求载荷 */
    payload?: unknown;
  }

  /**
   * 内核响应
   */
  export interface CoreResponse<T = unknown> {
    /** 是否成功 */
    success: boolean;
    /** 响应数据 */
    data?: T;
    /** 错误信息 */
    error?: {
      code: string;
      message: string;
      details?: unknown;
    };
  }

  /**
   * 服务处理器
   */
  export type ServiceHandler = (payload: unknown) => Promise<unknown>;

  /**
   * 服务注册配置
   */
  export interface ServiceRegistration {
    /** 服务名称 */
    name: string;
    /** 服务处理器 */
    handler: ServiceHandler;
    /** 服务 Schema */
    schema?: {
      input?: Record<string, unknown>;
      output?: Record<string, unknown>;
    };
  }

  /**
   * 薯片内核接口
   */
  export interface ChipsCore {
    /** 发送请求 */
    request<T = unknown>(request: CoreRequest): Promise<CoreResponse<T>>;
    /** 注册服务 */
    registerService(registration: ServiceRegistration): Promise<void>;
    /** 注销服务 */
    unregisterService(name: string): void;
    /** 获取配置 */
    getConfig<T = unknown>(key: string): T | undefined;
    /** 设置配置 */
    setConfig(key: string, value: unknown): void;
  }

  /**
   * 基础卡片插件接口
   */
  export interface BaseCardPlugin {
    /** 插件元数据 */
    readonly metadata: PluginMetadata;
    /** 配置 Schema */
    readonly configSchema: Record<string, unknown>;
    /** 初始化 */
    initialize(core: ChipsCore): Promise<void>;
    /** 销毁 */
    destroy(): Promise<void>;
    /** 创建渲染器 */
    createRenderer(): unknown;
    /** 创建编辑器 */
    createEditor(): unknown;
  }
}
