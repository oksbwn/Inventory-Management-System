<template>
  <v-snackbar
    v-model="notificationStore.show"
    :timeout="notificationStore.timeout"
    :color="snackbarColor"
    :location="notificationStore.position"
    variant="elevated"
    multi-line
    class="custom-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-3" size="24">
        {{ getIcon }}
      </v-icon>
      <span class="notification-message">
        {{ notificationStore.message }}
      </span>
    </div>
    
    <template v-slot:actions>
      <v-btn
        variant="text"
        icon
        size="small"
        @click="notificationStore.hideNotification()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

const getIcon = computed(() => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[notificationStore.type] || 'mdi-information'
})

const snackbarColor = computed(() => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return colors[notificationStore.type] || 'info'
})
</script>

<style scoped>
.notification-message {
  font-size: 0.95rem;
  line-height: 1.5;
}

.custom-snackbar {
  font-weight: 500;
}
</style>
