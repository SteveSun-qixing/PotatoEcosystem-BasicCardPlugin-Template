/**
 * 选项类型定义
 */

/**
 * 渲染选项
 */
export interface RenderOptions {
  /** 渲染模式 */
  mode: 'view' | 'edit';
  
  /** 主题ID */
  theme?: string;
  
  /** 是否只读 */
  readonly?: boolean;
  
  /** 是否可交互 */
  interactive?: boolean;
  
  /** 语言代码 */
  locale?: string;
  
  // ⚠️ 添加你的自定义选项
}

/**
 * 编辑器选项
 */
export interface EditorOptions {
  /** 主题ID */
  theme?: string;
  
  /** 语言代码 */
  locale?: string;
  
  /** 是否显示工具栏 */
  toolbar?: boolean;
  
  /** 是否显示预览 */
  preview?: boolean;
  
  /** 是否自动保存 */
  autoSave?: boolean;
  
  /** 自动保存延迟（毫秒） */
  saveDelay?: number;
  
  /** 占位符文本 */
  placeholder?: string;
  
  // ⚠️ 添加你的自定义选项
}
