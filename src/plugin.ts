/**
 * 基础卡片插件主类模板
 *
 * @description 插件入口类，负责管理插件生命周期和创建组件实例
 *
 * ⚠️ 使用说明：
 * 1. 全局替换 "Template" 为你的实际卡片类型名称（如 "Video"、"Image"）
 * 2. 修改 metadata 中的所有信息
 * 3. 修改 configSchema 定义你的配置结构
 * 4. 实现服务注册逻辑
 */

import type { BaseCardPlugin, ChipsCore, PluginMetadata } from '@chips/sdk';
import type { TemplateCardConfig } from './types';
import { TemplateRenderer } from './renderer';
import { TemplateEditor } from './editor';
import { t } from './utils/i18n';

/**
 * 模板卡片插件
 *
 * 实现 BaseCardPlugin 接口（从 @chips/sdk 导入），
 * 管理插件的完整生命周期。
 */
export class TemplateCardPlugin implements BaseCardPlugin {
  /**
   * 插件元数据
   * ⚠️ 必须修改所有值
   */
  readonly metadata: PluginMetadata = {
    id: 'chipshub:template-card',      // ⚠️ 修改为你的插件ID
    name: '模板卡片',                   // ⚠️ 修改为你的卡片名称
    version: '1.0.0',
    chipStandardsVersion: '1.0.0',     // 遵循的薯片协议版本
    cardType: 'TemplateCard',          // ⚠️ 修改为你的卡片类型（PascalCase）
    icon: 'assets/icon.svg',
    description: '这是一个基础卡片插件模板', // ⚠️ 修改描述
  };

  /**
   * 配置 Schema（JSON Schema 格式）
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
    },
  };

  /** 内核引用 */
  private core: ChipsCore | null = null;

  /** 是否已初始化 */
  private initialized = false;

  /**
   * 初始化插件
   *
   * 由插件管理器在启用插件时调用。
   * 接收 ChipsCore 实例作为与内核通信的唯一通道。
   *
   * @param core - 薯片内核实例（通过中心路由架构通信）
   */
  async initialize(core: ChipsCore): Promise<void> {
    if (this.initialized) {
      await this.logInfo('plugin.already_initialized');
      return;
    }

    try {
      this.core = core;

      // 注册插件服务到内核
      await this.registerServices();

      this.initialized = true;
      await this.logInfo('plugin.initialized');
    } catch (error) {
      this.core = null;
      throw error;
    }
  }

  /**
   * 启动插件
   */
  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error(t('plugin.not_initialized'));
    }
    try {
      await this.logInfo('plugin.started');
    } catch (error) {
      // 日志失败不应阻止启动
      console.error('[TemplateCardPlugin]', t('error.log_failed'), error);
    }
  }

  /**
   * 停止插件
   */
  async stop(): Promise<void> {
    try {
      await this.logInfo('plugin.stopped');
    } catch (error) {
      // 日志失败不应阻止停止
      console.error('[TemplateCardPlugin]', t('error.log_failed'), error);
    }
  }

  /**
   * 销毁插件
   */
  async destroy(): Promise<void> {
    try {
      await this.logInfo('plugin.destroyed');
    } catch (error) {
      // 日志失败不应阻止销毁
      console.error('[TemplateCardPlugin]', t('error.log_failed'), error);
    } finally {
      this.core = null;
      this.initialized = false;
    }
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
    this.logInfo('log.renderer_created');
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
    this.logInfo('log.editor_created');
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
   *
   * 通过标准的 core.registerService() 方法注册插件提供的服务。
   * ⚠️ 实现你的服务注册逻辑
   */
  private async registerServices(): Promise<void> {
    if (!this.core) return;

    try {
      // 注册渲染服务
      await this.core.registerService({
        name: 'template.render', // ⚠️ 修改服务名称
        handler: (payload: unknown) => this.handleRender(payload as {
          config: TemplateCardConfig;
          options?: unknown;
        }),
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

      await this.logInfo('log.service_registered', { service: 'template.render' });

      // ⚠️ 添加更多服务注册
    } catch (error) {
      console.error('[TemplateCardPlugin]', t('error.service_register_failed'), error);
      throw error;
    }
  }

  /**
   * 处理渲染服务请求
   * ⚠️ 实现你的服务处理器
   */
  private async handleRender(_payload: {
    config: TemplateCardConfig;
    options?: unknown;
  }): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      const renderer = this.createRenderer();
      // ⚠️ 实现渲染逻辑
      void renderer;

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
   * 记录日志
   *
   * 通过内核的日志服务记录，如果日志服务不可用则降级到 console
   */
  private async logInfo(key: string, vars?: Record<string, unknown>): Promise<void> {
    const message = t(key, vars);

    if (!this.core) {
      console.log(`[TemplateCardPlugin] ${message}`); // ⚠️ 修改前缀
      return;
    }

    // 通过内核记录日志
    await this.core
      .request({
        service: 'log',
        method: 'info',
        payload: {
          message,
          module: 'template-card-plugin', // ⚠️ 修改模块名
        },
      })
      .catch(() => {
        // 降级：如果日志服务不可用，使用 console
        console.log(`[TemplateCardPlugin] ${message}`); // ⚠️ 修改前缀
      });
  }
}

export default TemplateCardPlugin;
