// src/components/pages/hooks/useProductForm.js
import { useState, useCallback, useEffect } from 'react';

export const useProductForm = (categories = []) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    image: null,
    imagePreview: '',
    isActive: true
  });

  // Create stable callback functions to prevent re-renders
  const updateProductForm = useCallback((updates) => {
    setProductForm(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const handleFormFieldChange = useCallback((field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle add product
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories.find(c => c.isActive)?.id?.toString() || '',
      price: '',
      description: '',
      stock: '',
      image: null,
      imagePreview: '',
      isActive: true
    });
    setShowProductModal(true);
  }, [categories]);

  // Handle edit product - convert API structure to form structure
  const handleEditProduct = useCallback((product) => {
    try {
      console.log('Editing product:', product);
      
      setEditingProduct(product);
      
      // Create new form object to prevent reference issues
      const newFormData = {
        name: product.name || '',
        category: product.category?.id?.toString() || product.categoryId?.toString() || '',
        price: product.price?.toString() || '0',
        description: product.description || '',
        stock: '50',
        image: null,
        imagePreview: product.imagePath || '',
        isActive: product.isActive ?? true
      };
      
      setProductForm(newFormData);
      setShowProductModal(true);
    } catch (error) {
      console.error('Error in handleEditProduct:', error);
      alert('Error opening product for editing. Please try again.');
    }
  }, []);

  // Handle file selection with useCallback to prevent re-renders
  const handleImageChange = useCallback((file) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image file must be less than 5MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      setProductForm(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  }, []);

  // Clear image selection with useCallback
  const handleClearImage = useCallback(() => {
    if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(productForm.imagePreview);
    }
    
    setProductForm(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
  }, [productForm.imagePreview]);

  // Validate form
  const validateForm = useCallback(() => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  }, [productForm]);

  // Prepare product data for API
  const prepareProductData = useCallback(() => {
    return {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      categoryId: parseInt(productForm.category),
      isActive: productForm.isActive,
      imagePath: productForm.imagePreview && !productForm.image ? productForm.imagePreview : null,
    };
  }, [productForm]);

  // Close modal
  const closeModal = useCallback(() => {
    setShowProductModal(false);
    setEditingProduct(null);
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(productForm.imagePreview);
      }
    };
  }, [productForm.imagePreview]);

  return {
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
  };
};