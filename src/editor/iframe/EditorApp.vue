<!--
  编辑器 Vue 组件

  在 iframe 中编辑卡片内容的主组件。
  ⚠️ 根据你的卡片类型修改此组件
-->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getBridge } from '../../bridge';
import type { TemplateCardConfig, ValidationResult } from '../../types';
import { UndoManager } from '../history';
import { t } from '../../utils/i18n';

// Props 定义
interface Props {
  /** 卡片配置 */
  config: TemplateCardConfig;
  /** 资源映射表 */
  resourceMap: Record<string, string>;
  /** 当前语言 */
  locale: string;
  /** 配置变更回调（实时预览） */
  onConfigChange?: (config: Record<string, unknown>) => void;
  /** 保存回调（最终提交） */
  onSave?: (config: Record<string, unknown>) => void;
}

const props = defineProps<Props>();

// 状态
const isLoading = ref(true);
const error = ref<string | null>(null);
const isDirty = ref(false);

// 内部配置副本
const internalConfig = ref<TemplateCardConfig>({ ...props.config });

// 撤销/重做管理器
const history = new UndoManager<TemplateCardConfig>(50);

// 计算属性
const canUndo = computed(() => history.canUndo);
const canRedo = computed(() => history.canRedo);

/**
 * 更新配置
 */
function updateConfig(updates: Partial<TemplateCardConfig>): void {
  // 保存当前状态到历史
  history.push({ ...internalConfig.value });

  // 更新配置
  internalConfig.value = { ...internalConfig.value, ...updates };
  isDirty.value = true;

  // 通知变更（实时预览）
  if (props.onConfigChange) {
    props.onConfigChange(internalConfig.value);
  }
}

/**
 * 撤销
 */
function undo(): void {
  const previousState = history.undo();
  if (previousState) {
    internalConfig.value = { ...previousState };
    if (props.onConfigChange) {
      props.onConfigChange(internalConfig.value);
    }
  }
}

/**
 * 重做
 */
function redo(): void {
  const nextState = history.redo();
  if (nextState) {
    internalConfig.value = { ...nextState };
    if (props.onConfigChange) {
      props.onConfigChange(internalConfig.value);
    }
  }
}

/**
 * 保存配置
 */
function save(): void {
  // 验证配置
  const validation = validate();
  if (!validation.valid) {
    error.value = validation.errors?.[0]?.message ?? t('error.validation_failed');
    return;
  }

  // 通知保存
  if (props.onSave) {
    props.onSave(internalConfig.value);
  }

  isDirty.value = false;
}

/**
 * 验证配置
 */
