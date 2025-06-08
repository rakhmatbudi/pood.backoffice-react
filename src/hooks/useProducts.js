// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState(null);

  // Use your production API URL
  const API_BASE_URL = 'https://api.pood.lol';

  // Helper function to handle API responses
  const handleApiResponse = async (response, operation) => {
    const contentType = response.headers.get('content-type');
    
    // Check if response is HTML (error page)
    if (contentType && contentType.includes('text/html')) {
      throw new Error(`API endpoint not found. Server returned HTML instead of JSON for ${operation}. Check if your API server is running and the endpoint exists.`);
    }
    
    // Check if response is not ok
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        // Try to get error details from JSON response
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use the status text
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse JSON response
    try {
      const result = await response.json();
      return result;
    } catch (e) {
      throw new Error(`Invalid JSON response from server for ${operation}`);
    }
  };

  // Generate stats from products (since there's no stats endpoint)
  const generateStats = useCallback((productList) => {
    if (!productList || productList.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        withVariants: 0,
        withImages: 0,
        averagePrice: 0,
        priceRanges: {
          under25k: 0,
          '25k-50k': 0,
          '50k-100k': 0,
          over100k: 0
        }
      };
    }

    const total = productList.length;
    const active = productList.filter(p => p.isActive).length;
    const inactive = total - active;
    const withVariants = productList.filter(p => p.hasVariants).length;
    const withImages = productList.filter(p => p.imagePath).length;
    const averagePrice = productList.reduce((sum, p) => sum + (p.price || 0), 0) / total;

    const priceRanges = {
      under25k: productList.filter(p => (p.price || 0) < 25000).length,
      '25k-50k': productList.filter(p => (p.price || 0) >= 25000 && (p.price || 0) < 50000).length,
      '50k-100k': productList.filter(p => (p.price || 0) >= 50000 && (p.price || 0) < 100000).length,
      over100k: productList.filter(p => (p.price || 0) >= 100000).length
    };

    return {
      total,
      active,
      inactive,
      withVariants,
      withImages,
      averagePrice,
      priceRanges
    };
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/menu-items/?includeInactive=true`;
      console.log('Fetching products from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const result = await handleApiResponse(response, 'fetch products');
      
      if (result.status === 'success' && result.data) {
        // Transform the data to match our component expectations
        const transformedProducts = result.data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          isActive: product.is_active,
          imagePath: product.image_path,
          category: product.category,
          categoryId: product.category?.id,
          variants: product.variants || [],
          hasVariants: product.variants && product.variants.length > 0,
          activeVariantsCount: product.variants ? product.variants.filter(v => v.is_active).length : 0,
          updatedAt: product.updated_at,
          createdAt: product.created_at
        }));
        
        setProducts(transformedProducts);
        setTotalCount(transformedProducts.length);
        console.log('✅ Successfully loaded', transformedProducts.length, 'products');
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in fetchProducts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product statistics (generate from products data)
  const fetchStats = useCallback(async () => {
    try {
      // Generate stats from current products since there's no dedicated stats endpoint
      setStats(generateStats(products));
    } catch (err) {
      console.error('Error generating stats:', err);
    }
  }, [products, generateStats]);

  // Create product
  const createProduct = useCallback(async (productData, imageFile = null) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.categoryId); // Your API expects 'category'
      formData.append('is_active', productData.isActive.toString()); // Your API expects 'is_active'
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const url = `${API_BASE_URL}/menu-items/`;
      console.log('Creating product at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      const result = await handleApiResponse(response, 'create product');
      
      if (result.status === 'success' || result.id) {
        await fetchProducts();
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Failed to create product' };
      }
    } catch (err) {
      console.error('Error creating product:', err);
      return { success: false, error: err.message };
    }
  }, [fetchProducts]);

  // Update product
  const updateProduct = useCallback(async (productId, productData, imageFile = null) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.categoryId); // Your API expects 'category'
      formData.append('is_active', productData.isActive.toString()); // Your API expects 'is_active'
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const url = `${API_BASE_URL}/menu-items/${productId}/`;
      console.log('Updating product at:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      });
      
      const result = await handleApiResponse(response, 'update product');
      
      if (result.status === 'success' || result.id) {
        await fetchProducts();
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Failed to update product' };
      }
    } catch (err) {
      console.error('Error updating product:', err);
      return { success: false, error: err.message };
    }
  }, [fetchProducts]);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    try {
      const url = `${API_BASE_URL}/menu-items/${productId}/`;
      console.log('Deleting product at:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const result = await handleApiResponse(response, 'delete product');
      
      if (result.status === 'success' || response.status === 204) {
        setProducts(prev => prev.filter(product => product.id !== productId));
        setTotalCount(prev => prev - 1);
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Failed to delete product' };
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update stats when products change
  useEffect(() => {
    if (products.length >= 0) {
      setStats(generateStats(products));
    }
  }, [products, generateStats]);

  return {
    products,
    loading,
    error,
    totalCount,
    stats,
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

// Utility functions
export const generateNextProductId = (products) => {
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
};

export const calculateDashboardStats = (products, categories) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
  
  const categoryStats = categories.map(category => ({
    ...category,
    productCount: products.filter(p => p.categoryId === category.id).length,
    totalValue: products
      .filter(p => p.categoryId === category.id)
      .reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
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
    (product.description && product.description.toLowerCase().includes(term))
  );
};

export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(product => product.categoryId === categoryId);
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