/**
 * 错误类型单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  TemplateErrorCode,
  ChipsError,
  ConfigError,
  ResourceError,
  UploadError,
} from '../../src/types/errors';

describe('TemplateErrorCode', () => {
  it('should have configuration error codes', () => {
    expect(TemplateErrorCode.INVALID_CONFIG).toBe('TEMPLATE-E1001');
    expect(TemplateErrorCode.MISSING_FIELD).toBe('TEMPLATE-E1002');
  });

  it('should have resource error codes', () => {
    expect(TemplateErrorCode.LOAD_FAILED).toBe('TEMPLATE-E2001');
    expect(TemplateErrorCode.RESOURCE_NOT_FOUND).toBe('TEMPLATE-E2002');
  });

  it('should have upload error codes', () => {
    expect(TemplateErrorCode.UPLOAD_FAILED).toBe('TEMPLATE-E3001');
  });

  it('should have runtime error codes', () => {
    expect(TemplateErrorCode.RENDER_FAILED).toBe('TEMPLATE-E4001');
    expect(TemplateErrorCode.EDITOR_NOT_INITIALIZED).toBe('TEMPLATE-E4002');
  });
});

describe('ChipsError', () => {
  it('should create error with code and message', () => {
    const error = new ChipsError('TEST-001', 'Test error');
    expect(error.code).toBe('TEST-001');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ChipsError');
    expect(error).toBeInstanceOf(Error);
  });

  it('should support details', () => {
    const details = { field: 'test' };
    const error = new ChipsError('TEST-001', 'Test', details);
    expect(error.details).toEqual(details);
  });
});

describe('ConfigError', () => {
  it('should create with INVALID_CONFIG code', () => {
    const error = new ConfigError('Invalid config');
    expect(error.code).toBe(TemplateErrorCode.INVALID_CONFIG);
    expect(error.name).toBe('ConfigError');
    expect(error).toBeInstanceOf(ChipsError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ResourceError', () => {
  it('should create with custom code', () => {
    const error = new ResourceError(
      TemplateErrorCode.LOAD_FAILED,
      'Failed to load'
    );
    expect(error.code).toBe(TemplateErrorCode.LOAD_FAILED);
    expect(error.name).toBe('ResourceError');
  });
});

describe('UploadError', () => {
  it('should create with custom code', () => {
    const error = new UploadError(
      TemplateErrorCode.FILE_TOO_LARGE,
      'File too large'
    );
    expect(error.code).toBe(TemplateErrorCode.FILE_TOO_LARGE);
    expect(error.name).toBe('UploadError');
  });
});
