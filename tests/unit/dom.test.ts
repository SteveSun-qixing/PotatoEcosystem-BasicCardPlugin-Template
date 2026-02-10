/**
 * DOM 工具函数单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  generateId,
  escapeHtml,
  debounce,
  throttle,
  arrayMove,
} from '../../src/utils/dom';

describe('generateId', () => {
  it('should generate 10-character ID', () => {
    const id = generateId();
    expect(id).toHaveLength(10);
  });

  it('should only contain valid characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9A-Za-z]{10}$/);
  });

  it('should generate unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).not.toContain('<script>');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle normal text', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('should escape ampersand', () => {
    const result = escapeHtml('a & b');
    expect(result).toContain('&amp;');
  });
});

describe('debounce', () => {
  it('should delay execution', async () => {
    let count = 0;
    const fn = debounce(() => { count++; }, 50);

    fn();
    fn();
    fn();

    expect(count).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(count).toBe(1);
  });
});

describe('throttle', () => {
  it('should execute immediately on first call', () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 100);

    fn();
    expect(count).toBe(1);
  });

  it('should throttle subsequent calls', () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 100);

    fn();
    fn();
    fn();

    expect(count).toBe(1);
  });
});

describe('arrayMove', () => {
  it('should move element forward', () => {
    const result = arrayMove([1, 2, 3, 4], 0, 2);
    expect(result).toEqual([2, 3, 1, 4]);
  });

  it('should move element backward', () => {
    const result = arrayMove([1, 2, 3, 4], 3, 0);
    expect(result).toEqual([4, 1, 2, 3]);
  });

  it('should not modify original array', () => {
    const original = [1, 2, 3];
    const result = arrayMove(original, 0, 2);
    expect(original).toEqual([1, 2, 3]);
    expect(result).not.toBe(original);
  });

  it('should handle same position', () => {
    const result = arrayMove([1, 2, 3], 1, 1);
    expect(result).toEqual([1, 2, 3]);
  });
});
