import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Load from localStorage or use defaults
  const darkMode = ref(localStorage.getItem('darkMode') === 'true' || false)
  const itemsPerPage = ref(parseInt(localStorage.getItem('itemsPerPage') || '10'))
  const cacheTimeout = ref(parseInt(localStorage.getItem('cacheTimeout') || '5'))
  const compactMode = ref(localStorage.getItem('compactMode') === 'true' || false)
  const showNotifications = ref(localStorage.getItem('showNotifications') !== 'false')
  const autoRefresh = ref(localStorage.getItem('autoRefresh') === 'true' || false)
  const refreshInterval = ref(parseInt(localStorage.getItem('refreshInterval') || '30'))

  // Actions
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value.toString())
  }

  function setItemsPerPage(value) {
    itemsPerPage.value = value
    localStorage.setItem('itemsPerPage', value.toString())
  }

  function setCacheTimeout(value) {
    cacheTimeout.value = value
    localStorage.setItem('cacheTimeout', value.toString())
  }

  function toggleCompactMode() {
    compactMode.value = !compactMode.value
    localStorage.setItem('compactMode', compactMode.value.toString())
  }

  function toggleNotifications() {
    showNotifications.value = !showNotifications.value
    localStorage.setItem('showNotifications', showNotifications.value.toString())
  }

  function toggleAutoRefresh() {
    autoRefresh.value = !autoRefresh.value
    localStorage.setItem('autoRefresh', autoRefresh.value.toString())
  }

  function setRefreshInterval(value) {
    refreshInterval.value = value
    localStorage.setItem('refreshInterval', value.toString())
  }

  function resetToDefaults() {
    darkMode.value = false
    itemsPerPage.value = 10
    cacheTimeout.value = 5
    compactMode.value = false
    showNotifications.value = true
    autoRefresh.value = false
    refreshInterval.value = 30

    // Clear localStorage
    localStorage.removeItem('darkMode')
    localStorage.removeItem('itemsPerPage')
    localStorage.removeItem('cacheTimeout')
    localStorage.removeItem('compactMode')
    localStorage.removeItem('showNotifications')
    localStorage.removeItem('autoRefresh')
    localStorage.removeItem('refreshInterval')
  }

  return {
    // State
    darkMode,
    itemsPerPage,
    cacheTimeout,
    compactMode,
    showNotifications,
    autoRefresh,
    refreshInterval,

    // Actions
    toggleDarkMode,
    setItemsPerPage,
    setCacheTimeout,
    toggleCompactMode,
    toggleNotifications,
    toggleAutoRefresh,
    setRefreshInterval,
    resetToDefaults
  }
})
