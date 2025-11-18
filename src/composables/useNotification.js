import { useNotificationStore } from '@/stores/notificationStore'

export function useNotification() {
  const notificationStore = useNotificationStore()
  
  return {
    // Direct store access
    notification: notificationStore,
    
    // Convenience methods
    showNotification: notificationStore.showNotification,
    success: notificationStore.success,
    error: notificationStore.error,
    warning: notificationStore.warning,
    info: notificationStore.info,
    hide: notificationStore.hideNotification
  }
}
