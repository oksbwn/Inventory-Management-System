import { QUANTITY_LEVELS } from './constants'

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get quantity color based on level
 * @param {number} quantity - Stock quantity
 * @returns {string} Color name
 */
export const getQuantityColor = (quantity) => {
  if (quantity < 0) return 'error'
  
  if (quantity === QUANTITY_LEVELS.CRITICAL) return 'error'
  if (quantity < QUANTITY_LEVELS.LOW) return 'warning'
  if (quantity < QUANTITY_LEVELS.MEDIUM) return 'info'
  return 'success'
}

/**
 * Get quantity icon based on level
 * @param {number} quantity - Stock quantity
 * @returns {string} Icon name
 */
export const getQuantityIcon = (quantity) => {
  if (quantity < 0) return 'mdi-alert-circle'
  
  if (quantity === QUANTITY_LEVELS.CRITICAL) return 'mdi-close-circle'
  if (quantity < QUANTITY_LEVELS.LOW) return 'mdi-alert'
  return 'mdi-check-circle'
}

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 * @param {...object} objects - Objects to merge
 * @returns {object} Merged object
 */
export const deepMerge = (...objects) => {
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = deepMerge(result[key] || {}, obj[key])
      } else {
        result[key] = obj[key]
      }
    })
    return result
  }, {})
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Sort array of objects by property
 * @param {array} arr - Array to sort
 * @param {string} prop - Property to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} Sorted array
 */
export const sortBy = (arr, prop, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const valA = a[prop]
    const valB = b[prop]
    
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Group array by property
 * @param {array} arr - Array to group
 * @param {string} prop - Property to group by
 * @returns {object} Grouped object
 */
export const groupBy = (arr, prop) => {
  return arr.reduce((result, item) => {
    const key = item[prop]
    if (!result[key]) result[key] = []
    result[key].push(item)
    return result
  }, {})
}

/**
 * Find duplicates in array
 * @param {array} arr - Array to check
 * @param {string} prop - Property to check (optional)
 * @returns {array} Duplicates
 */
export const findDuplicates = (arr, prop) => {
  const seen = new Set()
  const duplicates = new Set()
  
  arr.forEach(item => {
    const key = prop ? item[prop] : item
    if (seen.has(key)) {
      duplicates.add(key)
    }
    seen.add(key)
  })
  
  return Array.from(duplicates)
}

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

/**
 * Retry async function
 * @param {function} func - Async function
 * @param {number} attempts - Number of attempts
 * @param {number} delay - Delay between attempts
 * @returns {promise}
 */
export const retry = async (func, attempts = 3, delay = 1000) => {
  try {
    return await func()
  } catch (error) {
    if (attempts <= 1) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return retry(func, attempts - 1, delay)
  }
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {object} Parsed query
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

/**
 * Build query string from object
 * @param {object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
}
