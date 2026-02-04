/**
 * 基础卡片插件主类模板
 *
 * @description 插件入口类，负责管理插件生命周期和创建组件实例
 * @important 使用时请全局替换 "Template" 为你的实际卡片类型名称
 */

import type { BaseCardPlugin, ChipsCore, PluginMetadata } from '@chips/sdk';
import type { TemplateCardConfig } from './types';
import { TemplateRenderer } from './renderer';
import { TemplateEditor } from './editor';

/**
 * 模板卡片插件
 * 
 * ⚠️ 使用说明：
 * 1. 全局替换 "Template" 为你的卡片类型（如 "Video"、"Image"）
 * 2. 修改 metadata 中的信息
 * 3. 修改 configSchema 定义你的配置结构
 * 4. 实现服务注册逻辑
 */
export class TemplateCardPlugin implements BaseCardPlugin {
  /**
   * 插件元数据
   * ⚠️ 必须修改这里的所有值
   */
  readonly metadata: PluginMetadata = {
    id: 'chipshub:template-card',      // ⚠️ 修改为你的插件ID
    name: '模板卡片',                   // ⚠️ 修改为你的卡片名称
    version: '1.0.0',
    cardType: 'TemplateCard',          // ⚠️ 修改为你的卡片类型
    icon: 'assets/icon.svg',
    description: '这是一个基础卡片插件模板', // ⚠️ 修改描述
  };

  /**
   * 配置Schema（JSON Schema格式）
   * ⚠️ 定义你的卡片配置结构
   */
  readonly configSchema = {
    type: 'object',
    required: ['card_type'],            // ⚠️ 添加你的必需字段
    properties: {
      // 通用字段（所有卡片都需要）
      card_type: {
        const: 'TemplateCard',           // ⚠️ 修改为你的卡片类型
      },
      theme: {
        type: 'string',
        default: '',
        description: '主题包标识',
      },
      layout: {
        type: 'object',
        properties: {
          height_mode: {
            type: 'string',
            enum: ['auto', 'fixed'],
            default: 'auto',
          },
          fixed_height: {
            type: 'integer',
            description: '固定高度（像素）',
          },
        },
      },
      
      // ⚠️ 在这里添加你的自定义字段
      // 示例：
      // title: {
      //   type: 'string',
      //   description: '标题',
      // },
      // content: {
      //   type: 'string',
      //   description: '内容',
      // },
    },
  };

  /**
   * 内核引用
   */
  private core: ChipsCore | null = null;

  /**
   * 是否已初始化
   */
  private initialized = false;

  /**
   * 初始化插件
   *
   * @param core - 薯片内核实例
   */
  async initialize(core: ChipsCore): Promise<void> {
    if (this.initialized) {
      console.warn(this.t('plugin.already_initialized'));
      return;
    }

    this.core = core;

    // ⚠️ 注册插件服务到内核
    await this.registerServices();

    this.initialized = true;
    console.log(this.t('plugin.initialized'));
  }

  /**
   * 启动插件
   */
  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error(this.t('plugin.not_initialized'));
    }
    console.log(this.t('plugin.started'));
  }

  /**
   * 停止插件
   */
  async stop(): Promise<void> {
    console.log(this.t('plugin.stopped'));
  }

  /**
   * 销毁插件
   */
  async destroy(): Promise<void> {
    // 清理资源
    this.core = null;
    this.initialized = false;
    console.log(this.t('plugin.destroyed'));
  }

  /**
   * 创建渲染器实例
   *
   * @returns 新的渲染器实例
   */
  createRenderer(): TemplateRenderer {
    const renderer = new TemplateRenderer();
    if (this.core) {
      renderer.setCore(this.core);
    }
    return renderer;
  }

  /**
   * 创建编辑器实例
   *
   * @returns 新的编辑器实例
   */
  createEditor(): TemplateEditor {
    const editor = new TemplateEditor();
    if (this.core) {
      editor.setCore(this.core);
    }
    return editor;
  }

  /**
   * 验证配置
   *
   * @param config - 待验证的配置
   * @returns 是否有效
   */
  validateConfig(config: unknown): config is TemplateCardConfig {
    if (!config || typeof config !== 'object') return false;

    const cfg = config as Record<string, unknown>;

    // 检查必需字段
    if (cfg.card_type !== 'TemplateCard') return false; // ⚠️ 修改为你的卡片类型

    // ⚠️ 添加你的验证逻辑
    
    return true;
  }

  /**
   * 注册服务到内核
   * ⚠️ 实现你的服务注册逻辑
   */
  private async registerServices(): Promise<void> {
    if (!this.core) return;

    // 示例：注册渲染服务
    await this.core.registerService({
      name: 'template.render', // ⚠️ 修改服务名称
      handler: this.handleRender.bind(this),
      schema: {
        input: {
          type: 'object',
          properties: {
            config: { type: 'object' },
            options: { type: 'object' },
          },
        },
        output: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            html: { type: 'string' },
          },
        },
      },
    });

    // ⚠️ 添加更多服务注册
  }

  /**
   * 处理渲染服务请求
   * ⚠️ 实现你的服务处理器
   */
  private async handleRender(payload: {
    config: TemplateCardConfig;
    options?: unknown;
  }): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      // 实现渲染逻辑
      const renderer = this.createRenderer();
      // ... 渲染逻辑
      
      return {
        success: true,
        html: '<div>Rendered content</div>',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 获取翻译文本
   * @param key - 翻译key
   */
  private t(key: string): string {
    // ⚠️ 实际应该通过 @chips/i18n 获取翻译
    // import { t } from '@chips/i18n';
    // return t(`template.${key}`);
    return `[${key}]`; // 临时占位
  }
}

export default TemplateCardPlugin;
