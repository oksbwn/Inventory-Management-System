<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500px"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar 
            :color="color" 
            size="48"
            variant="tonal"
          >
            <v-icon size="28" :color="color">
              {{ icon }}
            </v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">
              {{ title }}
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-0">
          {{ message }}
        </p>
        
        <!-- Optional details slot -->
        <slot name="details"></slot>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <BaseButton
          variant="outlined"
          color="secondary"
          @click="handleCancel"
          size="large"
          :disabled="loading"
        >
          {{ cancelText }}
        </BaseButton>
        <BaseButton
          variant="contained"
          :color="color"
          @click="handleConfirm"
          size="large"
          :loading="loading"
          class="px-6"
        >
          {{ confirmText }}
        </BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  subtitle: {
    type: String,
    default: 'Please confirm your action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  icon: {
    type: String,
    default: 'mdi-help-circle'
  },
  color: {
    type: String,
    default: 'primary'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const loading = ref(false)

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style scoped>

</style>
