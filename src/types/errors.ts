/**
 * 错误代码和错误类定义
 *
 * 使用标准化错误码格式：[插件前缀]-E[分类编号]
 * - 1xxx: 配置错误
 * - 2xxx: 资源错误
 * - 3xxx: 上传错误
 * - 4xxx: 运行时错误
 *
 * ⚠️ 使用时请修改前缀为你的卡片类型（如 IMAGE、RICHTEXT）
 */

/**
 * 模板卡片错误代码
 * ⚠️ 修改枚举名称和前缀
 */
export enum TemplateErrorCode {
  // === 配置错误 (1xxx) ===
  /** 无效的配置 */
  INVALID_CONFIG = 'TEMPLATE-E1001',
  /** 缺少必需字段 */
  MISSING_FIELD = 'TEMPLATE-E1002',

  // ⚠️ 添加你的配置错误代码
  // INVALID_XXX = 'TEMPLATE-E1003',

  // === 资源错误 (2xxx) ===
  /** 资源加载失败 */
  LOAD_FAILED = 'TEMPLATE-E2001',
  /** 资源未找到 */
  RESOURCE_NOT_FOUND = 'TEMPLATE-E2002',

  // ⚠️ 添加你的资源错误代码

  // === 上传错误 (3xxx) ===
  /** 上传失败 */
  UPLOAD_FAILED = 'TEMPLATE-E3001',
  /** 文件过大 */
  FILE_TOO_LARGE = 'TEMPLATE-E3002',
  /** 不支持的格式 */
  UNSUPPORTED_FORMAT = 'TEMPLATE-E3003',

  // === 运行时错误 (4xxx) ===
  /** 渲染失败 */
  RENDER_FAILED = 'TEMPLATE-E4001',
  /** 编辑器未初始化 */
  EDITOR_NOT_INITIALIZED = 'TEMPLATE-E4002',
}

/**
 * 薯片错误基类
 *
 * 所有自定义错误都继承此类，携带标准化错误码和详情
 */
export class ChipsError extends Error {
  constructor(
    public readonly code: TemplateErrorCode | string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ChipsError';
  }
}

/**
 * 配置错误
 */
export class ConfigError extends ChipsError {
  constructor(message: string, details?: unknown) {
    super(TemplateErrorCode.INVALID_CONFIG, message, details);
    this.name = 'ConfigError';
  }
}

/**
 * 资源错误
 */
export class ResourceError extends ChipsError {
  constructor(code: TemplateErrorCode, message: string, details?: unknown) {
    super(code, message, details);
    this.name = 'ResourceError';
  }
}

/**
 * 上传错误
 */
export class UploadError extends ChipsError {
  constructor(code: TemplateErrorCode, message: string, details?: unknown) {
    super(code, message, details);
    this.name = 'UploadError';
  }
}
