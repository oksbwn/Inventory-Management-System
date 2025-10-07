<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon color="error" size="32" class="mr-3">mdi-alert-circle</v-icon>
          <span class="text-h5 font-weight-bold">Confirm Delete</span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          Are you sure you want to delete this stock item?
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

      <v-divider></v-divider>

      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          size="large"
          @click="handleCancel"
          :disabled="loading"
          class="text-none px-6"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          size="large"
          @click="handleConfirm"
          :loading="loading"
          class="text-none px-6"
        >
          Delete
        </v-btn>
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
