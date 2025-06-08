// src/components/pages/components/CategoryModal.js
import React, { useMemo, useRef, useState } from 'react';
import { X, Save, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

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
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Update image preview when form.display_picture changes
  React.useEffect(() => {
    if (form.display_picture && typeof form.display_picture === 'string' && form.display_picture.startsWith('http')) {
      // It's a URL from existing category
      setImagePreview(form.display_picture);
    } else if (form.display_picture && typeof form.display_picture === 'string') {
      // It's just a filename, clear preview
      setImagePreview(null);
    } else if (!form.display_picture) {
      // No image
      setImagePreview(null);
    }
  }, [form.display_picture, show]);

  // Generate unique types from the categories data for the type dropdown
  const availableTypes = useMemo(() => {
    const uniqueTypes = [...new Set(categories.map(cat => cat.type).filter(Boolean))];
    return uniqueTypes.sort();
  }, [categories]);

  // Dynamic display name - capitalize first letter
  const getTypeDisplayName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Handle image file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Pass the actual file object to parent component
      onFieldChange('display_picture_file', file);
      onFieldChange('display_picture', file.name); // Keep track of filename
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    onFieldChange('display_picture_file', null);
    onFieldChange('display_picture', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

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
              value={form.name || ''}
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
              value={form.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter description (optional)"
              rows="3"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Picture
            </label>
            <div className="space-y-3">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="button"
                onClick={triggerImageUpload}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <p className="text-xs text-gray-500">
                Supports JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={form.type || ''}
              onChange={(e) => onFieldChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select a type</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>
                  {getTypeDisplayName(type)}
                </option>
              ))}
            </select>
          </div>



          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive !== undefined ? form.isActive : true}
              onChange={(e) => onFieldChange('isActive', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
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
            disabled={saving || !form.name?.trim()}
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