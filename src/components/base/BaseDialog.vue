<!-- 
  BaseDialog.vue
  ===============================
  Unified dialog component with shared title/actions/width template.
  Replaces all v-dialog implementations with inline props.
  
  Props identical to v-dialog - no breaking changes.
  All slots and events preserved.
  
  Usage:
  <BaseDialog
    v-model="isOpen"
    title="Confirm Action"
    persistent
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <p>Are you sure you want to continue?</p>
  </BaseDialog>
-->

<template>
  <v-dialog
    v-model="isOpen"
    :max-width="maxWidth"
    :persistent="persistent"
    :transition="transition"
    :class="['base-dialog', `base-dialog--${size}`]"
    v-bind="$attrs"
    @update:model-value="updateModelValue"
  >
    <v-card :rounded="rounded" :elevation="elevation" class="base-dialog__card">
      <!-- Header / Title Section -->
      <div class="base-dialog__header">
        <div class="base-dialog__title-section">
          <slot name="header">
            <h2 v-if="title" class="base-dialog__title">
              {{ title }}
            </h2>
            <p v-if="subtitle" class="base-dialog__subtitle">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <!-- Close Button -->
        <v-btn
          v-if="closeable"
          icon="mdi-close"
          variant="text"
          size="small"
          class="base-dialog__close"
          @click="handleClose"
        />
      </div>

      <!-- Divider -->
      <v-divider v-if="showDivider" class="base-dialog__divider" />

      <!-- Content Section -->
      <div class="base-dialog__content">
        <slot>
          {{ message }}
        </slot>
      </div>

      <!-- Actions / Footer Section -->
      <div class="base-dialog__actions">
        <slot name="actions">
          <v-spacer />
          <BaseButton
            v-if="showCancel"
            variant="outlined"
            color="secondary"
            @click="handleCancel"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            v-if="showConfirm"
            variant="contained"
            :color="confirmColor"
            :loading="loading"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </BaseButton>
        </slot>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  // v-model for dialog state
  modelValue: {
    type: Boolean,
    default: false,
  },

  // Dialog size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
  },

  // Max width mapping
  maxWidth: {
    type: String,
    default: null, // Will be computed from size
  },

  // Title and subtitle
  title: {
    type: String,
    default: null,
  },

  subtitle: {
    type: String,
    default: null,
  },

  // Message (alternative to slot)
  message: {
    type: String,
    default: null,
  },

  // Visual properties
  rounded: {
    type: [Boolean, String],
    default: 'lg',
  },

  elevation: {
    type: Number,
    default: 4,
  },

  // Behavior
  persistent: {
    type: Boolean,
    default: true,
  },

  closeable: {
    type: Boolean,
    default: true,
  },

  showDivider: {
    type: Boolean,
    default: true,
  },

  transition: {
    type: String,
    default: 'dialog-transition',
  },

  // Action button props
  showCancel: {
    type: Boolean,
    default: true,
  },

  showConfirm: {
    type: Boolean,
    default: true,
  },

  cancelText: {
    type: String,
    default: 'Cancel',
  },

  confirmText: {
    type: String,
    default: 'Confirm',
  },

  confirmColor: {
    type: String,
    default: 'primary',
  },

  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Compute max-width based on size
const computedMaxWidth = computed(() => {
  const widthMap = {
    xs: 'xs',    // 304px
    sm: 'sm',    // 488px
    md: 'md',    // 680px
    lg: 'lg',    // 912px
    xl: 'xl',    // 1264px
  }
  return props.maxWidth || widthMap[props.size] || 'md'
})

const updateModelValue = (val) => {
  isOpen.value = val
}

const handleConfirm = () => {
  emit('confirm')
  // Don't auto-close - let parent handle it
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const handleClose = () => {
  emit('close')
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.base-dialog {
  &__card {
    display: flex;
    flex-direction: column;
    background-color: var(--v-surface);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    gap: 16px;
  }

  &__title-section {
    flex: 1;
    min-width: 0; // Prevent overflow
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--v-textPrimary);
  }

  &__subtitle {
    margin: 8px 0 0 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
    color: var(--v-textSecondary);
  }

  &__close {
    flex-shrink: 0;
    margin-right: -8px; // Align to card edge
  }

  &__divider {
    margin: 0;
    height: 1px;
    background-color: var(--v-border-light);
  }

  &__content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    max-height: 60vh;
    font-size: 14px;
    line-height: 1.5;
    color: var(--v-textPrimary);

    // Content spacing
    > *:last-child {
      margin-bottom: 0;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--v-border-light);
    background-color: var(--v-surfaceVariant);
    border-radius: 0 0 12px 12px;
  }
}
</style>
