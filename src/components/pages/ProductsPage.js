// src/components/pages/ProductsPage.js
import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
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
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sorted products based on current sort configuration
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle category sorting by name
      if (sortConfig.key === 'category') {
        const aCategoryName = categories.find(c => c.id === a.category)?.name || '';
        const bCategoryName = categories.find(c => c.id === b.category)?.name || '';
        aValue = aCategoryName.toLowerCase();
        bValue = bCategoryName.toLowerCase();
      }

      // Handle price sorting as numbers
      if (sortConfig.key === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Handle stock sorting as numbers
      if (sortConfig.key === 'stock') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle boolean sorting (for isActive)
      if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [products, categories, sortConfig]);

  // Render sort icon for table headers
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-gray-600" />
      : <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  // Sortable header component
  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th 
      className={`text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {renderSortIcon(sortKey)}
      </div>
    </th>
  );

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your restaurant's food and drink items ({products.length} total)
            </p>
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

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <SortableHeader sortKey="name">Product Name</SortableHeader>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm max-w-xs">Description</th>
                <SortableHeader sortKey="price">Price</SortableHeader>
                <SortableHeader sortKey="category">Category</SortableHeader>
                <SortableHeader sortKey="stock">Stock</SortableHeader>
                <SortableHeader sortKey="isActive">Status</SortableHeader>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const category = categories.find(c => c.id === product.category);
                const categoryColors = getCategoryColorClasses(category?.color || 'blue');

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs truncate" title={product.description}>
                        {product.description}
                      </p>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-base font-bold text-orange-600">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text}`}>
                        {category?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`text-sm font-medium ${
                        product.stock > 10 
                          ? 'text-green-600' 
                          : product.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
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
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={14} className="sm:hidden" />
                          <Edit2 size={16} className="hidden sm:block" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete product"
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
          {products.length === 0 && (
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first product</p>
              <button
                onClick={() => handleAddProduct(categories)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sort indicator */}
      {sortConfig.key && (
        <div className="mt-4 text-sm text-gray-600 flex items-center">
          <span>Sorted by: </span>
          <span className="font-medium ml-1">
            {sortConfig.key === 'category' ? 'Category' : 
             sortConfig.key === 'isActive' ? 'Status' :
             sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
          </span>
          <span className="ml-1">
            ({sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'})
          </span>
          <button
            onClick={() => setSortConfig({ key: null, direction: 'asc' })}
            className="ml-2 text-orange-600 hover:text-orange-800 text-xs underline"
          >
            Clear sort
          </button>
        </div>
      )}

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