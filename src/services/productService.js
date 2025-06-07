// src/services/productService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

class ProductService {
  // Get all products/menu items
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, params);
      
      if (response.success) {
        // Handle the new API response structure
        const apiData = response.data;
        
        return {
          success: true,
          data: apiData.data || [],
          totalCount: apiData.data?.length || 0,
          status: apiData.status,
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error('Error fetching products:', error);
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
        return {
          success: true,
          data: response.data.data || null,
        };
      }
      
      throw new Error(response.error);
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
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.data?.length || 0,
        };
      }
      
      throw new Error(response.error);
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
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.data?.length || 0,
        };
      }
      
      throw new Error(response.error);
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
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.data?.length || 0,
          searchTerm,
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      // Transform frontend data to API format
      const apiProductData = this.transformToApiFormat(productData);
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, apiProductData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || null,
          message: 'Product created successfully',
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Update product
  async updateProduct(id, productData) {
    try {
      // Transform frontend data to API format
      const apiProductData = this.transformToApiFormat(productData);
      const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), apiProductData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || null,
          message: 'Product updated successfully',
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
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
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Utility methods for product data processing
  
  // Transform API product data to frontend format
  transformProductData(apiProduct) {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description || 'No description available',
      price: parseFloat(apiProduct.price) || 0,
      isActive: apiProduct.is_active,
      imagePath: apiProduct.image_path,
      createdAt: apiProduct.created_at,
      updatedAt: apiProduct.updated_at,
      
      // Category information
      category: apiProduct.category ? {
        id: apiProduct.category.id,
        name: apiProduct.category.name,
        description: apiProduct.category.description,
      } : null,
      
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