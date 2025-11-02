<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="rounded-lg delete-dialog">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon color="error" size="32" class="mr-3">mdi-alert-circle</v-icon>
          <span class="text-h5 font-weight-bold">Confirm Delete</span>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          Are you sure you want to delete this item?
        </p>
        <v-alert type="warning" variant="tonal" density="compact" class="mb-0">
          <div class="text-body-2">
            <strong>{{ itemName }}</strong>
          </div>
          <div class="text-caption mt-1">
            This action cannot be undone.
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <!-- ✅ REFACTORED: Using BaseButton -->
      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <BaseButton
          variant="outlined"
          color="secondary"
          size="large"
          @click="handleCancel"
          :disabled="loading"
          class="px-6"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="contained"
          color="error"
          size="large"
          @click="handleConfirm"
          :loading="loading"
          class="px-6"
        >
          Delete
        </BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  itemName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleConfirm = () => {
  loading.value = true
  emit('confirm')
}

const handleCancel = () => {
  dialog.value = false
}
</script>

<style scoped>
.delete-dialog {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
</style>
