// src/components/Sidebar.js
import React, { useState } from 'react';
import { ShoppingBag, X, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
// Make sure this import is GONE: // import { useNavigation } from '../hooks/useNavigation';

// Add 'menuItems' to the destructured props here:
const Sidebar = ({ handleLogout, currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, menuItems }) => {
  // REMOVE THIS LINE if it's still there:
  // const { currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, menuItems } = useNavigation();

  const [expandedGroups, setExpandedGroups] = useState({ reports: true }); // Reports expanded by default

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const isGroupActive = (group) => {
    return group.children?.some(child => child.id === currentPage);
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    
    if (item.type === 'group') {
      const isExpanded = expandedGroups[item.id];
      const isActive = isGroupActive(item);
      
      return (
        <div key={item.id}>
          {/* Group Header */}
          <button
            onClick={() => toggleGroup(item.id)}
            className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
              isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
            }`}
          >
            <div className="flex items-center">
              <Icon size={20} className="mr-3" />
              {item.label}
            </div>
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>
          
          {/* Group Items */}
          {isExpanded && (
            <div className="bg-gray-50">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                return (
                  <button
                    key={child.id}
                    onClick={() => {
                      setCurrentPage(child.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-12 py-2.5 text-left hover:bg-orange-50 transition-colors ${
                      currentPage === child.id 
                        ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600 font-medium' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <ChildIcon size={18} className="mr-3" />
                    {child.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    // Regular menu item
    return (
      <button
        key={item.id}
        onClick={() => {
          setCurrentPage(item.id);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
          currentPage === item.id 
            ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600 font-medium' 
            : 'text-gray-700 hover:text-orange-600'
        }`}
      >
        <Icon size={20} className="mr-3" />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
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
        
        <nav className="mt-6 flex-1 overflow-y-auto">
          {menuItems.map(renderMenuItem)} {/* This is line 49, where menuItems was undefined */}
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
    </>
  );
};

export default Sidebar;