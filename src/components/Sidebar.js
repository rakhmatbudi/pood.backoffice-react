// src/components/Sidebar.js
import React from 'react';
import { ShoppingBag, X, LogOut } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

const Sidebar = ({ currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, handleLogout }) => {
  const { menuItems } = useNavigation();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <div className="flex items-center">
          <div className="bg-orange-100 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Pood Admin</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                currentPage === item.id 
                  ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              <Icon size={20} className="mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;