import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const execute = async (apiCall, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      return { data: result, error: null }
    } catch (err) {
      error.value = err.message || 'An error occurred'
      
      if (options.onError) {
        options.onError(err)
      }
      
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute
  }
}
