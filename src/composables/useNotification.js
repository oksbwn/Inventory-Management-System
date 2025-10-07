import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export function useNotification() {
  const show = ref(false)
  const message = ref('')
  const type = ref('success') // success, error, warning, info
  const timeout = ref(3000)

  const showNotification = (msg, notifType = 'success', duration = 3000) => {
    const settingsStore = useSettingsStore()
    
    // Only show if notifications are enabled
    if (!settingsStore.showNotifications) return

    message.value = msg
    type.value = notifType
    timeout.value = duration
    show.value = true
  }

  const success = (msg, duration) => {
    showNotification(msg, 'success', duration)
  }

  const error = (msg, duration) => {
    showNotification(msg, 'error', duration || 5000)
  }

  const warning = (msg, duration) => {
    showNotification(msg, 'warning', duration)
  }

  const info = (msg, duration) => {
    showNotification(msg, 'info', duration)
  }

  return {
    show,
    message,
    type,
    timeout,
    success,
    error,
    warning,
    info
  }
}
