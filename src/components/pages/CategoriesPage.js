// src/components/pages/CategoriesPage.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Tag, RefreshCw, AlertCircle, Eye, EyeOff, Search, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import CategoryModal from '../modals/CategoryModal';
import categoryService from '../../services/categoryService';

const CategoriesPage = ({
  showCategoryModal,
  editingCategory,
  categoryForm,
  setShowCategoryModal,
  setCategoryForm,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSaveCategory
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch categories using the centralized service
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await categoryService.getCategories();
      
      if (result.success) {
        const transformedCategories = categoryService.transformCategoriesData(result.data);
        setCategories(transformedCategories);
        setTotalCount(result.totalCount);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in fetchCategories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category statistics
  const fetchStats = async () => {
    try {
      const result = await categoryService.getCategoryStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const result = await categoryService.searchCategories(term);
        if (result.success) {
          setCategories(result.data);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error('Error searching categories:', err);
      }
    } else {
      fetchCategories();
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort categories
  const getFilteredAndSortedCategories = () => {
    let filteredCategories = [...categories];

    // Apply type filter
    if (filterType !== 'all') {
      filteredCategories = filteredCategories.filter(cat => cat.type === filterType);
    }

    // Apply sorting
    filteredCategories.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'id') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'isActive') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredCategories;
  };

  // Get category color classes
  const getCategoryColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
    };
    return colorMap[color] || colorMap.gray;
  };

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
        onClick={() => handleSort(field)}
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

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const filteredCategories = getFilteredAndSortedCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Categories</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Category Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Organize your products into categories ({totalCount} total)
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={fetchCategories}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && stats && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Category Statistics</h4>
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
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="food">Food</option>
              <option value="drink">Drinks</option>
              <option value="package">Packages</option>
              <option value="extra">Extras</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
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
                {renderSortableHeader('color', 'Color')}
                <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => {
                const colors = getCategoryColorClasses(category.color);
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
                        <div className={`${colors.bg} p-2 rounded-lg mr-3`}>
                          <Tag className={`w-4 h-4 ${colors.text}`} />
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {category.color}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit category"
                      >
                        <Edit2 size={14} className="sm:hidden" />
                        <Edit2 size={16} className="hidden sm:block" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Empty state */}
          {!loading && filteredCategories.length === 0 && (
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
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      fetchCategories();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={fetchCategories}
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

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          editingCategory={editingCategory}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          setShowCategoryModal={setShowCategoryModal}
          handleSaveCategory={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;