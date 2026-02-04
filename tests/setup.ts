/**
 * 测试配置文件
 */

import { beforeEach, afterEach, vi } from 'vitest';

// 全局测试配置
beforeEach(() => {
  // 每个测试前的设置
});

afterEach(() => {
  // 每个测试后的清理
  vi.clearAllMocks();
});

// Mock 薯片内核
export function createMockCore() {
  return {
    request: vi.fn(),
    registerService: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
}
