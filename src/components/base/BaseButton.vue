<template>
  <v-btn :variant="computedVariant" :color="computedColor" :size="computedSize" :density="density"
    :class="['base-button', `base-button--${variant}`, `base-button--${color}`]" :disabled="disabled" :loading="loading"
    :href="href" :target="target" :to="to" :replace="replace" :exact="exact" :rounded="rounded" :elevation="elevation"
    :ripple="ripple" @click="$emit('click', $event)" v-bind="$attrs">
    <v-icon v-if="icon" :size="computedIconSize">
      {{ icon }}
    </v-icon>

    <template v-else-if="label && !$slots.default">
      {{ label }}
    </template>
    <slot />
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(v),
  },
  variant: {
    type: String,
    default: 'contained',
    validator: (v) => ['contained', 'tonal', 'outlined', 'plain', 'text'].includes(v),
  },
  color: {
    type: String,
    default: 'primary',
  },
  density: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'comfortable', 'compact'].includes(v),
  },
  rounded: {
    type: [Boolean, String],
    default: 'md',
  },
  elevation: {
    type: [Number, String],
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
  to: {
    type: [String, Object],
    default: null,
  },
  replace: {
    type: Boolean,
    default: false,
  },
  exact: {
    type: Boolean,
    default: false,
  },
  ripple: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const computedVariant = computed(() => {
  const variantMap = {
    contained: 'flat',
    tonal: 'tonal',
    outlined: 'outlined',
    plain: 'text',
    text: 'text',
  }
  return variantMap[props.variant] || 'flat'
})

const computedSize = computed(() => {
  const sizeMap = {
    'x-small': 'x-small',
    'small': 'small',
    'default': 'default',
    'large': 'large',
    'x-large': 'x-large',
  }
  return sizeMap[props.size] || 'default'
})

const computedColor = computed(() => {
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
  }
  return colorMap[props.color] || props.color
})

const computedIconSize = computed(() => {
  const sizeMap = {
    'x-small': 16,
    'small': 18,
    'default': 20,
    'large': 24,
    'x-large': 28,
  }
  return sizeMap[props.size] || 20
})
</script>

<style scoped lang="scss">
.base-button {
  transition: all 0.2s ease-in-out;
  font-weight: 500;

  &--contained {
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
  }

  &--tonal {
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }

  &--outlined {
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }

  &--text {
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
}
</style>

<style>
/* Global icon styles */
.base-button .v-icon {
  opacity: 1 !important;
  display: inline-flex !important;
}
</style>
