import { REGEX_PATTERNS, FILE_SIZES } from './constants'

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  return REGEX_PATTERNS.EMAIL.test(email)
}

/**
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  return REGEX_PATTERNS.PHONE.test(phone)
}

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {boolean}
 */
export const validateSKU = (sku) => {
  return !sku || REGEX_PATTERNS.SKU.test(sku)
}

/**
 * Validate positive number
 * @param {number|string} value - Value to validate
 * @returns {boolean}
 */
export const validatePositiveNumber = (value) => {
  return REGEX_PATTERNS.POSITIVE_NUMBER.test(String(value))
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {object} { valid, error }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' }
  }
  
  if (!FILE_SIZES.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }
  }
  
  if (file.size > FILE_SIZES.IMAGE_MAX_BYTES) {
    return { valid: false, error: `File too large. Max: ${FILE_SIZES.IMAGE_MAX_MB}MB` }
  }
  
  return { valid: true }
}

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @returns {string|true} Error message or true
 */
export const required = (value) => {
  return value ? true : 'This field is required'
}

/**
 * Validate min length
 * @param {number} length - Min length
 * @returns {function} Validator function
 */
export const minLength = (length) => (value) => {
  return !value || value.length >= length ? true : `Minimum ${length} characters required`
}

/**
 * Validate max length
 * @param {number} length - Max length
 * @returns {function} Validator function
 */
export const maxLength = (length) => (value) => {
  return !value || value.length <= length ? true : `Maximum ${length} characters allowed`
}

/**
 * Validate min value
 * @param {number} min - Min value
 * @returns {function} Validator function
 */
export const minValue = (min) => (value) => {
  return value >= min ? true : `Value must be at least ${min}`
}

/**
 * Validate max value
 * @param {number} max - Max value
 * @returns {function} Validator function
 */
export const maxValue = (max) => (value) => {
  return value <= max ? true : `Value must not exceed ${max}`
}

/**
 * Validate between range
 * @param {number} min - Min value
 * @param {number} max - Max value
 * @returns {function} Validator function
 */
export const between = (min, max) => (value) => {
  return value >= min && value <= max ? true : `Value must be between ${min} and ${max}`
}

/**
 * Validate object fields
 * @param {object} obj - Object to validate
 * @param {object} rules - Validation rules
 * @returns {object} Errors object
 */
export const validateObject = (obj, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]]
    
    validators.forEach(validator => {
      const result = validator(obj[field])
      if (result !== true) {
        errors[field] = result
      }
    })
  })
  
  return errors
}
