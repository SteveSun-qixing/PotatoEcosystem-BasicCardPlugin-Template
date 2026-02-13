import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

/**
 * Vite 配置
 *
 * 支持三种构建模式：
 * 1. 库模式（默认）：构建 ES Module 供其他项目导入
 * 2. 渲染器模式：构建 renderer/index.html
 * 3. 编辑器模式：构建 editor/index.html
 *
 * 使用方式：
 * - pnpm build          # 构建所有（库 + iframe 入口）
 * - pnpm build:lib      # 仅构建库
 * - pnpm build:renderer # 仅构建渲染器
 * - pnpm build:editor   # 仅构建编辑器
 */

const buildMode = process.env.BUILD_MODE || 'all';

// 基础配置
const baseConfig = {
  plugins: [
    vue(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@editor': resolve(__dirname, 'src/editor'),
      '@bridge': resolve(__dirname, 'src/bridge'),
    },
  },

  css: {
    modules: {
      localsConvention: 'camelCase' as const,
    },
  },
};

// 库构建配置
const libConfig = defineConfig({
  ...baseConfig,
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['tests/**/*', 'node_modules/**/*', 'src/renderer/iframe/**/*', 'src/editor/iframe/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TemplateCardPlugin', // ⚠️ 修改为你的插件名
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@chips/core',
        '@chips/sdk',
        '@chips/foundation',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@chips/core': 'ChipsCore',
          '@chips/sdk': 'ChipsSDK',
          '@chips/foundation': 'ChipsFoundation',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true,
  },
});

// 渲染器构建配置
const rendererConfig = defineConfig({
  ...baseConfig,
  root: resolve(__dirname, 'src/renderer/iframe'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/iframe/index.html'),
    },
  },
});

// 编辑器构建配置
const editorConfig = defineConfig({
  ...baseConfig,
  root: resolve(__dirname, 'src/editor/iframe'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/editor'),
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, 'src/editor/iframe/index.html'),
    },
  },
});

// 根据构建模式导出配置
export default (() => {
  switch (buildMode) {
    case 'lib':
      return libConfig;
    case 'renderer':
      return rendererConfig;
    case 'editor':
      return editorConfig;
    case 'all':
    default:
      // 默认使用库配置，iframe 入口通过单独的脚本构建
      return libConfig;
  }
})();
