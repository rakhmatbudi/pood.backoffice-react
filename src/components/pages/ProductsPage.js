

// src/components/pages/ProductsPage.js
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatPrice, getCategoryColorClasses } from '../../utils/formatters';
import ProductModal from '../modals/ProductModal';

const ProductsPage = ({ 
  products, 
  categories, 
  showModal, 
  editingProduct, 
  productForm,
  setShowModal,
  setProductForm,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleSaveProduct,
  toggleProductStatus
}) => {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your restaurant's food and drink items</p>
          </div>
          <button
            onClick={() => handleAddProduct(categories)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                />
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit2 size={14} className="sm:hidden" />
                    <Edit2 size={16} className="hidden sm:block" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 size={14} className="sm:hidden" />
                    <Trash2 size={16} className="hidden sm:block" />
                  </button>
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (() => {
                      const category = categories.find(c => c.id === product.category);
                      const colors = getCategoryColorClasses(category?.color || 'blue');
                      return `${colors.bg} ${colors.text}`;
                    })()
                  }`}>
                    {categories.find(c => c.id === product.category)?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t">
                <span className="text-xs sm:text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    product.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          editingProduct={editingProduct}
          productForm={productForm}
          categories={categories}
          setProductForm={setProductForm}
          setShowModal={setShowModal}
          handleSaveProduct={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductsPage;