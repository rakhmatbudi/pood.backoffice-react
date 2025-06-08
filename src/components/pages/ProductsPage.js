// src/components/pages/ProductsPage.js - Clean version without debug info
import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useProductFilters } from './hooks/useProductFilters';
import { useProductForm } from './hooks/useProductForm';
import { VALIDATION_MESSAGES } from '../../utils/constants';

// Components
import ProductHeader from './components/ProductHeader';
import ProductStats from './components/ProductStats';
import ProductFilters from './components/ProductFilters';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ProductsPage = () => {
  const [showStats, setShowStats] = useState(false);

  // Use real API data
  const {
    products,
    categories,
    loading,
    categoriesLoading,
    error,
    totalCount,
    stats,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    apiRequest,
    createApiUrl,
    saveProduct
  } = useProducts();

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
    prepareProductDataWithImage,
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

  // Enhanced save product handler
  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      
      if (prepareProductDataWithImage && saveProduct) {
        const productData = await prepareProductDataWithImage(apiRequest, createApiUrl);
        result = await saveProduct(productData, !!editingProduct, editingProduct?.id);
      } else {
        const productData = prepareProductData();
        
        if (editingProduct) {
          result = await updateProduct(editingProduct.id, productData, productForm.image);
        } else {
          result = await createProduct(productData, productForm.image);
        }
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

  if (loading || categoriesLoading) {
    return <LoadingSpinner message="Loading products and categories..." />;
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