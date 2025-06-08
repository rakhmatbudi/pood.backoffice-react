// src/hooks/useProducts.js - Works with separate useProductForm hook
import { useState, useEffect } from 'react';
import { API_CONFIG, ENDPOINTS, ERROR_MESSAGES } from '../config/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create API URL helper
  const createApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

  // Generic API request helper
  const apiRequest = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw err;
    }
  };

  // Fetch categories from the correct API endpoint
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      
      // Use the correct categories API endpoint
      const url = 'https://api.pood.lol/menu-categories/';
      console.log('🔍 Fetching categories from:', url);
      
      const data = await apiRequest(url);
      console.log('📦 Raw categories response:', data);
      
      let categories = [];
      
      // Handle different possible response structures
      if (data.status === 'success' && Array.isArray(data.data)) {
        categories = data.data;
      } else if (Array.isArray(data)) {
        categories = data;
      } else if (data.results && Array.isArray(data.results)) {
        categories = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        categories = data.data;
      } else {
        console.warn('⚠️ Unexpected categories response structure:', data);
        categories = [];
      }
      
      // Map categories to a consistent format based on the actual API response
      categories = categories.map(category => {
        console.log('📝 Processing category:', category);
        return {
          // Keep all original fields
          ...category,
          // Add standardized fields for the frontend
          id: category.id,
          name: category.name,
          description: category.description || '',
          // Use is_displayed as the active status
          isActive: category.is_displayed,
          // Keep original field names for API calls
          is_displayed: category.is_displayed,
          menu_category_group: category.menu_category_group,
          sku_id: category.sku_id,
          is_highlight: category.is_highlight,
          is_display_for_self_order: category.is_display_for_self_order,
          display_picture: category.display_picture,
          created_at: category.created_at,
          updated_at: category.updated_at
        };
      });
      
      console.log('✅ Processed categories:', categories);
      console.log('📊 Categories count:', categories.length);
      console.log('🎯 Active categories:', categories.filter(c => c.isActive).length);
      
      setCategories(categories);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      // Set empty array on error to prevent app crashes
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = createApiUrl(ENDPOINTS.PRODUCTS.LIST);
      const data = await apiRequest(url);
      
      let products = [];
      if (data.status === 'success' && Array.isArray(data.data)) {
        products = data.data;
      } else if (Array.isArray(data)) {
        products = data;
      } else {
        products = data.results || data.data || [];
      }
      
      products = products.map(product => {
        const mappedVariants = product.variants ? product.variants.map(variant => ({
          ...variant,
          isActive: variant.is_active,
          is_active: variant.is_active,
        })) : [];

        return {
          ...product,
          isActive: product.is_active,
          image: product.image_path || product.image || '',
          category: product.category,
          categoryId: product.category?.id || null,
          categoryName: product.category?.name || '',
          categoryData: product.category,
          variants: mappedVariants,
          hasVariants: mappedVariants.length > 0,
          activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
          updatedAt: product.updated_at,
          createdAt: product.created_at,
        };
      });
      
      console.log('✅ Fetched products:', products.length);
      setProducts(products);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const url = createApiUrl(ENDPOINTS.PRODUCTS.DELETE(id));
        await apiRequest(url, {
          method: 'DELETE',
        });

        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert(`Error deleting product: ${err.message}`);
        console.error('Error deleting product:', err);
      }
    }
  };

  // Save product function that works with useProductForm
  const saveProduct = async (productData, isEditing = false, editingProductId = null) => {
    try {
      console.log('💾 Saving product with data:', productData);

      if (isEditing && editingProductId) {
        // Update existing product
        const url = createApiUrl(ENDPOINTS.PRODUCTS.UPDATE(editingProductId));
        const updatedProduct = await apiRequest(url, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });

        // Map response back to frontend format
        const mappedVariants = updatedProduct.variants ? updatedProduct.variants.map(variant => ({
          ...variant,
          isActive: variant.is_active,
          is_active: variant.is_active,
        })) : [];

        const mappedProduct = {
          ...updatedProduct,
          isActive: updatedProduct.is_active,
          image: updatedProduct.image_path || '',
          category: updatedProduct.category,
          categoryId: updatedProduct.category?.id || null,
          categoryName: updatedProduct.category?.name || '',
          categoryData: updatedProduct.category,
          variants: mappedVariants,
          hasVariants: mappedVariants.length > 0,
          activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
          updatedAt: updatedProduct.updated_at,
          createdAt: updatedProduct.created_at,
        };

        setProducts(products.map(p => 
          p.id === editingProductId ? mappedProduct : p
        ));
      } else {
        // Create new product
        const url = createApiUrl(ENDPOINTS.PRODUCTS.CREATE);
        const newProduct = await apiRequest(url, {
          method: 'POST',
          body: JSON.stringify(productData),
        });

        // Map response back to frontend format
        const mappedVariants = newProduct.variants ? newProduct.variants.map(variant => ({
          ...variant,
          isActive: variant.is_active,
          is_active: variant.is_active,
        })) : [];

        const mappedProduct = {
          ...newProduct,
          isActive: newProduct.is_active,
          image: newProduct.image_path || '',
          category: newProduct.category,
          categoryId: newProduct.category?.id || null,
          categoryName: newProduct.category?.name || '',
          categoryData: newProduct.category,
          variants: mappedVariants,
          hasVariants: mappedVariants.length > 0,
          activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
          updatedAt: newProduct.updated_at,
          createdAt: newProduct.created_at,
        };

        setProducts([...products, mappedProduct]);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error saving product:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleProductStatus = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      const url = createApiUrl(ENDPOINTS.PRODUCTS.UPDATE(id));
      
      const updatedData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        is_active: !product.isActive,
        category: product.categoryId || product.category?.id,
        image_path: product.image || '',
        stock: product.stock || 0,
      };

      const updatedProduct = await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      const mappedVariants = updatedProduct.variants ? updatedProduct.variants.map(variant => ({
        ...variant,
        isActive: variant.is_active,
        is_active: variant.is_active,
      })) : [];

      const mappedProduct = {
        ...updatedProduct,
        isActive: updatedProduct.is_active,
        image: updatedProduct.image_path || updatedProduct.image || '',
        category: updatedProduct.category,
        categoryId: updatedProduct.category?.id || null,
        categoryName: updatedProduct.category?.name || '',
        categoryData: updatedProduct.category,
        variants: mappedVariants,
        hasVariants: mappedVariants.length > 0,
        activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
        updatedAt: updatedProduct.updated_at,
        createdAt: updatedProduct.created_at,
      };

      setProducts(products.map(p => 
        p.id === id ? mappedProduct : p
      ));
    } catch (err) {
      alert(`Error updating product status: ${err.message}`);
      console.error('Error updating product status:', err);
    }
  };

  return {
    // Product data
    products,
    categories,
    loading,
    categoriesLoading,
    error,
    
    // API functions
    fetchProducts,
    fetchCategories,
    handleDeleteProduct,
    saveProduct,
    toggleProductStatus,
    
    // API helpers for useProductForm
    apiRequest,
    createApiUrl,
  };
};