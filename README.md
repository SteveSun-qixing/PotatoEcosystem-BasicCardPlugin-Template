# 基础卡片插件模板 (Basic Card Plugin Template)

**版本**: 2.0.0
**更新日期**: 2026-02-08
**状态**: 标准模板

---

## 模板说明

这是薯片生态标准的基础卡片插件模板，包含完整的项目结构、标准化代码和必要的文档。

开发新的基础卡片插件时，请复制此模板并根据具体卡片类型进行定制。

**本模板严格遵循薯片生态的所有设计规范：**
- 中心路由架构（所有通信通过薯片内核）
- 零硬编码文本（使用多语言系统）
- CSS 变量主题系统（样式由主题包注入）
- 10 位 62 进制 ID 规范
- 标准接口（从 `@chips/sdk` 导入）

---

## 使用方法

### 1. 复制模板

```bash
cp -r Basic-Card-Plugin-Template My-Custom-Card-Plugin
cd My-Custom-Card-Plugin
```

### 2. 全局替换占位符

将 `Template`/`template`/`TEMPLATE` 替换为你的卡片类型名。

### 3. 安装依赖

```bash
# 在主仓库根目录
cd /path/to/Project-12
pnpm install
```

### 4. 开始开发

```bash
pnpm run dev     # 启动开发服务器
pnpm test        # 运行测试
pnpm run build   # 构建
```

---

## 项目结构

```
Basic-Card-Plugin-Template/
├── src/
│   ├── index.ts               # 入口文件
│   ├── plugin.ts              # 插件主类（实现 BaseCardPlugin 接口）
│   ├── renderer/              # 渲染组件
│   │   └── index.ts
│   ├── editor/                # 编辑组件
│   │   ├── index.ts
│   │   └── history.ts         # 撤销/重做管理器
│   ├── types/                 # TypeScript 类型定义
│   │   ├── config.ts          # 卡片配置
│   │   ├── state.ts           # 运行时状态
│   │   ├── commands.ts        # 编辑命令
│   │   ├── options.ts         # 渲染/编辑选项
│   │   ├── validation.ts      # 验证结果
│   │   ├── constants.ts       # 常量和默认配置
│   │   ├── errors.ts          # 错误码和错误类
│   │   └── events.ts          # 事件类型
│   └── utils/                 # 工具函数
│       ├── i18n.ts            # 多语言工具
│       ├── validator.ts       # 配置验证器
│       └── dom.ts             # DOM 和通用工具
├── tests/                     # 测试文件
│   ├── setup.ts               # 测试环境配置
│   ├── unit/                  # 单元测试
│   └── integration/           # 集成测试
├── assets/
│   └── i18n/
│       └── dev_vocabulary.yaml
├── manifest.yaml              # 插件清单
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 核心文件说明

### manifest.yaml
插件的元数据清单，定义插件的基本信息、配置 Schema、权限需求等。

### src/plugin.ts
插件主类，实现 `BaseCardPlugin` 接口（从 `@chips/sdk` 导入），管理生命周期。

### src/renderer/
渲染组件实现，负责在查看模式下显示卡片内容。

### src/editor/
编辑组件实现，负责在编辑模式下编辑卡片内容。包含 `UndoManager` 撤销/重做管理器。

### src/types/
TypeScript 类型定义，包含配置、状态、命令、错误码等完整的类型系统。

### src/utils/
工具函数，包含验证器、多语言、DOM 操作等。

---

## 开发检查清单

### 架构规范
- [ ] 所有通信通过薯片内核路由（`core.request()` / `core.registerService()`）
- [ ] 实现 `BaseCardPlugin` 接口（从 `@chips/sdk` 导入）
- [ ] 渲染器和编辑器完全分离
- [ ] 模块之间不直接调用

### 代码规范
- [ ] 零硬编码文本（使用 `t()` 函数）
- [ ] 零硬编码样式（使用 CSS 变量）
- [ ] 所有配置通过配置文件管理
- [ ] 完整的 TypeScript 类型定义

### 功能规范
- [ ] 实现完整的生命周期方法
- [ ] 注册插件服务到内核
- [ ] 支持主题系统
- [ ] 实现撤销重做功能
- [ ] 标准化错误处理（错误码 + 错误类）

### 测试规范
- [ ] 单元测试覆盖率 >= 80%
- [ ] 关键功能有集成测试
- [ ] 所有公开 API 有测试用例

---

## 相关文档

- [模板使用指南](docs/模板使用指南.md)
- [基础卡片开发手册](../基础卡片开发手册/)
- [插件开发规范](../../生态共用/07-插件开发规范.md)
- [前端接口标准](../../生态共用/05-前端接口标准.md)
- [开发规范总则](../../生态共用/08-开发规范总则.md)
- [多语言系统规范](../../生态共用/11-多语言系统规范.md)

---

## 许可证

MIT License

---

**模板维护者**: Chips 生态核心团队
**最后更新**: 2026-02-08
