import { CURRENCY, QUANTITY_LEVELS } from './constants'

/**
 * Format price to INR currency
 * @param {number} price - Price value
 * @param {boolean} showSymbol - Show currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (price, showSymbol = true) => {
  if (!price && price !== 0) return 'N/A'
  
  const parsed = parseFloat(price)
  if (isNaN(parsed)) return 'N/A'
  
  const formatted = parsed.toLocaleString('en-IN', {
    maximumFractionDigits: CURRENCY.DECIMALS,
    minimumFractionDigits: CURRENCY.DECIMALS
  })
  
  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A'
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return 'N/A'
  
  const formats = {
    short: dateObj.toLocaleDateString('en-IN'),
    long: dateObj.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: dateObj.toLocaleTimeString('en-IN'),
    datetime: dateObj.toLocaleString('en-IN')
  }
  
  return formats[format] || formats.short
}

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)
  
  return parts.join(' ')
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text
  return `${text.substring(0, length)}...`
}

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format quantity with stock level indicator
 * @param {number} quantity - Stock quantity
 * @returns {object} { value, label, severity }
 */
export const formatQuantity = (quantity) => {
  if (quantity < 0) {
    return {
      value: quantity,
      label: 'Invalid Quantity',
      severity: 'error'
    }
  }
  
  let severity = 'success'
  let label = 'In Stock'
  
  if (quantity === QUANTITY_LEVELS.CRITICAL) {
    severity = 'error'
    label = 'Out of Stock'
  } else if (quantity < QUANTITY_LEVELS.LOW) {
    severity = 'warning'
    label = 'Low Stock'
  } else if (quantity < QUANTITY_LEVELS.MEDIUM) {
    severity = 'info'
    label = 'Medium Stock'
  }
  
  return { value: quantity, label, severity }
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, total, decimals = 2) => {
  if (!total || isNaN(value) || isNaN(total)) return '0%'
  return `${((value / total) * 100).toFixed(decimals)}%`
}

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}
