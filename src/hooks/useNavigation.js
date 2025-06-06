

// src/hooks/useNavigation.js
import { useState } from 'react';
import { BarChart3, Package, Tag } from 'lucide-react';

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag }
  ];

  return {
    currentPage,
    sidebarOpen,
    menuItems,
    setCurrentPage,
    setSidebarOpen
  };
};