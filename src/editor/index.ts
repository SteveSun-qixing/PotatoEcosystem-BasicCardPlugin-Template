/**
 * 编辑器模块
 *
 * 负责在编辑模式下编辑卡片内容。
 * ⚠️ 实现你的编辑组件逻辑
 */

import type { BaseCardPlugin, ChipsCore } from '@chips/sdk';
import type {
  TemplateCardConfig,
  EditorOptions,
  TemplateEditorState,
  TemplateCommand,
  ValidationResult,
} from '../types';
import { UndoManager } from './history';
import { t } from '../utils/i18n';

// 导出 UndoManager 供外部使用
export { UndoManager } from './history';

/**
 * 模板卡片编辑器
 *
 * 负责在编辑模式下编辑卡片内容。
 * ⚠️ 实现你的编辑逻辑
 */
export class TemplateEditor {
  /** 内核引用 */
  private core: ChipsCore | null = null;

  /** 配置 */
  private config: TemplateCardConfig | null = null;

  /** 容器元素 */
  private container: HTMLElement | null = null;

  /** 编辑器选项 */
  private options: EditorOptions | null = null;

  /** 撤销/重做管理器 ⚠️ 根据需要修改泛型类型 */
  private history = new UndoManager<TemplateCardConfig>(50);

  /** 状态 */
  private state: TemplateEditorState = {
    isDirty: false,
    canUndo: false,
    canRedo: false,
  };

  /** 变更回调 */
  private changeCallback: ((config: TemplateCardConfig) => void) | null = null;

  /**
   * 设置内核引用
   */
  setCore(core: ChipsCore): void {
    this.core = core;
  }

  /**
   * 渲染编辑器
   *
   * @param config - 卡片配置
   * @param container - 容器元素
   * @param options - 编辑器选项
   */
  async render(
    config: TemplateCardConfig,
    container: HTMLElement,
    options: EditorOptions
  ): Promise<void> {
    this.config = { ...config };
    this.container = container;
    this.options = options;

    // 记录初始状态到历史
    this.history.push({ ...config });

    try {
      // 清空容器
      container.innerHTML = '';

      // ⚠️ 实现你的编辑器界面
      // 建议使用 Vue 3 createApp() 动态挂载组件：
      //
      // import { createApp } from 'vue';
      // import EditorComponent from './Editor.vue';
      //
      // const app = createApp(EditorComponent, {
      //   config: this.config,
      //   options: this.options,
      //   onConfigChange: (newConfig) => this.handleConfigChange(newConfig),
      // });
      // app.mount(container);

      // 工具栏（如果需要）
      if (options.toolbar) {
        const toolbar = this.createToolbar();
        container.appendChild(toolbar);
      }

      // 编辑区
      const editor = this.createEditorArea();
      container.appendChild(editor);

      // 应用主题
      if (config.theme) {
        await this.applyTheme(config.theme);
      }

      // 绑定键盘快捷键
      this.bindKeyboardShortcuts();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): TemplateCardConfig {
    if (!this.config) {
      throw new Error(t('error.editor_not_initialized'));
    }
    return { ...this.config };
  }

  /**
   * 设置配置
   */
  setConfig(updates: Partial<TemplateCardConfig>): void {
    if (!this.config) {
      throw new Error(t('error.editor_not_initialized'));
    }

    // 更新配置
    this.config = { ...this.config, ...updates };

    // 记录新状态到历史（用于撤销/重做）
    this.history.push({ ...this.config });

    this.state.isDirty = true;
    this.updateUndoRedoState();
    this.notifyChange();
  }

  /**
   * 验证配置
   */
  validate(): ValidationResult {
    if (!this.config) {
      return {
        valid: false,
        errors: [
          {
            field: 'config',
            message: t('error.editor_not_initialized'),
            code: 'NOT_INITIALIZED',
          },
        ],
      };
    }

    // ⚠️ 实现你的验证逻辑
    const errors: ValidationResult['errors'] = [];

    if (!this.config.card_type) {
      errors.push({
        field: 'card_type',
        message: t('error.missing_field', { field: 'card_type' }),
        code: 'REQUIRED',
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * 监听变更
   */
  onChange(callback: (config: TemplateCardConfig) => void): void {
    this.changeCallback = callback;
  }

  /**
   * 执行命令
   * ⚠️ 实现你的命令处理逻辑
   */
  executeCommand(command: TemplateCommand): void {
    if (!this.config) return;

    // 记录到历史（用于撤销）
    this.history.push({ ...this.config });

    // 处理命令
    switch (command.type) {
      case 'sample_command':
        // ⚠️ 实现命令逻辑
        break;
      case 'another_command':
        // ⚠️ 实现命令逻辑
        break;
      // ⚠️ 添加更多命令处理
    }

    this.state.isDirty = true;
    this.updateUndoRedoState();
    this.notifyChange();
  }

  /**
   * 撤销
   */
  undo(): void {
    const previousState = this.history.undo();
    if (previousState) {
      this.config = { ...previousState };
      this.updateUndoRedoState();
      this.notifyChange();
    }
  }

  /**
   * 重做
   */
  redo(): void {
    const nextState = this.history.redo();
    if (nextState) {
      this.config = { ...nextState };
      this.updateUndoRedoState();
      this.notifyChange();
    }
  }

  /**
   * 获取状态
   */
  getState(): TemplateEditorState {
    return { ...this.state };
  }

  /**
   * 销毁编辑器
   */
  async destroy(): Promise<void> {
    this.unbindKeyboardShortcuts();
    this.config = null;
    this.container = null;
    this.options = null;
    this.changeCallback = null;
    this.history.clear();
  }

  // ========== 私有方法 ==========

  /**
   * 创建工具栏
   * ⚠️ 实现你的工具栏
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.className = 'chips-template-toolbar'; // ⚠️ 修改类名

    // ⚠️ 添加工具栏按钮

    return toolbar;
  }

  /**
   * 创建编辑区
   * ⚠️ 实现你的编辑区
   */
  private createEditorArea(): HTMLElement {
    const editor = document.createElement('div');
    editor.className = 'chips-template-editor'; // ⚠️ 修改类名

    // ⚠️ 添加你的编辑逻辑

    return editor;
  }

  /**
   * 应用主题
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
        // 应用 CSS 变量
        // const vars = (response.data as Theme).cssVariables;
        // Object.entries(vars).forEach(([key, value]) => {
        //   this.container!.style.setProperty(key, value);
        // });
      }
    } catch (error) {
      console.error(t('error.render_failed', { reason: String(error) }));
    }
  }

  /**
   * 更新撤销/重做状态
   */
  private updateUndoRedoState(): void {
    this.state.canUndo = this.history.canUndo;
    this.state.canRedo = this.history.canRedo;
  }

  /**
   * 通知配置变更
   */
  private notifyChange(): void {
    if (this.changeCallback && this.config) {
      this.changeCallback({ ...this.config });
    }
  }

  /** 键盘事件处理器引用（用于解绑） */
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;

  /**
   * 绑定键盘快捷键
   */
  private bindKeyboardShortcuts(): void {
    this.keyboardHandler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        this.redo();
      } else if (isMod && e.key === 'y') {
        e.preventDefault();
        this.redo();
      }

      // ⚠️ 添加更多快捷键
    };

    document.addEventListener('keydown', this.keyboardHandler);
  }

  /**
   * 解绑键盘快捷键
   */
  private unbindKeyboardShortcuts(): void {
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }
  }
}
