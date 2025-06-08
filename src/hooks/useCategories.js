// src/hooks/useCategories.js
import { useState, useEffect } from 'react';

export const useCategories = (useMockData = true) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    type: '',
    color: 'blue',
    isActive: true,
    display_picture: null,
    display_picture_file: null
  });

  // API base URL - adjust according to your setup
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Mock categories data for development
  const MOCK_CATEGORIES = [
    {
      id: 'food',
      name: 'Food',
      description: 'Food items and main dishes',
      type: 'main',
      color: 'blue',
      isActive: true,
      display_picture: null,
      productCount: 3
    },
    {
      id: 'drink',
      name: 'Drinks',
      description: 'Beverages and drinks',
      type: 'beverage',
      color: 'green',
      isActive: true,
      display_picture: null,
      productCount: 2
    },
    {
      id: 'snack',
      name: 'Snacks',
      description: 'Light snacks and appetizers',
      type: 'appetizer',
      color: 'yellow',
      isActive: true,
      display_picture: null,
      productCount: 0
    },
    {
      id: 'dessert',
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      type: 'dessert',
      color: 'pink',
      isActive: true,
      display_picture: null,
      productCount: 0
    }
  ];

  // Fetch categories from API or use mock data
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setCategories(MOCK_CATEGORIES);
      } else {
        const response = await fetch(`${API_BASE_URL}/menu-categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const result = await response.json();
        if (result.status === 'success') {
          setCategories(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch categories');
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [useMockData]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      type: '',
      color: 'blue',
      isActive: true,
      display_picture: null,
      display_picture_file: null
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      type: category.type || '',
      color: category.color || 'blue',
      isActive: category.isActive !== undefined ? category.isActive : true,
      display_picture: category.display_picture || null,
      display_picture_file: null
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id, products = []) => {
    // Check if any products are using this category
    const productsUsingCategory = products.filter(p => p.category_id === id || p.category === id || p.categoryId === id);
    if (productsUsingCategory.length > 0) {
      alert(`Cannot delete category. ${productsUsingCategory.length} product(s) are using this category.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      try {
        if (useMockData) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setCategories(categories.filter(c => c.id !== id));
        } else {
          const response = await fetch(`${API_BASE_URL}/menu-categories/${id}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete category');
          }
          
          const result = await response.json();
          if (result.status === 'success') {
            // Remove from local state
            setCategories(categories.filter(c => c.id !== id));
          } else {
            throw new Error(result.message || 'Failed to delete category');
          }
        }
      } catch (err) {
        setError(err.message);
        alert('Failed to delete category: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const categoryData = {
          id: editingCategory ? editingCategory.id : `cat_${Date.now()}`,
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
          type: categoryForm.type.trim(),
          color: categoryForm.color,
          isActive: categoryForm.isActive,
          display_picture: categoryForm.display_picture_file ? URL.createObjectURL(categoryForm.display_picture_file) : categoryForm.display_picture,
          productCount: editingCategory ? editingCategory.productCount : 0
        };

        if (editingCategory) {
          // Update existing category in local state
          setCategories(categories.map(c => 
            c.id === editingCategory.id ? categoryData : c
          ));
        } else {
          // Add new category to local state
          setCategories([...categories, categoryData]);
        }
        setShowCategoryModal(false);
      } else {
        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append('name', categoryForm.name.trim());
        formData.append('description', categoryForm.description.trim());
        formData.append('type', categoryForm.type.trim());
        formData.append('color', categoryForm.color);
        formData.append('isActive', categoryForm.isActive.toString());
        
        // Add file if present
        if (categoryForm.display_picture_file) {
          formData.append('display_picture', categoryForm.display_picture_file);
        } else if (categoryForm.display_picture === null && editingCategory) {
          // Explicitly clear image if user removed it
          formData.append('display_picture', '');
        }
        
        const url = editingCategory 
          ? `${API_BASE_URL}/menu-categories/${editingCategory.id}`
          : `${API_BASE_URL}/menu-categories`;
        
        const method = editingCategory ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
        }
        
        const result = await response.json();
        if (result.status === 'success') {
          if (editingCategory) {
            // Update existing category in local state
            setCategories(categories.map(c => 
              c.id === editingCategory.id ? result.data : c
            ));
          } else {
            // Add new category to local state
            setCategories([...categories, result.data]);
          }
          setShowCategoryModal(false);
        } else {
          throw new Error(result.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
        }
      }
    } catch (err) {
      setError(err.message);
      alert(`Failed to ${editingCategory ? 'update' : 'create'} category: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryStatus = async (id) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    setLoading(true);
    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setCategories(categories.map(c => 
          c.id === id ? { ...c, isActive: !c.isActive } : c
        ));
      } else {
        const formData = new FormData();
        formData.append('name', category.name);
        formData.append('description', category.description || '');
        formData.append('type', category.type || '');
        formData.append('color', category.color || 'blue');
        formData.append('isActive', (!category.isActive).toString());
        
        const response = await fetch(`${API_BASE_URL}/menu-categories/${id}`, {
          method: 'PUT',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to update category status');
        }
        
        const result = await response.json();
        if (result.status === 'success') {
          setCategories(categories.map(c => 
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ));
        } else {
          throw new Error(result.message || 'Failed to update category status');
        }
      }
    } catch (err) {
      setError(err.message);
      alert('Failed to update category status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setCategoryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    categories,
    loading,
    error,
    saving,
    showCategoryModal,
    editingCategory,
    categoryForm,
    setCategories,
    setShowCategoryModal,
    setCategoryForm,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    toggleCategoryStatus,
    handleFieldChange,
    fetchCategories,
    setError
  };
};