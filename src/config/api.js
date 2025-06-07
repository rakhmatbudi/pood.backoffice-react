// src/config/api.js
const API_CONFIG = {
  BASE_URL: 'https://api.cafeserendipity.id',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

const ENDPOINTS = {
  // Category endpoints
  CATEGORIES: {
    LIST: '/category',
    CREATE: '/category',
    UPDATE: (id) => `/category/${id}`,
    DELETE: (id) => `/category/${id}`,
    BY_ID: (id) => `/category/${id}`,
  },
  
  // Product endpoints (for future use)
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    BY_ID: (id) => `/products/${id}`,
    BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  },
  
  // Menu endpoints
  MENU: {
    LIST: '/menu',
    FEATURED: '/menu/featured',
    BY_CATEGORY: (categoryId) => `/menu/category/${categoryId}`,
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