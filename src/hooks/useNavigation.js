// src/hooks/useNavigation.js
import { useState } from 'react';
import { BarChart3, Package, Tag, TrendingUp, Receipt, FileText, Users, Clock, UserCheck } from 'lucide-react';

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, type: 'item' },
    { id: 'products', label: 'Products', icon: Package, type: 'item' },
    { id: 'categories', label: 'Categories', icon: Tag, type: 'item' },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      type: 'group',
      children: [
        { id: 'sales-report', label: 'Sales Report', icon: TrendingUp, type: 'item' },
        { id: 'expense-report', label: 'Expense Report', icon: Receipt, type: 'item' }
      ]
    },
    { 
      id: 'hr', 
      label: 'Human Resources', 
      icon: Users, 
      type: 'group',
      children: [
        { id: 'staff', label: 'Staff', icon: UserCheck, type: 'item' },
        { id: 'attendance', label: 'Attendance', icon: Clock, type: 'item' }
      ]
    }
  ];

  return {
    currentPage,
    sidebarOpen,
    menuItems,
    setCurrentPage,
    setSidebarOpen
  };
};