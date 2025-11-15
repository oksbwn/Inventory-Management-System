<!-- 
  BaseLoading.vue
  ===============================
  Consistent loading/skeleton placeholder.
  Shows loading indicator or skeleton based on variant.
  
  Usage:
  <BaseLoading
    v-if="isLoading"
    type="skeleton"
    count="3"
  />
-->

<template>
  <div class="base-loading">
    <!-- Indeterminate Loader -->
    <div v-if="type === 'spinner'" class="base-loading__spinner">
      <v-progress-circular indeterminate :size="spinnerSize" :width="2" />
      <p v-if="label" class="base-loading__label">
        {{ label }}
      </p>
    </div>

    <!-- Linear Progress -->
    <div v-else-if="type === 'linear'" class="base-loading__linear">
      <v-progress-linear indeterminate />
      <p v-if="label" class="base-loading__label">
        {{ label }}
      </p>
    </div>

    <!-- Skeleton Cards -->
    <div v-else-if="type === 'skeleton'" class="base-loading__skeleton">
      <template v-for="i in count" :key="`skeleton-${i}`">
        <div class="base-loading__skeleton-item">
          <v-skeleton-loader type="heading, paragraph@2, divider, paragraph@2" />
        </div>
      </template>
    </div>

    <!-- Skeleton Table Rows -->
    <div v-else-if="type === 'table'" class="base-loading__skeleton-table">
      <template v-for="i in count" :key="`table-row-${i}`">
        <v-skeleton-loader type="table-row@5" />
      </template>
    </div>

    <!-- Skeleton List Items -->
    <div v-else-if="type === 'list'" class="base-loading__skeleton-list">
      <template v-for="i in count" :key="`list-item-${i}`">
        <v-skeleton-loader type="avatar, sentence" />
      </template>
    </div>

    <!-- Default: Pulse -->
    <div v-else class="base-loading__pulse">
      <div class="base-loading__pulse-item" />
      <p v-if="label" class="base-loading__label">
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Loading type: 'spinner' | 'linear' | 'skeleton' | 'table' | 'list' | 'pulse'
  type: {
    type: String,
    default: 'spinner',
    validator: (v) => ['spinner', 'linear', 'skeleton', 'table', 'list', 'pulse'].includes(v),
  },

  // Count of skeleton items
  count: {
    type: Number,
    default: 3,
  },

  // Optional label
  label: {
    type: String,
    default: null,
  },

  // Spinner size
  spinnerSize: {
    type: Number,
    default: 40,
  },
})
</script>

<style scoped lang="scss">
.base-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px 24px;
  width: 100%;

  &__spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__linear {
    width: 100%;
  }

  &__label {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--v-textSecondary);
    text-align: center;
  }

  &__skeleton {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__skeleton-item {
    width: 100%;
    padding: 16px;
    background: var(--v-surface);
    border-radius: 12px;
    border: 1px solid var(--v-border-light);
  }

  &__skeleton-table {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__skeleton-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__pulse {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__pulse-item {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      var(--v-surfaceVariant) 25%,
      rgba(0, 0, 0, 0.04) 50%,
      var(--v-surfaceVariant) 75%
    );
    background-size: 200% 100%;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
