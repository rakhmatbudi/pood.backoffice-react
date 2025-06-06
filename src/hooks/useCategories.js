

// src/hooks/useCategories.js
import { useState } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState([
    { id: 'food', name: 'Food', description: 'Main dishes and meals', color: 'green', isActive: true },
    { id: 'drink', name: 'Drink', description: 'Beverages and refreshments', color: 'blue', isActive: true },
    { id: 'dessert', name: 'Dessert', description: 'Sweet treats and desserts', color: 'pink', isActive: true },
    { id: 'snack', name: 'Snack', description: 'Light snacks and appetizers', color: 'yellow', isActive: false }
  ]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: 'blue',
    isActive: true
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      color: 'blue',
      isActive: true
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color,
      isActive: category.isActive
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id, products) => {
    const productsUsingCategory = products.filter(p => p.category === id);
    if (productsUsingCategory.length > 0) {
      alert(`Cannot delete category. ${productsUsingCategory.length} product(s) are using this category.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name || !categoryForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? {
              ...c,
              name: categoryForm.name,
              description: categoryForm.description,
              color: categoryForm.color,
              isActive: categoryForm.isActive
            }
          : c
      ));
    } else {
      const newCategory = {
        id: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        isActive: categoryForm.isActive
      };
      setCategories([...categories, newCategory]);
    }
    
    setShowCategoryModal(false);
  };

  const toggleCategoryStatus = (id) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  return {
    categories,
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
    toggleCategoryStatus
  };
};