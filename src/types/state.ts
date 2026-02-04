/**
 * 状态类型定义
 */

/**
 * 渲染器状态
 */
export interface TemplateRendererState {
  /** 当前内容 */
  content: string;
  
  /** 是否正在加载 */
  isLoading: boolean;
  
  /** 错误信息 */
  error: string | null;
  
  // ⚠️ 添加你的自定义状态字段
}

/**
 * 编辑器状态
 */
export interface TemplateEditorState {
  /** 当前内容 */
  content: string;
  
  /** 是否有未保存的修改 */
  isDirty: boolean;
  
  /** 是否可以撤销 */
  canUndo: boolean;
  
  /** 是否可以重做 */
  canRedo: boolean;
  
  // ⚠️ 添加你的自定义状态字段
  // 示例：
  // /** 当前选区 */
  // selection?: SelectionRange;
  // 
  // /** 字数统计 */
  // wordCount?: number;
}
