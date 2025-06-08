// src/components/pages/components/CategoryStats.js
import React from 'react';

const CategoryStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Category Statistics
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.displayed}</div>
          <div className="text-sm text-gray-600">Displayed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.hidden}</div>
          <div className="text-sm text-gray-600">Hidden</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.byType.food}</div>
          <div className="text-sm text-gray-600">Food</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.byType.drink}</div>
          <div className="text-sm text-gray-600">Drinks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.byType.other}</div>
          <div className="text-sm text-gray-600">Other</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;