/**
 * 国际化工具
 *
 * ⚠️ 重要：所有界面文本必须使用多语言系统，零硬编码
 *
 * 工作流程：
 * 1. 开发时使用词汇 key（如 'editor.upload'）
 * 2. 词汇定义在 assets/i18n/dev_vocabulary.yaml
 * 3. 构建时自动替换为系统编码（如 'i18n.plugin.400001'）
 * 4. 运行时系统根据当前语言返回翻译文本
 */

// ⚠️ 正式环境应该从 @chips/i18n 导入
// import { t as systemT } from '@chips/i18n';

/**
 * 开发阶段词汇表
 *
 * ⚠️ 实际应从 assets/i18n/dev_vocabulary.yaml 加载
 * ⚠️ 修改词汇内容以匹配你的卡片类型
 */
const DEV_VOCABULARY: Record<string, string> = {
  // 插件生命周期
  'plugin.initialized': '插件已初始化',
  'plugin.already_initialized': '插件已经初始化',
  'plugin.not_initialized': '插件未初始化',
  'plugin.started': '插件已启动',
  'plugin.stopped': '插件已停止',
  'plugin.destroyed': '插件已销毁',

  // 渲染器
  'renderer.loading': '正在加载...',
  'renderer.render_success': '渲染成功',
  'renderer.render_failed': '渲染失败',

  // 编辑器
  'editor.placeholder': '请输入内容...',
  'editor.save_success': '保存成功',
  'editor.save_failed': '保存失败',

  // 工具栏
  'toolbar.undo': '撤销',
  'toolbar.redo': '重做',

  // 错误
  'error.invalid_config': '配置无效',
  'error.missing_field': '缺少必需字段: {field}',
  'error.load_failed': '加载失败',
  'error.resource_not_found': '资源未找到',
  'error.render_failed': '渲染失败: {reason}',
  'error.upload_failed': '上传失败',

  // 确认对话框
  'confirm.delete': '确定要删除吗？',
  'confirm.discard_changes': '放弃未保存的更改吗？',

  // 状态
  'status.loading': '加载中...',
  'status.saving': '保存中...',
  'status.ready': '就绪',

  // 日志
  'log.renderer_created': '渲染器已创建',
  'log.editor_created': '编辑器已创建',
  'log.service_registered': '服务已注册: {service}',

  // 通用
  'common.ok': '确定',
  'common.cancel': '取消',
  'common.save': '保存',
  'common.delete': '删除',
  'common.close': '关闭',
};

/**
 * 规范化键名
 *
 * 支持去除插件特定前缀，例如 'template.editor.upload' → 'editor.upload'
 * ⚠️ 修改前缀匹配为你的插件名
 */
function normalizeKey(key: string): string {
  if (key.startsWith('template.')) {
    return key.slice('template.'.length);
  }
  return key;
}

/**
 * 获取翻译文本
 *
 * @param key - 翻译键（开发时使用，构建时替换为系统编码）
 * @param vars - 变量替换
 * @returns 翻译后的文本
 *
 * @example
 * ```typescript
 * // 开发时
 * t('editor.placeholder')  // → "请输入内容..."
 *
 * // 构建后
 * t('i18n.plugin.400001')  // → 系统根据当前语言返回翻译
 *
 * // 带变量
 * t('error.missing_field', { field: 'title' })
 * // → "缺少必需字段: title"
 * ```
 */
export function t(key: string, vars?: Record<string, unknown>): string {
  // ⚠️ 正式环境应该调用系统多语言 API
  // return systemT(key, vars);

  const normalizedKey = normalizeKey(key);
  let text = DEV_VOCABULARY[normalizedKey] || key;

  // 变量替换
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return text;
}

/**
 * 检查键是否存在于词汇表中
 */
export function hasKey(key: string): boolean {
  return normalizeKey(key) in DEV_VOCABULARY;
}

/**
 * 获取所有词汇键
 */
export function getAllKeys(): string[] {
  return Object.keys(DEV_VOCABULARY);
}
