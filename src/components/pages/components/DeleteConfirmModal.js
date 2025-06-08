// src/components/pages/components/DeleteConfirmModal.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({ category, onConfirm, onCancel }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Delete Category</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(category.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
            >
              Delete Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;