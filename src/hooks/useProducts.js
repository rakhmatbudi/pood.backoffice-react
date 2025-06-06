

// src/hooks/useProducts.js
import { useState } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      category: 'food',
      price: 25000,
      description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
      stock: 50,
      image: 'https://via.placeholder.com/100x100?text=Nasi+Goreng',
      isActive: true
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      category: 'drink',
      price: 5000,
      description: 'Teh manis dingin yang menyegarkan',
      stock: 100,
      image: 'https://via.placeholder.com/100x100?text=Es+Teh',
      isActive: true
    },
    {
      id: 3,
      name: 'Ayam Bakar',
      category: 'food',
      price: 30000,
      description: 'Ayam bakar dengan bumbu khas dan sambal',
      stock: 25,
      image: 'https://via.placeholder.com/100x100?text=Ayam+Bakar',
      isActive: false
    },
    {
      id: 4,
      name: 'Gado-gado',
      category: 'food',
      price: 20000,
      description: 'Sayuran segar dengan bumbu kacang',
      stock: 30,
      image: 'https://via.placeholder.com/100x100?text=Gado-gado',
      isActive: true
    },
    {
      id: 5,
      name: 'Jus Jeruk',
      category: 'drink',
      price: 8000,
      description: 'Jus jeruk segar tanpa gula tambahan',
      stock: 75,
      image: 'https://via.placeholder.com/100x100?text=Jus+Jeruk',
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'food',
    price: '',
    description: '',
    stock: '',
    image: '',
    isActive: true
  });

  const handleAddProduct = (categories) => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories.find(c => c.isActive)?.id || 'food',
      price: '',
      description: '',
      stock: '',
      image: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
      image: product.image,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.stock) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: productForm.name,
              category: productForm.category,
              price: parseInt(productForm.price),
              description: productForm.description,
              stock: parseInt(productForm.stock),
              image: productForm.image || 'https://via.placeholder.com/100x100?text=Product',
              isActive: productForm.isActive
            }
          : p
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: productForm.name,
        category: productForm.category,
        price: parseInt(productForm.price),
        description: productForm.description,
        stock: parseInt(productForm.stock),
        image: productForm.image || 'https://via.placeholder.com/100x100?text=Product',
        isActive: productForm.isActive
      };
      setProducts([...products, newProduct]);
    }
    
    setShowModal(false);
  };

  const toggleProductStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  return {
    products,
    showModal,
    editingProduct,
    productForm,
    setShowModal,
    setProductForm,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    toggleProductStatus
  };
};

// src/utils/formatters.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export const getCategoryColorClasses = (color) => {
  const colorClasses = {
    green: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      border: 'border-green-200', 
      solid: 'bg-green-500' 
    },
    blue: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      border: 'border-blue-200', 
      solid: 'bg-blue-500' 
    },
    pink: { 
      bg: 'bg-pink-100', 
      text: 'text-pink-800', 
      border: 'border-pink-200', 
      solid: 'bg-pink-500' 
    },
    yellow: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200', 
      solid: 'bg-yellow-500' 
    },
    purple: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800', 
      border: 'border-purple-200', 
      solid: 'bg-purple-500' 
    },
    red: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      border: 'border-red-200', 
      solid: 'bg-red-500' 
    }
  };
  return colorClasses[color] || colorClasses.blue;
};

// src/utils/constants.js
export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/100x100?text=Product';

export const CATEGORY_COLORS = [
  'blue', 'green', 'pink', 'yellow', 'purple', 'red'
];

export const CURRENCY_CONFIG = {
  locale: 'id-ID',
  currency: 'IDR',
  minimumFractionDigits: 0
};

// src/utils/validators.js
export const validateProductForm = (form) => {
  const errors = {};
  
  if (!form.name.trim()) {
    errors.name = 'Product name is required';
  }
  
  if (!form.price || form.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!form.description.trim()) {
    errors.description = 'Description is required';
  }
  
  if (!form.stock || form.stock < 0) {
    errors.stock = 'Stock must be 0 or greater';
  }
  
  if (form.image && !isValidUrl(form.image)) {
    errors.image = 'Please enter a valid URL';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCategoryForm = (form) => {
  const errors = {};
  
  if (!form.name.trim()) {
    errors.name = 'Category name is required';
  }
  
  if (!form.description.trim()) {
    errors.description = 'Description is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// src/utils/helpers.js
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
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  
  const categoryStats = categories.map(category => ({
    ...category,
    productCount: products.filter(p => p.category === category.id).length,
    totalValue: products
      .filter(p => p.category === category.id)
      .reduce((sum, p) => sum + (p.price * p.stock), 0)
  }));
  
  return {
    totalProducts,
    activeProducts,
    totalStock,
    totalValue,
    lowStockProducts,
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

export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(product => product.category === categoryId);
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