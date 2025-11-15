<!-- 
  BaseEmpty.vue
  ===============================
  Consistent empty state placeholder.
  Shows icon, title, and message when no data is available.
  
  Usage:
  <BaseEmpty
    icon="mdi-inbox-outline"
    title="No Items"
    description="Start by adding your first item"
    :action-button="true"
    action-text="Add Item"
    @action="handleAddItem"
  />
-->

<template>
  <div class="base-empty">
    <!-- Icon -->
    <div class="base-empty__icon-container">
      <v-icon size="56" class="base-empty__icon">
        {{ icon }}
      </v-icon>
    </div>

    <!-- Title -->
    <h3 v-if="title" class="base-empty__title">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="base-empty__description">
      {{ description }}
    </p>

    <!-- Slot Content -->
    <slot />

    <!-- Action Button -->
    <div v-if="showActionButton" class="base-empty__actions">
      <BaseButton
        v-if="actionButton"
        variant="contained"
        color="primary"
        size="small"
        @click="$emit('action')"
      >
        {{ actionText }}
      </BaseButton>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  // Icon
  icon: {
    type: String,
    default: 'mdi-inbox-outline',
  },

  // Text content
  title: {
    type: String,
    default: 'No Data',
  },

  description: {
    type: String,
    default: 'There is nothing to display here',
  },

  // Action button
  actionButton: {
    type: Boolean,
    default: false,
  },

  actionText: {
    type: String,
    default: 'Add New',
  },

  showActionButton: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['action'])
</script>

<style scoped lang="scss">
.base-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
  min-height: 300px;
  background: var(--v-surfaceVariant);
  border-radius: 12px;

  &__icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.04);
  }

  &__icon {
    color: var(--v-textTertiary);
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--v-textPrimary);
  }

  &__description {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--v-textSecondary);
    max-width: 320px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
