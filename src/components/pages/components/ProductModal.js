// src/components/pages/components/ProductModal.js - Updated with variants
import React, { useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useProductVariants } from '../hooks/useProductVariants';
import ProductVariants from './ProductVariants';

const ProductModal = ({
  editingProduct,
  productForm,
  setProductForm,
  setShowModal,
  handleSaveProduct,
  onImageChange,
  onClearImage,
  categories = []
}) => {
  const fileInputRef = useRef(null);
  
  // Initialize variants functionality
  const menuItemId = editingProduct?.id;
  const variantProps = useProductVariants(menuItemId);

  // Debug logging
  console.log('ProductModal rendered with:', {
    editingProduct,
    menuItemId,
    hasVariants: variantProps.variants?.length > 0
  });

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Handle numeric fields properly
    if (field === 'price' || field === 'stock') {
      // Convert empty string to null, otherwise parse as number
      if (value === '' || value === null || value === undefined) {
        processedValue = null;
      } else {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? null : numValue;
      }
    }
    
    setProductForm(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageChange(file);
    }
    // Reset the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveProduct();
  };

  const handleModalClick = (e) => {
    // Close modal when clicking outside the content
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // Get active categories and sort them
  const activeCategories = categories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={productForm.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Two Column Layout for Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              
              {activeCategories.length > 0 ? (
                <select
                  value={productForm.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {activeCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  {categories.length === 0 ? 'Loading categories...' : 'No active categories found'}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (IDR) *
              </label>
              <input
                type="number"
                value={productForm.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter price"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={productForm.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Two Column Layout for Stock and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={productForm.stock || ''}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter stock quantity"
                min="0"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="isActive"
                checked={productForm.isActive || false}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Product is active and visible to customers
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
            />

            {/* Image preview or upload area */}
            {productForm.imagePreview ? (
              <div className="relative">
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-4">
                  <div className="relative group">
                    <img
                      src={productForm.imagePreview}
                      alt="Product preview"
                      className="w-full max-w-md mx-auto aspect-square object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Image failed to load:', productForm.imagePreview);
                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                    {/* Always visible overlay with replace/remove buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <button
                          type="button"
                          onClick={handleFileSelect}
                          className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={onClearImage}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Corner button for quick replace */}
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-1.5 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                      title="Replace image"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      {productForm.image instanceof File 
                        ? productForm.image.name 
                        : 'Current image'
                      }
                    </p>
                    {productForm.image instanceof File && (
                      <p className="text-xs text-gray-500">
                        Size: {(productForm.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    
                    {/* Additional replace button below image */}
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline hover:no-underline transition-colors"
                    >
                      Click to replace image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={handleFileSelect}
                className="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload product image
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, or WebP files up to 5MB
                </p>
              </div>
            )}

            {/* Upload instructions */}
            <div className="mt-2 text-xs text-gray-500">
              <p>• Recommended size: 800x600 pixels or larger</p>
              <p>• Supported formats: JPEG, PNG, WebP</p>
              <p>• Maximum file size: 5MB</p>
            </div>
          </div>

          {/* Product Variants Section - Only show for existing products */}
          {menuItemId && (
            <div className="border-t pt-6">
              <ProductVariants 
                menuItemId={menuItemId}
                {...variantProps}
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;