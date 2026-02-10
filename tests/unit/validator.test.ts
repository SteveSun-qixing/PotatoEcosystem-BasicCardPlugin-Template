/**
 * 配置验证器单元测试
 */

import { describe, it, expect } from 'vitest';
import { validateConfig, getDefaultConfig, mergeDefaults } from '../../src/utils/validator';

describe('validateConfig', () => {
  it('should accept valid config', () => {
    const result = validateConfig({ card_type: 'TemplateCard' });
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should reject null', () => {
    const result = validateConfig(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].code).toBe('INVALID_TYPE');
  });

  it('should reject non-object', () => {
    const result = validateConfig('string');
    expect(result.valid).toBe(false);
  });

  it('should reject wrong card_type', () => {
    const result = validateConfig({ card_type: 'WrongType' });
    expect(result.valid).toBe(false);
    expect(result.errors!.some((e) => e.code === 'INVALID_CARD_TYPE')).toBe(true);
  });

  it('should accept valid layout', () => {
    const result = validateConfig({
      card_type: 'TemplateCard',
      layout: { height_mode: 'auto' },
    });
    expect(result.valid).toBe(true);
  });

  it('should accept fixed height layout', () => {
    const result = validateConfig({
      card_type: 'TemplateCard',
      layout: { height_mode: 'fixed', fixed_height: 300 },
    });
    expect(result.valid).toBe(true);
  });

  it('should reject invalid height_mode', () => {
    const result = validateConfig({
      card_type: 'TemplateCard',
      layout: { height_mode: 'invalid' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors!.some((e) => e.code === 'INVALID_HEIGHT_MODE')).toBe(true);
  });

  it('should reject negative fixed_height', () => {
    const result = validateConfig({
      card_type: 'TemplateCard',
      layout: { fixed_height: -100 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors!.some((e) => e.code === 'INVALID_FIXED_HEIGHT')).toBe(true);
  });

  it('should reject non-object layout', () => {
    const result = validateConfig({
      card_type: 'TemplateCard',
      layout: 'invalid',
    });
    expect(result.valid).toBe(false);
    expect(result.errors!.some((e) => e.code === 'INVALID_LAYOUT')).toBe(true);
  });
});

describe('getDefaultConfig', () => {
  it('should return default config', () => {
    const config = getDefaultConfig();
    expect(config.card_type).toBe('TemplateCard');
    expect(config.theme).toBe('');
    expect(config.layout?.height_mode).toBe('auto');
  });

  it('should return a deep copy', () => {
    const config1 = getDefaultConfig();
    const config2 = getDefaultConfig();
    expect(config1).toEqual(config2);
    expect(config1).not.toBe(config2);
    expect(config1.layout).not.toBe(config2.layout);
  });
});

describe('mergeDefaults', () => {
  it('should merge with defaults', () => {
    const config = mergeDefaults({ card_type: 'TemplateCard' });
    expect(config.card_type).toBe('TemplateCard');
    expect(config.theme).toBe('');
    expect(config.layout?.height_mode).toBe('auto');
  });

  it('should override defaults', () => {
    const config = mergeDefaults({
      card_type: 'TemplateCard',
      theme: 'my-theme',
    });
    expect(config.theme).toBe('my-theme');
  });

  it('should deep merge layout', () => {
    const config = mergeDefaults({
      card_type: 'TemplateCard',
      layout: { fixed_height: 500 },
    });
    expect(config.layout?.height_mode).toBe('auto');
    expect(config.layout?.fixed_height).toBe(500);
  });
});
