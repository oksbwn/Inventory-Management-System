<template>
  <div :class="['base-form-field', `base-form-field--${variant}`, { 'base-form-field--error': hasError }]">
    <label v-if="label" :for="fieldId" class="base-form-field__label">
      <span class="base-form-field__label-text">{{ label }}</span>
      <span v-if="required" class="base-form-field__required">*</span>
      <span v-if="hint" class="base-form-field__hint">({{ hint }})</span>
    </label>

    <div class="base-form-field__input-wrapper">
      <slot 
        :field-id="fieldId" 
        :handle-input="handleInput" 
        :char-count="characterCount"
      />
    </div>

    <div v-if="helperText || errorMessage || $slots['helper']" class="base-form-field__support-text">
      <v-icon v-if="hasError" size="14" class="base-form-field__support-icon">
        mdi-alert-circle
      </v-icon>
      <v-icon v-else-if="showHelper" size="14" class="base-form-field__support-icon">
        mdi-information
      </v-icon>

      <span
        :class="[
          'base-form-field__support-message',
          { 'base-form-field__support-message--error': hasError },
        ]"
      >
        <slot name="helper">
          {{ errorMessage || helperText }}
        </slot>
      </span>
    </div>

    <div v-if="showCharCount && maxLength" class="base-form-field__char-count">
      <span :class="{ 'base-form-field__char-count--warn': characterCount > maxLength * 0.8 }">
        {{ characterCount }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useId } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: null,
  },

  hint: {
    type: String,
    default: null,
  },

  required: {
    type: Boolean,
    default: false,
  },

  helperText: {
    type: String,
    default: null,
  },

  errorMessage: {
    type: String,
    default: null,
  },

  showHelper: {
    type: Boolean,
    default: true,
  },

  variant: {
    type: String,
    default: 'filled',
    validator: (v) => ['filled', 'outlined', 'solo', 'plain'].includes(v),
  },

  maxLength: {
    type: Number,
    default: null,
  },

  showCharCount: {
    type: Boolean,
    default: false,
  },

  fieldId: {
    type: String,
    default: () => useId(),
  },
})

const hasError = computed(() => !!props.errorMessage)
const characterCount = ref(0)

const handleInput = (event) => {
  if (props.showCharCount) {
    characterCount.value = event.target?.value?.length || 0
  }
}
</script>

<style scoped lang="scss">
.base-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  &__label {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    margin: 0;
    padding: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--v-textPrimary);
    line-height: 1.4;
    cursor: pointer;
  }

  &__label-text {
    font-weight: 500;
  }

  &__required {
    color: var(--v-error);
    font-weight: 600;
  }

  &__hint {
    color: var(--v-textTertiary);
    font-size: 12px;
    font-weight: 400;
  }

  &__input-wrapper {
    position: relative;
    width: 100%;

    ::v-deep {
      .v-field {
        --v-field-border-color: var(--v-border-default);
        --v-field-border-opacity: 1;

        &:hover:not(.v-field--error) {
          --v-field-border-color: var(--v-border-dark);
        }

        &.v-field--focused:not(.v-field--error) {
          --v-field-border-color: var(--v-primary);
        }

        &.v-field--error {
          --v-field-border-color: var(--v-error);
        }
      }

      .v-input__control {
        min-height: 40px;
      }
    }
  }

  &__support-text {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--v-textSecondary);
    margin-top: 2px;
  }

  &__support-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__support-message {
    color: var(--v-textSecondary);

    &--error {
      color: var(--v-error);
      font-weight: 500;
    }
  }

  &__char-count {
    display: flex;
    justify-content: flex-end;
    font-size: 11px;
    color: var(--v-textTertiary);
    margin-top: 2px;
  }

  &__char-count--warn {
    color: var(--v-warning);
    font-weight: 500;
  }

  &--error {
    .base-form-field__label {
      color: var(--v-error);
    }

    .base-form-field__support-message {
      color: var(--v-error);
    }
  }
}
</style>
