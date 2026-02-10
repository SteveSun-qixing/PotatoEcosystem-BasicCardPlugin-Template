/**
 * 工具函数统一导出
 */

// 配置验证
export { validateConfig, getDefaultConfig, mergeDefaults } from './validator';

// 国际化
export { t, hasKey, getAllKeys } from './i18n';

// DOM 工具
export {
  generateId,
  escapeHtml,
  debounce,
  throttle,
  arrayMove,
} from './dom';
