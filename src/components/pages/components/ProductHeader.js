// src/components/pages/components/ProductHeader.js
import React from 'react';
import { Plus, RefreshCw, BarChart3 } from 'lucide-react';

const ProductHeader = ({
  totalCount,
  showStats,
  onToggleStats,
  onRefresh,
  onAddProduct,
  loading
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your menu items and products ({totalCount} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onToggleStats}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={onRefresh}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onAddProduct}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;