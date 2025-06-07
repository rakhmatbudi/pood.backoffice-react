// src/components/pages/DashboardPage.js
import React from 'react';
import { Package, TrendingUp, Users, DollarSign } from 'lucide-react';
import { formatPrice, getCategoryColorClasses } from '../../utils/formatters';
import { useSettings } from '../../hooks/useSettings';

const DashboardPage = ({ categories, products, setCurrentPage }) => {
  const { restaurant, loading, error } = useSettings();

  // Calculate dashboard stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard settings error:', error);
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to {restaurant?.name || 'Restaurant'} Dashboard
        </h3>
        <p className="text-gray-600">Overview of your restaurant operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h4>
          <div className="space-y-4">
            {categories.filter(c => c.isActive).map(category => {
              const categoryProducts = products.filter(p => p.category === category.id).length;
              const colors = getCategoryColorClasses(category.color);
              
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${colors.solid} rounded-full mr-3`}></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{categoryProducts}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Product inventory updated</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New products added to menu</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Stock levels checked</span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentPage('products')}
            className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Manage Products →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;