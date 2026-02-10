/**
 * 撤销/重做管理器
 *
 * 泛型实现，可用于任何状态类型的撤销重做管理。
 * 基于快照模式：每次操作前记录完整状态快照。
 */

/**
 * 撤销/重做管理器
 *
 * @typeParam T - 状态类型（如配置对象或 HTML 字符串）
 *
 * @example
 * ```typescript
 * const history = new UndoManager<ImageCardConfig>(50);
 *
 * // 记录状态
 * history.push(currentConfig);
 *
 * // 撤销
 * if (history.canUndo) {
 *   const previousState = history.undo();
 *   applyState(previousState);
 * }
 *
 * // 重做
 * if (history.canRedo) {
 *   const nextState = history.redo();
 *   applyState(nextState);
 * }
 * ```
 */
export class UndoManager<T> {
  /** 历史记录栈 */
  private _stack: T[] = [];

  /** 当前位置指针 */
  private _position = -1;

  /** 最大记录数 */
  private _maxSize: number;

  /**
   * 创建撤销/重做管理器
   *
   * @param maxSize - 最大历史记录数（默认 50）
   */
  constructor(maxSize = 50) {
    this._maxSize = maxSize;
  }

  /**
   * 记录一个新状态
   *
   * 会清除当前位置之后的所有状态（重做历史被丢弃），
   * 然后将新状态推入栈顶。
   *
   * @param state - 要记录的状态快照
   */
  push(state: T): void {
    // 清除当前位置之后的历史（丢弃重做栈）
    this._stack = this._stack.slice(0, this._position + 1);

    // 推入新状态
    this._stack.push(state);

    // 如果超过最大记录数，移除最旧的
    if (this._stack.length > this._maxSize) {
      this._stack.shift();
    } else {
      this._position++;
    }
  }

  /**
   * 撤销，返回上一个状态
   *
   * @returns 上一个状态，如果无法撤销则返回 undefined
   */
  undo(): T | undefined {
    if (!this.canUndo) {
      return undefined;
    }

    this._position--;
    return this._stack[this._position];
  }

  /**
   * 重做，返回下一个状态
   *
   * @returns 下一个状态，如果无法重做则返回 undefined
   */
  redo(): T | undefined {
    if (!this.canRedo) {
      return undefined;
    }

    this._position++;
    return this._stack[this._position];
  }

  /**
   * 是否可以撤销
   */
  get canUndo(): boolean {
    return this._position > 0;
  }

  /**
   * 是否可以重做
   */
  get canRedo(): boolean {
    return this._position < this._stack.length - 1;
  }

  /**
   * 获取当前状态
   */
  get current(): T | undefined {
    if (this._position < 0 || this._position >= this._stack.length) {
      return undefined;
    }
    return this._stack[this._position];
  }

  /**
   * 获取历史记录数量
   */
  get size(): number {
    return this._stack.length;
  }

  /**
   * 清空所有历史
   */
  clear(): void {
    this._stack = [];
    this._position = -1;
  }
}
