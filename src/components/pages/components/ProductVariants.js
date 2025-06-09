// src/components/pages/components/ProductVariants.js
import React from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

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
  // Debug logging
  console.log('ProductVariants rendered with:', {
    menuItemId,
    variantsCount: variants?.length || 0,
    isLoadingVariants,
    variants
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveVariant();
  };

  if (!menuItemId) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Product Variants</h3>
        <p className="text-gray-500">Please save the product first to manage variants.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
        <button
          onClick={handleAddVariant}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Variant
        </button>
      </div>

      {isLoadingVariants ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : variants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No variants found for this product.</p>
          <button
            onClick={handleAddVariant}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first variant
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                variant.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className={`font-medium ${
                    variant.is_active ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {variant.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    variant.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {variant.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className={`text-lg font-semibold mt-1 ${
                  variant.is_active ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {formatPrice(variant.price)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVariantStatus(variant)}
                  className={`p-2 rounded-lg transition-colors ${
                    variant.is_active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={variant.is_active ? 'Deactivate variant' : 'Activate variant'}
                >
                  {variant.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                <button
                  onClick={() => handleEditVariant(variant)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit variant"
                >
                  <Edit size={16} />
                </button>
                
                <button
                  onClick={() => deleteVariant(variant.id, variant.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    value={variantForm.name}
                    onChange={(e) => handleVariantFormChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      variantErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Large, Small, Vanilla, Chocolate"
                    disabled={isSubmittingVariant}
                  />
                  {variantErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{variantErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    value={variantForm.price || ''}
                    onChange={(e) => handleVariantFormChange('price', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      variantErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25000"
                    min="0"
                    step="100"
                    disabled={isSubmittingVariant}
                  />
                  {variantErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{variantErrors.price}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="variant-active"
                    checked={variantForm.is_active}
                    onChange={(e) => handleVariantFormChange('is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmittingVariant}
                  />
                  <label htmlFor="variant-active" className="text-sm text-gray-700">
                    Active variant
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeVariantModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={isSubmittingVariant}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmittingVariant}
                  >
                    {isSubmittingVariant ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : (
                      editingVariant ? 'Update Variant' : 'Add Variant'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;