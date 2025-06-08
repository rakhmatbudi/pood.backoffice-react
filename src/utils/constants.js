// src/utils/constants.js

// Demo credentials for login
export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

// Default placeholder image for products
export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/100x100?text=Product';

// Available category colors
export const CATEGORY_COLORS = [
  'blue', 'green', 'pink', 'yellow', 'purple', 'red', 'orange'
];

// Currency configuration for Indonesian Rupiah
export const CURRENCY_CONFIG = {
  locale: 'id-ID',
  currency: 'IDR',
  minimumFractionDigits: 0
};

// Application configuration
export const APP_CONFIG = {
  name: 'Pood Backoffice',
  version: '1.0.0',
  description: 'Restaurant Management System',
  defaultLanguage: 'id-ID'
};

// Pagination settings
export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  pageSizeOptions: [6, 12, 24, 48]
};

// Validation rules for forms
export const VALIDATION_RULES = {
  product: {
    nameMinLength: 3,
    nameMaxLength: 100,
    descriptionMinLength: 10,
    descriptionMaxLength: 500,
    priceMin: 100,
    priceMax: 10000000,
    stockMin: 0,
    stockMax: 9999
  },
  category: {
    nameMinLength: 3,
    nameMaxLength: 50,
    descriptionMinLength: 10,
    descriptionMaxLength: 200
  }
};

// Sort options for different entities
export const SORT_OPTIONS = {
  products: [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' },
    { value: 'category', label: 'Category' }
  ],
  categories: [
    { value: 'name', label: 'Name' },
    { value: 'color', label: 'Color' }
  ]
};

// Status filter options
export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' }
];

// Price range filters (keeping for backward compatibility with existing components)
export const PRICE_RANGES = {
  UNDER_25K: 'under25k',
  RANGE_25K_50K: '25k-50k',
  RANGE_50K_100K: '50k-100k',
  OVER_100K: 'over100k'
};

export const PRICE_RANGE_LABELS = {
  [PRICE_RANGES.UNDER_25K]: 'Under 25K',
  [PRICE_RANGES.RANGE_25K_50K]: '25K - 50K',
  [PRICE_RANGES.RANGE_50K_100K]: '50K - 100K',
  [PRICE_RANGES.OVER_100K]: 'Over 100K'
};

// Sort options with directions (for ProductFilters component)
export const SORT_OPTIONS_WITH_DIRECTION = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  DATE_DESC: 'created_at-desc',
  DATE_ASC: 'created_at-asc'
};

export const SORT_LABELS = {
  [SORT_OPTIONS_WITH_DIRECTION.NAME_ASC]: 'Name A-Z',
  [SORT_OPTIONS_WITH_DIRECTION.NAME_DESC]: 'Name Z-A',
  [SORT_OPTIONS_WITH_DIRECTION.PRICE_ASC]: 'Price Low-High',
  [SORT_OPTIONS_WITH_DIRECTION.PRICE_DESC]: 'Price High-Low',
  [SORT_OPTIONS_WITH_DIRECTION.DATE_DESC]: 'Newest First',
  [SORT_OPTIONS_WITH_DIRECTION.DATE_ASC]: 'Oldest First'
};

// Status filters (for backward compatibility)
export const STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const STATUS_LABELS = {
  [STATUS_FILTERS.ALL]: 'All Status',
  [STATUS_FILTERS.ACTIVE]: 'Active',
  [STATUS_FILTERS.INACTIVE]: 'Inactive'
};

// Image upload configuration
export const IMAGE_CONFIG = {
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  QUALITY: 0.8
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields',
  INVALID_IMAGE_TYPE: 'Please select a valid image file (JPEG, PNG, or WebP)',
  IMAGE_TOO_LARGE: 'Image file must be less than 5MB',
  DELETE_CONFIRMATION: 'Are you sure you want to delete this product?',
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.product.nameMinLength} characters`,
  NAME_TOO_LONG: `Name must not exceed ${VALIDATION_RULES.product.nameMaxLength} characters`,
  DESCRIPTION_TOO_SHORT: `Description must be at least ${VALIDATION_RULES.product.descriptionMinLength} characters`,
  DESCRIPTION_TOO_LONG: `Description must not exceed ${VALIDATION_RULES.product.descriptionMaxLength} characters`,
  PRICE_TOO_LOW: `Price must be at least IDR ${VALIDATION_RULES.product.priceMin.toLocaleString('id-ID')}`,
  PRICE_TOO_HIGH: `Price must not exceed IDR ${VALIDATION_RULES.product.priceMax.toLocaleString('id-ID')}`,
  INVALID_STOCK: `Stock must be between ${VALIDATION_RULES.product.stockMin} and ${VALIDATION_RULES.product.stockMax}`
};