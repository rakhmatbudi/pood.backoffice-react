// src/utils/formatters.js

// Price formatting
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// Number formatting
export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

// Date formatting
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Date and time formatting
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Category color classes for Tailwind
export const getCategoryColorClasses = (color) => {
  const colorClasses = {
    green: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      border: 'border-green-200', 
      solid: 'bg-green-500',
      hover: 'hover:bg-green-200',
      ring: 'focus:ring-green-500'
    },
    blue: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      border: 'border-blue-200', 
      solid: 'bg-blue-500',
      hover: 'hover:bg-blue-200',
      ring: 'focus:ring-blue-500'
    },
    pink: { 
      bg: 'bg-pink-100', 
      text: 'text-pink-800', 
      border: 'border-pink-200', 
      solid: 'bg-pink-500',
      hover: 'hover:bg-pink-200',
      ring: 'focus:ring-pink-500'
    },
    yellow: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200', 
      solid: 'bg-yellow-500',
      hover: 'hover:bg-yellow-200',
      ring: 'focus:ring-yellow-500'
    },
    purple: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800', 
      border: 'border-purple-200', 
      solid: 'bg-purple-500',
      hover: 'hover:bg-purple-200',
      ring: 'focus:ring-purple-500'
    },
    red: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      border: 'border-red-200', 
      solid: 'bg-red-500',
      hover: 'hover:bg-red-200',
      ring: 'focus:ring-red-500'
    },
    orange: { 
      bg: 'bg-orange-100', 
      text: 'text-orange-800', 
      border: 'border-orange-200', 
      solid: 'bg-orange-500',
      hover: 'hover:bg-orange-200',
      ring: 'focus:ring-orange-500'
    },
    gray: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      border: 'border-gray-200', 
      solid: 'bg-gray-500',
      hover: 'hover:bg-gray-200',
      ring: 'focus:ring-gray-500'
    }
  };
  return colorClasses[color] || colorClasses.blue;
};

// Percentage formatting
export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

// Text truncation
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get price display (with variants consideration) - specific to products
export const getPriceDisplay = (product) => {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    const activeVariants = product.variants.filter(v => v.isActive);
    if (activeVariants.length > 0) {
      const minPrice = Math.min(...activeVariants.map(v => v.price));
      const maxPrice = Math.max(...activeVariants.map(v => v.price));
      
      if (minPrice === maxPrice) {
        return formatPrice(minPrice);
      } else {
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
      }
    }
  }
  return formatPrice(product.price);
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};