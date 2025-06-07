// src/components/pages/CategoriesPage.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, RefreshCw } from 'lucide-react';
import CategoryModal from '../modals/CategoryModal';

const CategoriesPage = ({
  showCategoryModal,
  editingCategory,
  categoryForm,
  setShowCategoryModal,
  setCategoryForm,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.cafeserendipity.id/category');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setCategories(result.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate a color for each category based on its ID
  const getCategoryColor = (categoryId) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    ];
    return colors[categoryId % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <Tag className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Categories</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Category Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Organize your products into categories ({categories.length} total)
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchCategories}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">ID</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Category</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Description</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Type</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => {
                const colors = getCategoryColor(category.item_category_id);
                const isFood = ['Pasta', 'Food', 'Snacks', 'Dessert', 'Platter'].includes(category.item_category_description);
                const isDrink = category.item_category_description.toLowerCase().includes('drink') || 
                              category.item_category_description.toLowerCase().includes('tea') ||
                              category.item_category_description.toLowerCase().includes('coffee');

                return (
                  <tr key={category.item_category_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-sm font-mono text-gray-600">
                        #{category.item_category_id}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center">
                        <div className={`${colors.bg} p-2 rounded-lg mr-3`}>
                          <Tag className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm sm:text-base">
                            {category.item_category_description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {category.item_category_description}
                      </p>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isFood 
                          ? 'bg-green-100 text-green-800' 
                          : isDrink 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isFood ? 'Food' : isDrink ? 'Drink' : 'Other'}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit category"
                        >
                          <Edit2 size={14} className="sm:hidden" />
                          <Edit2 size={16} className="hidden sm:block" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.item_category_id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={14} className="sm:hidden" />
                          <Trash2 size={16} className="hidden sm:block" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Empty state */}
          {!loading && categories.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-4">No categories are currently available from the API</p>
              <button
                onClick={fetchCategories}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          editingCategory={editingCategory}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          setShowCategoryModal={setShowCategoryModal}
          handleSaveCategory={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;