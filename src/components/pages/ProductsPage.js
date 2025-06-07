// src/components/pages/ProductsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw, AlertCircle, Search, Filter } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import ProductModal from '../modals/ProductModal';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const ProductsPage = ({ 
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Fetch products and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and categories concurrently
      const [productsResult, categoriesResult] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      
      if (productsResult.success) {
        const transformedProducts = productService.transformProductsData(productsResult.data);
        setProducts(transformedProducts);
        setTotalCount(productsResult.totalCount);
      } else {
        setError(productsResult.error);
      }

      if (categoriesResult.success) {
        const transformedCategories = categoryService.transformCategoriesData(categoriesResult.data);
        setCategories(transformedCategories);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion with service
  const handleDeleteProductWithService = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const result = await productService.deleteProduct(productId);
      
      if (result.success) {
        // Remove from local state
        setProducts(prev => prev.filter(product => product.id !== productId));
        setTotalCount(prev => prev - 1);
        
        // Show success message
        console.log('Product deleted successfully');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get category color classes
  const getCategoryColorClasses = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
      green: { bg: 'bg-green-100', text: 'text-green-800' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-800' },
      red: { bg: 'bg-red-100', text: 'text-red-800' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    return colorMap[category.color] || colorMap.gray;
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = productService.searchProducts(filtered, searchTerm);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = productService.filterProductsByCategory(filtered, parseInt(selectedCategory));
    }

    // Apply sorting
    if (sortConfig.key) {
      if (sortConfig.key === 'category') {
        filtered.sort((a, b) => {
          const aCategoryName = categories.find(c => c.id === a.category)?.name || '';
          const bCategoryName = categories.find(c => c.id === b.category)?.name || '';
          const aValue = aCategoryName.toLowerCase();
          const bValue = bCategoryName.toLowerCase();
          
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      } else {
        filtered = productService.sortProducts(filtered, sortConfig.key, sortConfig.direction);
      }
    }

    return filtered;
  }, [products, categories, searchTerm, selectedCategory, sortConfig]);

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Products</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchData}
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
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your restaurant's menu items ({totalCount} total, {filteredAndSortedProducts.length} shown)
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchData}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => handleAddProduct(categories)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                <SortableHeader sortKey="grouping">Group</SortableHeader>
                <SortableHeader sortKey="stock">Stock</SortableHeader>
                <SortableHeader sortKey="isActive">Status</SortableHeader>
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedProducts.map((product) => {
                const category = categories.find(c => c.id === product.category);
                const categoryColors = getCategoryColorClasses(product.category);

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">
                          {product.name}
                        </div>
                        {product.shortName && product.shortName !== product.name && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.shortName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs truncate" title={product.description}>
                        {product.description}
                      </p>
                      {product.shortDescription && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          {product.shortDescription}
                        </p>
                      )}
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
                      <span className="text-xs text-gray-600">
                        {product.grouping}
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
                          onClick={() => handleDeleteProductWithService(product.id)}
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
          {!loading && filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && !selectedCategory && (
                <button
                  onClick={() => handleAddProduct(categories)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sort and filter indicators */}
      {(sortConfig.key || searchTerm || selectedCategory) && (
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          {sortConfig.key && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <span>Sorted by: </span>
              <span className="font-medium ml-1">
                {sortConfig.key === 'category' ? 'Category' : 
                 sortConfig.key === 'isActive' ? 'Status' :
                 sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
              </span>
              <span className="ml-1">({sortConfig.direction === 'asc' ? '↑' : '↓'})</span>
              <button
                onClick={() => setSortConfig({ key: null, direction: 'asc' })}
                className="ml-2 text-orange-600 hover:text-orange-800 text-xs"
              >
                ✕
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
              >
                ✕
              </button>
            </div>
          )}
          {selectedCategory && (
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <span>Category: {categories.find(c => c.id === parseInt(selectedCategory))?.name}</span>
              <button
                onClick={() => setSelectedCategory('')}
                className="ml-2 text-green-600 hover:text-green-800 text-xs"
              >
                ✕
              </button>
            </div>
          )}
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