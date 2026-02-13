# 卡片插件 iframe 通信协议文档

**文档版本**：1.0.0
**编写日期**：2026-02-13
**适用对象**：卡片插件开发者、宿主应用开发者

---

## 1. 概述

本文档定义卡片插件在 iframe 中运行时与宿主应用之间的 postMessage 通信协议。

### 1.1 设计原则

- **安全隔离**：卡片插件运行在沙箱化的 iframe 中，无法直接访问宿主的 DOM 或 Node.js API
- **统一协议**：所有通信使用标准化的消息格式，便于调试和扩展
- **异步通信**：所有请求-响应模式均为异步，支持超时处理

### 1.2 iframe 沙箱配置

```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  loading="lazy"
></iframe>
```

**禁止的能力**：
- `allow-top-navigation`：禁止导航顶层窗口
- `allow-popups-to-escape-sandbox`：禁止弹出窗口逃逸沙箱

---

## 2. 消息格式

### 2.1 基础消息结构

所有 postMessage 消息必须遵循以下格式：

```typescript
interface CardRuntimeMessage<T = unknown> {
  /** 协议标识，固定为 'chips-card-runtime' */
  protocol: 'chips-card-runtime';
  /** 协议版本 */
  version: '1.0.0';
  /** 消息唯一标识，用于请求-响应匹配 */
  messageId: string;
  /** 消息类型 */
  type: CardMessageType;
  /** ISO 8601 时间戳 */
  timestamp: string;
  /** 消息负载 */
  payload: T;
}
```

### 2.2 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `init` | 宿主 → iframe | 初始化数据 |
| `ready` | iframe → 宿主 | iframe 就绪通知 |
| `bridge-request` | iframe → 宿主 | Bridge API 调用请求 |
| `bridge-response` | 宿主 → iframe | Bridge API 调用响应 |
| `resource-request` | iframe → 宿主 | 资源请求 |
| `resource-response` | 宿主 → iframe | 资源响应 |
| `resize` | iframe → 宿主 | 尺寸变化通知 |
| `theme-update` | 宿主 → iframe | 主题更新通知 |
| `config-change` | iframe → 宿主 | 配置变更通知（编辑器） |
| `dispose` | 宿主 → iframe | 销毁通知 |
| `error` | iframe → 宿主 | 错误上报 |

---

## 3. 初始化流程

### 3.1 时序图

```
宿主                                iframe
  |                                    |
  |-------- 创建 iframe --------------->|
  |                                    |
  |                                    |--- 加载完成
  |                                    |
  |<-------- ready --------------------|
  |                                    |
  |-------- init --------------------->|
  |                                    |
  |                                    |--- 渲染内容
  |                                    |
  |<-------- resize -------------------|
  |                                    |
```

### 3.2 ready 消息

iframe 加载完成后发送：

```typescript
interface ReadyPayload {
  /** 运行模式 */
  mode: 'renderer' | 'editor';
  /** 支持的协议版本 */
  protocolVersion: string;
}
```

### 3.3 init 消息

宿主收到 ready 后发送：

```typescript
interface InitPayload {
  /** 卡片配置数据 */
  config: Record<string, unknown>;
  /** 当前主题 ID */
  themeId: string;
  /** 主题 CSS 变量 */
  themeVariables: Record<string, string>;
  /** 当前语言 */
  locale: string;
  /** 资源映射表（资源 ID -> 可访问 URL） */
  resourceMap: Record<string, string>;
  /** 插件 ID */
  pluginId: string;
  /** 插件版本 */
  pluginVersion: string;
  /** 运行模式 */
  mode: 'renderer' | 'editor';
  /** 是否为只读模式（仅 renderer） */
  readonly?: boolean;
  /** 宿主版本 */
  hostVersion: string;
}
```

---

## 4. Bridge API 调用

### 4.1 请求格式

```typescript
interface BridgeRequestPayload {
  /** 请求 ID，用于匹配响应 */
  requestId: string;
  /** 服务命名空间 */
  namespace: string;
  /** 动作名称 */
  action: string;
  /** 调用参数 */
  params?: unknown;
}
```

### 4.2 响应格式

**成功响应**：

```typescript
interface BridgeResponsePayload {
  requestId: string;
  success: true;
  data: unknown;
  durationMs: number;
}
```

**失败响应**：

```typescript
interface BridgeResponsePayload {
  requestId: string;
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  durationMs: number;
}
```

### 4.3 使用示例

```typescript
// iframe 内部
const bridge = getBridge();

// 调用 i18n 服务
const text = await bridge.invoke('i18n', 'translate', { key: 'common.save' });

// 调用 file 服务
const content = await bridge.invoke('file', 'read', { path: '/data/config.yaml' });
```

---

## 5. 资源请求

### 5.1 请求格式

