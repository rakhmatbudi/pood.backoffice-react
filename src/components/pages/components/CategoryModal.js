// src/components/pages/components/CategoryModal.js
import React, { useMemo } from 'react';
import { X, Save, RefreshCw, Upload, Image } from 'lucide-react';

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
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {editing ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter description (optional)"
              rows="3"
            />
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
                  className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-300 shadow-sm bg-gray-50"
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
                    // Create a preview URL for the selected image
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
                className="cursor-pointer inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="text-sm text-red-600 hover:text-red-800 text-center"
                >
                  Remove Image
                </button>
              )}
              <p className="text-xs text-gray-500 text-center">
                Upload an image for this category (optional)
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_displayed"
              checked={form.is_displayed}
              onChange={(e) => onFieldChange('is_displayed', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_displayed" className="ml-2 block text-sm text-gray-700">
              Display this category
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !form.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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