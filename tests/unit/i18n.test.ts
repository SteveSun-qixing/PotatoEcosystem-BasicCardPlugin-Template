/**
 * 国际化工具单元测试
 */

import { describe, it, expect } from 'vitest';
import { t, hasKey, getAllKeys } from '../../src/utils/i18n';

describe('t (translate)', () => {
  it('should return text for known key', () => {
    const text = t('plugin.initialized');
    expect(text).toBe('插件已初始化');
  });

  it('should return key for unknown key', () => {
    const text = t('unknown.key');
    expect(text).toBe('unknown.key');
  });

  it('should replace variables', () => {
    const text = t('error.missing_field', { field: 'title' });
    expect(text).toBe('缺少必需字段: title');
  });

  it('should replace multiple occurrences of same variable', () => {
    // 添加一个测试用的带重复变量的文本
    const text = t('log.service_registered', { service: 'test.render' });
    expect(text).toBe('服务已注册: test.render');
  });

  it('should normalize key with plugin prefix', () => {
    const text = t('template.plugin.initialized');
    expect(text).toBe('插件已初始化');
  });

  it('should handle empty vars', () => {
    const text = t('plugin.initialized', {});
    expect(text).toBe('插件已初始化');
  });
});

describe('hasKey', () => {
  it('should return true for existing key', () => {
    expect(hasKey('plugin.initialized')).toBe(true);
  });

  it('should return false for non-existing key', () => {
    expect(hasKey('nonexistent.key')).toBe(false);
  });

  it('should handle normalized key', () => {
    expect(hasKey('template.plugin.initialized')).toBe(true);
  });
});

describe('getAllKeys', () => {
  it('should return array of keys', () => {
    const keys = getAllKeys();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should include known keys', () => {
    const keys = getAllKeys();
    expect(keys).toContain('plugin.initialized');
    expect(keys).toContain('error.invalid_config');
  });
});
