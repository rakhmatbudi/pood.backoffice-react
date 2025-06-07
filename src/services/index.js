// src/services/index.js
// Centralized export for all services

export { default as apiClient } from './apiClient';
export { default as categoryService } from './categoryService';

// Future services can be added here:
// export { default as productService } from './productService';
// export { default as orderService } from './orderService';
// export { default as authService } from './authService';
// export { default as menuService } from './menuService';

// You can also create grouped exports for better organization:
export const services = {
  category: () => import('./categoryService'),
  // product: () => import('./productService'),
  // order: () => import('./orderService'),
  // auth: () => import('./authService'),
};

// Configuration exports
export { API_CONFIG, ENDPOINTS } from '../config/api';