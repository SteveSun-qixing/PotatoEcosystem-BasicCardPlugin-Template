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
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      await expect(plugin.initialize(mockCore as any)).resolves.not.toThrow();
    });

    it('should not initialize twice', async () => {
      await plugin.initialize(mockCore as any);
      await plugin.initialize(mockCore as any);
      // 应该只初始化一次
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
  });

  describe('validateConfig', () => {
    it('should validate correct config', () => {
      const config = {
        card_type: 'TemplateCard',
      };
      expect(plugin.validateConfig(config)).toBe(true);
    });

    it('should reject invalid config', () => {
      const config = {
        card_type: 'WrongType',
      };
      expect(plugin.validateConfig(config)).toBe(false);
    });

    it('should reject non-object config', () => {
      expect(plugin.validateConfig(null)).toBe(false);
      expect(plugin.validateConfig('string')).toBe(false);
    });
  });
});
