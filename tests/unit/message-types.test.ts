/**
 * 消息类型单元测试
 *
 * 测试 postMessage 消息类型定义的正确性
 */

import { describe, it, expect } from 'vitest';
import {
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  IframeBridgeErrorCode,
  type CardRuntimeMessage,
  type InitPayload,
  type BridgeRequestPayload,
  type BridgeResponsePayload,
  type ResourceRequestPayload,
  type ResourceResponsePayload,
  type ResizePayload,
  type ErrorPayload,
  type ThemeUpdatePayload,
  type ConfigChangePayload,
  type ReadyPayload,
  type DisposePayload,
} from '../../src/bridge/message-types';

describe('消息类型常量', () => {
  it('协议名称应该正确', () => {
    expect(PROTOCOL_NAME).toBe('chips-card-runtime');
  });

  it('协议版本应该正确', () => {
    expect(PROTOCOL_VERSION).toBe('1.0.0');
  });

  it('错误代码应该包含所有必需的错误类型', () => {
    expect(IframeBridgeErrorCode.PROTOCOL_MISMATCH).toBe('IFRAME_PROTOCOL_MISMATCH');
    expect(IframeBridgeErrorCode.INVALID_MESSAGE).toBe('IFRAME_INVALID_MESSAGE');
    expect(IframeBridgeErrorCode.REQUEST_TIMEOUT).toBe('IFRAME_REQUEST_TIMEOUT');
    expect(IframeBridgeErrorCode.NOT_INITIALIZED).toBe('IFRAME_NOT_INITIALIZED');
    expect(IframeBridgeErrorCode.BRIDGE_CALL_FAILED).toBe('IFRAME_BRIDGE_CALL_FAILED');
    expect(IframeBridgeErrorCode.RESOURCE_LOAD_FAILED).toBe('IFRAME_RESOURCE_LOAD_FAILED');
    expect(IframeBridgeErrorCode.INVALID_CONFIG).toBe('IFRAME_INVALID_CONFIG');
    expect(IframeBridgeErrorCode.RENDER_FAILED).toBe('IFRAME_RENDER_FAILED');
    expect(IframeBridgeErrorCode.UNKNOWN_ERROR).toBe('IFRAME_UNKNOWN_ERROR');
  });
});

