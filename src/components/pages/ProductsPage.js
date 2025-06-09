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
    prepareFormData,
    saveProductToAPI, // Add this new function
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
    console.log('🔄 Starting product save...');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    try {
      let result;
      
      // Method 1: Use the new direct API function
      if (saveProductToAPI && apiRequest && createApiUrl) {
        console.log('📤 Using direct API save method...');
        result = await saveProductToAPI(apiRequest, createApiUrl);
      }
      // Method 2: Fallback to existing functions if available
      else if (prepareProductData && (createProduct || updateProduct)) {
        console.log('📤 Using fallback save method...');
        const productData = await prepareProductData();
        
        if (editingProduct && updateProduct) {
          console.log('🔄 Updating existing product...');
          result = await updateProduct(editingProduct.id, productData, productForm.image);
        } else if (!editingProduct && createProduct) {
          console.log('🆕 Creating new product...');
          result = await createProduct(productData, productForm.image);
        } else {
          throw new Error('Missing create/update functions');
        }
      }
      else {
        throw new Error('No save method available');
      }

      console.log('📥 Save result:', result);

      if (result && result.success) {
        console.log('🎉 Product saved successfully!');
        closeModal();
        
        // Refresh the products list
        if (fetchProducts) {
          console.log('🔄 Refreshing products list...');
          await fetchProducts();
        }
      } else {
        console.log('❌ Save failed:', result);
        alert(result?.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('💥 Error saving product:', err);
      
      // More helpful error messages
      let message = 'Error saving product. ';
      if (err.message.includes('network') || err.message.includes('fetch')) {
        message += 'Please check your internet connection.';
      } else if (err.message.includes('400')) {
        message += 'Invalid data. Please check all fields.';
      } else if (err.message.includes('401')) {
        message += 'Authentication required.';
      } else if (err.message.includes('403')) {
        message += 'Permission denied.';
      } else if (err.message.includes('500')) {
        message += 'Server error. Please try again later.';
      } else {
        message += err.message;
      }
      
      alert(message);
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