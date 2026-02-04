/**
 * 配置类型定义
 * ⚠️ 定义你的卡片配置结构
 */

/**
 * 布局配置
 */
export interface TemplateLayoutConfig {
  /** 高度模式：auto-自适应，fixed-固定高度 */
  height_mode?: 'auto' | 'fixed';
  /** 固定高度值（像素） */
  fixed_height?: number;
}

/**
 * 模板卡片配置
 * ⚠️ 这是核心配置接口，根据你的卡片需求修改
 */
export interface TemplateCardConfig {
  /** 卡片类型，固定值 */
  card_type: 'TemplateCard'; // ⚠️ 修改为你的卡片类型
  
  /** 主题包标识，为空则使用上级主题 */
  theme?: string;
  
  /** 布局配置 */
  layout?: TemplateLayoutConfig;
  
  // ⚠️ 在这里添加你的自定义字段
  // 示例：
  // /** 标题 */
  // title?: string;
  // 
  // /** 内容 */
  // content?: string;
  // 
  // /** 是否只读 */
  // readonly?: boolean;
}
