import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TemplateCardPlugin',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@chips/core', '@chips/sdk', '@chips/foundation'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css';
          }
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
