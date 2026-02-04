/**
 * 常量定义
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
 * CSS类名前缀
 * 用于生成组件CSS类名
 */
export const CSS_PREFIX = 'chips-template'; // ⚠️ 修改为你的前缀

/**
 * CSS变量名
 * 用于主题系统
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
  
  // ⚠️ 添加你的CSS变量
} as const;

/**
 * 错误代码
 * ⚠️ 定义你的错误代码
 */
export const ERROR_CODES = {
  // 配置错误
  INVALID_CONFIG: 'TEMPLATE-E1001',
  MISSING_FIELD: 'TEMPLATE-E1002',
  
  // 资源错误
  LOAD_FAILED: 'TEMPLATE-E2001',
  RESOURCE_NOT_FOUND: 'TEMPLATE-E2002',
  
  // 运行时错误
  RENDER_FAILED: 'TEMPLATE-E3001',
  EDIT_FAILED: 'TEMPLATE-E3002',
  
  // ⚠️ 添加你的错误代码
} as const;
