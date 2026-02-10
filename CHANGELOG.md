# 更新日志

## [Unreleased]

## [2.0.0] - 2026-02-08

### Changed
- **重构**: 以薯片生态设计文档为标准全面重构模板
- **接口**: 标准化从 `@chips/sdk` 导入 `BaseCardPlugin`、`ChipsCore`、`PluginMetadata` 等接口
- **服务注册**: 使用标准 `core.registerService()` 方式注册服务
- **类型系统**: 重构所有类型定义，添加更完整的示例和注释
- **验证器**: 实现分层验证逻辑，深拷贝默认配置，深合并配置
- **国际化**: 添加 `normalizeKey()`、`hasKey()`、`getAllKeys()`，完善词汇表
- **渲染器**: 添加 ResizeObserver 响应式支持、CSS 变量主题应用
- **编辑器**: 使用 UndoManager 实现标准撤销/重做，添加键盘快捷键
- **配置文件**: 完善路径别名、覆盖率阈值、构建优化

### Added
- **错误系统**: 新增 `types/errors.ts`，标准化错误码和错误类层级
- **事件系统**: 新增 `types/events.ts`，定义编辑器/渲染器事件
- **撤销重做**: 新增 `editor/history.ts`，泛型 UndoManager 类
- **DOM 工具**: 新增 `utils/dom.ts`，包含 generateId、escapeHtml、debounce、throttle、arrayMove
- **资源解析**: EditorOptions 添加 `onResolveResource` 和 `onReleaseResolvedResource` 回调
- **完整测试**: 新增 validator、i18n、dom、errors、history 单元测试和集成测试
- **测试环境**: 完善 Mock（ResizeObserver、DOMParser、Image、FileReader、crypto）

## [1.0.0] - 2026-02-04

### Added
- 初始模板版本
- 标准项目结构
- 完整配置文件
- 代码模板和示例
- 测试框架配置
- 多语言支持框架
