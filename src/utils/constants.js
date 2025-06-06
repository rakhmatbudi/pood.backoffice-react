// src/utils/constants.js
export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/100x100?text=Product';

export const CATEGORY_COLORS = [
  'blue', 'green', 'pink', 'yellow', 'purple', 'red', 'orange'
];

export const CURRENCY_CONFIG = {
  locale: 'id-ID',
  currency: 'IDR',
  minimumFractionDigits: 0
};

export const APP_CONFIG = {
  name: 'Pood Backoffice',
  version: '1.0.0',
  description: 'Restaurant Management System',
  defaultLanguage: 'id-ID'
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  pageSizeOptions: [6, 12, 24, 48]
};

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

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' }
];