describe('消息结构类型检查', () => {
  it('CardRuntimeMessage 应该包含所有必需字段', () => {
    const message: CardRuntimeMessage<string> = {
      protocol: PROTOCOL_NAME,
      version: PROTOCOL_VERSION,
      messageId: 'test-123',
      type: 'init',
      timestamp: '2026-02-13T00:00:00.000Z',
      payload: 'test payload',
    };

    expect(message.protocol).toBe(PROTOCOL_NAME);
    expect(message.version).toBe(PROTOCOL_VERSION);
    expect(message.messageId).toBe('test-123');
    expect(message.type).toBe('init');
    expect(message.timestamp).toBeDefined();
    expect(message.payload).toBe('test payload');
  });

  it('InitPayload 应该包含所有必需字段', () => {
    const payload: InitPayload = {
      config: { card_type: 'TestCard' },
      themeId: 'default',
      themeVariables: { '--bg': '#fff' },
      locale: 'zh-CN',
      resourceMap: { 'img1': 'http://example.com/img1.png' },
      pluginId: 'test.plugin',
      pluginVersion: '1.0.0',
      mode: 'renderer',
      hostVersion: '1.0.0',
    };

    expect(payload.config).toBeDefined();
    expect(payload.themeId).toBe('default');
    expect(payload.themeVariables).toBeDefined();
    expect(payload.locale).toBe('zh-CN');
    expect(payload.resourceMap).toBeDefined();
    expect(payload.pluginId).toBe('test.plugin');
    expect(payload.pluginVersion).toBe('1.0.0');
    expect(payload.mode).toBe('renderer');
    expect(payload.hostVersion).toBe('1.0.0');
  });

  it('InitPayload 可以包含可选的 readonly 字段', () => {
    const payload: InitPayload = {
      config: {},
      themeId: 'default',
      themeVariables: {},
      locale: 'zh-CN',
      resourceMap: {},
      pluginId: 'test.plugin',
      pluginVersion: '1.0.0',
      mode: 'renderer',
      readonly: true,
      hostVersion: '1.0.0',
    };

    expect(payload.readonly).toBe(true);
  });

  it('BridgeRequestPayload 应该包含所有必需字段', () => {
    const payload: BridgeRequestPayload = {
      requestId: 'req-123',
      namespace: 'file',
      action: 'read',
      params: { path: '/test.txt' },
    };

    expect(payload.requestId).toBe('req-123');
    expect(payload.namespace).toBe('file');
    expect(payload.action).toBe('read');
    expect(payload.params).toEqual({ path: '/test.txt' });
  });

  it('BridgeResponsePayload 成功响应应该包含 data', () => {
    const payload: BridgeResponsePayload = {
      requestId: 'req-123',
      success: true,
      data: { content: 'file content' },
      durationMs: 10,
    };

    expect(payload.success).toBe(true);
    expect(payload.data).toEqual({ content: 'file content' });
    expect(payload.error).toBeUndefined();
  });

  it('BridgeResponsePayload 失败响应应该包含 error', () => {
    const payload: BridgeResponsePayload = {
      requestId: 'req-123',
      success: false,
      error: {
        code: 'FILE_NOT_FOUND',
        message: 'File not found',
        details: { path: '/test.txt' },
      },
      durationMs: 5,
    };

    expect(payload.success).toBe(false);
    expect(payload.error?.code).toBe('FILE_NOT_FOUND');
    expect(payload.error?.message).toBe('File not found');
    expect(payload.data).toBeUndefined();
  });

  it('ResourceRequestPayload 应该包含所有必需字段', () => {
    const payload: ResourceRequestPayload = {
      requestId: 'res-123',
      resourceId: 'image-001',
      type: 'image',
    };

    expect(payload.requestId).toBe('res-123');
    expect(payload.resourceId).toBe('image-001');
    expect(payload.type).toBe('image');
  });

  it('ResourceResponsePayload 成功响应应该包含 url', () => {
    const payload: ResourceResponsePayload = {
      requestId: 'res-123',
      success: true,
      url: 'chips-resource://image-001.png',
      mimeType: 'image/png',
    };

    expect(payload.success).toBe(true);
    expect(payload.url).toBe('chips-resource://image-001.png');
    expect(payload.mimeType).toBe('image/png');
  });

  it('ResizePayload 应该包含尺寸信息', () => {
    const payload: ResizePayload = {
      width: 800,
      height: 600,
      natural: true,
    };

    expect(payload.width).toBe(800);
    expect(payload.height).toBe(600);
    expect(payload.natural).toBe(true);
  });

  it('ErrorPayload 应该包含错误信息', () => {
    const payload: ErrorPayload = {
      code: 'RENDER_ERROR',
      message: 'Failed to render',
      details: { component: 'ImageRenderer' },
      recoverable: true,
    };

    expect(payload.code).toBe('RENDER_ERROR');
    expect(payload.message).toBe('Failed to render');
    expect(payload.details).toEqual({ component: 'ImageRenderer' });
    expect(payload.recoverable).toBe(true);
  });

  it('ThemeUpdatePayload 应该包含主题信息', () => {
    const payload: ThemeUpdatePayload = {
      themeId: 'dark',
      themeVariables: {
        '--bg-primary': '#1a1a1a',
        '--text-primary': '#ffffff',
      },
    };

    expect(payload.themeId).toBe('dark');
    expect(payload.themeVariables['--bg-primary']).toBe('#1a1a1a');
  });

  it('ConfigChangePayload 应该包含配置和 final 标志', () => {
    const payload: ConfigChangePayload = {
      config: { card_type: 'TestCard', title: 'Updated' },
      final: true,
    };

    expect(payload.config).toEqual({ card_type: 'TestCard', title: 'Updated' });
    expect(payload.final).toBe(true);
  });

  it('ReadyPayload 应该包含模式和协议版本', () => {
    const payload: ReadyPayload = {
      mode: 'editor',
      protocolVersion: '1.0.0',
    };

    expect(payload.mode).toBe('editor');
    expect(payload.protocolVersion).toBe('1.0.0');
  });

  it('DisposePayload 应该包含销毁原因', () => {
    const payload: DisposePayload = {
      reason: 'close',
    };

    expect(payload.reason).toBe('close');
  });
});

describe('消息类型枚举', () => {
  it('应该支持所有定义的消息类型', () => {
    const messageTypes = [
      'init',
      'ready',
      'bridge-request',
      'bridge-response',
      'resource-request',
      'resource-response',
      'resize',
      'theme-update',
      'dispose',
      'error',
    ];

    messageTypes.forEach((type) => {
      const message: CardRuntimeMessage = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'test',
        type: type as CardRuntimeMessage['type'],
        timestamp: new Date().toISOString(),
        payload: {},
      };

      expect(message.type).toBe(type);
    });
  });
});
