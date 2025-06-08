// src/components/pages/hooks/useProductFilters.js
import { useState, useMemo } from 'react';

export const useProductFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Memoize filtered products to prevent unnecessary re-calculations
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category && product.category.id.toString() === selectedCategory
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product =>
        statusFilter === 'active' ? product.isActive : !product.isActive
      );
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under25k':
          filtered = filtered.filter(p => p.price < 25000);
          break;
        case '25k-50k':
          filtered = filtered.filter(p => p.price >= 25000 && p.price < 50000);
          break;
        case '50k-100k':
          filtered = filtered.filter(p => p.price >= 50000 && p.price < 100000);
          break;
        case 'over100k':
          filtered = filtered.filter(p => p.price >= 100000);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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

    return filtered;
  }, [products, searchTerm, selectedCategory, statusFilter, priceFilter, sortBy, sortOrder]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStatusFilter('all');
    setPriceFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' || priceFilter !== 'all';

  return {
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
    filteredProducts,
    clearAllFilters,
    hasActiveFilters
  };
};