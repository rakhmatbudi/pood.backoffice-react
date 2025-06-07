// src/services/categoryService.js
import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

class CategoryService {
  // Get all categories
  async getCategories(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST, params);
      
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
      const response = await apiClient.post(ENDPOINTS.CATEGORIES.CREATE, categoryData);
      
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
      const response = await apiClient.put(ENDPOINTS.CATEGORIES.UPDATE(id), categoryData);
      
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
      id: apiCategory.item_category_id,
      name: apiCategory.item_category_description,
      description: apiCategory.item_category_description,
      isActive: true, // Default since API doesn't provide this
      color: this.getCategoryColor(apiCategory.item_category_id),
      type: this.getCategoryType(apiCategory.item_category_description),
    };
  }

  // Transform multiple categories
  transformCategoriesData(apiCategories) {
    return apiCategories.map(category => this.transformCategoryData(category));
  }

  // Get category color based on ID
  getCategoryColor(categoryId) {
    const colors = [
      'blue', 'green', 'purple', 'orange', 'pink', 
      'indigo', 'teal', 'red', 'yellow', 'gray'
    ];
    return colors[categoryId % colors.length];
  }

  // Determine category type based on description
  getCategoryType(description) {
    const lowerDesc = description.toLowerCase();
    
    if (['pasta', 'food', 'snacks', 'dessert', 'platter'].some(food => 
        lowerDesc.includes(food))) {
      return 'food';
    }
    
    if (lowerDesc.includes('drink') || lowerDesc.includes('tea') || 
        lowerDesc.includes('coffee') || lowerDesc.includes('mocktail') ||
        lowerDesc.includes('frappe') || lowerDesc.includes('chocolate')) {
      return 'drink';
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
        data: { food: [], drink: [], other: [] },
      };
    }
  }
}

// Create and export a singleton instance
const categoryService = new CategoryService();
export default categoryService;