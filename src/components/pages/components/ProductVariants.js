// src/components/pages/components/ProductVariants.js - Fixed version
import React from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const ProductVariants = ({
  menuItemId,
  variants,
  isLoadingVariants,
  showVariantModal,
  editingVariant,
  isSubmittingVariant,
  variantForm,
  variantErrors,
  handleVariantFormChange,
  handleAddVariant,
  handleEditVariant,
  saveVariant,
  deleteVariant,
  toggleVariantStatus,
  closeVariantModal,
  formatPrice
}) => {
  // Handle modal click to prevent closing when clicking inside
  const handleModalClick = (e) => {
    // Only close if clicking the backdrop (not the modal content)
    if (e.target === e.currentTarget) {
      closeVariantModal();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await saveVariant();
  };

  // Handle add variant with event prevention
  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddVariant();
  };

  // Handle edit variant with event prevention  
  const handleEditClick = (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    handleEditVariant(variant);
  };

  // Handle delete variant with event prevention
  const handleDeleteClick = async (e, variantId, variantName) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteVariant(variantId, variantName);
  };

  // Handle toggle status with event prevention
  const handleToggleClick = async (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleVariantStatus(variant);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!menuItemId}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          title={!menuItemId ? "Save the product first to add variants" : "Add new variant"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </button>
      </div>

      {/* Loading State */}
      {isLoadingVariants && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 mt-2">Loading variants...</p>
        </div>
      )}

      {/* Variants List */}
      {!isLoadingVariants && (
        <div className="space-y-2">
          {variants.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No variants added yet</p>
              {menuItemId && (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Add your first variant
                </button>
              )}
            </div>
          ) : (
            variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">{variant.name}</span>
                    <span className="text-orange-600 font-semibold">
                      {formatPrice(variant.price)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      variant.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {variant.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Toggle Status */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleClick(e, variant)}
                    className={`p-1 rounded transition-colors ${
                      variant.is_active 
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-red-600 hover:text-red-800'
                    }`}
                    title={variant.is_active ? 'Deactivate variant' : 'Activate variant'}
                  >
                    {variant.is_active ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(e, variant)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="Edit variant"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, variant.id, variant.name)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    title="Delete variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Variant Modal */}
      {showVariantModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={handleModalClick}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
              </h3>
              <button
                type="button"
                onClick={closeVariantModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Variant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant Name *
                </label>
                <input
                  type="text"
                  value={variantForm.name || ''}
                  onChange={(e) => handleVariantFormChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    variantErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Small, Medium, Large"
                  required
                />
                {variantErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{variantErrors.name}</p>
                )}
              </div>

              {/* Variant Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  value={variantForm.price || ''}
                  onChange={(e) => handleVariantFormChange('price', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    variantErrors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter variant price"
                  min="0"
                  step="1000"
                  required
                />
                {variantErrors.price && (
                  <p className="text-red-600 text-sm mt-1">{variantErrors.price}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="variantIsActive"
                  checked={variantForm.is_active || false}
                  onChange={(e) => handleVariantFormChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="variantIsActive" className="ml-2 block text-sm text-gray-700">
                  Variant is active and available for customers
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeVariantModal}
                  disabled={isSubmittingVariant}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmittingVariant}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmittingVariant && (
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {editingVariant ? 'Update Variant' : 'Create Variant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;