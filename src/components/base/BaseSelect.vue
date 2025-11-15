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
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },

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

  label: {
    type: String,
    default: null,
  },

  helperText: {
    type: String,
    default: null,
  },

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
    :deep(.v-field__outline) {
      --v-field-border-color: var(--v-error);
    }
  }
}
</style>
