// src/components/pages/hooks/useCategoriesPage.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import categoryService from '../../../services/categoryService';
import { API_CONFIG, ENDPOINTS } from '../../../config/api';

export const useCategoriesPage = () => {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // FIXED: Use transformed field names in form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    type: 'food',
    isActive: true, // CHANGED: was is_displayed
    imageFile: null,
    imageUrl: '',
    display_picture: null,
    hasNewImage: false,
    removeImage: false
  });

  const resetForm = useCallback(() => {
    setCategoryForm({
      name: '',
      description: '',
      type: 'food',
      isActive: true, // CHANGED: was is_displayed
      imageFile: null,
      imageUrl: '',
      display_picture: null,
      hasNewImage: false,
      removeImage: false
    });
  }, []);

  const handleFormFieldChange = useCallback((field, value) => {
    setCategoryForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await categoryService.getCategories();
      
      if (result.success) {
        const transformedCategories = categoryService.transformCategoriesData(result.data);
        setCategories(transformedCategories);
        setTotalCount(result.totalCount || transformedCategories.length);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const result = await categoryService.getCategoryStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Handle add category
  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    resetForm();
    setShowCategoryModal(true);
  }, [resetForm]);

  // FIXED: Handle edit category with transformed field names
  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      type: category.type || 'food',
      isActive: category.isActive !== undefined ? category.isActive : true, // CHANGED: was is_displayed
      imageFile: null,
      imageUrl: '',
      display_picture: category.display_picture || null,
      hasNewImage: false,
      removeImage: false
    });
    setShowCategoryModal(true);
  }, []);

  // FIXED: Handle save category using the service
  const handleSaveCategory = useCallback(async () => {
    try {
      setSaving(true);

      if (!categoryForm.name.trim()) {
        alert('Category name is required');
        return;
      }

      let result;
      if (editingCategory) {
        // For updates, if there's a file upload, handle it separately
        if (categoryForm.hasNewImage && categoryForm.imageFile) {
          // Handle file upload with FormData
          const formData = new FormData();
          formData.append('name', categoryForm.name);
          formData.append('description', categoryForm.description || '');
          formData.append('menu_category_group', getApiTypeFromComponentType(categoryForm.type));
          formData.append('is_displayed', categoryForm.isActive.toString());
          formData.append('image', categoryForm.imageFile);
          
          if (categoryForm.removeImage) {
            formData.append('removeImage', 'true');
          }

          const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.CATEGORIES.UPDATE(editingCategory.id)}`, {
            method: 'PUT',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          result = { success: data.status === 'success', data: data.data, error: data.message };
        } else {
          // Use service for regular updates
          result = await categoryService.updateCategory(editingCategory.id, categoryForm);
        }
      } else {
        // For creates, if there's a file upload, handle it with FormData
        if (categoryForm.hasNewImage && categoryForm.imageFile) {
          const formData = new FormData();
          formData.append('name', categoryForm.name);
          formData.append('description', categoryForm.description || '');
          formData.append('menu_category_group', getApiTypeFromComponentType(categoryForm.type));
          formData.append('is_displayed', categoryForm.isActive.toString());
          formData.append('image', categoryForm.imageFile);

          const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.CATEGORIES.CREATE}`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          result = { success: data.status === 'success', data: data.data, error: data.message };
        } else {
          // Use service for regular creates
          result = await categoryService.createCategory(categoryForm);
        }
      }
      
      if (result.success) {
        setShowCategoryModal(false);
        setEditingCategory(null);
        resetForm();
        await fetchCategories();
        
        if (showStats) {
          await fetchStats();
        }
      } else {
        alert(`Failed to save category: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert(`Error saving category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [categoryForm, editingCategory, fetchCategories, fetchStats, resetForm, showStats]);

  // Handle delete category
  const handleDeleteCategory = useCallback(async (categoryId) => {
    try {
      const result = await categoryService.deleteCategory(categoryId);
      
      if (result.success) {
        await fetchCategories();
        if (showStats) {
          await fetchStats();
        }
        setDeleteConfirm(null);
      } else {
        alert(`Failed to delete category: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error deleting category: ${err.message}`);
    }
  }, [fetchCategories, fetchStats, showStats]);

  // Handle search
  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    
    if (term.trim()) {
      try {
        const result = await categoryService.searchCategories(term);
        if (result.success) {
          setCategories(result.data);
          setTotalCount(result.totalCount || result.data.length);
        }
      } catch (err) {
        console.error('Error searching categories:', err);
      }
    } else {
      fetchCategories();
    }
  }, [fetchCategories]);

  // Handle sorting
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  // FIXED: Filter and sort categories with correct field names
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    if (filterType !== 'all') {
      filtered = filtered.filter(cat => cat.type === filterType);
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'id') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'isActive') { // CHANGED: was 'is_displayed'
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      return sortOrder === 'asc' ? 
        (aValue > bValue ? 1 : -1) : 
        (aValue < bValue ? 1 : -1);
    });

    return filtered;
  }, [categories, filterType, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [fetchCategories, fetchStats]);

  return {
    // Data state
    categories,
    loading,
    error,
    totalCount,
    stats,
    filteredCategories,
    
    // UI state
    searchTerm,
    filterType,
    showStats,
    sortBy,
    sortOrder,
    showCategoryModal,
    editingCategory,
    saving,
    deleteConfirm,
    categoryForm,
    
    // Actions
    fetchCategories,
    fetchStats,
    handleAddCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleSearch,
    handleSort,
    setShowStats,
    setFilterType,
    setShowCategoryModal,
    setDeleteConfirm,
    handleFormFieldChange,
  };
};

// ADDED: Helper function to convert component type back to API format
const getApiTypeFromComponentType = (componentType) => {
  const typeMap = {
    'food': 'Food',
    'drink': 'Drink',
    'package': 'Bundle',
    'other': 'Others'
  };
  return typeMap[componentType] || 'Others';
};