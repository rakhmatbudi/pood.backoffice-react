// src/utils/helpers.js
import { formatPrice } from './formatters';
import { CATEGORY_COLORS } from './constants';

export const generateId = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export const generateNextProductId = (products) => {
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
};

export const calculateDashboardStats = (products, categories) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = products.filter(p => !p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  
  const categoryStats = categories.map(category => ({
    ...category,
    productCount: products.filter(p => p.category === category.id).length,
    activeProductCount: products.filter(p => p.category === category.id && p.isActive).length,
    totalStock: products
      .filter(p => p.category === category.id)
      .reduce((sum, p) => sum + p.stock, 0),
    totalValue: products
      .filter(p => p.category === category.id)
      .reduce((sum, p) => sum + (p.price * p.stock), 0)
  }));
  
  const averagePrice = totalProducts > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts 
    : 0;
    
  const averageStock = totalProducts > 0 
    ? totalStock / totalProducts 
    : 0;
  
  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalStock,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
    averagePrice,
    averageStock,
    categoryStats
  };
};

export const searchProducts = (products, searchTerm) => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
};

export const searchCategories = (categories, searchTerm) => {
  if (!searchTerm.trim()) return categories;
  
  const term = searchTerm.toLowerCase();
  return categories.filter(category => 
    category.name.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term)
  );
};

export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(product => product.category === categoryId);
};

export const filterByStatus = (items, status) => {
  if (status === 'all') return items;
  if (status === 'active') return items.filter(item => item.isActive);
  if (status === 'inactive') return items.filter(item => !item.isActive);
  return items;
};

export const sortProducts = (products, sortBy, sortOrder = 'asc') => {
  return [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const sortCategories = (categories, sortBy, sortOrder = 'asc') => {
  return [...categories].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const paginateItems = (items, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / pageSize),
    currentPage: page,
    totalItems: items.length,
    hasNextPage: endIndex < items.length,
    hasPrevPage: page > 1
  };
};

export const exportToCSV = (data, filename) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const capitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getRandomColor = () => {
  return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
};

// src/utils/storage.js
const STORAGE_PREFIX = 'pood_backoffice_';

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export const saveUserPreferences = (preferences) => {
  return storage.set('user_preferences', preferences);
};

export const getUserPreferences = () => {
  return storage.get('user_preferences') || {
    theme: 'light',
    language: 'id-ID',
    pageSize: 12,
    defaultSort: 'name'
  };
};

export const saveAppState = (state) => {
  return storage.set('app_state', state);
};

export const getAppState = () => {
  return storage.get('app_state');
};