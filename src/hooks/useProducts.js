// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS, ERROR_MESSAGES } from '../config/api'; // API_CONFIG is used by apiClient
import { useAuth } from './useAuth'; // Import useAuth hook
import apiClient from '../services/apiClient'; // <-- Import the apiClient instance

export const useProducts = () => {
    // We only need handleLogout from useAuth to trigger global logout on 401s.
    // getToken is no longer needed here as apiClient internally manages the token.
    const { handleLogout } = useAuth();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for products
    const [categoriesLoading, setCategoriesLoading] = useState(true); // Loading state for categories
    const [error, setError] = useState(null); // General error state for the hook

    // Removed: createApiUrl is no longer needed as apiClient handles full URLs.
    // Removed: apiRequest is no longer needed as we use apiClient directly.

    /**
     * Fetches product categories from the API.
     */
    const fetchCategories = useCallback(async () => {
        setCategoriesLoading(true);
        setError(null); // Clear any previous errors
        try {
            console.log('🔍 Fetching categories using apiClient from:', ENDPOINTS.MENU_CATEGORIES.LIST);

            // Use apiClient.get directly
            const result = await apiClient.get(ENDPOINTS.MENU_CATEGORIES.LIST);

            if (!result.success) {
                // If the error is 401 Unauthorized, trigger global logout
                if (result.status === 401) {
                    console.error("401 Unauthorized during categories fetch. Logging out.");
                    handleLogout();
                    return; // Stop further processing as logout handles redirection/state
                }
                throw new Error(result.error || 'Failed to fetch categories.');
            }

            let categoriesData = [];
            // Handle various possible response structures from the API
            if (Array.isArray(result.data)) {
                categoriesData = result.data;
            } else if (result.data && Array.isArray(result.data.data)) { // Common for some APIs that wrap data in another 'data' field
                categoriesData = result.data.data;
            } else if (result.data && Array.isArray(result.data.results)) { // For Django REST Framework pagination
                categoriesData = result.data.results;
            } else {
                console.warn('⚠️ Unexpected categories response structure:', result.data);
                categoriesData = [];
            }

            // Map API response to a consistent frontend format
            const mappedCategories = categoriesData.map(category => {
                return {
                    ...category,
                    id: category.id,
                    name: category.name,
                    description: category.description || '',
                    isActive: category.is_displayed, // Map backend 'is_displayed' to frontend 'isActive'
                    // Keep original field names for potential API calls (or remove if not directly used)
                    is_displayed: category.is_displayed,
                    menu_category_group: category.menu_category_group,
                    sku_id: category.sku_id,
                    is_highlight: category.is_highlight,
                    is_display_for_self_order: category.is_display_for_self_order,
                    display_picture: category.display_picture,
                    created_at: category.created_at,
                    updated_at: category.updated_at
                };
            });

            console.log('✅ Processed categories:', mappedCategories);
            console.log('📊 Categories count:', mappedCategories.length);
            console.log('🎯 Active categories:', mappedCategories.filter(c => c.isActive).length);

            setCategories(mappedCategories);
        } catch (err) {
            console.error('❌ Error fetching categories:', err);
            // Only set general error state if it's not the UNAUTHORIZED error
            if (err.message !== ERROR_MESSAGES.UNAUTHORIZED) {
                setError(err.message);
            }
            setCategories([]); // Set empty array on error to prevent app crashes
        } finally {
            setCategoriesLoading(false);
        }
    }, [handleLogout]); // Dependencies for useCallback: Only handleLogout as apiClient is stable.

    /**
     * Fetches products from the API.
     */
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            console.log('🔍 Fetching products using apiClient from:', ENDPOINTS.PRODUCTS.LIST);

            // Use apiClient.get directly
            const result = await apiClient.get(ENDPOINTS.PRODUCTS.LIST);

            if (!result.success) {
                if (result.status === 401) {
                    console.error("401 Unauthorized during products fetch. Logging out.");
                    handleLogout();
                    return;
                }
                throw new Error(result.error || 'Failed to fetch products.');
            }

            let productsData = [];
            // Handle various possible response structures from the API
            if (Array.isArray(result.data)) {
                productsData = result.data;
            } else if (result.data && Array.isArray(result.data.data)) { // Common for some APIs that wrap data in another 'data' field
                productsData = result.data.data;
            } else if (result.data && Array.isArray(result.data.results)) {
                productsData = result.data.results;
            } else {
                productsData = []; // Default to empty array if unexpected structure
            }

            // Map API response to a consistent frontend format
            const mappedProducts = productsData.map(product => {
                // Map product variants if they exist
                const mappedVariants = product.variants ? product.variants.map(variant => ({
                    ...variant,
                    isActive: variant.is_active, // Map variant 'is_active' to 'isActive'
                    is_active: variant.is_active, // Keep original for API calls
                })) : [];

                return {
                    ...product, // Keep all original product fields
                    isActive: product.is_active, // Map product 'is_active' to 'isActive'
                    image: product.image_path || product.image || '', // Prefer image_path, fallback to image
                    category: product.category, // Keep original category object
                    categoryId: product.category?.id || null, // Extract category ID
                    categoryName: product.category?.name || '', // Extract category name
                    categoryData: product.category, // Keep full category object if useful
                    variants: mappedVariants, // Mapped variants
                    hasVariants: mappedVariants.length > 0,
                    activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
                    updatedAt: product.updated_at,
                    createdAt: product.created_at,
                };
            });

            console.log('✅ Fetched products:', mappedProducts.length);
            setProducts(mappedProducts);
        } catch (err) {
            console.error('❌ Error fetching products:', err);
            if (err.message !== ERROR_MESSAGES.UNAUTHORIZED) {
                setError(err.message);
            }
            setProducts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, [handleLogout]); // Dependencies for useCallback: Only handleLogout as apiClient is stable.

    /**
     * Effect hook to fetch products and categories on component mount.
     */
    useEffect(() => {
        fetchCategories(); // Fetch categories when hook mounts
        fetchProducts(); // Fetch products when hook mounts
    }, [fetchCategories, fetchProducts]); // Dependencies: ensure these functions are stable

    /**
     * Handles the deletion of a product.
     * @param {string} id - The ID of the product to delete.
     * @returns {object} - An object indicating success or failure.
     */
    const handleDeleteProduct = useCallback(async (id) => {
        // Removed window.confirm. Caller (component) should handle confirmation UI.
        try {
            // Use apiClient.delete directly
            const result = await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));

            if (!result.success) {
                if (result.status === 401) { handleLogout(); return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED }; }
                throw new Error(result.error || 'Failed to delete product.');
            }

            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
            // Removed alert(). Caller (component) should provide user feedback.
            return { success: true, message: 'Product deleted successfully!' };
        } catch (err) {
            console.error('Error deleting product:', err);
            return { success: false, error: err.message };
        }
    }, [handleLogout]); // Dependencies for useCallback: Only handleLogout as apiClient is stable.

    /**
     * Saves a product (creates new or updates existing).
     * @param {object | FormData} productData - The product data to save. Can be an object or FormData.
     * @param {boolean} isEditing - True if updating an existing product.
     * @param {string} editingProductId - The ID of the product being edited (if isEditing is true).
     * @returns {object} - An object indicating success or failure.
     */
    const saveProduct = useCallback(async (productData, isEditing = false, editingProductId = null) => {
        try {
            console.log('💾 Saving product with data:', productData);
            let result; // To hold the API response data

            if (isEditing && editingProductId) {
                // Update existing product using apiClient.put
                result = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(editingProductId), productData);
            } else {
                // Create new product using apiClient.post
                result = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, productData);
            }

            if (!result.success) {
                if (result.status === 401) { handleLogout(); return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED }; }
                // Backend might return validation errors in result.data.errors or similar
                const errorMessage = result.error || (result.data?.errors ? Object.values(result.data.errors).flat().join(', ') : 'Failed to save product.');
                throw new Error(errorMessage);
            }

            // Map the API response back to the frontend's consistent format
            const mapApiResponseToProduct = (apiProduct) => {
                const mappedVariants = apiProduct.variants ? apiProduct.variants.map(variant => ({
                    ...variant,
                    isActive: variant.is_active,
                    is_active: variant.is_active,
                })) : [];

                return {
                    ...apiProduct,
                    isActive: apiProduct.is_active,
                    image: apiProduct.image_path || apiProduct.image || '',
                    category: apiProduct.category,
                    categoryId: apiProduct.category?.id || null,
                    categoryName: apiProduct.category?.name || '',
                    categoryData: apiProduct.category,
                    variants: mappedVariants,
                    hasVariants: mappedVariants.length > 0,
                    activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
                    updatedAt: apiProduct.updated_at,
                    createdAt: apiProduct.created_at,
                };
            };

            const mappedProduct = mapApiResponseToProduct(result.data);

            setProducts(prevProducts => {
                if (isEditing) {
                    return prevProducts.map(p =>
                        p.id === editingProductId ? mappedProduct : p
                    );
                } else {
                    return [...prevProducts, mappedProduct];
                }
            });

            return { success: true, message: 'Product saved successfully!' };
        } catch (err) {
            console.error('Error saving product:', err);
            return { success: false, error: err.message };
        }
    }, [handleLogout]); // Dependencies for useCallback: Only handleLogout as apiClient is stable.

    /**
     * Toggles the active status of a product.
     * @param {string} id - The ID of the product to toggle.
     * @returns {object} - An object indicating success or failure.
     */
    const toggleProductStatus = useCallback(async (id) => {
        try {
            // Find the product to get its current state and other necessary fields for PUT
            const product = products.find(p => p.id === id);
            if (!product) {
                throw new Error("Product not found for status toggle.");
            }

            // Create a payload with the new 'is_active' status and other required fields for PUT.
            // Ensure dataToSend is a plain object for JSON.stringify by apiClient OR a FormData object.
            // Since this is likely a PATCH operation (partial update) but your backend might expect PUT,
            // we send all original fields plus the changed 'is_active'.
            const dataToSend = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                is_active: !product.isActive, // Toggle status
                category: product.categoryId || product.category?.id, // Send category ID
                image_path: product.image || '', // Send image path
                stock: product.stock || 0, // Send stock
                // Add any other required fields for a PUT request
                sku_id: product.sku_id || null,
                is_featured: product.is_featured || false,
                is_display_for_self_order: product.is_display_for_self_order || false,
                is_highlight: product.is_highlight || false,
                menu_category_group: product.menu_category_group || null
            };

            // Use apiClient.put directly
            const result = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), dataToSend);

            if (!result.success) {
                if (result.status === 401) { handleLogout(); return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED }; }
                throw new Error(result.error || 'Failed to update product status');
            }

            const mapApiResponseToProduct = (apiProduct) => {
                const mappedVariants = apiProduct.variants ? apiProduct.variants.map(variant => ({
                    ...variant,
                    isActive: variant.is_active,
                    is_active: variant.is_active,
                })) : [];

                return {
                    ...apiProduct,
                    isActive: apiProduct.is_active,
                    image: apiProduct.image_path || apiProduct.image || '',
                    category: apiProduct.category,
                    categoryId: apiProduct.category?.id || null,
                    categoryName: apiProduct.category?.name || '',
                    categoryData: apiProduct.category,
                    variants: mappedVariants,
                    hasVariants: mappedVariants.length > 0,
                    activeVariantsCount: mappedVariants.filter(v => v.isActive).length,
                    updatedAt: apiProduct.updated_at,
                    createdAt: apiProduct.created_at,
                };
            };
            const mappedProduct = mapApiResponseToProduct(result.data);

            setProducts(prevProducts => prevProducts.map(p =>
                p.id === id ? mappedProduct : p
            ));
            // Removed alert(). Caller (component) should provide user feedback.
            return { success: true, message: 'Product status updated successfully!' };
        } catch (err) {
            console.error('Error updating product status:', err);
            return { success: false, error: err.message };
        }
    }, [products, handleLogout]); // `products` is required here to find the product object

    // Return all states and functions that components using this hook might need
    return {
        products,
        categories,
        loading, // Loading state for products
        categoriesLoading, // Loading state for categories
        error, // General error state

        // API functions
        fetchProducts,
        fetchCategories, // Expose fetchCategories as well
        handleDeleteProduct,
        saveProduct,
        toggleProductStatus,
    };
};
