/**
 * 插件主类单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateCardPlugin } from '../../src/plugin';
import { createMockCore } from '../setup';

describe('TemplateCardPlugin', () => {
  let plugin: TemplateCardPlugin;
  let mockCore: ReturnType<typeof createMockCore>;

  beforeEach(() => {
    plugin = new TemplateCardPlugin();
    mockCore = createMockCore();
  });

  describe('metadata', () => {
    it('should have correct metadata', () => {
      expect(plugin.metadata).toBeDefined();
      expect(plugin.metadata.id).toBe('chipshub:template-card');
      expect(plugin.metadata.cardType).toBe('TemplateCard');
      expect(plugin.metadata.version).toBe('1.0.0');
    });

    it('should have chipStandardsVersion', () => {
      expect(plugin.metadata.chipStandardsVersion).toBe('1.0.0');
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      await expect(plugin.initialize(mockCore as any)).resolves.not.toThrow();
    });

    it('should register services on initialize', async () => {
      await plugin.initialize(mockCore as any);
      expect(mockCore.registerService).toHaveBeenCalled();
    });

    it('should not initialize twice', async () => {
      await plugin.initialize(mockCore as any);
      // 第二次调用不应报错
      await expect(plugin.initialize(mockCore as any)).resolves.not.toThrow();
      // registerService 只被调用一次
      expect(mockCore.registerService).toHaveBeenCalledTimes(1);
    });
  });

  describe('lifecycle', () => {
    beforeEach(async () => {
      await plugin.initialize(mockCore as any);
    });

    it('should start successfully', async () => {
      await expect(plugin.start()).resolves.not.toThrow();
    });

    it('should stop successfully', async () => {
      await expect(plugin.stop()).resolves.not.toThrow();
    });

    it('should destroy successfully', async () => {
      await expect(plugin.destroy()).resolves.not.toThrow();
    });

    it('should throw on start without initialize', async () => {
      const freshPlugin = new TemplateCardPlugin();
      await expect(freshPlugin.start()).rejects.toThrow();
    });
  });

  describe('factory methods', () => {
    it('should create renderer', () => {
      const renderer = plugin.createRenderer();
      expect(renderer).toBeDefined();
    });

    it('should create editor', () => {
      const editor = plugin.createEditor();
      expect(editor).toBeDefined();
    });

    it('should inject core into renderer when initialized', async () => {
      await plugin.initialize(mockCore as any);
      const renderer = plugin.createRenderer();
      expect(renderer).toBeDefined();
    });

    it('should inject core into editor when initialized', async () => {
      await plugin.initialize(mockCore as any);
      const editor = plugin.createEditor();
      expect(editor).toBeDefined();
    });
  });

  describe('validateConfig', () => {
    it('should validate correct config', () => {
      const config = { card_type: 'TemplateCard' };
      expect(plugin.validateConfig(config)).toBe(true);
    });

    it('should reject wrong card_type', () => {
      const config = { card_type: 'WrongType' };
      expect(plugin.validateConfig(config)).toBe(false);
    });

    it('should reject null config', () => {
      expect(plugin.validateConfig(null)).toBe(false);
    });

    it('should reject string config', () => {
      expect(plugin.validateConfig('string')).toBe(false);
    });

    it('should reject undefined config', () => {
      expect(plugin.validateConfig(undefined)).toBe(false);
    });
  });

  describe('configSchema', () => {
    it('should have valid schema structure', () => {
      expect(plugin.configSchema).toBeDefined();
      expect(plugin.configSchema.type).toBe('object');
      expect(plugin.configSchema.required).toContain('card_type');
      expect(plugin.configSchema.properties.card_type).toBeDefined();
    });
  });
});
