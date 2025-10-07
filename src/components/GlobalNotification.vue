<template>
  <v-snackbar
    v-model="notification.show"
    :timeout="notification.timeout"
    :color="notification.type"
    location="top right"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">{{ getIcon() }}</v-icon>
      {{ notification.message }}
    </div>
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="notification.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

const getIcon = computed(() => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[notification.type.value] || 'mdi-information'
})
</script>
