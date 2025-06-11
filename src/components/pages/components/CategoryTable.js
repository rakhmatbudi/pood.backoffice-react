// src/components/pages/components/CategoryTable.js
import React from 'react';
import { Tag, Edit2, Eye, EyeOff, RefreshCw, ChevronUp, ChevronDown, Smartphone, X } from 'lucide-react';

const CategoryTable = ({
  categories,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  saving,
  loading,
  searchTerm,
  filterType,
  onRefresh,
  onClearFilters
}) => {
  // Get type display info
  const getTypeDisplayInfo = (type) => {
    const typeMap = {
      food: { label: 'Food', color: 'bg-green-100 text-green-800' },
      drink: { label: 'Drink', color: 'bg-blue-100 text-blue-800' },
      package: { label: 'Package', color: 'bg-purple-100 text-purple-800' },
      extra: { label: 'Extra', color: 'bg-orange-100 text-orange-800' },
      other: { label: 'Other', color: 'bg-gray-100 text-gray-800' },
    };
    return typeMap[type] || typeMap.other;
  };

  // Render sortable header for desktop
  const renderSortableHeader = (field, label) => {
    return (
      <th 
        className="text-left py-3 px-3 sm:px-6 font-semibold text-gray-800 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 transition-colors select-none"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{label}</span>
          <div className="flex flex-col ml-1 flex-shrink-0">
            <ChevronUp 
              className={`w-3 h-3 ${sortBy === field && sortOrder === 'asc' ? 'text-orange-600' : 'text-gray-400'}`} 
            />
            <ChevronDown 
              className={`w-3 h-3 -mt-1 ${sortBy === field && sortOrder === 'desc' ? 'text-orange-600' : 'text-gray-400'}`} 
            />
          </div>
        </div>
      </th>
    );
  };

  // Mobile card component
  const MobileCard = ({ category }) => {
    const typeInfo = getTypeDisplayInfo(category.type);
    
    return (
      <div className="bg-white p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center flex-1 min-w-0">
            <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
              <Tag className="w-4 h-4 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-800 text-base truncate">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">ID: #{category.id}</p>
            </div>
          </div>
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 ml-2"
            title="Edit category"
            disabled={saving}
          >
            <Edit2 size={16} />
          </button>
        </div>
        
        {category.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {category.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
            <div className="flex items-center">
              {category.isActive ? (
                <div className="flex items-center text-green-600">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-xs">Displayed</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <EyeOff className="w-4 h-4 mr-1" />
                  <span className="text-xs">Hidden</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {category.is_display_for_self_order ? (
                <div className="flex items-center text-blue-600">
                  <Smartphone className="w-4 h-4 mr-1" />
                  <span className="text-xs">Self-Order</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <div className="relative">
                    <Smartphone className="w-4 h-4" />
                    <X className="w-2 h-2 absolute -top-0.5 -right-0.5 text-red-500" />
                  </div>
                  <span className="text-xs ml-1">No Self-Order</span>
                </div>
              )}
            </div>
          </div>
          {category.updatedAt && (
            <span className="text-xs text-gray-500">
              {new Date(category.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {renderSortableHeader('id', 'ID')}
                {renderSortableHeader('name', 'Category')}
                {renderSortableHeader('description', 'Description')}
                {renderSortableHeader('type', 'Type')}
                {renderSortableHeader('isActive', 'Status')}
                {renderSortableHeader('is_display_for_self_order', 'Self-Order')}
                <th className="text-left py-3 px-3 sm:px-6 font-semibold text-gray-800 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => {
                const typeInfo = getTypeDisplayInfo(category.type);

                return (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-3 sm:px-6">
                      <span className="text-xs font-mono text-gray-600">
                        #{category.id}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
                          <Tag className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-sm truncate">
                            {category.name}
                          </div>
                          {category.updatedAt && (
                            <div className="text-xs text-gray-500">
                              Updated: {new Date(category.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                        {category.description}
                      </p>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center">
                        {category.isActive ? (
                          <div className="flex items-center text-green-600">
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="text-xs">Displayed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <EyeOff className="w-4 h-4 mr-1" />
                            <span className="text-xs">Hidden</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center">
                        {category.is_display_for_self_order ? (
                          <div className="flex items-center text-blue-600">
                            <Smartphone className="w-4 h-4 mr-1" />
                            <span className="text-xs">Enabled</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <div className="relative">
                              <Smartphone className="w-4 h-4" />
                              <X className="w-2 h-2 absolute -top-0.5 -right-0.5 text-red-500" />
                            </div>
                            <span className="text-xs ml-1">Disabled</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(category)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit category"
                          disabled={saving}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {/* Mobile Sort Controls */}
        <div className="bg-gray-50 border-b p-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSort('name')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortBy === 'name' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => onSort('type')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortBy === 'type' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => onSort('isActive')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortBy === 'isActive' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Status {sortBy === 'isActive' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => onSort('is_display_for_self_order')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortBy === 'is_display_for_self_order' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Self-Order {sortBy === 'is_display_for_self_order' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <MobileCard key={category.id} category={category} />
          ))}
        </div>
      </div>
      
      {/* Empty state */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <Tag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No matching categories found' : 'No categories found'}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-md mx-auto">
            {searchTerm 
              ? `No categories match "${searchTerm}"` 
              : filterType !== 'all' 
                ? `No categories of type "${filterType}" found`
                : 'No categories are currently available from the API'
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 sm:space-x-2">
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={onClearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center justify-center text-sm"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={onRefresh}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;