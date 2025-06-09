// src/components/pages/hooks/useProductForm.js - Fixed for your API structure
import { useState, useCallback, useEffect } from 'react';

export const useProductForm = (categories = []) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
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
    console.log('🔍 Validating form:', productForm);
    
    if (!productForm.name || productForm.name.trim() === '') {
      alert('Please enter a product name');
      return false;
    }
    
    if (productForm.price === null || productForm.price === undefined || productForm.price <= 0) {
      alert('Please enter a valid price');
      return false;
    }
    
    if (!productForm.description || productForm.description.trim() === '') {
      alert('Please enter a product description');
      return false;
    }
    
    if (!productForm.category) {
      alert('Please select a category');
      return false;
    }
    
    console.log('✅ Form validation passed');
    return true;
  }, [productForm]);

  // Convert image to base64 for API
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Prepare product data for API (with image as base64 or FormData)
  const prepareProductData = useCallback(async () => {
    console.log('📦 Preparing product data for API...');
    console.log('📝 Current form state:', productForm);
    
    try {
      // Basic data structure
      const data = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        is_active: productForm.isActive,
        category: parseInt(productForm.category),
        stock: productForm.stock ? parseInt(productForm.stock) : 0,
      };

      // Handle image if present
      if (productForm.image instanceof File) {
        console.log('📸 Converting image to base64...');
        try {
          const base64Image = await convertImageToBase64(productForm.image);
          data.image = base64Image; // Send as base64
          // OR if your API expects just the file name:
          // data.image_name = productForm.image.name;
        } catch (err) {
          console.error('❌ Image conversion failed:', err);
          // Continue without image
        }
      } else if (productForm.imagePreview && !productForm.imagePreview.startsWith('blob:')) {
        // Keep existing image path for edits
        data.image_path = productForm.imagePreview;
      }
      
      console.log('✅ Final product data prepared:', data);
      return data;
    } catch (err) {
      console.error('❌ Error preparing product data:', err);
      throw err;
    }
  }, [productForm]);

  // Prepare FormData for multipart upload (alternative approach)
  const prepareFormData = useCallback(() => {
    console.log('📦 Preparing FormData for API...');
    
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', productForm.name.trim());
    formData.append('description', productForm.description.trim());
    formData.append('price', parseFloat(productForm.price));
    formData.append('is_active', productForm.isActive);
    formData.append('category', parseInt(productForm.category));
    formData.append('stock', productForm.stock ? parseInt(productForm.stock) : 0);
    
    // Add image file if present
    if (productForm.image instanceof File) {
      formData.append('image', productForm.image);
    }
    
    console.log('✅ FormData prepared');
    return formData;
  }, [productForm]);

  // API request function that works with your endpoint
  const saveProductToAPI = useCallback(async (apiRequest, createApiUrl) => {
    console.log('🔄 Saving product to API...');
    console.log('✏️ Is editing:', !!editingProduct);
    
    try {
      let url, method, requestData;
      
      if (editingProduct) {
        // Update existing product - PUT to https://api.pood.lol/menu-items/{id}
        url = `https://api.pood.lol/menu-items/${editingProduct.id}`;
        method = 'PUT';
      } else {
        // Create new product - POST to https://api.pood.lol/menu-items/
        url = 'https://api.pood.lol/menu-items/';
        method = 'POST';
      }
      
      console.log(`📤 ${method} request to:`, url);
      
      // Try FormData first (for multipart with image)
      if (productForm.image instanceof File) {
        console.log('📸 Using FormData for image upload...');
        requestData = prepareFormData();
        
        const response = await fetch(url, {
          method: method,
          body: requestData,
          // Don't set Content-Type for FormData - browser will set it with boundary
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ API response:', result);
        return { success: true, data: result };
      } else {
        // Use JSON for requests without new images
        console.log('📝 Using JSON data...');
        requestData = await prepareProductData();
        
        const response = await apiRequest(url, {
          method: method,
          body: JSON.stringify(requestData),
        });
        
        console.log('✅ API response:', response);
        return { success: true, data: response };
      }
    } catch (err) {
      console.error('❌ API request failed:', err);
      return { success: false, error: err.message };
    }
  }, [productForm, editingProduct, prepareProductData, prepareFormData]);

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
    prepareFormData,
    saveProductToAPI,
    closeModal
  };
};