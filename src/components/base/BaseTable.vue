<!-- 
  BaseTable.vue
  ===============================
  Common table headers, pagination, and styling.
  Replaces all v-data-table-server with consistent configuration.
  
  Props and events identical to v-data-table-server - no breaking changes.
  
  Usage:
  <BaseTable
    :items="products"
    :headers="tableHeaders"
    :loading="isLoading"
    @update:options="handleTableUpdate"
  />
-->

<template>
  <div class="base-table">
    <!-- Table -->
    <v-data-table-server
      v-model:sort-by="localSortBy"
      v-model:page="localPage"
      v-model:items-per-page="localItemsPerPage"
      :items="items"
      :headers="computedHeaders"
      :items-length="itemsLength"
      :loading="loading"
      :class="['base-table__table', `base-table__table--${density}`]"
      density="comfortable"
      :hover="hover"
      :fixed-header="fixedHeader"
      :height="tableHeight"
      no-data-text="No data available"
      :mobile-breakpoint="mobileBreakpoint"
      @update:options="emitTableUpdate"
      v-bind="$attrs"
    >
      <!-- Custom header slots -->
      <template
        v-for="(header, index) in computedHeaders"
        :key="`header-${index}`"
        #[`header.${header.key}`]="{ column }"
      >
        <div class="base-table__header-cell">
          <span class="base-table__header-text">{{ column.title }}</span>
          <v-icon
            v-if="column.sortable !== false"
            size="small"
            class="base-table__sort-icon"
          >
            mdi-arrow-up-down
          </v-icon>
        </div>
      </template>

      <!-- Custom item row -->
      <template #item="{ item }">
        <tr class="base-table__row">
          <td v-for="header in computedHeaders" :key="header.key" class="base-table__cell">
            <div class="base-table__cell-content">
              <slot :name="`item.${header.key}`" :item="item">
                {{ item[header.key] }}
              </slot>
            </div>
          </td>
        </tr>
      </template>

      <!-- Loading state -->
      <template #loading>
        <tr>
          <td :colspan="computedHeaders.length" class="base-table__loading">
            <v-progress-linear indeterminate />
          </td>
        </tr>
      </template>

      <!-- Empty state -->
      <template #no-data>
        <tr>
          <td :colspan="computedHeaders.length" class="base-table__empty">
            <BaseEmpty
              icon="mdi-inbox-outline"
              title="No Data"
              :description="emptyMessage"
            />
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <!-- Pagination Info & Actions -->
    <div v-if="showFooter" class="base-table__footer">
      <div class="base-table__footer-info">
        <span class="base-table__footer-text">
          {{ footerText }}
        </span>
      </div>

      <div v-if="$slots['footer-actions']" class="base-table__footer-actions">
        <slot name="footer-actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseEmpty from './BaseEmpty.vue'

const props = defineProps({
  // Data
  items: {
    type: Array,
    required: true,
  },

  itemsLength: {
    type: Number,
    required: true,
  },

  headers: {
    type: Array,
    required: true,
  },

  // States
  loading: {
    type: Boolean,
    default: false,
  },

  // Density: 'compact' | 'comfortable' | 'expanded'
  density: {
    type: String,
    default: 'comfortable',
    validator: (v) => ['compact', 'comfortable', 'expanded'].includes(v),
  },

  // Display options
  hover: {
    type: Boolean,
    default: true,
  },

  fixedHeader: {
    type: Boolean,
    default: true,
  },

  tableHeight: {
    type: [Number, String],
    default: '600px',
  },

  showFooter: {
    type: Boolean,
    default: true,
  },

  emptyMessage: {
    type: String,
    default: 'No records to display',
  },

  mobileBreakpoint: {
    type: String,
    default: 'lg',
  },

  // Pagination
  page: {
    type: Number,
    default: 1,
  },

  itemsPerPage: {
    type: Number,
    default: 10,
  },

  sortBy: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:options', 'update:page', 'update:itemsPerPage', 'update:sortBy'])

// Local state for two-way binding
const localPage = ref(props.page)
const localItemsPerPage = ref(props.itemsPerPage)
const localSortBy = ref(props.sortBy)

// Computed header configuration
const computedHeaders = computed(() => {
  return props.headers.map((header) => ({
    title: header.title || header.key,
    key: header.key,
    align: header.align || 'start',
    sortable: header.sortable !== false,
    width: header.width,
    ...header,
  }))
})

// Footer text
const footerText = computed(() => {
  const start = (localPage.value - 1) * localItemsPerPage.value + 1
  const end = Math.min(
    localPage.value * localItemsPerPage.value,
    props.itemsLength
  )
  const total = props.itemsLength

  if (total === 0) return 'No items'
  return `Showing ${start} to ${end} of ${total} items`
})

// Emit table update
const emitTableUpdate = () => {
  emit('update:options', {
    page: localPage.value,
    itemsPerPage: localItemsPerPage.value,
    sortBy: localSortBy.value,
  })

  emit('update:page', localPage.value)
  emit('update:itemsPerPage', localItemsPerPage.value)
  emit('update:sortBy', localSortBy.value)
}

// Watch prop changes
const watchProps = () => {
  if (props.page !== localPage.value) {
    localPage.value = props.page
  }
  if (props.itemsPerPage !== localItemsPerPage.value) {
    localItemsPerPage.value = props.itemsPerPage
  }
  if (JSON.stringify(props.sortBy) !== JSON.stringify(localSortBy.value)) {
    localSortBy.value = props.sortBy
  }
}

import { watch } from 'vue'
watch(() => [props.page, props.itemsPerPage, props.sortBy], watchProps)
</script>

<style scoped lang="scss">
.base-table {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: var(--v-surface);
  border: 1px solid var(--v-border-light);

  &__table {
    flex: 1;
    background: var(--v-surface);

    // Header styling
    ::v-deep thead {
      background-color: var(--v-surfaceVariant);
      border-bottom: 1px solid var(--v-border-light);

      th {
        background-color: var(--v-surfaceVariant);
        color: var(--v-textPrimary);
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 12px 16px;
        height: auto;
        border: none;
      }
    }

    // Row styling
    ::v-deep tbody {
      tr {
        border-bottom: 1px solid var(--v-border-light);
        transition: background-color 0.15s ease;

        &:hover {
          background-color: var(--v-overlay);
        }

        &:last-child {
          border-bottom: none;
        }

        td {
          padding: 12px 16px;
          color: var(--v-textPrimary);
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }
  }

  &__header-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
  }

  &__header-text {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--v-textPrimary);
  }

  &__sort-icon {
    opacity: 0;
    transition: opacity 0.2s ease;
    color: var(--v-textSecondary);
  }

  &__header-cell:hover &__sort-icon {
    opacity: 1;
  }

  &__cell {
    height: 48px;
    vertical-align: middle;
  }

  &__cell-content {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
  }

  &__loading {
    padding: 0 !important;
    height: 48px;
  }

  &__empty {
    padding: 48px 16px !important;
    background: var(--v-surfaceVariant);
    border: none;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid var(--v-border-light);
    background-color: var(--v-surfaceVariant);
    gap: 12px;
  }

  &__footer-info {
    flex: 1;
  }

  &__footer-text {
    font-size: 12px;
    color: var(--v-textSecondary);
  }

  &__footer-actions {
    display: flex;
    gap: 8px;
  }

  // Density variants
  &__table--compact {
    ::v-deep {
      td,
      th {
        padding: 8px 12px;
        height: 40px;
      }
    }
  }

  &__table--expanded {
    ::v-deep {
      td,
      th {
        padding: 16px 20px;
        height: 56px;
      }
    }
  }
}
</style>
