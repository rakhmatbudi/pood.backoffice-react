// src/components/pages/components/CategoryModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, RefreshCw, Upload, Image, Coffee, Eye, EyeOff, Package } from 'lucide-react';
import { API_CONFIG, ENDPOINTS } from '../../../config/api';

const CategoryModal = ({ 
  show, 
  editing, 
  form, 
  saving, 
  categories = [],
  onClose, 
  onSave, 
  onFieldChange 
}) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  // Fetch products for the category being edited
  const fetchCategoryProducts = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      setLoadingProducts(true);
      setProductsError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/menu-items/category/${categoryId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setProducts(data.data || []);
      } else {
        setProductsError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
      setProductsError(err.message);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch products when editing a category
  useEffect(() => {
    if (editing && editing.id && show) {
      fetchCategoryProducts(editing.id);
      setShowProducts(true);
    } else {
      setProducts([]);
      setShowProducts(false);
      setProductsError(null);
    }
  }, [editing, show]);

  // Calculate product statistics
  const productStats = useMemo(() => {
    if (!products.length) return null;
    
    const activeProducts = products.filter(p => p.is_active);
    const inactiveProducts = products.filter(p => !p.is_active);
    const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
    const averagePrice = products.length > 0 
      ? (products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / products.length)
      : 0;

    return {
      total: products.length,
      active: activeProducts.length,
      inactive: inactiveProducts.length,
      totalVariants,
      averagePrice: averagePrice.toFixed(0)
    };
  }, [products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(price || 0));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-screen sm:h-auto overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {editing ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Form Section */}
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Enter description (optional)"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => onFieldChange('type', e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="package">Package/Bundle</option>
                <option value="extra">Extra/Add-on</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              {(form.imageUrl || form.display_picture) && (
                <div className="mb-4">
                  <img
                    src={form.imageUrl || form.display_picture}
                    alt="Category preview"
                    className="w-full h-auto max-h-40 sm:max-h-48 object-contain rounded-lg border border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      onFieldChange('imageFile', file);
                      onFieldChange('imageUrl', imageUrl);
                      onFieldChange('hasNewImage', true);
                    }
                  }}
                  className="hidden"
                  id="categoryImage"
                />
                <label
                  htmlFor="categoryImage"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 touch-manipulation"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {form.imageUrl || form.display_picture ? 'Change Image' : 'Choose Image'}
                </label>
                {(form.imageUrl || form.display_picture) && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange('imageFile', null);
                      onFieldChange('imageUrl', '');
                      onFieldChange('display_picture', null);
                      onFieldChange('removeImage', true);
                      onFieldChange('hasNewImage', false);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 text-center py-2 touch-manipulation"
                  >
                    Remove Image
                  </button>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Upload an image for this category (optional)
                </p>
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <div className="flex items-center py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => onFieldChange('isActive', e.target.checked)}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-3 block text-sm text-gray-700">
                  Display this category
                </label>
              </div>

              <div className="flex items-center py-2">
                <input
                  type="checkbox"
                  id="isDisplayForSelfOrder"
                  checked={form.isDisplayForSelfOrder}
                  onChange={(e) => onFieldChange('isDisplayForSelfOrder', e.target.checked)}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isDisplayForSelfOrder" className="ml-3 block text-sm text-gray-700">
                  Show in self-order kiosk
                </label>
              </div>
              <p className="text-xs text-gray-500 ml-8">
                When enabled, this category will be visible on self-order kiosks for customers to browse
              </p>
            </div>

            {/* Products Section - Only show when editing */}
            {editing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base sm:text-lg font-medium text-gray-800 flex items-center">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Products in this Category
                    </h4>
                    {products.length > 0 && (
                      <button
                        onClick={() => setShowProducts(!showProducts)}
                        className="text-sm text-orange-600 hover:text-orange-800 flex items-center px-2 py-1 rounded touch-manipulation"
                      >
                        {showProducts ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {showProducts ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>

                  {/* Product Statistics */}
                  {productStats && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border">
                        <div className="text-lg sm:text-2xl font-bold text-orange-600">{productStats.total}</div>
                        <div className="text-xs text-gray-600">Total Products</div>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{productStats.active}</div>
                        <div className="text-xs text-gray-600">Active Products</div>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">{productStats.totalVariants}</div>
                        <div className="text-xs text-gray-600">Total Variants</div>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border">
                        <div className="text-sm sm:text-lg font-bold text-purple-600">{formatPrice(productStats.averagePrice)}</div>
                        <div className="text-xs text-gray-600">Avg. Price</div>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {loadingProducts && (
                    <div className="flex items-center justify-center py-6 sm:py-8">
                      <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-orange-500 mr-2" />
                      <span className="text-sm sm:text-base text-gray-600">Loading products...</span>
                    </div>
                  )}

                  {/* Error State */}
                  {productsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                      <p className="text-red-600 text-sm">{productsError}</p>
                    </div>
                  )}

                  {/* Products List */}
                  {showProducts && !loadingProducts && products.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      {products.map((product) => (
                        <div key={product.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h5 className="font-medium text-gray-800 text-sm sm:text-base truncate">{product.name}</h5>
                                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap self-start ${
                                  product.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-orange-600 text-sm sm:text-base">
                                  {formatPrice(product.price)}
                                </span>
                                {product.variants && product.variants.length > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            {product.image_path && (
                              <img
                                src={product.image_path}
                                alt={product.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!loadingProducts && products.length === 0 && !productsError && (
                    <div className="text-center py-6 sm:py-8">
                      <Coffee className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm sm:text-base">No products in this category yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !form.name.trim()}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editing ? 'Update' : 'Create'} Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;