// src/components/pages/components/ProductFilters.js
import React from 'react';
import { Search } from 'lucide-react';
import { 
  PRICE_RANGES, 
  PRICE_RANGE_LABELS, 
  SORT_OPTIONS, 
  SORT_LABELS,
  STATUS_FILTERS,
  STATUS_LABELS 
} from '../../../utils/constants';

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
  hasActiveFilters,
  clearAllFilters
}) => {
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Prices</option>
            {Object.entries(PRICE_RANGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-600">×</button>
            </span>
          )}
          
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-green-600">×</button>
            </span>
          )}
          
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Status: {STATUS_LABELS[statusFilter]}
              <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-purple-600">×</button>
            </span>
          )}
          
          {priceFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              Price: {PRICE_RANGE_LABELS[priceFilter]}
              <button onClick={() => setPriceFilter('all')} className="ml-1 hover:text-orange-600">×</button>
            </span>
          )}
          
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;