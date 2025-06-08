// src/components/pages/ProductsPage.js - Fixed to use real API data
import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
// Remove useCategories since we'll get categories from useProducts
// import { useCategories } from '../../hooks/useCategories'; 
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

  // Use real API data - remove the 'true' parameter to stop using mock data
  const {
    products,
    categories, // Get categories from useProducts instead of useCategories
    loading,
    categoriesLoading,
    error,
    totalCount,
    stats,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Add API helpers if using separate hooks
    apiRequest,
    createApiUrl,
    saveProduct // If you have this function
  } = useProducts(); // Remove 'true' parameter - use real API data

  // Remove this line since we're getting categories from useProducts:
  // const { categories } = useCategories(true); 

  // Debug logging to see what we're getting
  console.log('🔍 ProductsPage - categories from useProducts:', categories);
  console.log('🔍 ProductsPage - categories length:', categories.length);
  console.log('🔍 ProductsPage - categoriesLoading:', categoriesLoading);

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
    prepareProductDataWithImage, // If using the enhanced version
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
      
      // If you have the enhanced version with image upload
      if (prepareProductDataWithImage && saveProduct) {
        const productData = await prepareProductDataWithImage(apiRequest, createApiUrl);
        result = await saveProduct(productData, !!editingProduct, editingProduct?.id);
      } else {
        // Fallback to original method
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

  // Show loading if either products or categories are loading
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
      {/* Debug info - remove this later */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
          <p className="text-sm text-yellow-700">
            Products: {products.length} | Categories: {categories.length} | Categories Loading: {categoriesLoading ? 'Yes' : 'No'}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Categories: {categories.map(c => c.name).join(', ')}
          </p>
        </div>
      )}

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