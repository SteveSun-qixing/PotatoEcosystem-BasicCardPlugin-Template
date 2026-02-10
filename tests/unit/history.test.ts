/**
 * 撤销/重做管理器单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UndoManager } from '../../src/editor/history';

describe('UndoManager', () => {
  let manager: UndoManager<string>;

  beforeEach(() => {
    manager = new UndoManager<string>(10);
  });

  describe('initial state', () => {
    it('should start with empty history', () => {
      expect(manager.size).toBe(0);
      expect(manager.canUndo).toBe(false);
      expect(manager.canRedo).toBe(false);
      expect(manager.current).toBeUndefined();
    });
  });

  describe('push', () => {
    it('should add state to history', () => {
      manager.push('state1');
      expect(manager.size).toBe(1);
      expect(manager.current).toBe('state1');
    });

    it('should track multiple states', () => {
      manager.push('state1');
      manager.push('state2');
      manager.push('state3');
      expect(manager.size).toBe(3);
      expect(manager.current).toBe('state3');
    });

    it('should enable undo after push', () => {
      manager.push('state1');
      manager.push('state2');
      expect(manager.canUndo).toBe(true);
    });

    it('should respect max size', () => {
      const small = new UndoManager<number>(3);
      small.push(1);
      small.push(2);
      small.push(3);
      small.push(4);
      expect(small.size).toBe(3);
    });
  });

  describe('undo', () => {
    it('should return previous state', () => {
      manager.push('state1');
      manager.push('state2');
      const result = manager.undo();
      expect(result).toBe('state1');
    });

    it('should return undefined when cannot undo', () => {
      manager.push('state1');
      expect(manager.undo()).toBeUndefined();
    });

    it('should enable redo after undo', () => {
      manager.push('state1');
      manager.push('state2');
      manager.undo();
      expect(manager.canRedo).toBe(true);
    });

    it('should support multiple undo steps', () => {
      manager.push('state1');
      manager.push('state2');
      manager.push('state3');

      expect(manager.undo()).toBe('state2');
      expect(manager.undo()).toBe('state1');
      expect(manager.canUndo).toBe(false);
    });
  });

  describe('redo', () => {
    it('should return next state', () => {
      manager.push('state1');
      manager.push('state2');
      manager.undo();
      const result = manager.redo();
      expect(result).toBe('state2');
    });

    it('should return undefined when cannot redo', () => {
      manager.push('state1');
      expect(manager.redo()).toBeUndefined();
    });

    it('should support multiple redo steps', () => {
      manager.push('state1');
      manager.push('state2');
      manager.push('state3');

      manager.undo();
      manager.undo();

      expect(manager.redo()).toBe('state2');
      expect(manager.redo()).toBe('state3');
      expect(manager.canRedo).toBe(false);
    });
  });

  describe('push after undo (discard redo)', () => {
    it('should discard redo history when pushing new state', () => {
      manager.push('state1');
      manager.push('state2');
      manager.push('state3');

      manager.undo(); // → state2
      manager.push('state4');

      expect(manager.canRedo).toBe(false);
      expect(manager.current).toBe('state4');
      expect(manager.size).toBe(3); // state1, state2, state4
    });
  });

  describe('clear', () => {
    it('should clear all history', () => {
      manager.push('state1');
      manager.push('state2');
      manager.clear();

      expect(manager.size).toBe(0);
      expect(manager.canUndo).toBe(false);
      expect(manager.canRedo).toBe(false);
      expect(manager.current).toBeUndefined();
    });
  });

  describe('with complex objects', () => {
    it('should work with object states', () => {
      const objManager = new UndoManager<{ name: string; count: number }>();

      objManager.push({ name: 'a', count: 1 });
      objManager.push({ name: 'b', count: 2 });

      const prev = objManager.undo();
      expect(prev).toEqual({ name: 'a', count: 1 });
    });
  });
});
