/**
 * 渲染器模块
 * ⚠️ 实现你的渲染组件逻辑
 */

import type { ChipsCore } from '@chips/sdk';
import type { TemplateCardConfig, RenderOptions, TemplateRendererState } from '../types';

/**
 * 模板卡片渲染器
 * 负责在查看模式下显示卡片内容
 */
export class TemplateRenderer {
  /**
   * 内核引用
   */
  private core: ChipsCore | null = null;

  /**
   * 配置
   */
  private config: TemplateCardConfig | null = null;

  /**
   * 容器元素
   */
  private container: HTMLElement | null = null;

  /**
   * 渲染选项
   */
  private options: RenderOptions | null = null;

  /**
   * 状态
   */
  private state: TemplateRendererState = {
    content: '',
    isLoading: false,
    error: null,
  };

  /**
   * 设置内核引用
   */
  setCore(core: ChipsCore): void {
    this.core = core;
  }

  /**
   * 渲染内容到容器
   * 
   * @param config - 卡片配置
   * @param container - 容器元素
   * @param options - 渲染选项
   */
  async render(
    config: TemplateCardConfig,
    container: HTMLElement,
    options: RenderOptions
  ): Promise<void> {
    this.config = config;
    this.container = container;
    this.options = options;

    try {
      this.state.isLoading = true;
      this.state.error = null;

      // ⚠️ 实现你的渲染逻辑
      // 示例步骤：
      // 1. 加载内容数据
      // 2. 应用主题
      // 3. 渲染到DOM
      // 4. 绑定事件

      // 清空容器
      container.innerHTML = '';

      // 创建内容元素
      const contentElement = this.createContentElement();
      container.appendChild(contentElement);

      // 应用主题
      if (config.theme) {
        await this.applyTheme(config.theme);
      }

      this.state.isLoading = false;
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * 更新配置
   */
  async update(config: Partial<TemplateCardConfig>): Promise<void> {
    if (!this.config || !this.container || !this.options) {
      throw new Error('Renderer not initialized');
    }

    // 合并配置
    this.config = { ...this.config, ...config };

    // 重新渲染
    await this.render(this.config, this.container, this.options);
  }

  /**
   * 获取状态
   */
  getState(): TemplateRendererState {
    return { ...this.state };
  }

  /**
   * 设置状态
   */
  setState(state: Partial<TemplateRendererState>): void {
    this.state = { ...this.state, ...state };
  }

  /**
   * 销毁渲染器
   */
  async destroy(): Promise<void> {
    // 清理事件监听器
    // 清理DOM引用
    this.config = null;
    this.container = null;
    this.options = null;
  }

  /**
   * 创建内容元素
   * ⚠️ 实现你的内容创建逻辑
   */
  private createContentElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'chips-template-content'; // ⚠️ 修改类名
    
    // ⚠️ 添加你的内容
    element.textContent = 'Template card content';
    
    return element;
  }

  /**
   * 应用主题
   * ⚠️ 实现主题应用逻辑
   */
  private async applyTheme(themeId: string): Promise<void> {
    if (!this.core || !this.container) return;

    try {
      // 通过内核获取主题
      const response = await this.core.request({
        service: 'theme.get',
        payload: { themeId },
      });

      if (response.success && response.data) {
        // 应用CSS变量
        // const theme = response.data as Theme;
        // this.container.style.setProperty('--template-text-color', theme.colors.text);
        // ...
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }
}
