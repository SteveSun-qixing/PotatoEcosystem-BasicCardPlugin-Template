# 基础卡片插件模板 (Basic Card Plugin Template)

**版本**: 1.0.0  
**更新日期**: 2026-02-04  
**状态**: 标准模板

---

## 📌 模板说明

这是薯片生态标准的基础卡片插件模板，包含完整的项目结构、标准化代码和必要的文档。

开发新的基础卡片插件时，请复制此模板并根据具体卡片类型进行定制。

---

## 🎯 使用方法

### 1. 复制模板

```bash
# 复制整个模板目录
cp -r Basic-Card-Plugin-Template My-Custom-Card-Plugin

cd My-Custom-Card-Plugin
```

### 2. 修改插件信息

在以下文件中替换模板占位符：

#### manifest.yaml
```yaml
id: "chipshub:my-card"  # 修改为你的插件ID
name: "我的卡片"         # 修改为你的卡片名称
cardType: "MyCard"      # 修改为你的卡片类型
```

#### package.json
```json
{
  "name": "@chips/my-card-plugin",  // 修改包名
  "description": "我的自定义卡片插件"  // 修改描述
}
```

#### src/plugin.ts
```typescript
export class MyCardPlugin implements BaseCardPlugin {
  readonly metadata: PluginMetadata = {
    id: 'chipshub:my-card',
    name: '我的卡片',
    cardType: 'MyCard',
    // ...
  };
}
```

### 3. 初始化Git仓库

```bash
# 初始化Git
git init

# 添加远程仓库
git remote add origin https://github.com/your-org/my-card-plugin.git

# 首次提交
git add .
git commit -m "feat: 初始化项目，基于标准模板"
git push -u origin main
```

### 4. 安装依赖

```bash
# 安装项目依赖
npm install

# 或使用pnpm
pnpm install
```

### 5. 开始开发

```bash
# 启动开发服务器
npm run dev

# 运行测试
npm test

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

---

## 📦 模板结构

```
Basic-Card-Plugin-Template/
├── .github/                    # GitHub Actions配置
│   └── workflows/
│       └── ci.yml             # CI/CD流程
├── docs/                      # 文档目录
│   ├── requirements/          # 需求文档
│   │   └── 01-需求规格说明书.md
│   ├── technical/             # 技术文档
│   │   ├── 01-架构设计.md
│   │   ├── 02-数据模型设计.md
│   │   ├── 03-接口定义.md
│   │   ├── 04-渲染组件设计.md
│   │   └── 05-编辑组件设计.md
│   └── development/           # 开发计划
│       └── 00-开发计划总览.md
├── src/                       # 源代码
│   ├── renderer/              # 渲染组件
│   │   ├── index.ts
│   │   ├── Renderer.ts
│   │   └── Renderer.vue
│   ├── editor/                # 编辑组件
│   │   ├── index.ts
│   │   ├── Editor.ts
│   │   └── Editor.vue
│   ├── types/                 # 类型定义
│   │   ├── index.ts
│   │   ├── config.ts
│   │   ├── state.ts
│   │   └── commands.ts
│   ├── utils/                 # 工具函数
│   │   ├── index.ts
│   │   ├── validator.ts
│   │   └── i18n.ts
│   ├── index.ts               # 入口文件
│   └── plugin.ts              # 插件主类
├── tests/                     # 测试文件
│   ├── unit/                  # 单元测试
│   │   ├── plugin.test.ts
│   │   └── validator.test.ts
│   ├── integration/           # 集成测试
│   │   └── plugin.test.ts
│   └── setup.ts               # 测试配置
├── assets/                    # 资源文件
│   ├── i18n/                  # 多语言
│   │   └── dev_vocabulary.yaml
│   └── icon.svg               # 插件图标
├── .gitignore                 # Git忽略文件
├── .eslintrc.cjs              # ESLint配置
├── .prettierrc                # Prettier配置
├── manifest.yaml              # 插件清单
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript配置
├── vite.config.ts             # Vite配置
├── vitest.config.ts           # 测试配置
├── LICENSE                    # 许可证
└── README.md                  # 项目说明
```

---

## 🔧 核心文件说明

### manifest.yaml
插件的元数据清单，定义插件的基本信息、配置schema、权限需求等。

### src/plugin.ts
插件主类，负责生命周期管理、渲染器和编辑器的创建。

### src/renderer/
渲染组件实现，负责在查看模式下显示卡片内容。

### src/editor/
编辑组件实现，负责在编辑模式下编辑卡片内容。

### src/types/
TypeScript类型定义，确保类型安全。

### src/utils/
工具函数，包含验证、多语言、DOM操作等。

---

## ✅ 开发检查清单

使用模板开发时，请确保：

### 架构规范
- [ ] 所有通信通过薯片内核路由
- [ ] 实现 BaseCardPlugin 接口
- [ ] 渲染器和编辑器完全分离
- [ ] 模块之间不直接调用

### 代码规范
- [ ] 零硬编码文本（使用多语言系统）
- [ ] 零硬编码样式（使用CSS变量）
- [ ] 所有配置通过配置文件管理
- [ ] 完整的TypeScript类型定义

### 功能规范
- [ ] 实现完整的生命周期方法
- [ ] 注册插件服务到内核
- [ ] 支持主题系统
- [ ] 实现撤销重做功能

### 测试规范
- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 关键功能有集成测试
- [ ] 所有公开API有测试用例

### 文档规范
- [ ] 完整的README
- [ ] 需求文档
- [ ] 技术文档
- [ ] API文档
- [ ] CHANGELOG

### Git规范
- [ ] 初始化Git仓库
- [ ] 配置 .gitignore
- [ ] 遵循提交规范
- [ ] 配置CI/CD

---

## 📚 相关文档

- [基础卡片开发手册](../基础卡片开发手册/)
- [插件开发规范](../../生态共用/07-插件开发规范.md)
- [开发规范总则](../../生态共用/08-开发规范总则.md)
- [多语言系统规范](../../生态共用/11-多语言系统规范.md)

---

## 💡 开发建议

1. **先设计后开发**: 先完成需求文档和技术文档，再开始编码
2. **遵循规范**: 严格遵循薯片生态的所有开发规范
3. **测试驱动**: 先写测试用例，再实现功能
4. **渐进增强**: 先实现核心功能，再添加高级特性
5. **持续集成**: 配置CI/CD，每次提交自动测试和构建

---

## 🤝 获取帮助

- **文档**: 查看 docs/ 目录中的完整文档
- **示例**: 参考 Rich-Text-Basic-Card-Plugin 的实现
- **规范**: 阅读生态共用文件夹中的各种规范
- **社区**: 加入薯片生态开发者社区

---

## 📄 许可证

MIT License

---

**模板维护者**: Chips生态核心团队  
**最后更新**: 2026-02-04
