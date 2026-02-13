<!--
  渲染器 Vue 组件

  在 iframe 中渲染卡片内容的主组件。
  ⚠️ 根据你的卡片类型修改此组件
-->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getBridge } from '../../bridge';
import type { TemplateCardConfig } from '../../types';
import { t } from '../../utils/i18n';

// Props 定义
interface Props {
  /** 卡片配置 */
  config: TemplateCardConfig;
  /** 资源映射表 */
  resourceMap: Record<string, string>;
  /** 当前语言 */
  locale: string;
  /** 是否只读 */
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: true,
});

// 状态
const isLoading = ref(true);
const error = ref<string | null>(null);

// 计算属性
const cardType = computed(() => props.config.card_type);
const heightMode = computed(() => props.config.layout?.height_mode ?? 'auto');
const fixedHeight = computed(() => props.config.layout?.fixed_height);

// 容器样式
const containerStyle = computed(() => {
  if (heightMode.value === 'fixed' && fixedHeight.value) {
    return { height: `${fixedHeight.value}px` };
  }
  return {};
});

/**
 * 获取资源 URL
 *
 * 优先从资源映射表获取，否则通过 Bridge 请求
 */
async function getResourceUrl(resourceId: string): Promise<string | null> {
  // 先检查映射表
  if (props.resourceMap[resourceId]) {
    return props.resourceMap[resourceId];
  }

  // 通过 Bridge 请求
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

// 生命周期
onMounted(async () => {
  try {
    // ⚠️ 在这里添加你的初始化逻辑
    // 例如：加载资源、获取额外数据等

    isLoading.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    isLoading.value = false;
  }
});

onUnmounted(() => {
  // ⚠️ 在这里添加清理逻辑
});

// 监听配置变化
watch(
  () => props.config,
  (_newConfig) => {
    // ⚠️ 配置变化时的处理逻辑
    // 在这里添加配置变化后的更新逻辑
  },
  { deep: true }
);

// 暴露方法供外部调用
defineExpose({
  getResourceUrl,
  invokeBridge,
});
</script>

<template>
  <div
    class="chips-template-renderer"
    :class="{
      'chips-template-renderer--loading': isLoading,
      'chips-template-renderer--error': error,
    }"
    :style="containerStyle"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="chips-template-renderer__loading">
      <span class="chips-template-renderer__loading-text">
        {{ t('renderer.loading') }}
      </span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="chips-template-renderer__error">
      <span class="chips-template-renderer__error-icon">⚠️</span>
      <span class="chips-template-renderer__error-text">
        {{ t('error.render_failed', { reason: error }) }}
      </span>
    </div>

    <!-- 正常内容 -->
    <!-- ⚠️ 在这里添加你的渲染内容 -->
    <div v-else class="chips-template-renderer__content">
      <div class="chips-template-renderer__placeholder">
        <p>{{ t('renderer.placeholder') }}</p>
        <p class="chips-template-renderer__card-type">
          {{ cardType }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/*
 * 注意：这里只定义结构性样式
 * 视觉样式应由主题包提供
 */
.chips-template-renderer {
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
}

.chips-template-renderer__loading,
.chips-template-renderer__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 16px;
}

.chips-template-renderer__error {
  flex-direction: column;
  gap: 8px;
}

.chips-template-renderer__content {
  width: 100%;
}

.chips-template-renderer__placeholder {
  padding: 24px;
  text-align: center;
}

.chips-template-renderer__card-type {
  font-family: monospace;
  opacity: 0.6;
}
</style>
