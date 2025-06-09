// src/components/pages/hooks/useProductVariants.js
import { useState, useCallback, useEffect } from 'react';

export const useProductVariants = (menuItemId) => {
  const [variants, setVariants] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
  const [variantErrors, setVariantErrors] = useState({});
  
  const [variantForm, setVariantForm] = useState({
    name: '',
    price: null,
    is_active: true
  });

  // Fetch variants for a specific menu item
  const fetchVariants = useCallback(async (itemId) => {
    console.log('fetchVariants called with itemId:', itemId);
    if (!itemId) return;
    
    setIsLoadingVariants(true);
    try {
      const url = `https://api.pood.lol/menu-item-variants/menu-item/${itemId}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.status === 'success') {
        console.log('Setting variants:', data.data || []);
        setVariants(data.data || []);
      } else {
        console.error('Failed to fetch variants:', data);
        setVariants([]);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    } finally {
      setIsLoadingVariants(false);
    }
  }, []);

  // Load variants when menuItemId changes
  useEffect(() => {
    console.log('useProductVariants: menuItemId changed to:', menuItemId);
    if (menuItemId) {
      console.log('Fetching variants for menuItemId:', menuItemId);
      fetchVariants(menuItemId);
    } else {
      console.log('No menuItemId, clearing variants');
      setVariants([]);
    }
  }, [menuItemId, fetchVariants]);

  // Handle form field changes
  const handleVariantFormChange = useCallback((field, value) => {
    let processedValue = value;
    
    // Handle price field
    if (field === 'price') {
      if (value === '' || value === null || value === undefined) {
        processedValue = null;
      } else {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? null : numValue;
      }
    }
    
    setVariantForm(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Clear error for this field
    if (variantErrors[field]) {
      setVariantErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [variantErrors]);

  // Validate variant form
  const validateVariantForm = useCallback(() => {
    const errors = {};
    
    if (!variantForm.name || variantForm.name.trim() === '') {
      errors.name = 'Variant name is required';
    }
    
    const price = parseFloat(variantForm.price);
    if (!variantForm.price || isNaN(price) || price <= 0) {
      errors.price = 'Valid price is required (must be a positive number)';
    }
    
    setVariantErrors(errors);
    return Object.keys(errors).length === 0;
  }, [variantForm]);

  // Handle add variant
  const handleAddVariant = useCallback(() => {
    if (!menuItemId) {
      alert('Please save the product first before adding variants');
      return;
    }
    
    setEditingVariant(null);
    setVariantForm({
      name: '',
      price: null,
      is_active: true
    });
    setVariantErrors({});
    setShowVariantModal(true);
  }, [menuItemId]);

  // Handle edit variant
  const handleEditVariant = useCallback((variant) => {
    setEditingVariant(variant);
    setVariantForm({
      name: variant.name || '',
      price: variant.price ? parseFloat(variant.price) : null,
      is_active: variant.is_active ?? true
    });
    setVariantErrors({});
    setShowVariantModal(true);
  }, []);

  // Save variant to API
  const saveVariant = useCallback(async () => {
    if (!validateVariantForm()) {
      return;
    }
    
    setIsSubmittingVariant(true);
    
    try {
      const requestData = {
        menu_item_id: parseInt(menuItemId),
        name: variantForm.name.trim(),
        price: parseFloat(variantForm.price),
        is_active: variantForm.is_active
      };
      
      let url, method;
      
      if (editingVariant) {
        // Update existing variant
        url = `https://api.pood.lol/menu-item-variants/${editingVariant.id}`;
        method = 'PUT';
      } else {
        // Create new variant
        url = 'https://api.pood.lol/menu-item-variants/';
        method = 'POST';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // Refresh variants list
      await fetchVariants(menuItemId);
      
      // Close modal
      setShowVariantModal(false);
      setEditingVariant(null);
      
      return { success: true, data: responseData };
      
    } catch (error) {
      console.error('Error saving variant:', error);
      alert(`Failed to save variant: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsSubmittingVariant(false);
    }
  }, [variantForm, editingVariant, menuItemId, validateVariantForm, fetchVariants]);

  // Delete variant
  const deleteVariant = useCallback(async (variantId, variantName) => {
    if (!window.confirm(`Are you sure you want to delete the variant "${variantName}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`https://api.pood.lol/menu-item-variants/${variantId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete variant: ${response.status} ${response.statusText}`);
      }
      
      // Refresh variants list
      await fetchVariants(menuItemId);
      
      return { success: true };
      
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert(`Failed to delete variant: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, [menuItemId, fetchVariants]);

  // Toggle variant active status
  const toggleVariantStatus = useCallback(async (variant) => {
    try {
      const response = await fetch(`https://api.pood.lol/menu-item-variants/${variant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          menu_item_id: variant.menu_item_id,
          name: variant.name,
          price: parseFloat(variant.price),
          is_active: !variant.is_active
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update variant status: ${response.status} ${response.statusText}`);
      }
      
      // Refresh variants list
      await fetchVariants(menuItemId);
      
    } catch (error) {
      console.error('Error toggling variant status:', error);
      alert(`Failed to update variant status: ${error.message}`);
    }
  }, [menuItemId, fetchVariants]);

  // Close variant modal
  const closeVariantModal = useCallback(() => {
    setShowVariantModal(false);
    setEditingVariant(null);
    setVariantErrors({});
  }, []);

  // Format price for display
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  return {
    variants,
    isLoadingVariants,
    showVariantModal,
    editingVariant,
    isSubmittingVariant,
    variantForm,
    variantErrors,
    handleVariantFormChange,
    handleAddVariant,
    handleEditVariant,
    saveVariant,
    deleteVariant,
    toggleVariantStatus,
    closeVariantModal,
    fetchVariants,
    formatPrice
  };
};