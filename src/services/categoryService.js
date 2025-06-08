// src/services/categoryService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

class CategoryService {
  // Get all categories
  async getCategories(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST, params);
      
      if (response.success) {
        // Handle the new API response structure
        const apiData = response.data;
        
        return {
          success: true,
          data: apiData.data || [],
          totalCount: apiData.count || 0,
          status: apiData.status,
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.BY_ID(id));
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || null,
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      // Transform frontend data to API format
      const apiCategoryData = this.transformToApiFormat(categoryData);
      const response = await apiClient.post(ENDPOINTS.CATEGORIES.CREATE, apiCategoryData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || null,
          message: 'Category created successfully',
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    try {
      // Transform frontend data to API format
      const apiCategoryData = this.transformToApiFormat(categoryData);
      const response = await apiClient.put(ENDPOINTS.CATEGORIES.UPDATE(id), apiCategoryData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data || null,
          message: 'Category updated successfully',
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await apiClient.delete(ENDPOINTS.CATEGORIES.DELETE(id));
      
      if (response.success) {
        return {
          success: true,
          message: 'Category deleted successfully',
        };
      }
      
      throw new Error(response.error);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Utility methods for category data processing
  
  // Transform API category data to frontend format
  transformCategoryData(apiCategory) {
    return {
      id: apiCategory.id,
      name: apiCategory.name,
      description: apiCategory.description || 'No description available',
      is_displayed: apiCategory.is_displayed, // ✅ Fixed: Use correct field name
      display_picture: apiCategory.display_picture, // ✅ Fixed: Use correct field name
      createdAt: apiCategory.created_at,
      updatedAt: apiCategory.updated_at,
      color: this.getCategoryColor(apiCategory.id),
      type: this.getCategoryType(apiCategory.name),
      
      // Keep legacy field names for backward compatibility (if needed)
      isActive: apiCategory.is_displayed,
      displayPicture: apiCategory.display_picture,
    };
  }

  // Transform frontend data to API format
  transformToApiFormat(frontendData) {
    return {
      name: frontendData.name,
      description: frontendData.description || null,
      is_displayed: frontendData.is_displayed !== undefined ? frontendData.is_displayed : true, // ✅ Fixed: Use correct field name
      display_picture: frontendData.display_picture || null, // ✅ Fixed: Use correct field name
    };
  }

  // Transform multiple categories
  transformCategoriesData(apiCategories) {
    return apiCategories.map(category => this.transformCategoryData(category));
  }

  // Get category color based on ID or name
  getCategoryColor(categoryId) {
    const colors = [
      'blue', 'green', 'purple', 'orange', 'pink', 
      'indigo', 'teal', 'red', 'yellow', 'gray'
    ];
    return colors[categoryId % colors.length];
  }

  // Determine category type based on name
  getCategoryType(name) {
    if (!name) return 'other';
    
    const lowerName = name.toLowerCase();
    
    // Drink categories
    if (['coffee', 'tea', 'chocolate', 'frappe', 'mocktail', 'artisan tea', 'signature drink', 'other drink'].some(drink => 
        lowerName.includes(drink.toLowerCase()))) {
      return 'drink';
    }
    
    // Food categories
    if (['pasta', 'food', 'snacks', 'dessert', 'platter'].some(food => 
        lowerName.includes(food.toLowerCase()))) {
      return 'food';
    }
    
    // Package or bundle categories
    if (['paket', 'package', 'bundle'].some(pkg => 
        lowerName.includes(pkg.toLowerCase()))) {
      return 'package';
    }
    
    // Extra items
    if (['extras', 'extra', 'addon', 'add-on'].some(extra => 
        lowerName.includes(extra.toLowerCase()))) {
      return 'extra';
    }
    
    return 'other';
  }

  // Get categories grouped by type
  async getCategoriesByType() {
    try {
      const result = await this.getCategories();
      
      if (!result.success) {
        return result;
      }

      const transformedCategories = this.transformCategoriesData(result.data);
      const groupedCategories = {
        food: transformedCategories.filter(cat => cat.type === 'food'),
        drink: transformedCategories.filter(cat => cat.type === 'drink'),
        package: transformedCategories.filter(cat => cat.type === 'package'),
        extra: transformedCategories.filter(cat => cat.type === 'extra'),
        other: transformedCategories.filter(cat => cat.type === 'other'),
      };

      return {
        success: true,
        data: groupedCategories,
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.error('Error getting categories by type:', error);
      return {
        success: false,
        error: error.message,
        data: { food: [], drink: [], package: [], extra: [], other: [] },
      };
    }
  }

  // Get categories filtered by display status
  async getDisplayedCategories() {
    try {
      const result = await this.getCategories();
      
      if (!result.success) {
        return result;
      }

      const transformedCategories = this.transformCategoriesData(result.data);
      const displayedCategories = transformedCategories.filter(cat => cat.is_displayed); // ✅ Fixed: Use correct field name

      return {
        success: true,
        data: displayedCategories,
        totalCount: displayedCategories.length,
      };
    } catch (error) {
      console.error('Error getting displayed categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Search categories by name or description
  async searchCategories(searchTerm) {
    try {
      const result = await this.getCategories();
      
      if (!result.success) {
        return result;
      }

      const transformedCategories = this.transformCategoriesData(result.data);
      const filteredCategories = transformedCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return {
        success: true,
        data: filteredCategories,
        totalCount: filteredCategories.length,
        searchTerm,
      };
    } catch (error) {
      console.error('Error searching categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      const result = await this.getCategories();
      
      if (!result.success) {
        return result;
      }

      const transformedCategories = this.transformCategoriesData(result.data);
      
      const stats = {
        total: transformedCategories.length,
        displayed: transformedCategories.filter(cat => cat.is_displayed).length, // ✅ Fixed: Use correct field name
        hidden: transformedCategories.filter(cat => !cat.is_displayed).length, // ✅ Fixed: Use correct field name
        byType: {
          food: transformedCategories.filter(cat => cat.type === 'food').length,
          drink: transformedCategories.filter(cat => cat.type === 'drink').length,
          package: transformedCategories.filter(cat => cat.type === 'package').length,
          extra: transformedCategories.filter(cat => cat.type === 'extra').length,
          other: transformedCategories.filter(cat => cat.type === 'other').length,
        },
        withDescription: transformedCategories.filter(cat => cat.description && cat.description !== 'No description available').length,
        withDisplayPicture: transformedCategories.filter(cat => cat.display_picture).length, // ✅ Fixed: Use correct field name
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Error getting category stats:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
}

// Create and export a singleton instance
const categoryService = new CategoryService();
export default categoryService;