<template>
  <v-card
    :elevation="elevation"
    :rounded="rounded"
    :class="['base-card', `base-card--${variant}`]"
    v-bind="$attrs"
  >
    <!-- Header Section (optional title) -->
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <!-- Title Section -->
    <template v-if="title || $slots.title" #title>
      <div class="base-card__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </template>

    <!-- Subtitle Section -->
    <template v-if="subtitle" #subtitle>
      <div class="base-card__subtitle">
        {{ subtitle }}
      </div>
    </template>

    <!-- Main Content -->
    <v-card-text v-if="$slots.default" :class="['base-card__content', contentClass]">
      <slot />
    </v-card-text>

    <!-- Text Slot (alias for simple text content) -->
    <template v-if="$slots.text" #text>
      <slot name="text" />
    </template>

    <!-- Actions Footer -->
    <template v-if="$slots.actions" #actions>
      <div class="base-card__actions">
        <slot name="actions" />
      </div>
    </template>

    <!-- Append Slot -->
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'  // ✅ FIXED: Added import

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'outlined', 'elevated', 'flat'].includes(v),
  },
  elevation: {
    type: [Number, String],
    default: 1,
  },
  rounded: {
    type: [Boolean, String],
    default: 'lg',
  },
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  contentClass: {
    type: String,
    default: null,
  },
  padding: {
    type: String,
    default: 'lg',
  },
})

const paddingClass = computed(() => {
  const paddingMap = {
    sm: 'pa-2',
    md: 'pa-4',
    lg: 'pa-4',
    xl: 'pa-6',
  }
  return paddingMap[props.padding] || 'pa-4'
})
</script>

<style scoped lang="scss">
.base-card {
  background-color: var(--v-surface);
  border: 1px solid var(--v-border-light);
  transition: all 0.2s ease-in-out;

  &--default {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    
    &:hover {
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    }
  }

  &--outlined {
    box-shadow: none;
    border: 1px solid var(--v-border-default);
  }

  &--elevated {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    border: none;
  }

  &--flat {
    box-shadow: none;
    border: none;
    background-color: var(--v-surfaceVariant);
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--v-textPrimary);
    margin: 0;
    padding: 0;
  }

  &__subtitle {
    font-size: 13px;
    font-weight: 400;
    line-height: 1.4;
    color: var(--v-textSecondary);
    margin-top: 4px;
  }

  &__content {
    font-size: 14px;
    line-height: 1.5;
    color: var(--v-textPrimary);

    p {
      margin: 0 0 12px 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid var(--v-border-light);
  }
}
</style>
