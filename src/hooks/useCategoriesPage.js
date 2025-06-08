// src/components/pages/CategoriesPage.js
import React from 'react';
import { useCategoriesPage } from './hooks/useCategoriesPage';
import CategoryHeader from './components/CategoryHeader';
import CategoryStats from './components/CategoryStats';
import CategoryFilters from './components/CategoryFilters';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const CategoriesPage = () => {
  const {
    // Data state
    categories,
    loading,
    error,
    totalCount,
    stats,
    filteredCategories,
    
    // UI state
    searchTerm,
    filterType,
    showStats,
    sortBy,
    sortOrder,
    showCategoryModal,
    editingCategory,
    saving,
    deleteConfirm,
    categoryForm,
    
    // Actions
    fetchCategories,
    fetchStats,
    handleAddCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleSearch,
    handleSort,
    setShowStats,
    setFilterType,
    setShowCategoryModal,
    setDeleteConfirm,
    handleFormFieldChange,
  } = useCategoriesPage();

  if (loading) {
    return <LoadingSpinner message="Loading categories..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Error Loading Categories"
        message={error}
        onRetry={fetchCategories}
      />
    );
  }

  return (
    <div>
      <CategoryHeader
        totalCount={totalCount}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
        onRefresh={fetchCategories}
        onAddCategory={handleAddCategory}
        loading={loading}
      />

      {showStats && stats && (
        <CategoryStats stats={stats} />
      )}

      <CategoryFilters
        searchTerm={searchTerm}
        filterType={filterType}
        onSearch={handleSearch}
        onFilterChange={setFilterType}
      />

      <CategoryTable
        categories={filteredCategories}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={handleEditCategory}
        onDelete={setDeleteConfirm}
        saving={saving}
        loading={loading}
        searchTerm={searchTerm}
        filterType={filterType}
        onRefresh={fetchCategories}
        onClearFilters={() => {
          handleSearch('');
          setFilterType('all');
        }}
      />

      <CategoryModal
        show={showCategoryModal}
        editing={editingCategory}
        form={categoryForm}
        saving={saving}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
        onFieldChange={handleFormFieldChange}
      />

      <DeleteConfirmModal
        category={deleteConfirm}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default CategoriesPage;