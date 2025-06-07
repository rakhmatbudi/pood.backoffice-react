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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Category</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Description</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Color</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Products</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Status</th>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.category === category.id).length;
                const colors = getCategoryColorClasses(category.color);

                return (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center">
                        <div className={`${colors.bg} p-2 rounded-lg mr-3`}>
                          <Tag className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm sm:text-base">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                        {category.description}
                      </p>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {category.color}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-sm text-gray-600">
                        {categoryProducts} product{categoryProducts !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
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
                          onClick={() => handleDeleteCategory(category.id, products)}
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
          {categories.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first category</p>
              <button
                onClick={handleAddCategory}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
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