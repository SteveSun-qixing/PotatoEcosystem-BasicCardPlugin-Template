/**
 * 选项类型定义
 *
 * 渲染器和编辑器的初始化选项。
 */

/**
 * 渲染选项
 *
 * 传递给渲染器的 render() 方法
 */
export interface RenderOptions {
  /** 卡片ID（用于构建 chips:// 资源URI） */
  cardId?: string;

  /**
   * 渲染模式
   * - view: 查看模式，只读展示
   * - edit: 编辑模式，可编辑
   */
  mode: 'view' | 'edit';

  /** 主题包ID */
  theme?: string;

  /** 是否只读 */
  readonly?: boolean;

  /**
   * 是否可交互（点击放大等）
   * @default true
   */
  interactive?: boolean;

  /**
   * 语言环境
   * @default 'zh-CN'
   */
  locale?: string;

  // ⚠️ 添加你的自定义渲染选项
}

/**
 * 编辑器选项
 *
 * 传递给编辑器的 render() 方法
 */
export interface EditorOptions {
  /** 主题包ID */
  theme?: string;

  /**
   * 语言环境
   * @default 'zh-CN'
   */
  locale?: string;

  /**
   * 是否显示工具栏
   * @default true
   */
  toolbar?: boolean;

  /**
   * 是否显示预览
   * @default false
   */
  preview?: boolean;

  /**
   * 是否启用自动保存
   * @default true
   */
  autoSave?: boolean;

  /**
   * 自动保存延迟（毫秒）
   * @default 1000
   */
  saveDelay?: number;

  /** 占位符文本 */
  placeholder?: string;

  /**
   * 资源解析回调
   *
   * 将卡片内相对路径（如 image.png）解析为可访问的 URL
   * 通常由宿主应用提供，使用 chips:// 协议
   */
  onResolveResource?: (resourcePath: string) => Promise<string>;

  /**
   * 资源释放回调
   *
   * 释放由 onResolveResource 创建的资源句柄（如 blob URL）
   * 防止内存泄漏
   */
  onReleaseResolvedResource?: (resourcePath: string) => Promise<void> | void;

  // ⚠️ 添加你的自定义编辑器选项
  // 示例（图片卡片）：
  // /** 允许的最大图片数量 */
  // maxImages?: number;
  // /** 允许的最大单张图片大小（MB） */
  // maxImageSize?: number;
  // /** 允许的图片格式 */
  // acceptedFormats?: string[];
}
