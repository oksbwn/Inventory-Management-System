<template>
  <v-snackbar
    v-model="isOpen"
    :timeout="timeout"
    :color="computedColor"
    :location="position"
    :class="['base-snackbar', `base-snackbar--${type}`]"
    rounded="lg"
    :elevation="4"
  >
    <div class="base-snackbar__content">
      <v-icon size="20" class="base-snackbar__icon">
        {{ computedIcon }}
      </v-icon>
      <span class="base-snackbar__message">
        {{ message }}
      </span>
    </div>

    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        @click="isOpen = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'error', 'warning', 'info'].includes(v),
  },
  timeout: {
    type: [Number, null],
    default: 4000,
  },
  position: {
    type: String,
    default: 'bottom',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  }
)

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const computedIcon = computed(() => {
  const iconMap = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }
  return iconMap[props.type] || 'mdi-information'
})

const computedColor = computed(() => {
  const colorMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return colorMap[props.type] || 'info'
})
</script>

<style scoped lang="scss">
.base-snackbar {
  &__content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__message {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  &--success {
    ::v-deep {
      .v-snackbar__content {
        color: #fff;
      }
    }
  }

  &--error {
    ::v-deep {
      .v-snackbar__content {
        color: #fff;
      }
    }
  }

  &--warning {
    ::v-deep {
      .v-snackbar__content {
        color: #000;
      }
    }
  }

  &--info {
    ::v-deep {
      .v-snackbar__content {
        color: #fff;
      }
    }
  }
}
</style>
