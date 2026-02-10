/**
 * 配置类型定义
 *
 * 定义卡片配置文件（content/{ID}.yaml）中的数据结构。
 * ⚠️ 根据你的卡片类型修改配置接口
 */

/**
 * 布局配置
 *
 * 通用布局参数，所有基础卡片都支持
 */
export interface TemplateLayoutConfig {
  /** 高度模式：auto-自适应，fixed-固定高度 */
  height_mode?: 'auto' | 'fixed';
  /** 固定高度值（像素），height_mode=fixed 时使用 */
  fixed_height?: number;
}

/**
 * 模板卡片配置
 *
 * 这是核心配置接口，对应 content/{ID}.yaml 文件内容。
 * ⚠️ 根据你的卡片需求修改此接口
 *
 * @example
 * ```yaml
 * # content/a1B2c3D4e5.yaml
 * card_type: TemplateCard
 * theme: ""
 * layout:
 *   height_mode: auto
 * # ... 你的自定义字段
 * ```
 */
export interface TemplateCardConfig {
  /** 卡片类型标识，固定值 ⚠️ 修改为你的卡片类型 */
  card_type: 'TemplateCard';

  /** 主题包标识，为空则使用上级主题 */
  theme?: string;

  /** 布局参数 */
  layout?: TemplateLayoutConfig;

  // ⚠️ 在这里添加你的自定义字段
  // 示例（图片卡片）：
  // /** 图片列表 */
  // images: ImageItem[];
  // /** 排版类型 */
  // layout_type: 'single' | 'grid' | 'long-scroll';
  //
  // 示例（富文本卡片）：
  // /** 内容来源 */
  // content_source: 'file' | 'inline';
  // /** 内联HTML内容 */
  // content_text?: string;
}
