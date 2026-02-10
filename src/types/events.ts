/**
 * 事件类型定义
 *
 * 定义插件内部事件的数据结构，用于编辑器和渲染器的事件通信。
 * ⚠️ 根据你的卡片类型修改事件定义
 */

import type { TemplateCardConfig } from './config';

/**
 * 配置变更事件
 *
 * 当编辑器修改了卡片配置时发出
 */
export interface TemplateChangeEvent {
  /** 事件类型 */
  type: 'change';
  /** 最新的配置 */
  config: TemplateCardConfig;
  /** 是否为用户操作触发 */
  isUserAction: boolean;
  /** 事件时间戳 */
  timestamp: number;
}

// ⚠️ 添加你的自定义事件类型
// 示例：
// export interface TemplateSelectEvent {
//   type: 'select';
//   itemId: string;
// }

/**
 * 编辑器事件映射
 * ⚠️ 添加你的事件处理器签名
 */
export interface EditorEvents {
  /** 配置变更事件 */
  change: (event: TemplateChangeEvent) => void;

  // ⚠️ 添加更多编辑器事件
  // select: (event: TemplateSelectEvent) => void;
}

/**
 * 渲染器事件映射（可选）
 * ⚠️ 如果渲染器需要对外发出事件，在这里定义
 */
export interface RendererEvents {
  // ⚠️ 添加渲染器事件
  // 示例：
  // click: (event: { itemId: string; index: number }) => void;
}