```typescript
interface ResourceRequestPayload {
  /** 请求 ID */
  requestId: string;
  /** 资源标识（相对路径或资源 ID） */
  resourceId: string;
  /** 资源类型提示 */
  type?: 'image' | 'video' | 'audio' | 'file' | 'other';
}
```

### 5.2 响应格式

```typescript
interface ResourceResponsePayload {
  requestId: string;
  success: boolean;
  /** 资源可访问 URL */
  url?: string;
  /** 资源 MIME 类型 */
  mimeType?: string;
  error?: {
    code: string;
    message: string;
  };
}
```

### 5.3 资源 URL 协议

宿主返回的资源 URL 可能使用以下协议：

- `chips-resource://`：薯片资源协议，由宿主拦截处理
- `file://`：本地文件（仅在允许的情况下）
- `blob:`：临时 Blob URL
- `data:`：Data URL（小文件）

---

## 6. 尺寸通知

### 6.1 消息格式

```typescript
interface ResizePayload {
  /** 内容宽度 */
  width: number;
  /** 内容高度 */
  height: number;
  /** 是否为自然尺寸 */
  natural?: boolean;
}
```

### 6.2 触发时机

- 首次渲染完成后
- 内容高度变化时（如展开/折叠）
- 窗口尺寸变化导致重排后

### 6.3 节流策略

建议使用 ResizeObserver 监听，并进行节流处理（16ms 一帧）。

---

## 7. 主题更新

### 7.1 消息格式

```typescript
interface ThemeUpdatePayload {
  /** 新主题 ID */
  themeId: string;
  /** 新主题 CSS 变量 */
  themeVariables: Record<string, string>;
}
```

### 7.2 处理方式

iframe 收到主题更新后，应将 CSS 变量应用到 `document.documentElement`：

```typescript
function applyThemeVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
}
```

---

## 8. 配置变更（编辑器专用）

### 8.1 消息格式

```typescript
interface ConfigChangePayload {
  /** 新配置 */
  config: Record<string, unknown>;
  /** 是否为最终保存 */
  final: boolean;
}
```

### 8.2 使用场景

- `final: false`：实时预览，用户正在编辑
- `final: true`：最终保存，用户点击保存按钮

---

## 9. 错误上报

### 9.1 消息格式

```typescript
interface ErrorPayload {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: unknown;
  /** 错误堆栈（仅开发模式） */
  stack?: string;
  /** 是否可恢复 */
  recoverable: boolean;
}
```

### 9.2 错误代码

| 代码 | 说明 |
|------|------|
| `IFRAME_PROTOCOL_MISMATCH` | 协议版本不匹配 |
| `IFRAME_INVALID_MESSAGE` | 消息格式无效 |
| `IFRAME_REQUEST_TIMEOUT` | 请求超时 |
| `IFRAME_NOT_INITIALIZED` | 未初始化 |
| `IFRAME_BRIDGE_CALL_FAILED` | Bridge 调用失败 |
| `IFRAME_RESOURCE_LOAD_FAILED` | 资源加载失败 |
| `IFRAME_INVALID_CONFIG` | 配置无效 |
| `IFRAME_RENDER_FAILED` | 渲染失败 |
| `IFRAME_UNKNOWN_ERROR` | 未知错误 |

---

## 10. 销毁通知

### 10.1 消息格式

```typescript
interface DisposePayload {
  /** 销毁原因 */
  reason: 'unload' | 'navigation' | 'close';
}
```

### 10.2 处理方式

iframe 收到销毁通知后应：

1. 停止所有进行中的请求
2. 清理事件监听器
3. 释放资源

---

## 11. 安全考虑

### 11.1 消息来源验证

iframe 应验证消息来源：

```typescript
window.addEventListener('message', (event) => {
  // 验证协议
  if (event.data?.protocol !== 'chips-card-runtime') {
    return;
  }
  // 处理消息...
});
```

### 11.2 禁止的操作

iframe 内部禁止：

- 使用 `require()` 或 `import` Node.js 模块
- 直接访问 `window.parent` 的 DOM
- 使用 `eval()` 或 `new Function()`
- 发起跨域请求（除非通过 Bridge）

---

## 12. 开发调试

### 12.1 消息日志

开发模式下，可以在控制台查看所有 postMessage 通信：

```typescript
// 在 iframe 中
window.addEventListener('message', (event) => {
  if (event.data?.protocol === 'chips-card-runtime') {
    console.log('[iframe] Received:', event.data.type, event.data);
  }
});
```

### 12.2 Mock Bridge

使用 `chipsd dev` 命令启动开发服务器时，会自动注入 Mock Bridge API，支持本地开发调试。

---

## 附录 A：完整类型定义

完整的 TypeScript 类型定义请参考：

- `src/bridge/message-types.ts`：消息类型定义
- `src/bridge/iframe-bridge.ts`：Bridge 实现

---

## 附录 B：版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| 1.0.0 | 2026-02-13 | 初始版本 |
