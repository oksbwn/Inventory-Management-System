// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
}

// Status Constants
export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  ON_ORDER: 'On Order',
  DISCONTINUED: 'Discontinued'
}

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
}

// Quantity Levels
export const QUANTITY_LEVELS = {
  CRITICAL: 0,
  LOW: 10,
  MEDIUM: 50,
  HIGH: 100
}

// Currency
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  DECIMALS: 2
}

// File Sizes
export const FILE_SIZES = {
  IMAGE_MAX_MB: 5,
  IMAGE_MAX_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}

// Validation Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  SKU: /^[A-Z0-9\-]{3,20}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  POSITIVE_NUMBER: /^[0-9]+(\.[0-9]{1,2})?$/
}

// Colors for Status
export const STATUS_COLORS = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  primary: '#667eea'
}

// Toast Durations (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
  EXTRA_LONG: 7000
}
