// src/components/pages/hooks/useProductForm.js - Updated with variant support
import { useState, useCallback, useEffect } from 'react';

export const useProductForm = (categories = []) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savedProductId, setSavedProductId] = useState(null); // New state for saved product ID
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
    setSavedProductId(null); // Reset saved product ID
    
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
      setEditingProduct(product);
      setSavedProductId(product.id); // Set saved product ID for existing products
      
      // Create new form object to prevent reference issues
      const newFormData = {
        name: product.name || '',
        category: product.categoryId || product.category?.id || '',
        price: product.price ? parseFloat(product.price) : null,
        description: product.description || '',
        stock: product.stock || null,
        image: null,
        imagePreview: product.image_path || product.image || '',
        isActive: product.is_active ?? true
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
    if (!productForm.name || productForm.name.trim() === '') {
      alert('Please enter a product name');
      return false;
    }
    
    // Validate price
    const price = parseFloat(productForm.price);
    if (!productForm.price || isNaN(price) || price <= 0) {
      alert('Please enter a valid price (must be a positive number)');
      return false;
    }
    
    if (!productForm.description || productForm.description.trim() === '') {
      alert('Please enter a product description');
      return false;
    }
    
    // Validate category
    const categoryId = parseInt(productForm.category, 10);
    if (!productForm.category || isNaN(categoryId)) {
      alert('Please select a valid category');
      return false;
    }
    
    // Validate stock if provided
    if (productForm.stock !== null && productForm.stock !== undefined && productForm.stock !== '') {
      const stock = parseInt(productForm.stock, 10);
      if (isNaN(stock) || stock < 0) {
        alert('Stock must be a valid non-negative number');
        return false;
      }
    }
    
    return true;
  }, [productForm]);

  // Prepare FormData for multipart upload (when image is included)
  const prepareFormData = useCallback(() => {
    const formData = new FormData();
    
    // Add text fields using the correct field names
    formData.append('name', productForm.name.trim());
    formData.append('description', productForm.description.trim());
    formData.append('price', productForm.price.toString());
    formData.append('is_active', productForm.isActive.toString());
    formData.append('category_id', productForm.category.toString());
    
    // Add image file if present
    if (productForm.image instanceof File) {
      formData.append('image', productForm.image);
    }
    
    return formData;
  }, [productForm]);

  // Prepare JSON data (when no new image)
  const prepareJSONData = useCallback(() => {
    // Safely parse numeric values with fallbacks
    const price = parseFloat(productForm.price);
    const categoryId = parseInt(productForm.category, 10);
    
    // Double-check for NaN values
    if (isNaN(price)) {
      throw new Error(`Invalid price value: "${productForm.price}" cannot be converted to number`);
    }
    if (isNaN(categoryId)) {
      throw new Error(`Invalid category value: "${productForm.category}" cannot be converted to integer`);
    }
    
    // Use the correct field names that the API expects
    const data = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: price,
      is_active: Boolean(productForm.isActive),
      category_id: categoryId
    };
    
    // Include existing image path if editing and no new image
    if (productForm.imagePreview && !productForm.image && !productForm.imagePreview.startsWith('blob:')) {
      data.image_path = productForm.imagePreview;
    }
    
    return data;
  }, [productForm]);

  // API request function that works with your endpoint
  const saveProductToAPI = useCallback(async (apiRequest, createApiUrl) => {
    try {
      let url, method;
      
      if (editingProduct) {
        // Update existing product - PUT
        url = `https://api.pood.lol/menu-items/${editingProduct.id}`;
        method = 'PUT';
      } else {
        // Create new product - POST
        url = 'https://api.pood.lol/menu-items/';
        method = 'POST';
      }
      
      let response;
      
      // If we have a new image file, use FormData
      if (productForm.image instanceof File) {
        const formData = prepareFormData();
        
        response = await fetch(url, {
          method: method,
          body: formData,
        });
        
        // If FormData fails, try JSON approach without image
        if (!response.ok) {
          const jsonData = prepareJSONData();
          
          response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(jsonData),
          });
        }
      } else {
        // No new image, use JSON
        const jsonData = prepareJSONData();
        
        response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });
      }
      
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
      }
      
      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        result = { message: responseText };
      }
      
      // For new products, set the saved product ID and update editingProduct
      if (!editingProduct && result.id) {
        setSavedProductId(result.id);
        setEditingProduct(result); // Set as editing product so variants can be managed
      }
      
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [productForm, editingProduct, prepareFormData, prepareJSONData]);

  // Close modal
  const closeModal = useCallback(() => {
    // Clean up blob URL when closing modal
    if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(productForm.imagePreview);
    }
    
    setShowProductModal(false);
    setEditingProduct(null);
    setSavedProductId(null);
  }, [productForm.imagePreview]);

  // Get current menu item ID (for variants)
  const getCurrentMenuItemId = useCallback(() => {
    return editingProduct?.id || savedProductId;
  }, [editingProduct, savedProductId]);

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
    savedProductId,
    productForm,
    setProductForm,
    updateProductForm,
    handleFormFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleImageChange,
    handleClearImage,
    validateForm,
    prepareFormData,
    prepareJSONData,
    saveProductToAPI,
    closeModal,
    getCurrentMenuItemId // New function to get current menu item ID
  };
};