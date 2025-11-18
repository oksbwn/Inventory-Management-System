import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const show = ref(false)
  const message = ref('')
  const type = ref('info') // 'success', 'error', 'warning', 'info'
  const timeout = ref(3000)
  const position = ref('top right')
  
  // Actions
  const showNotification = ({ 
    message: msg, 
    type: notifType = 'info', 
    timeout: notifTimeout = 3000,
    position: notifPosition = 'top right'
  }) => {
    message.value = msg
    type.value = notifType
    timeout.value = notifTimeout
    position.value = notifPosition
    show.value = true
  }

  const hideNotification = () => {
    show.value = false
  }

  // Convenience methods
  const success = (msg, timeout = 3000) => {
    showNotification({ message: msg, type: 'success', timeout })
  }

  const error = (msg, timeout = 5000) => {
    showNotification({ message: msg, type: 'error', timeout })
  }

  const warning = (msg, timeout = 4000) => {
    showNotification({ message: msg, type: 'warning', timeout })
  }

  const info = (msg, timeout = 3000) => {
    showNotification({ message: msg, type: 'info', timeout })
  }

  return {
    // State
    show,
    message,
    type,
    timeout,
    position,
    
    // Actions
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info
  }
})
