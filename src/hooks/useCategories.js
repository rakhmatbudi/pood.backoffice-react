// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, ENDPOINTS, ERROR_MESSAGES } from '../config/api';
import { useAuth } from './useAuth'; // Still need useAuth if it provides other context (e.g., current user info)
import apiClient from '../services/apiClient'; // <-- Import the apiClient instance

export const useCategories = (useMockData = false) => {
    // We no longer need getToken and handleLogout directly from useAuth for API calls,
    // as apiClient now manages the token internally.
    // However, if you use handleLogout from useAuth for redirection/global logout state,
    // you might still need to destructure it. For now, let's assume apiClient handles the 401.
    const { handleLogout } = useAuth(); // Keeping handleLogout for potential redirection after 401

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        type: '',
        color: 'blue',
        isActive: true,
        display_picture: null,
        display_picture_file: null
    });

    // Helper to construct API URLs using API_CONFIG.
    // This is now redundant as apiClient's methods take endpoints directly,
    // but kept it for consistency if other parts still use createApiUrl.
    // Ideally, you'd use apiClient.get(ENDPOINTS.MENU_CATEGORIES.LIST) directly.
    const createApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;


    // Old apiRequest function is REMOVED as we will use apiClient directly.
    // This removes the dependency chain that caused infinite re-fetches.


    // Fetch categories from API or use mock data
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setCategories([
                    { id: 'food', name: 'Food', description: 'Food items and main dishes', type: 'main', color: 'blue', isActive: true, display_picture: null, productCount: 3 },
                    { id: 'drink', name: 'Drinks', description: 'Beverages and drinks', type: 'beverage', color: 'green', isActive: true, display_picture: null, productCount: 2 },
                    { id: 'snack', name: 'Snacks', description: 'Light snacks and appetizers', type: 'appetizer', color: 'yellow', isActive: true, display_picture: null, productCount: 0 },
                    { id: 'dessert', name: 'Desserts', description: 'Sweet treats and desserts', type: 'dessert', color: 'pink', isActive: true, display_picture: null, productCount: 0 }
                ]);
            } else {
                console.log('🔍 [Categories Hook] Fetching categories using apiClient from:', ENDPOINTS.MENU_CATEGORIES.LIST);
                // Use apiClient.get directly
                const result = await apiClient.get(ENDPOINTS.MENU_CATEGORIES.LIST);

                if (!result.success) {
                    // Check for 401 specifically here, and trigger global logout
                    if (result.status === 401) {
                         console.error("401 Unauthorized during categories fetch. Logging out.");
                         handleLogout(); // Trigger logout logic from useAuth
                         // Do not set error state if handleLogout handles full flow (e.g., redirect)
                         return; // Stop further processing
                    }
                    throw new Error(result.error || 'Failed to fetch categories.');
                }

                let categoriesData = [];
                // Adapt to various backend response structures
                if (Array.isArray(result.data)) {
                    categoriesData = result.data;
                } else if (result.data && Array.isArray(result.data.data)) { // Common for some APIs that wrap data in another 'data' field
                    categoriesData = result.data.data;
                } else if (result.data.results && Array.isArray(result.data.results)) { // For Django REST Framework pagination
                    categoriesData = result.data.results;
                } else {
                    console.warn('⚠️ [Categories Hook] Unexpected categories response structure or empty data:', result.data);
                    categoriesData = [];
                }

                const mappedCategories = categoriesData.map(category => ({
                    ...category,
                    isActive: category.is_displayed !== undefined ? category.is_displayed : true,
                    productCount: category.products_count !== undefined ? category.products_count : 0
                }));
                setCategories(mappedCategories);
                console.log('✅ [Categories Hook] Processed categories:', mappedCategories);
            }
        } catch (err) {
            console.error('❌ [Categories Hook] Error fetching categories:', err);
            // Only set general error state if it's not the UNAUTHORIZED error handled by handleLogout
            if (err.message !== ERROR_MESSAGES.UNAUTHORIZED) { // Assuming ERROR_MESSAGES.UNAUTHORIZED is a string matching the thrown error
                setError(err.message);
            }
            // setCategories([]); // Optionally clear on error
        } finally {
            setLoading(false);
        }
    }, [useMockData, handleLogout]); // Dependencies are now just useMockData and handleLogout

    // Load categories on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); // fetchCategories is stable

    const handleAddCategory = useCallback(() => {
        setEditingCategory(null);
        setCategoryForm({
            name: '', description: '', type: '', color: 'blue', isActive: true,
            display_picture: null, display_picture_file: null
        });
        setShowCategoryModal(true);
    }, []);

    const handleEditCategory = useCallback((category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name || '', description: category.description || '',
            type: category.type || '', color: category.color || 'blue',
            isActive: category.isActive !== undefined ? category.isActive : true,
            display_picture: category.display_picture || null, display_picture_file: null
        });
        setShowCategoryModal(true);
    }, []);

    const handleDeleteCategory = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 500));
                setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
            } else {
                // Use apiClient.delete directly
                const result = await apiClient.delete(ENDPOINTS.MENU_CATEGORIES.DELETE(id));

                if (!result.success) {
                    if (result.status === 401) { handleLogout(); return; }
                    throw new Error(result.error || 'Failed to delete category.');
                }
                setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
            }
            return { success: true, message: 'Category deleted successfully!' };
        } catch (err) {
            setError(err.message);
            console.error('Error deleting category:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [useMockData, handleLogout]); // Removed createApiUrl as apiClient handles URLs

    const handleSaveCategory = useCallback(async () => {
        if (!categoryForm.name.trim()) {
            return { success: false, error: 'Category name is required.' };
        }

        setSaving(true);
        setError(null);

        try {
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const categoryData = {
                    id: editingCategory ? editingCategory.id : `cat_${Date.now()}`,
                    name: categoryForm.name.trim(),
                    description: categoryForm.description.trim(),
                    type: categoryForm.type.trim(),
                    color: categoryForm.color,
                    isActive: categoryForm.isActive,
                    display_picture: categoryForm.display_picture_file ? URL.createObjectURL(categoryForm.display_picture_file) : categoryForm.display_picture,
                    productCount: editingCategory ? editingCategory.productCount : 0
                };
                setCategories(prevCategories => {
                    if (editingCategory) {
                        return prevCategories.map(c => c.id === editingCategory.id ? categoryData : c);
                    } else {
                        return [...prevCategories, categoryData];
                    }
                });
                setShowCategoryModal(false);
                return { success: true, message: 'Category saved successfully (mock).' };

            } else {
                const dataToSend = new FormData();
                dataToSend.append('name', categoryForm.name.trim());
                dataToSend.append('description', categoryForm.description.trim());
                dataToSend.append('is_displayed', categoryForm.isActive.toString());

                if (categoryForm.type) dataToSend.append('type', categoryForm.type.trim());
                if (categoryForm.color) dataToSend.append('color', categoryForm.color);

                if (categoryForm.display_picture_file) {
                    dataToSend.append('display_picture', categoryForm.display_picture_file);
                } else if (editingCategory && categoryForm.display_picture === null) {
                    dataToSend.append('display_picture', ''); // Clear image
                } else if (editingCategory && categoryForm.display_picture) {
                     // If existing, and no new file, don't append. apiClient will preserve it implicitly on PUT
                     // unless your backend requires explicit re-sending of the URL string.
                     // Generally, if a file field is empty on FormData, backend should ignore/preserve.
                }

                const endpoint = editingCategory
                    ? ENDPOINTS.MENU_CATEGORIES.UPDATE(editingCategory.id)
                    : ENDPOINTS.MENU_CATEGORIES.CREATE;

                const method = editingCategory ? 'PUT' : 'POST';

                // Use apiClient.post or apiClient.put directly with FormData
                const result = await (method === 'POST'
                    ? apiClient.post(endpoint, dataToSend)
                    : apiClient.put(endpoint, dataToSend));

                if (!result.success) {
                    if (result.status === 401) { handleLogout(); return; }
                    const errorMessage = result.error || (result.data?.errors ? Object.values(result.data.errors).flat().join(', ') : `Failed to ${editingCategory ? 'update' : 'create'} category`);
                    throw new Error(errorMessage);
                }

                const savedCategory = {
                    ...result.data,
                    isActive: result.data.is_displayed,
                    productCount: result.data.products_count || 0
                };
                setCategories(prevCategories => {
                    if (editingCategory) {
                        return prevCategories.map(c => c.id === editingCategory.id ? savedCategory : c);
                    } else {
                        return [...prevCategories, savedCategory];
                    }
                });
                setShowCategoryModal(false);
                return { success: true, message: 'Category saved successfully.' };
            }
        } catch (err) {
            setError(err.message);
            console.error('Error saving category:', err);
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    }, [categoryForm, editingCategory, useMockData, handleLogout]); // Removed apiRequest, createApiUrl

    const toggleCategoryStatus = useCallback(async (id) => {
        const category = categories.find(c => c.id === id);
        if (!category) {
            console.warn(`Category with ID ${id} not found for toggle.`);
            return { success: false, error: 'Category not found.' };
        }

        setLoading(true);
        setError(null);
        try {
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setCategories(prevCategories => prevCategories.map(c =>
                    c.id === id ? { ...c, isActive: !c.isActive } : c
                ));
            } else {
                const dataToSend = new FormData();
                // For PUT/PATCH, send all required fields, not just the one being changed.
                // Assuming backend expects these for a full PUT on this endpoint.
                dataToSend.append('name', category.name);
                dataToSend.append('description', category.description || '');
                dataToSend.append('type', category.type || '');
                dataToSend.append('color', category.color || '');
                dataToSend.append('is_displayed', (!category.isActive).toString()); // Toggled status

                if (category.display_picture) {
                    // Re-send existing picture URL if it exists and no new file,
                    // assuming backend handles this string as a URL for existing images.
                    // If backend expects a FILE only, this might need adjustment to not send if no new file.
                    dataToSend.append('display_picture', category.display_picture);
                }

                // Use apiClient.put directly
                const result = await apiClient.put(ENDPOINTS.MENU_CATEGORIES.UPDATE(id), dataToSend);

                if (!result.success) {
                    if (result.status === 401) { handleLogout(); return; }
                    throw new Error(result.error || 'Failed to update category status');
                }

                const updatedCategory = {
                    ...result.data,
                    isActive: result.data.is_displayed,
                    productCount: result.data.products_count || 0
                };
                setCategories(prevCategories => prevCategories.map(c =>
                    c.id === id ? updatedCategory : c
                ));
            }
            return { success: true, message: 'Category status updated successfully!' };
        } catch (err) {
            setError(err.message);
            console.error('Error updating category status:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [categories, useMockData, handleLogout]); // Removed apiRequest, createApiUrl

    const handleFieldChange = useCallback((field, value) => {
        setCategoryForm(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    return {
        categories,
        loading,
        error,
        saving,
        showCategoryModal,
        editingCategory,
        categoryForm,
        setCategories,
        setShowCategoryModal,
        setCategoryForm,
        handleAddCategory,
        handleEditCategory,
        handleDeleteCategory,
        handleSaveCategory,
        toggleCategoryStatus,
        handleFieldChange,
        fetchCategories,
        setError
    };
};