<!-- 
  BaseSelect.vue
  ===============================
  Unified select component with consistent styling.
  Wraps v-select with theme-aware defaults.
  
  Usage:
  <BaseSelect
    v-model="selectedItem"
    label="Choose Category"
    :items="categoryOptions"
    item-title="name"
    item-value="id"
  />
-->

<template>
  <v-select
    v-bind="selectProps"
    :class="['base-select', { 'base-select--error': error }]"
    v-on="selectEvents"
  >
    <template v-for="(_, slot) in $slots" :key="`slot-${slot}`" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps" />
    </template>
  </v-select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // v-model
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },

  // Select options
  items: {
    type: Array,
    required: true,
  },

  itemTitle: {
    type: String,
    default: 'title',
  },

  itemValue: {
    type: String,
    default: 'value',
  },

  // Label and helper
  label: {
    type: String,
    default: null,
  },

  helperText: {
    type: String,
    default: null,
  },

  // State
  error: {
    type: Boolean,
    default: false,
  },

  errorMessage: {
    type: String,
    default: null,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  clearable: {
    type: Boolean,
    default: false,
  },

  multiple: {
    type: Boolean,
    default: false,
  },

  // Visual
  variant: {
    type: String,
    default: 'outlined',
  },

  density: {
    type: String,
    default: 'comfortable',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Computed select props
const selectProps = computed(() => ({
  modelValue: props.modelValue,
  items: props.items,
  itemTitle: props.itemTitle,
  itemValue: props.itemValue,
  label: props.label,
  helperText: props.helperText || props.errorMessage,
  error: props.error,
  disabled: props.disabled,
  clearable: props.clearable,
  multiple: props.multiple,
  variant: props.variant,
  density: props.density,
  menuIcon: 'mdi-chevron-down',
  hideDetails: !props.helperText && !props.errorMessage,
}))

// Computed select events
const selectEvents = computed(() => ({
  'update:modelValue': (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
}))
</script>

<style scoped lang="scss">
.base-select {
  &--error {
    ::v-deep {
      .v-field__outline {
        --v-field-border-color: var(--v-error);
      }
    }
  }
}
</style>
