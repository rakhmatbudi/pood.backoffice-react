// src/components/pages/components/CategoryTable.js
import React from 'react';
import { Tag, Edit2, Eye, EyeOff, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

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

  // Render sortable header
  const renderSortableHeader = (field, label) => {
    return (
      <th 
        className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm cursor-pointer hover:bg-gray-100 transition-colors select-none"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center justify-between">
          <span>{label}</span>
          <div className="flex flex-col ml-1">
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

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {renderSortableHeader('id', 'ID')}
              {renderSortableHeader('name', 'Category')}
              {renderSortableHeader('description', 'Description')}
              {renderSortableHeader('type', 'Type')}
              {renderSortableHeader('isActive', 'Status')}
              <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => {
              const typeInfo = getTypeDisplayInfo(category.type);

              return (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="text-sm font-mono text-gray-600">
                      #{category.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Tag className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">
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
                  <td className="py-4 px-4 sm:px-6">
                    <p className="text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                      {category.description}
                    </p>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
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
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit category"
                        disabled={saving}
                      >
                        <Edit2 size={14} className="sm:hidden" />
                        <Edit2 size={16} className="hidden sm:block" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching categories found' : 'No categories found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No categories match "${searchTerm}"` 
                : filterType !== 'all' 
                  ? `No categories of type "${filterType}" found`
                  : 'No categories are currently available from the API'
              }
            </p>
            <div className="flex justify-center space-x-2">
              {(searchTerm || filterType !== 'all') && (
                <button
                  onClick={onClearFilters}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={onRefresh}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;