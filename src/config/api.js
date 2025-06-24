// src/config/api.js
const API_CONFIG = {
  BASE_URL: 'https://api.pood.lol',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

const ENDPOINTS = {
  // Category endpoints
  CATEGORIES: {
    LIST: '/menu-categories/',
    CREATE: '/menu-categories/',
    UPDATE: (id) => `/menu-categories/${id}/`,
    DELETE: (id) => `/menu-categories/${id}/`,
    BY_ID: (id) => `/menu-categories/${id}/`,
  },
  
  // Product/Menu endpoints - using your existing structure
  PRODUCTS: {
    LIST: '/menu-items/?includeInactive=true',
    CREATE: '/menu-items/',
    UPDATE: (id) => `/menu-items/${id}/`,
    DELETE: (id) => `/menu-items/${id}/`,
    BY_ID: (id) => `/menu-items/${id}/`,
    BY_CATEGORY: (categoryId) => `/menu-items/?category=${categoryId}`,
    SEARCH: (term) => `/menu-items/?search=${term}`,
    ACTIVE: '/menu-items/?is_active=true',
  },

  TRANSACTIONS: { // <-- Add this
    LIST: '/payments/grouped/sessions/details',
  },
  
  // Variant endpoints (if needed separately)
  VARIANTS: {
    LIST: '/variants/',
    CREATE: '/variants/',
    UPDATE: (id) => `/variants/${id}/`,
    DELETE: (id) => `/variants/${id}/`,
    BY_PRODUCT: (productId) => `/variants/?product=${productId}`,
  },
  
  // Order endpoints (for future use)
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: (id) => `/orders/${id}`,
    BY_ID: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
  },
  
  // Authentication endpoints (for future use)
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
};

// API Configuration
export const API_CONFIG_EXTENDED = {
  ...API_CONFIG,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // File upload specific config
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
};

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
};

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Menu item created successfully',
  PRODUCT_UPDATED: 'Menu item updated successfully',
  PRODUCT_DELETED: 'Menu item deleted successfully',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size is too large. Maximum size is 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid image file.',
  PRODUCT_NOT_FOUND: 'Menu item not found.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  ORDER_NOT_FOUND: 'Order not found.',
};

export { API_CONFIG, ENDPOINTS };

export default {
  ENDPOINTS,
  API_CONFIG,
  API_CONFIG_EXTENDED,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};