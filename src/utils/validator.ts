/**
 * 配置验证工具
 *
 * ⚠️ 根据你的卡片配置结构实现具体的验证逻辑
 */

import type { TemplateCardConfig } from '../types/config';
import type { ValidationResult, ValidationError } from '../types/validation';
import { DEFAULT_CONFIG } from '../types/constants';

/**
 * 验证卡片配置
 *
 * 分层验证：先验证对象类型 → 再验证必需字段 → 再验证可选字段
 *
 * @param config - 待验证的配置
 * @returns 验证结果
 *
 * ⚠️ 添加你的自定义验证逻辑
 */
export function validateConfig(config: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. 检查是否为对象
  if (!config || typeof config !== 'object') {
    return {
      valid: false,
      errors: [
        {
          field: 'config',
          message: '配置必须是对象',
          code: 'INVALID_TYPE',
        },
      ],
    };
  }

  const cfg = config as Record<string, unknown>;

  // 2. 验证必需字段：card_type
  if (cfg.card_type !== 'TemplateCard') { // ⚠️ 修改为你的卡片类型
    errors.push({
      field: 'card_type',
      message: 'card_type 必须为 TemplateCard',
      code: 'INVALID_CARD_TYPE',
    });
  }

  // 3. 验证 layout（可选字段）
  if (cfg.layout !== undefined) {
    if (typeof cfg.layout !== 'object' || cfg.layout === null) {
      errors.push({
        field: 'layout',
        message: 'layout 必须是对象',
        code: 'INVALID_LAYOUT',
      });
    } else {
      const layout = cfg.layout as Record<string, unknown>;

      if (
        layout.height_mode !== undefined &&
        !['auto', 'fixed'].includes(layout.height_mode as string)
      ) {
        errors.push({
          field: 'layout.height_mode',
          message: 'height_mode 必须为 auto 或 fixed',
          code: 'INVALID_HEIGHT_MODE',
        });
      }

      if (layout.fixed_height !== undefined) {
        if (typeof layout.fixed_height !== 'number' || layout.fixed_height <= 0) {
          errors.push({
            field: 'layout.fixed_height',
            message: 'fixed_height 必须为正整数',
            code: 'INVALID_FIXED_HEIGHT',
          });
        }
      }
    }
  }

  // ⚠️ 添加你的自定义验证逻辑
  // 示例：
  // if (!Array.isArray(cfg.images)) {
  //   errors.push({ field: 'images', message: 'images必须是数组', code: 'INVALID_IMAGES' });
  // }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 获取默认配置（深拷贝）
 */
export function getDefaultConfig(): TemplateCardConfig {
  return {
    ...DEFAULT_CONFIG,
    layout: DEFAULT_CONFIG.layout ? { ...DEFAULT_CONFIG.layout } : undefined,
  };
}

/**
 * 合并默认配置（深合并）
 *
 * @param config - 用户提供的部分配置
 * @returns 与默认配置合并后的完整配置
 */
export function mergeDefaults(
  config: Partial<TemplateCardConfig>
): TemplateCardConfig {
  const defaults = getDefaultConfig();

  return {
    ...defaults,
    ...config,
    layout: {
      ...defaults.layout,
      ...config.layout,
    },
  };
}
