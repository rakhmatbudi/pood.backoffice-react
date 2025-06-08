// src/components/pages/components/ProductStats.js
import React from 'react';
import { formatPrice } from '../../../utils/formatters';

const ProductStats = ({ stats, showStats, onToggleStats }) => {
  if (!showStats || !stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Statistics</h4>
      
      {/* Main Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.withVariants}</div>
          <div className="text-sm text-gray-600">With Variants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.withImages}</div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{formatPrice(stats.averagePrice)}</div>
          <div className="text-sm text-gray-600">Avg Price</div>
        </div>
      </div>
      
      {/* Price Range Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">{stats.priceRanges.under25k}</div>
          <div className="text-xs text-gray-500">Under 25K</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">{stats.priceRanges['25k-50k']}</div>
          <div className="text-xs text-gray-500">25K - 50K</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">{stats.priceRanges['50k-100k']}</div>
          <div className="text-xs text-gray-500">50K - 100K</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">{stats.priceRanges.over100k}</div>
          <div className="text-xs text-gray-500">Over 100K</div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;