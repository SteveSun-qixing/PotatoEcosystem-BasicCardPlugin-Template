/**
 * 渲染器 iframe 入口
 *
 * 在 iframe 中运行的渲染器主入口文件。
 * 负责初始化 Bridge 通信、接收配置、渲染内容。
 */

import { createApp, type App } from 'vue';
import { initBridge, getBridge, type InitPayload } from '../../bridge';
import RendererApp from './RendererApp.vue';

/** Vue 应用实例 */
let app: App | null = null;

/** 初始化数据 */
let initData: InitPayload | null = null;

/**
 * 应用主题变量到文档
 */
function applyThemeVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
}

/**
 * 设置 ResizeObserver 监听内容高度变化
 */
function setupResizeObserver(element: HTMLElement): ResizeObserver {
  const bridge = getBridge();
  let lastHeight = 0;

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const height = Math.ceil(entry.contentRect.height);
      // 只在高度变化时通知
      if (height !== lastHeight) {
        lastHeight = height;
        bridge.notifyResize(
          Math.ceil(entry.contentRect.width),
          height,
          true
        );
      }
    }
  });

  observer.observe(element);
  return observer;
}

/**
 * 初始化渲染器
 */
async function init(): Promise<void> {
  try {
    // 初始化 Bridge 通信
    initData = await initBridge('renderer');

    // 应用主题变量
    applyThemeVariables(initData.themeVariables);

    // 获取挂载点
    const mountPoint = document.getElementById('app');
    if (!mountPoint) {
      throw new Error('Mount point #app not found');
    }

    // 创建 Vue 应用
    app = createApp(RendererApp, {
      config: initData.config,
      resourceMap: initData.resourceMap,
      locale: initData.locale,
      readonly: initData.readonly ?? true,
    });

    // 挂载应用
    app.mount(mountPoint);

    // 设置尺寸监听
    setupResizeObserver(mountPoint);

    // 监听主题更新
    const bridge = getBridge();
    bridge.on('theme-update', (payload: { themeVariables: Record<string, string> }) => {
      applyThemeVariables(payload.themeVariables);
    });

    // 监听销毁事件
    bridge.on('dispose', () => {
      cleanup();
    });

  } catch (error) {
    console.error('Renderer initialization failed:', error);

    // 报告错误
    const bridge = getBridge();
    bridge.reportError(
      'RENDER_INIT_FAILED',
      error instanceof Error ? error.message : String(error),
      undefined,
      false
    );
  }
}

/**
 * 清理资源
 */
function cleanup(): void {
  if (app) {
    app.unmount();
    app = null;
  }
}

// 页面卸载时清理
window.addEventListener('beforeunload', cleanup);

// 启动初始化
init();
