// src/components/pages/hooks/useProductForm.js
import { useState, useCallback, useEffect } from 'react';

export const useProductForm = (categories = []) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '', // Add category field
    price: null,
    description: '',
    stock: null,
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
    let processedValue = value;
    
    // Handle numeric fields properly
    if (field === 'price' || field === 'stock') {
      // Convert empty string to null, otherwise parse as number
      if (value === '' || value === null || value === undefined) {
        processedValue = null;
      } else {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? null : numValue;
      }
    }
    
    setProductForm(prev => ({
      ...prev,
      [field]: processedValue
    }));
  }, []);

  // Handle add product
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    
    // Get default category (first active category)
    const defaultCategory = categories.find(c => c.isActive)?.id || categories[0]?.id || '';
    
    setProductForm({
      name: '',
      category: defaultCategory,
      price: null,
      description: '',
      stock: null,
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
        category: product.categoryId || product.category?.id || '',
        price: product.price || null,
        description: product.description || '',
        stock: product.stock || null,
        image: null,
        imagePreview: product.image || product.imagePath || '',
        isActive: product.isActive ?? true
      };
      
      console.log('Form data for editing:', newFormData);
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

      // Clean up previous preview URL if it exists
      if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(productForm.imagePreview);
      }

      const previewUrl = URL.createObjectURL(file);
      
      setProductForm(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  }, [productForm.imagePreview]);

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
    if (!productForm.name || productForm.price === null || productForm.price === undefined || !productForm.description) {
      alert('Please fill in all required fields');
      return false;
    }
    
    if (!productForm.category) {
      alert('Please select a category');
      return false;
    }
    
    return true;
  }, [productForm]);

  // Prepare product data for API
  const prepareProductData = useCallback(() => {
    const data = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      is_active: productForm.isActive, // Use snake_case for API
      category: productForm.category, // Category ID
      image_path: productForm.imagePreview && !productForm.image ? productForm.imagePreview : '',
    };
    
    // Only include stock if it has a value
    if (productForm.stock !== null && productForm.stock !== undefined) {
      data.stock = productForm.stock;
    }
    
    console.log('Prepared product data for API:', data);
    return data;
  }, [productForm]);

  // Helper function to upload image (you'll need to implement this based on your API)
  const uploadImage = async (imageFile, apiRequest, createApiUrl) => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      // Update this URL to match your actual image upload endpoint
      const uploadUrl = createApiUrl('/upload/image');
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.image_path || result.url || result.path || result.data?.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error(`Failed to upload image: ${err.message}`);
    }
  };

  // Enhanced prepare data function that handles image upload
  const prepareProductDataWithImage = useCallback(async (apiRequest, createApiUrl) => {
    let imagePath = '';
    
    // Upload new image if one was selected
    if (productForm.image instanceof File) {
      imagePath = await uploadImage(productForm.image, apiRequest, createApiUrl);
    } else if (productForm.imagePreview && !productForm.imagePreview.startsWith('blob:')) {
      // Keep existing image path for edits
      imagePath = productForm.imagePreview;
    }
    
    const data = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      is_active: productForm.isActive,
      category: productForm.category,
      image_path: imagePath,
      stock: productForm.stock || 0,
    };
    
    console.log('Prepared product data with image for API:', data);
    return data;
  }, [productForm]);

  // Close modal
  const closeModal = useCallback(() => {
    // Clean up blob URL when closing modal
    if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(productForm.imagePreview);
    }
    
    setShowProductModal(false);
    setEditingProduct(null);
  }, [productForm.imagePreview]);

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
    prepareProductDataWithImage,
    closeModal
  };
};