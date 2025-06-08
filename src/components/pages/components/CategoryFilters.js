// src/components/pages/components/CategoryFilters.js
import React, { useMemo } from 'react';
import { Search } from 'lucide-react';

const CategoryFilters = ({ searchTerm, filterType, onSearch, onFilterChange, categories = [] }) => {
  // Generate unique types from the transformed categories data (which now has 'type' field)
  const availableTypes = useMemo(() => {
    const uniqueTypes = [...new Set(categories.map(cat => cat.type).filter(Boolean))];
    return uniqueTypes.sort();
  }, [categories]);

  // Dynamic display name - capitalize first letter
  const getTypeDisplayName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>
                {getTypeDisplayName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;