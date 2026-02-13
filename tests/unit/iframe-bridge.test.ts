/**
 * iframe Bridge 单元测试
 *
 * 测试 postMessage 通信层的核心功能
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  IframeBridge,
  IframeBridgeError,
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  IframeBridgeErrorCode,
  type CardRuntimeMessage,
  type InitPayload,
  type BridgeRequestPayload,
  type BridgeResponsePayload,
  type ResourceRequestPayload,
  type ResourceResponsePayload,
  type ThemeUpdatePayload,
} from '../../src/bridge';

// Mock window.parent.postMessage
const mockPostMessage = vi.fn();

describe('IframeBridge', () => {
  let bridge: IframeBridge;
  let originalParent: typeof window.parent;

  beforeEach(() => {
    // 保存原始 parent
    originalParent = window.parent;

    // Mock window.parent
    Object.defineProperty(window, 'parent', {
      value: {
        postMessage: mockPostMessage,
      },
      writable: true,
      configurable: true,
    });

    bridge = new IframeBridge();
    mockPostMessage.mockClear();
  });

  afterEach(() => {
    bridge.stop();
    // 恢复原始 parent
    Object.defineProperty(window, 'parent', {
      value: originalParent,
      writable: true,
      configurable: true,
    });
  });

  describe('消息格式验证', () => {
    it('应该使用正确的协议名称和版本', () => {
      expect(PROTOCOL_NAME).toBe('chips-card-runtime');
      expect(PROTOCOL_VERSION).toBe('1.0.0');
    });

    it('发送的消息应包含所有必需字段', async () => {
      // 启动 bridge（会发送 ready 消息）
      const startPromise = bridge.start('renderer');

      // 验证 ready 消息格式
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      const readyMessage = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage;

      expect(readyMessage.protocol).toBe(PROTOCOL_NAME);
      expect(readyMessage.version).toBe(PROTOCOL_VERSION);
      expect(readyMessage.type).toBe('ready');
      expect(readyMessage.messageId).toBeDefined();
      expect(readyMessage.timestamp).toBeDefined();
      expect(readyMessage.payload).toEqual({
        mode: 'renderer',
        protocolVersion: PROTOCOL_VERSION,
      });

      // 模拟收到 init 消息以完成初始化
      const initPayload: InitPayload = {
        config: { card_type: 'TestCard' },
        themeId: 'default',
        themeVariables: {},
        locale: 'zh-CN',
        resourceMap: {},
        pluginId: 'test.plugin',
        pluginVersion: '1.0.0',
        mode: 'renderer',
        hostVersion: '1.0.0',
      };

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: initPayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));

      const result = await startPromise;
      expect(result).toEqual(initPayload);
    });
  });

  describe('初始化流程', () => {
    it('应该在初始化完成后返回配置数据', async () => {
      const startPromise = bridge.start('renderer');

      const initPayload: InitPayload = {
        config: { card_type: 'TestCard', title: 'Test' },
        themeId: 'dark',
        themeVariables: { '--bg': '#000' },
        locale: 'en-US',
        resourceMap: { 'img1': 'http://example.com/img1.png' },
        pluginId: 'test.plugin',
        pluginVersion: '1.0.0',
        mode: 'renderer',
        hostVersion: '1.0.0',
      };

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: initPayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));

      const result = await startPromise;

      expect(result.config).toEqual({ card_type: 'TestCard', title: 'Test' });
      expect(result.themeId).toBe('dark');
      expect(result.locale).toBe('en-US');
      expect(bridge.getConfig()).toEqual({ card_type: 'TestCard', title: 'Test' });
      expect(bridge.getThemeVariables()).toEqual({ '--bg': '#000' });
      expect(bridge.getResourceUrl('img1')).toBe('http://example.com/img1.png');
    });

    it('初始化超时应该抛出错误', async () => {
      vi.useFakeTimers();

      const startPromise = bridge.start('renderer');

      // 快进超过超时时间
      vi.advanceTimersByTime(15000);

      await expect(startPromise).rejects.toThrow(IframeBridgeError);
      await expect(startPromise).rejects.toMatchObject({
        code: IframeBridgeErrorCode.REQUEST_TIMEOUT,
      });

      vi.useRealTimers();
    });
  });

  describe('Bridge API 调用', () => {
    beforeEach(async () => {
      // 先完成初始化
      const startPromise = bridge.start('renderer');

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: {
          config: {},
          themeId: 'default',
          themeVariables: {},
          locale: 'zh-CN',
          resourceMap: {},
          pluginId: 'test.plugin',
          pluginVersion: '1.0.0',
          mode: 'renderer',
          hostVersion: '1.0.0',
        },
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));
      await startPromise;
      mockPostMessage.mockClear();
    });

    it('invoke 应该发送正确格式的请求', async () => {
      const invokePromise = bridge.invoke('file', 'read', { path: '/test.txt' });

      // 验证发送的消息
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      const requestMessage = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage<BridgeRequestPayload>;

      expect(requestMessage.type).toBe('bridge-request');
      expect(requestMessage.payload).toMatchObject({
        namespace: 'file',
        action: 'read',
        params: { path: '/test.txt' },
      });

      // 模拟响应
      const responsePayload: BridgeResponsePayload = {
        requestId: requestMessage.payload.requestId,
        success: true,
        data: { content: 'file content' },
        durationMs: 10,
      };

      const responseMessage: CardRuntimeMessage<BridgeResponsePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'resp-1',
        type: 'bridge-response',
        timestamp: new Date().toISOString(),
        payload: responsePayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: responseMessage }));

      const result = await invokePromise;
      expect(result).toEqual({ content: 'file content' });
    });

    it('invoke 失败应该抛出 IframeBridgeError', async () => {
      const invokePromise = bridge.invoke('file', 'read', { path: '/not-found.txt' });

      const requestMessage = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage<BridgeRequestPayload>;

      const responsePayload: BridgeResponsePayload = {
        requestId: requestMessage.payload.requestId,
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'File not found',
        },
        durationMs: 5,
      };

      const responseMessage: CardRuntimeMessage<BridgeResponsePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'resp-1',
        type: 'bridge-response',
        timestamp: new Date().toISOString(),
        payload: responsePayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: responseMessage }));

      await expect(invokePromise).rejects.toThrow(IframeBridgeError);
      await expect(invokePromise).rejects.toMatchObject({
        code: 'FILE_NOT_FOUND',
        message: 'File not found',
      });
    });

    it('未初始化时调用 invoke 应该抛出错误', async () => {
      const uninitializedBridge = new IframeBridge();

      await expect(
        uninitializedBridge.invoke('file', 'read', {})
      ).rejects.toMatchObject({
        code: IframeBridgeErrorCode.NOT_INITIALIZED,
      });
    });
  });

  describe('资源请求', () => {
    beforeEach(async () => {
      const startPromise = bridge.start('renderer');

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: {
          config: {},
          themeId: 'default',
          themeVariables: {},
          locale: 'zh-CN',
          resourceMap: {},
          pluginId: 'test.plugin',
          pluginVersion: '1.0.0',
          mode: 'renderer',
          hostVersion: '1.0.0',
        },
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));
      await startPromise;
      mockPostMessage.mockClear();
    });

    it('requestResource 应该返回资源 URL', async () => {
      const resourcePromise = bridge.requestResource('image-001', 'image');

      const requestMessage = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage<ResourceRequestPayload>;
      expect(requestMessage.type).toBe('resource-request');

      const responsePayload: ResourceResponsePayload = {
        requestId: requestMessage.payload.requestId,
        success: true,
        url: 'chips-resource://image-001.png',
        mimeType: 'image/png',
      };

      const responseMessage: CardRuntimeMessage<ResourceResponsePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'resp-1',
        type: 'resource-response',
        timestamp: new Date().toISOString(),
        payload: responsePayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: responseMessage }));

      const result = await resourcePromise;
      expect(result.url).toBe('chips-resource://image-001.png');
      expect(result.mimeType).toBe('image/png');
    });
  });

  describe('事件监听', () => {
    beforeEach(async () => {
      const startPromise = bridge.start('renderer');

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: {
          config: {},
          themeId: 'default',
          themeVariables: { '--bg': '#fff' },
          locale: 'zh-CN',
          resourceMap: {},
          pluginId: 'test.plugin',
          pluginVersion: '1.0.0',
          mode: 'renderer',
          hostVersion: '1.0.0',
        },
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));
      await startPromise;
    });

    it('应该能监听主题更新事件', async () => {
      const themeUpdateHandler = vi.fn();
      bridge.on('theme-update', themeUpdateHandler);

      const themePayload: ThemeUpdatePayload = {
        themeId: 'dark',
        themeVariables: { '--bg': '#000', '--text': '#fff' },
      };

      const themeMessage: CardRuntimeMessage<ThemeUpdatePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'theme-1',
        type: 'theme-update',
        timestamp: new Date().toISOString(),
        payload: themePayload,
      };

      window.dispatchEvent(new MessageEvent('message', { data: themeMessage }));

      expect(themeUpdateHandler).toHaveBeenCalledWith(themePayload);
      expect(bridge.getThemeVariables()).toEqual({ '--bg': '#000', '--text': '#fff' });
    });

    it('once 应该只触发一次', async () => {
      const handler = vi.fn();
      bridge.once('theme-update', handler);

      const themePayload: ThemeUpdatePayload = {
        themeId: 'dark',
        themeVariables: {},
      };

      const themeMessage: CardRuntimeMessage<ThemeUpdatePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'theme-1',
        type: 'theme-update',
        timestamp: new Date().toISOString(),
        payload: themePayload,
      };

      // 发送两次
      window.dispatchEvent(new MessageEvent('message', { data: themeMessage }));
      window.dispatchEvent(new MessageEvent('message', { data: themeMessage }));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('取消订阅应该生效', async () => {
      const handler = vi.fn();
      const unsubscribe = bridge.on('theme-update', handler);

      unsubscribe();

      const themeMessage: CardRuntimeMessage<ThemeUpdatePayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'theme-1',
        type: 'theme-update',
        timestamp: new Date().toISOString(),
        payload: { themeId: 'dark', themeVariables: {} },
      };

      window.dispatchEvent(new MessageEvent('message', { data: themeMessage }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('尺寸通知', () => {
    beforeEach(async () => {
      const startPromise = bridge.start('renderer');

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: {
          config: {},
          themeId: 'default',
          themeVariables: {},
          locale: 'zh-CN',
          resourceMap: {},
          pluginId: 'test.plugin',
          pluginVersion: '1.0.0',
          mode: 'renderer',
          hostVersion: '1.0.0',
        },
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));
      await startPromise;
      mockPostMessage.mockClear();
    });

    it('notifyResize 应该发送正确的消息', () => {
      bridge.notifyResize(800, 600, true);

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      const message = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage;

      expect(message.type).toBe('resize');
      expect(message.payload).toEqual({
        width: 800,
        height: 600,
        natural: true,
      });
    });
  });

  describe('错误报告', () => {
    beforeEach(async () => {
      const startPromise = bridge.start('renderer');

      const initMessage: CardRuntimeMessage<InitPayload> = {
        protocol: PROTOCOL_NAME,
        version: PROTOCOL_VERSION,
        messageId: 'init-1',
        type: 'init',
        timestamp: new Date().toISOString(),
        payload: {
          config: {},
          themeId: 'default',
          themeVariables: {},
          locale: 'zh-CN',
          resourceMap: {},
          pluginId: 'test.plugin',
          pluginVersion: '1.0.0',
          mode: 'renderer',
          hostVersion: '1.0.0',
        },
      };

      window.dispatchEvent(new MessageEvent('message', { data: initMessage }));
      await startPromise;
      mockPostMessage.mockClear();
    });

    it('reportError 应该发送错误消息', () => {
      bridge.reportError('TEST_ERROR', 'Test error message', { detail: 'info' }, true);

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      const message = mockPostMessage.mock.calls[0][0] as CardRuntimeMessage;

      expect(message.type).toBe('error');
      expect(message.payload).toMatchObject({
        code: 'TEST_ERROR',
        message: 'Test error message',
        details: { detail: 'info' },
        recoverable: true,
      });
    });
  });

  describe('消息过滤', () => {
    it('应该忽略非卡片运行时协议的消息', async () => {
      vi.useFakeTimers();

      const startPromise = bridge.start('renderer');

      // 发送非协议消息
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'other', data: 'test' },
      }));

      // 发送错误协议的消息
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          protocol: 'wrong-protocol',
          version: '1.0.0',
          messageId: 'test',
          type: 'init',
          timestamp: new Date().toISOString(),
          payload: {},
        },
      }));

      // 验证 bridge 仍在等待正确的 init 消息
      vi.advanceTimersByTime(15000);

      await expect(startPromise).rejects.toThrow();
      vi.useRealTimers();
    }, 20000);
  });
});

describe('IframeBridgeError', () => {
  it('应该正确创建错误实例', () => {
    const error = new IframeBridgeError('TEST_CODE', 'Test message', { key: 'value' });

    expect(error.name).toBe('IframeBridgeError');
    expect(error.code).toBe('TEST_CODE');
    expect(error.message).toBe('Test message');
    expect(error.details).toEqual({ key: 'value' });
    expect(error instanceof Error).toBe(true);
  });
});
