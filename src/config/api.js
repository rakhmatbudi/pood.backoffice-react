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
  
  // Product/Menu endpoints
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

export { API_CONFIG, ENDPOINTS };