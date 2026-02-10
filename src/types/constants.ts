/**
 * 常量定义
 *
 * ⚠️ 修改所有常量中的 "template" 为你的卡片类型名
 */

import type { TemplateCardConfig } from './config';

/**
 * 默认配置
 * ⚠️ 定义你的卡片默认配置
 */
export const DEFAULT_CONFIG: TemplateCardConfig = {
  card_type: 'TemplateCard', // ⚠️ 修改为你的卡片类型
  theme: '',
  layout: {
    height_mode: 'auto',
  },
  // ⚠️ 添加你的默认字段值
};

/**
 * CSS 类名前缀
 *
 * 用于生成组件 CSS 类名，避免样式冲突
 * ⚠️ 修改为你的前缀
 */
export const CSS_PREFIX = 'chips-template';

/**
 * CSS 变量名
 *
 * 用于主题系统注入样式。插件只定义变量名，具体值由主题包提供。
 */
export const CSS_VARS = {
  // 颜色
  textColor: `--${CSS_PREFIX}-text-color`,
  bgColor: `--${CSS_PREFIX}-bg-color`,
  borderColor: `--${CSS_PREFIX}-border-color`,

  // 字体
  fontFamily: `--${CSS_PREFIX}-font-family`,
  fontSize: `--${CSS_PREFIX}-font-size`,
  lineHeight: `--${CSS_PREFIX}-line-height`,

  // 间距
  padding: `--${CSS_PREFIX}-padding`,
  margin: `--${CSS_PREFIX}-margin`,

  // ⚠️ 添加你的 CSS 变量
} as const;
