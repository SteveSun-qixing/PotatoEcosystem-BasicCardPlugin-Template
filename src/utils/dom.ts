/**
 * DOM 和通用工具函数
 *
 * 提供基础卡片插件开发中常用的工具函数。
 */

/**
 * 生成十位 62 进制 ID
 *
 * 使用加密安全的随机数生成器。符合薯片生态 ID 规范。
 *
 * @returns 10 位由 0-9、a-z、A-Z 组成的字符串
 *
 * @example
 * ```typescript
 * const id = generateId(); // "a1B2c3D4e5"
 * ```
 */
export function generateId(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  const array = new Uint8Array(10);

  // 优先使用加密安全随机数
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 10; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < 10; i++) {
    id += chars.charAt(array[i] % chars.length);
  }

  return id;
}

/**
 * 转义 HTML 特殊字符
 *
 * 防止 XSS 注入攻击
 *
 * @param str - 原始字符串
 * @returns 转义后的安全字符串
 */
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 防抖函数
 *
 * 在最后一次调用后延迟执行
 *
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数
 *
 * 在固定时间间隔内最多执行一次
 *
 * @param fn - 要节流的函数
 * @param delay - 间隔时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 数组元素移动
 *
 * 将数组中的元素从一个位置移到另一个位置
 *
 * @param arr - 源数组
 * @param fromIndex - 源位置
 * @param toIndex - 目标位置
 * @returns 新数组
 */
export function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  if (removed !== undefined) {
    result.splice(toIndex, 0, removed);
  }
  return result;
}
