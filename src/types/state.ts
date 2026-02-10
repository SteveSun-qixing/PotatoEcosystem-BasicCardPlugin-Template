/**
 * 状态类型定义
 *
 * 渲染器和编辑器的内部运行状态。
 * ⚠️ 根据你的卡片类型添加自定义状态字段
 */

/**
 * 渲染器状态
 */
export interface TemplateRendererState {
  /** 是否正在加载 */
  isLoading: boolean;

  /** 错误信息 */
  error: string | null;

  /** 当前主题ID */
  currentTheme: string;

  /** 容器宽度（像素） */
  containerWidth: number;

  // ⚠️ 添加你的自定义渲染器状态字段
  // 示例（图片卡片）：
  // /** 已加载的图片URL列表 */
  // loadedImages: string[];
  // /** 当前滚动位置 */
  // scrollPosition: number;
  //
  // 示例（富文本卡片）：
  // /** 当前HTML内容 */
  // content: string;
}

/**
 * 编辑器状态
 */
export interface TemplateEditorState {
  /** 是否有未保存的修改 */
  isDirty: boolean;

  /** 是否可以撤销 */
  canUndo: boolean;

  /** 是否可以重做 */
  canRedo: boolean;

  // ⚠️ 添加你的自定义编辑器状态字段
  // 示例（图片卡片）：
  // /** 是否正在上传 */
  // isUploading: boolean;
  // /** 上传进度 (0-100) */
  // uploadProgress: number;
  // /** 当前选中的项目ID */
  // selectedItemId: string | null;
  //
  // 示例（富文本卡片）：
  // /** 当前HTML内容 */
  // content: string;
  // /** 字数统计 */
  // wordCount: number;
  // /** 是否聚焦 */
  // isFocused: boolean;
}
