

// src/components/pages/CategoriesPage.js
import React from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { getCategoryColorClasses } from '../../utils/formatters';
import CategoryModal from '../modals/CategoryModal';

const CategoriesPage = ({
  categories,
  products,
  showCategoryModal,
  editingCategory,
  categoryForm,
  setShowCategoryModal,
  setCategoryForm,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory,
  toggleCategoryStatus
}) => {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Category Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Organize your products into categories</p>
          </div>
          <button
            onClick={handleAddCategory}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category.id).length;
          const colors = getCategoryColorClasses(category.color);

          return (
            <div key={category.id} className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${colors.border}`}>
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`${colors.bg} p-3 rounded-lg`}>
                    <Tag className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit2 size={14} className="sm:hidden" />
                      <Edit2 size={16} className="hidden sm:block" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, products)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={14} className="sm:hidden" />
                      <Trash2 size={16} className="hidden sm:block" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {categoryProducts} product{categoryProducts !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {category.color}
                  </span>
                  <button
                    onClick={() => toggleCategoryStatus(category.id)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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