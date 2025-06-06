// src/components/DashboardLayout.js
import React from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

const DashboardLayout = ({ currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, handleLogout }) => {
  const categoryHooks = useCategories();
  const productHooks = useProducts();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage categories={categoryHooks.categories} products={productHooks.products} setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage {...productHooks} categories={categoryHooks.categories} />;
      case 'categories':
        return <CategoriesPage {...categoryHooks} products={productHooks.products} />;
      default:
        return <DashboardPage categories={categoryHooks.categories} products={productHooks.products} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        sidebarOpen={sidebarOpen}
        setCurrentPage={setCurrentPage}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {currentPage}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;


