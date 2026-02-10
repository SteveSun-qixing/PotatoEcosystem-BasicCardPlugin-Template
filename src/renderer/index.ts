/**
 * 渲染器模块
 *
 * 负责在查看模式下显示卡片内容。
 * ⚠️ 实现你的渲染组件逻辑
 */

import type { ChipsCore } from '@chips/sdk';
import type { TemplateCardConfig, RenderOptions, TemplateRendererState } from '../types';
import { CSS_VARS } from '../types';
import { t } from '../utils/i18n';

/**
 * 模板卡片渲染器
 *
 * 负责在查看模式下显示卡片内容。
 * ⚠️ 实现你的渲染逻辑
 */
export class TemplateRenderer {
  /** 内核引用 */
  private core: ChipsCore | null = null;

  /** 配置 */
  private config: TemplateCardConfig | null = null;

  /** 容器元素 */
  private container: HTMLElement | null = null;

  /** 渲染选项 */
  private options: RenderOptions | null = null;

  /** ResizeObserver（响应式监听） */
  private resizeObserver: ResizeObserver | null = null;

  /** 状态 */
  private state: TemplateRendererState = {
    isLoading: false,
    error: null,
    currentTheme: '',
    containerWidth: 0,
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

      // 清空容器
      container.innerHTML = '';

      // ⚠️ 实现你的渲染逻辑
      // 建议使用 Vue 3 createApp() 动态挂载组件：
      //
      // import { createApp } from 'vue';
      // import RendererComponent from './Renderer.vue';
      //
      // const app = createApp(RendererComponent, {
      //   config: this.config,
      //   options: this.options,
      // });
      // app.mount(container);

      // 示例：创建内容元素
      const contentElement = this.createContentElement();
      container.appendChild(contentElement);

      // 应用主题
      if (config.theme) {
        await this.applyTheme(config.theme);
      }

      // 设置响应式监听
      this.setupResizeObserver();

      this.state.isLoading = false;
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * 更新配置并重新渲染
   */
  async update(config: Partial<TemplateCardConfig>): Promise<void> {
    if (!this.config || !this.container || !this.options) {
      throw new Error(t('renderer.render_failed'));
    }

    this.config = { ...this.config, ...config };
    await this.render(this.config, this.container, this.options);
  }

  /**
   * 获取当前状态
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
    // 清理 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // 清理引用
    this.config = null;
    this.container = null;
    this.options = null;
  }

  // ========== 私有方法 ==========

  /**
   * 创建内容元素
   * ⚠️ 实现你的内容创建逻辑
   */
  private createContentElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'chips-template-content'; // ⚠️ 修改类名

    // ⚠️ 添加你的内容渲染
    element.textContent = t('renderer.loading');

    return element;
  }

  /**
   * 应用主题
   *
   * 通过内核获取主题包的 CSS 变量，并应用到容器上
   */
  private async applyTheme(themeId: string): Promise<void> {
    if (!this.core || !this.container) return;

    try {
      const response = await this.core.request({
        service: 'theme',
        method: 'get',
        payload: { themeId },
      });

      if (response.success && response.data) {
        const themeData = response.data as Record<string, string>;

        // 应用 CSS 变量到容器
        Object.entries(CSS_VARS).forEach(([_key, varName]) => {
          const value = themeData[varName];
          if (value) {
            this.container!.style.setProperty(varName, value);
          }
        });

        this.state.currentTheme = themeId;
      }
    } catch (error) {
      console.error(t('error.render_failed', { reason: String(error) }));
    }
  }

  /**
   * 设置响应式监听
   *
   * 监听容器宽度变化，用于响应式布局
   */
  private setupResizeObserver(): void {
    if (!this.container) return;

    // 清理旧的
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.state.containerWidth = entry.contentRect.width;
        this.onContainerResize(entry.contentRect.width);
      }
    });

    this.resizeObserver.observe(this.container);
  }

  /**
   * 容器尺寸变化回调
   * ⚠️ 如需响应式布局，在这里实现
   */
  private onContainerResize(_width: number): void {
    // ⚠️ 根据需要实现响应式逻辑
  }
}
