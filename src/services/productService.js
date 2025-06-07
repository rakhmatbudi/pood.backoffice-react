// src/services/productService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

class ProductService {
  // Get all products/menu items
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.MENU.LIST, params);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.full_count || 0,
          query: response.data.query,
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
      const response = await apiClient.get(ENDPOINTS.MENU.BY_CATEGORY(categoryId));
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.full_count || 0,
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

  // Create new product
  async createProduct(productData) {
    try {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, productData);
      
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
      const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), productData);
      
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
      id: apiProduct.item_id,
      name: apiProduct.item_name,
      shortName: apiProduct.short_name,
      price: parseFloat(apiProduct.item_price) || 0,
      category: apiProduct.item_category,
      description: apiProduct.item_description || '',
      shortDescription: apiProduct.short_description || '',
      varian: apiProduct.varian,
      grouping: apiProduct.grouping,
      isActive: apiProduct.is_active === 'Y',
      isDisplayInMenu: apiProduct.is_display_in_menu,
      image: this.getProductImageUrl(apiProduct.item_photo1),
      image2: this.getProductImageUrl(apiProduct.item_photo2),
      stock: this.generateRandomStock(), // Since API doesn't provide stock
    };
  }

  // Transform multiple products
  transformProductsData(apiProducts) {
    return apiProducts.map(product => this.transformProductData(product));
  }

  // Get product image URL (handle null/empty images)
  getProductImageUrl(photoPath) {
    if (!photoPath || photoPath === null || photoPath === '') {
      return 'https://via.placeholder.com/200/f3f4f6/6b7280?text=No+Image';
    }
    
    // Assume images are served from a CDN or static folder
    const baseImageUrl = 'https://api.cafeserendipity.id/images/';
    return `${baseImageUrl}${photoPath}`;
  }

  // Generate random stock (since API doesn't provide this)
  generateRandomStock() {
    return Math.floor(Math.random() * 50) + 1;
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
        const categoryId = product.category;
        if (!groupedProducts[categoryId]) {
          groupedProducts[categoryId] = [];
        }
        groupedProducts[categoryId].push(product);
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

  // Search products by name or description
  searchProducts(products, searchTerm) {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.shortName.toLowerCase().includes(term) ||
      product.grouping.toLowerCase().includes(term)
    );
  }

  // Filter products by category
  filterProductsByCategory(products, categoryId) {
    if (!categoryId) return products;
    return products.filter(product => product.category === categoryId);
  }

  // Filter products by price range
  filterProductsByPriceRange(products, minPrice, maxPrice) {
    return products.filter(product => {
      const price = product.price;
      return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    });
  }

  // Sort products by various criteria
  sortProducts(products, sortBy, sortDirection = 'asc') {
    return [...products].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Get product statistics
  getProductStatistics(products) {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
    };

    // Group by category
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    return {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      averagePrice: Math.round(averagePrice),
      priceRange,
      categoryCount,
    };
  }
}

// Create and export a singleton instance
const productService = new ProductService();
export default productService;