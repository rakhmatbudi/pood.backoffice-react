// src/components/pages/ProductsPage.js
import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useProductFilters } from './hooks/useProductFilters';
import { useProductForm } from './hooks/useProductForm';
import { VALIDATION_MESSAGES } from '../../utils/constants';

// Components
import ProductHeader from './components/ProductHeader';
import ProductStats from './components/ProductStats';
import ProductFilters from './components/ProductFilters';
import ProductTable from './components/ProductTable';
import ProductModal from '../modals/ProductModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ProductsPage = () => {
  const [showStats, setShowStats] = useState(false);

  // Custom hooks - using mock data for now
  const {
    products,
    loading,
    error,
    totalCount,
    stats,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts(true); // true = use mock data

  const { categories } = useCategories(true); // true = use mock data

  const {
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
  } = useProductFilters(products);

  const {
    showProductModal,
    setShowProductModal,
    editingProduct,
    productForm,
    setProductForm,
    updateProductForm,
    handleFormFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleImageChange,
    handleClearImage,
    validateForm,
    prepareProductData,
    closeModal
  } = useProductForm(categories);

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(VALIDATION_MESSAGES.DELETE_CONFIRMATION)) {
      return;
    }

    const result = await deleteProduct(productId);
    
    if (!result.success) {
      alert(result.error || 'Failed to delete product');
    }
  };

  // Handle save product
  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const productData = prepareProductData();
      let result;
      
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData, productForm.image);
      } else {
        result = await createProduct(productData, productForm.image);
      }

      if (result.success) {
        closeModal();
      } else {
        alert(result.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please try again.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchProducts();
  };

  // Handle toggle stats
  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Products"
        message={error}
        onRetry={fetchProducts}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <ProductHeader
        totalCount={totalCount}
        showStats={showStats}
        onToggleStats={handleToggleStats}
        onRefresh={handleRefresh}
        onAddProduct={handleAddProduct}
        loading={loading}
      />

      {/* Statistics Panel */}
      <ProductStats
        stats={stats}
        showStats={showStats}
        onToggleStats={handleToggleStats}
      />

      {/* Filters and Controls */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEditProduct={handleEditProduct}
        onAddProduct={handleAddProduct}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          updateProductForm={updateProductForm}
          handleFormFieldChange={handleFormFieldChange}
          setShowModal={setShowProductModal}
          handleSaveProduct={handleSaveProduct}
          categories={categories}
          onImageChange={handleImageChange}
          onClearImage={handleClearImage}
        />
      )}
    </div>
  );
};

export default ProductsPage;