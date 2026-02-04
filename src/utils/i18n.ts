/**
 * 多语言工具
 * 
 * ⚠️ 重要：所有文本必须使用多语言系统
 * 开发时使用key，构建时自动替换为系统编码
 */

// ⚠️ 实际应该从 @chips/i18n 导入
// import { t as i18nT } from '@chips/i18n';

/**
 * 获取翻译文本
 * 
 * @param key - 翻译key，格式：'namespace.key'
 * @param vars - 变量替换
 * @returns 翻译后的文本
 * 
 * @example
 * ```typescript
 * t('template.title') // 开发时返回key对应的文本
 * t('template.welcome', { name: '张三' }) // "欢迎，张三！"
 * ```
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  // ⚠️ 临时实现，实际应该调用系统多语言API
  let text = `[${key}]`; // 开发时显示key
  
  // 简单的变量替换
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  
  return text;

  // ⚠️ 正确的实现应该是：
  // return i18nT(key, vars);
}
