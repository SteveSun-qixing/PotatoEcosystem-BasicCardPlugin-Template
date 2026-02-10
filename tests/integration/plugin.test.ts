/**
 * 插件集成测试
 *
 * 测试插件完整的生命周期流程
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TemplateCardPlugin } from '../../src/plugin';
import { createMockCore } from '../setup';

describe('Plugin Integration', () => {
  let plugin: TemplateCardPlugin;
  let mockCore: ReturnType<typeof createMockCore>;

  beforeEach(() => {
    plugin = new TemplateCardPlugin();
    mockCore = createMockCore();
  });

  afterEach(async () => {
    try {
      await plugin.destroy();
    } catch {
      // ignore
    }
  });

  it('should complete full lifecycle', async () => {
    // 初始化
    await plugin.initialize(mockCore as any);

    // 启动
    await plugin.start();

    // 创建渲染器和编辑器
    const renderer = plugin.createRenderer();
    expect(renderer).toBeDefined();

    const editor = plugin.createEditor();
    expect(editor).toBeDefined();

    // 验证配置
    const validConfig = { card_type: 'TemplateCard' };
    expect(plugin.validateConfig(validConfig)).toBe(true);

    const invalidConfig = { card_type: 'Wrong' };
    expect(plugin.validateConfig(invalidConfig)).toBe(false);

    // 停止
    await plugin.stop();

    // 销毁
    await plugin.destroy();
  });

  it('should register services on initialization', async () => {
    await plugin.initialize(mockCore as any);

    // 验证服务注册被调用
    expect(mockCore.registerService).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'template.render',
      })
    );
  });

  it('should handle renderer lifecycle', async () => {
    await plugin.initialize(mockCore as any);

    const renderer = plugin.createRenderer();

    // 渲染到容器
    const container = document.createElement('div');
    await renderer.render(
      { card_type: 'TemplateCard', theme: '' },
      container,
      { mode: 'view' }
    );

    // 验证容器有内容
    expect(container.innerHTML).not.toBe('');

    // 获取状态
    const state = renderer.getState();
    expect(state.isLoading).toBe(false);

    // 销毁
    await renderer.destroy();
  });

  it('should handle editor lifecycle', async () => {
    await plugin.initialize(mockCore as any);

    const editor = plugin.createEditor();

    // 渲染到容器
    const container = document.createElement('div');
    await editor.render(
      { card_type: 'TemplateCard', theme: '' },
      container,
      { toolbar: true }
    );

    // 获取配置
    const config = editor.getConfig();
    expect(config.card_type).toBe('TemplateCard');

    // 验证
    const validation = editor.validate();
    expect(validation.valid).toBe(true);

    // 获取状态
    const state = editor.getState();
    expect(state.isDirty).toBe(false);

    // 销毁
    await editor.destroy();
  });

  it('should support undo/redo in editor', async () => {
    await plugin.initialize(mockCore as any);

    const editor = plugin.createEditor();
    const container = document.createElement('div');
    await editor.render(
      { card_type: 'TemplateCard', theme: '' },
      container,
      {}
    );

    // 初始状态不能撤销
    expect(editor.getState().canUndo).toBe(false);

    // 修改配置
    editor.setConfig({ theme: 'dark-theme' });
    expect(editor.getState().isDirty).toBe(true);
    expect(editor.getState().canUndo).toBe(true);

    // 撤销
    editor.undo();
    const config = editor.getConfig();
    expect(config.theme).toBe('');

    // 重做
    editor.redo();
    const config2 = editor.getConfig();
    expect(config2.theme).toBe('dark-theme');

    await editor.destroy();
  });
});