function validate(): ValidationResult {
  const errors: ValidationResult['errors'] = [];

  // ⚠️ 添加你的验证逻辑
  if (!internalConfig.value.card_type) {
    errors.push({
      field: 'card_type',
      message: t('error.missing_field', { field: 'card_type' }),
      code: 'REQUIRED',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 获取资源 URL
 */
async function getResourceUrl(resourceId: string): Promise<string | null> {
  if (props.resourceMap[resourceId]) {
    return props.resourceMap[resourceId];
  }

  try {
    const bridge = getBridge();
    const result = await bridge.requestResource(resourceId);
    return result.url;
  } catch (err) {
    console.error('Failed to load resource:', resourceId, err);
    return null;
  }
}

/**
 * 调用 Bridge API
 */
async function invokeBridge<T>(
  namespace: string,
  action: string,
  params?: unknown
): Promise<T> {
  const bridge = getBridge();
  return bridge.invoke<T>(namespace, action, params);
}

// 键盘快捷键处理
function handleKeydown(e: KeyboardEvent): void {
  const isMod = e.ctrlKey || e.metaKey;

  if (isMod && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
  } else if (isMod && e.key === 'z' && e.shiftKey) {
    e.preventDefault();
    redo();
  } else if (isMod && e.key === 'y') {
    e.preventDefault();
    redo();
  } else if (isMod && e.key === 's') {
    e.preventDefault();
    save();
  }
}

// 生命周期
onMounted(async () => {
  try {
    // 记录初始状态
    history.push({ ...internalConfig.value });

    // 绑定键盘快捷键
    document.addEventListener('keydown', handleKeydown);

    // ⚠️ 在这里添加你的初始化逻辑

    isLoading.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    isLoading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  history.clear();
});

// 监听外部配置变化
watch(
  () => props.config,
  (newConfig) => {
    // 只在非脏状态下同步外部配置
    if (!isDirty.value) {
      internalConfig.value = { ...newConfig };
    }
  },
  { deep: true }
);

// 暴露方法
defineExpose({
  updateConfig,
  undo,
  redo,
  save,
  validate,
  getResourceUrl,
  invokeBridge,
});
</script>

<template>
  <div
    class="chips-template-editor"
    :class="{
      'chips-template-editor--loading': isLoading,
      'chips-template-editor--error': error,
      'chips-template-editor--dirty': isDirty,
    }"
  >
    <!-- 工具栏 -->
    <div class="chips-template-editor__toolbar">
      <button
        class="chips-template-editor__toolbar-btn"
        :disabled="!canUndo"
        :title="t('editor.undo')"
        @click="undo"
      >
        ↩
      </button>
      <button
        class="chips-template-editor__toolbar-btn"
        :disabled="!canRedo"
        :title="t('editor.redo')"
        @click="redo"
      >
        ↪
      </button>
      <div class="chips-template-editor__toolbar-spacer"></div>
      <button
        class="chips-template-editor__toolbar-btn chips-template-editor__toolbar-btn--primary"
        :disabled="!isDirty"
        :title="t('editor.save')"
        @click="save"
      >
        {{ t('common.save') }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="chips-template-editor__loading">
      <span class="chips-template-editor__loading-text">
        {{ t('editor.loading') }}
      </span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="chips-template-editor__error">
      <span class="chips-template-editor__error-icon">⚠️</span>
      <span class="chips-template-editor__error-text">{{ error }}</span>
      <button
        class="chips-template-editor__error-dismiss"
        @click="error = null"
      >
        {{ t('common.dismiss') }}
      </button>
    </div>

    <!-- 编辑区域 -->
    <!-- ⚠️ 在这里添加你的编辑界面 -->
    <div v-else class="chips-template-editor__content">
      <div class="chips-template-editor__placeholder">
        <p>{{ t('editor.placeholder') }}</p>
        <p class="chips-template-editor__card-type">
          {{ internalConfig.card_type }}
        </p>

        <!-- 示例：布局设置 -->
        <div class="chips-template-editor__section">
          <label class="chips-template-editor__label">
            {{ t('editor.height_mode') }}
          </label>
          <select
            class="chips-template-editor__select"
            :value="internalConfig.layout?.height_mode ?? 'auto'"
            @change="updateConfig({
              layout: {
                ...internalConfig.layout,
                height_mode: ($event.target as HTMLSelectElement).value as 'auto' | 'fixed'
              }
            })"
          >
            <option value="auto">{{ t('editor.height_auto') }}</option>
            <option value="fixed">{{ t('editor.height_fixed') }}</option>
          </select>
        </div>

        <!-- 固定高度输入 -->
        <div
          v-if="internalConfig.layout?.height_mode === 'fixed'"
          class="chips-template-editor__section"
        >
          <label class="chips-template-editor__label">
            {{ t('editor.fixed_height') }}
          </label>
          <input
            type="number"
            class="chips-template-editor__input"
            :value="internalConfig.layout?.fixed_height ?? 200"
            min="50"
            max="2000"
            @input="updateConfig({
              layout: {
                ...internalConfig.layout,
                fixed_height: parseInt(($event.target as HTMLInputElement).value) || 200
              }
            })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/*
 * 注意：这里只定义结构性样式
 * 视觉样式应由主题包提供
 */
.chips-template-editor {
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.chips-template-editor__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--chips-border-color, #e0e0e0);
}

.chips-template-editor__toolbar-btn {
  padding: 4px 8px;
  border: 1px solid var(--chips-border-color, #e0e0e0);
  border-radius: 4px;
  background: var(--chips-bg-secondary, #f5f5f5);
  cursor: pointer;
  font-size: 14px;
}

.chips-template-editor__toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chips-template-editor__toolbar-btn--primary {
  background: var(--chips-primary-color, #1890ff);
  color: white;
  border-color: var(--chips-primary-color, #1890ff);
}

.chips-template-editor__toolbar-spacer {
  flex: 1;
}

.chips-template-editor__loading,
.chips-template-editor__error {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 150px;
  padding: 16px;
}

.chips-template-editor__content {
  flex: 1;
  padding: 16px;
}

.chips-template-editor__placeholder {
  text-align: center;
}

.chips-template-editor__card-type {
  font-family: monospace;
  opacity: 0.6;
}

.chips-template-editor__section {
  margin-top: 16px;
  text-align: left;
}

.chips-template-editor__label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.chips-template-editor__select,
.chips-template-editor__input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--chips-border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 14px;
}

.chips-template-editor__error-dismiss {
  margin-top: 8px;
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  background: var(--chips-bg-secondary, #f5f5f5);
  cursor: pointer;
}
</style>
