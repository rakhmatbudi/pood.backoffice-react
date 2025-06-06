// src/utils/validators.js
import { VALIDATION_RULES } from './constants';

export const validateProductForm = (form) => {
  const errors = {};
  const rules = VALIDATION_RULES.product;
  
  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Product name is required';
  } else if (form.name.trim().length < rules.nameMinLength) {
    errors.name = `Name must be at least ${rules.nameMinLength} characters`;
  } else if (form.name.trim().length > rules.nameMaxLength) {
    errors.name = `Name must be less than ${rules.nameMaxLength} characters`;
  }
  
  // Price validation
  if (!form.price) {
    errors.price = 'Price is required';
  } else {
    const price = parseInt(form.price);
    if (isNaN(price) || price < rules.priceMin) {
      errors.price = `Price must be at least ${formatPrice(rules.priceMin)}`;
    } else if (price > rules.priceMax) {
      errors.price = `Price must be less than ${formatPrice(rules.priceMax)}`;
    }
  }
  
  // Description validation
  if (!form.description.trim()) {
    errors.description = 'Description is required';
  } else if (form.description.trim().length < rules.descriptionMinLength) {
    errors.description = `Description must be at least ${rules.descriptionMinLength} characters`;
  } else if (form.description.trim().length > rules.descriptionMaxLength) {
    errors.description = `Description must be less than ${rules.descriptionMaxLength} characters`;
  }
  
  // Stock validation
  if (form.stock === '') {
    errors.stock = 'Stock is required';
  } else {
    const stock = parseInt(form.stock);
    if (isNaN(stock) || stock < rules.stockMin) {
      errors.stock = `Stock must be at least ${rules.stockMin}`;
    } else if (stock > rules.stockMax) {
      errors.stock = `Stock must be less than ${rules.stockMax}`;
    }
  }
  
  // Image URL validation
  if (form.image && !isValidUrl(form.image)) {
    errors.image = 'Please enter a valid URL';
  }
  
  // Category validation
  if (!form.category) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCategoryForm = (form) => {
  const errors = {};
  const rules = VALIDATION_RULES.category;
  
  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Category name is required';
  } else if (form.name.trim().length < rules.nameMinLength) {
    errors.name = `Name must be at least ${rules.nameMinLength} characters`;
  } else if (form.name.trim().length > rules.nameMaxLength) {
    errors.name = `Name must be less than ${rules.nameMaxLength} characters`;
  }
  
  // Description validation
  if (!form.description.trim()) {
    errors.description = 'Description is required';
  } else if (form.description.trim().length < rules.descriptionMinLength) {
    errors.description = `Description must be at least ${rules.descriptionMinLength} characters`;
  } else if (form.description.trim().length > rules.descriptionMaxLength) {
    errors.description = `Description must be less than ${rules.descriptionMaxLength} characters`;
  }
  
  // Color validation
  if (!form.color) {
    errors.color = 'Color theme is required';
  } else if (!CATEGORY_COLORS.includes(form.color)) {
    errors.color = 'Invalid color theme selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (form) => {
  const errors = {};
  
  if (!form.username.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!form.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};