/**
 * 配置验证工具
 */

import type { TemplateCardConfig, ValidationResult } from '../types';
import { DEFAULT_CONFIG } from '../types';

/**
 * 验证配置
 * ⚠️ 实现你的验证逻辑
 */
export function validateConfig(config: unknown): ValidationResult {
  const errors: ValidationResult['errors'] = [];

  if (!config || typeof config !== 'object') {
    errors.push({
      field: 'config',
      message: 'Config must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  const cfg = config as Record<string, unknown>;

  // 验证必需字段
  if (cfg.card_type !== 'TemplateCard') { // ⚠️ 修改为你的卡片类型
    errors.push({
      field: 'card_type',
      message: 'Invalid card type',
      code: 'INVALID_CARD_TYPE',
    });
  }

  // ⚠️ 添加你的验证逻辑

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): TemplateCardConfig {
  return { ...DEFAULT_CONFIG };
}

/**
 * 合并默认配置
 */
export function mergeDefaults(
  config: Partial<TemplateCardConfig>
): TemplateCardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}
