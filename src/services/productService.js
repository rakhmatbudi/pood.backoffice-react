// src/services/productService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

class ProductService {
  // Get all products/menu items
  async getProducts(params = {}) {
    try {
      console.log('🔍 Fetching products from:', ENDPOINTS.PRODUCTS.LIST);
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, params);
      
      console.log('🔍 Full API response:', response);
      
      // Your APIClient returns { success: true/false, data: {...}, status: number }
      if (response.success) {
        // The actual data might be in response.data.data or just response.data
        const actualData = response.data?.data || response.data;
        console.log('🔍 Actual data:', actualData);
        
        return {
          success: true,
          data: actualData || [],
          totalCount: Array.isArray(actualData) ? actualData.length : 0,
          status: 'success',
        };
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.BY_ID(id));
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || null,
        };
      } else {
        throw new Error(response.error || 'Failed to fetch product');
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId));
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || [],
          totalCount: Array.isArray(actualData) ? actualData.length : 0,
        };
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get active products only
  async getActiveProducts() {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.ACTIVE);
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || [],
          totalCount: Array.isArray(actualData) ? actualData.length : 0,
        };
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching active products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Search products
  async searchProducts(searchTerm) {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.SEARCH(encodeURIComponent(searchTerm)));
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || [],
          totalCount: Array.isArray(actualData) ? actualData.length : 0,
          searchTerm,
        };
      } else {
        throw new Error(response.error || 'Failed to search products');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Create new product (works with your existing endpoint)
  async createProduct(productData) {
    try {
      // Transform frontend data to API format
      const apiProductData = this.transformToApiFormat(productData);
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, apiProductData);
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || null,
          message: 'Product created successfully',
        };
      } else {
        throw new Error(response.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Create product with image using your existing endpoint
  async createProductWithImage(formData) {
    try {
      // For FormData, we need to use a different approach with your APIClient
      const response = await apiClient.request(ENDPOINTS.PRODUCTS.CREATE, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      });
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || null,
          message: 'Product created successfully',
        };
      } else {
        throw new Error(response.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product with image:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Update product (works with your existing endpoint)
  async updateProduct(id, productData) {
    try {
      // Transform frontend data to API format
      const apiProductData = this.transformToApiFormat(productData);
      const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), apiProductData);
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || null,
          message: 'Product updated successfully',
        };
      } else {
        throw new Error(response.error || 'Failed to update product');
      }
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Update product with image using your existing endpoint
  async updateProductWithImage(id, formData) {
    try {
      // For FormData, we need to use a different approach with your APIClient
      const response = await apiClient.request(ENDPOINTS.PRODUCTS.UPDATE(id), {
        method: 'PUT',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      });
      
      if (response.success) {
        const actualData = response.data?.data || response.data;
        return {
          success: true,
          data: actualData || null,
          message: 'Product updated successfully',
        };
      } else {
        throw new Error(response.error || 'Failed to update product');
      }
    } catch (error) {
      console.error(`Error updating product ${id} with image:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
      
      if (response.success) {
        return {
          success: true,
          message: 'Product deleted successfully',
        };
      } else {
        throw new Error(response.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // File upload utility methods

  // Helper method to validate image file
  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please select a valid image file (JPEG, PNG, or WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image file must be less than 5MB'
      };
    }

    return { valid: true };
  }

  // Helper method to create image preview URL
  createImagePreview(file) {
    return URL.createObjectURL(file);
  }

  // Helper method to revoke image preview URL (call this to prevent memory leaks)
  revokeImagePreview(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  // Prepare form data for file upload - works with your existing API
  prepareFormData(productData, imageFile = null) {
    const formData = new FormData();
    
    // Add fields in the format your API expects
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('category_id', productData.categoryId.toString());
    formData.append('is_active', productData.isActive.toString());
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return formData;
  }

  // Get formatted image URL (your images are already full Cloudinary URLs)
  getImageUrl(imagePath) {
    return imagePath; // Your API returns full Cloudinary URLs
  }

  // Transform API product data to frontend format
  transformProductData(apiProduct) {
    return {
      id: apiProduct.id,
      name: apiProduct.name || '',
      description: apiProduct.description || '',
      price: parseFloat(apiProduct.price) || 0,
      isActive: apiProduct.is_active,
      imagePath: apiProduct.image_path || '',
      createdAt: apiProduct.created_at,
      updatedAt: apiProduct.updated_at,
      
      // Category information - ensure safe access
      category: apiProduct.category ? {
        id: apiProduct.category.id,
        name: apiProduct.category.name,
        description: apiProduct.category.description,
      } : null,
      
      // Add categoryId for form compatibility
      categoryId: apiProduct.category ? apiProduct.category.id : null,
      
      // Variants information
      variants: apiProduct.variants ? apiProduct.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: parseFloat(variant.price) || 0,
        isActive: variant.is_active,
        createdAt: variant.created_at,
        updatedAt: variant.updated_at,
      })) : [],
      
      // Additional computed fields
      hasVariants: apiProduct.variants && apiProduct.variants.length > 0,
      activeVariantsCount: apiProduct.variants ? apiProduct.variants.filter(v => v.is_active).length : 0,
      minPrice: apiProduct.variants && apiProduct.variants.length > 0 
        ? Math.min(...apiProduct.variants.map(v => parseFloat(v.price) || 0))
        : parseFloat(apiProduct.price) || 0,
      maxPrice: apiProduct.variants && apiProduct.variants.length > 0 
        ? Math.max(...apiProduct.variants.map(v => parseFloat(v.price) || 0))
        : parseFloat(apiProduct.price) || 0,
        
      // Additional form-friendly fields
      priceString: apiProduct.price?.toString() || '0',
      categoryIdString: apiProduct.category?.id?.toString() || '',
    };
  }

  // Transform frontend data to API format
  transformToApiFormat(frontendData) {
    return {
      name: frontendData.name,
      description: frontendData.description || null,
      price: frontendData.price?.toString() || '0.00',
      is_active: frontendData.isActive !== undefined ? frontendData.isActive : true,
      image_path: frontendData.imagePath || null,
      category_id: frontendData.categoryId || frontendData.category?.id || null,
    };
  }

  // Transform multiple products
  transformProductsData(apiProducts) {
    return apiProducts.map(product => this.transformProductData(product));
  }

  // Get products grouped by category
  async getProductsByCategories() {
    try {
      const result = await this.getProducts();
      
      if (!result.success) {
        return result;
      }

      const transformedProducts = this.transformProductsData(result.data);
      const groupedProducts = {};

      transformedProducts.forEach(product => {
        if (product.category) {
          const categoryName = product.category.name;
          if (!groupedProducts[categoryName]) {
            groupedProducts[categoryName] = {
              category: product.category,
              products: [],
            };
          }
          groupedProducts[categoryName].products.push(product);
        } else {
          // Handle products without category
          if (!groupedProducts['Uncategorized']) {
            groupedProducts['Uncategorized'] = {
              category: { id: null, name: 'Uncategorized', description: null },
              products: [],
            };
          }
          groupedProducts['Uncategorized'].products.push(product);
        }
      });

      return {
        success: true,
        data: groupedProducts,
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.error('Error getting products by categories:', error);
      return {
        success: false,
        error: error.message,
        data: {},
      };
    }
  }

  // Get products filtered by various criteria
  async getFilteredProducts(filters = {}) {
    try {
      const result = await this.getProducts();
      
      if (!result.success) {
        return result;
      }

      let transformedProducts = this.transformProductsData(result.data);
      
      // Apply filters
      if (filters.isActive !== undefined) {
        transformedProducts = transformedProducts.filter(product => product.isActive === filters.isActive);
      }
      
      if (filters.categoryId) {
        transformedProducts = transformedProducts.filter(product => 
          product.category && product.category.id === filters.categoryId
        );
      }
      
      if (filters.hasVariants !== undefined) {
        transformedProducts = transformedProducts.filter(product => product.hasVariants === filters.hasVariants);
      }
      
      if (filters.minPrice !== undefined) {
        transformedProducts = transformedProducts.filter(product => product.price >= filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        transformedProducts = transformedProducts.filter(product => product.price <= filters.maxPrice);
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        transformedProducts = transformedProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.name.toLowerCase().includes(searchTerm))
        );
      }

      return {
        success: true,
        data: transformedProducts,
        totalCount: transformedProducts.length,
        filters,
      };
    } catch (error) {
      console.error('Error getting filtered products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get product statistics
  async getProductStats() {
    try {
      const result = await this.getProducts();
      
      if (!result.success) {
        return result;
      }

      const transformedProducts = this.transformProductsData(result.data);
      
      const stats = {
        total: transformedProducts.length,
        active: transformedProducts.filter(product => product.isActive).length,
        inactive: transformedProducts.filter(product => !product.isActive).length,
        withVariants: transformedProducts.filter(product => product.hasVariants).length,
        withoutVariants: transformedProducts.filter(product => !product.hasVariants).length,
        withImages: transformedProducts.filter(product => product.imagePath).length,
        withoutImages: transformedProducts.filter(product => !product.imagePath).length,
        byCategory: {},
        priceRanges: {
          under25k: transformedProducts.filter(p => p.price < 25000).length,
          '25k-50k': transformedProducts.filter(p => p.price >= 25000 && p.price < 50000).length,
          '50k-100k': transformedProducts.filter(p => p.price >= 50000 && p.price < 100000).length,
          over100k: transformedProducts.filter(p => p.price >= 100000).length,
        },
        averagePrice: transformedProducts.length > 0 
          ? transformedProducts.reduce((sum, p) => sum + p.price, 0) / transformedProducts.length 
          : 0,
        totalVariants: transformedProducts.reduce((sum, p) => sum + p.variants.length, 0),
      };

      // Category breakdown
      transformedProducts.forEach(product => {
        if (product.category) {
          const categoryName = product.category.name;
          if (!stats.byCategory[categoryName]) {
            stats.byCategory[categoryName] = 0;
          }
          stats.byCategory[categoryName]++;
        }
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Error getting product stats:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Get featured/popular products (can be customized based on business logic)
  async getFeaturedProducts(limit = 10) {
    try {
      const result = await this.getActiveProducts();
      
      if (!result.success) {
        return result;
      }

      const transformedProducts = this.transformProductsData(result.data);
      
      // Simple logic: products with images and higher prices might be featured
      // You can customize this logic based on your business needs
      const featuredProducts = transformedProducts
        .filter(product => product.imagePath && product.price > 0)
        .sort((a, b) => b.price - a.price) // Sort by price descending
        .slice(0, limit);

      return {
        success: true,
        data: featuredProducts,
        totalCount: featuredProducts.length,
      };
    } catch (error) {
      console.error('Error getting featured products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }
}

// Create and export a singleton instance
const productService = new ProductService();
export default productService;