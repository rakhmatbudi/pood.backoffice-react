// src/components/pages/ProductsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, Package, RefreshCw, AlertCircle, Eye, EyeOff, 
  Search, BarChart3, Filter, Image, DollarSign, Tag,
  ShoppingBag, Star, Clock, CheckCircle, XCircle
} from 'lucide-react';
import ProductModal from '../modals/ProductModal';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal and form state
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

  // Fetch products using the service
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await productService.getProducts();
      
      if (result.success) {
        const transformedProducts = productService.transformProductsData(result.data);
        setProducts(transformedProducts);
        setTotalCount(result.totalCount);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in fetchProducts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategories();
      if (result.success) {
        const transformedCategories = categoryService.transformCategoriesData(result.data);
        setCategories(transformedCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch product statistics
  const fetchStats = async () => {
    try {
      const result = await productService.getProductStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

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

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const result = await productService.deleteProduct(productId);
      
      if (result.success) {
        setProducts(prev => prev.filter(product => product.id !== productId));
        setTotalCount(prev => prev - 1);
        fetchStats();
        console.log('Product deleted successfully');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  // Handle save product with file upload using existing API
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let result;
      
      if (productForm.image) {
        const formData = productService.prepareFormData({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          categoryId: parseInt(productForm.category),
          isActive: productForm.isActive,
        }, productForm.image);
        
        if (editingProduct) {
          result = await productService.updateProductWithImage(editingProduct.id, formData);
        } else {
          result = await productService.createProductWithImage(formData);
        }
      } else {
        const productData = {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          categoryId: parseInt(productForm.category),
          isActive: productForm.isActive,
          imagePath: productForm.imagePreview && !productForm.image ? productForm.imagePreview : null,
        };

        if (editingProduct) {
          result = await productService.updateProduct(editingProduct.id, productData);
        } else {
          result = await productService.createProduct(productData);
        }
      }

      if (result.success) {
        setShowProductModal(false);
        fetchProducts();
        fetchStats();
      } else {
        alert(result.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please try again.');
    }
  };

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

  // Memoize filtered products to prevent unnecessary re-calculations
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category && product.category.id.toString() === selectedCategory
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product =>
        statusFilter === 'active' ? product.isActive : !product.isActive
      );
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under25k':
          filtered = filtered.filter(p => p.price < 25000);
          break;
        case '25k-50k':
          filtered = filtered.filter(p => p.price >= 25000 && p.price < 50000);
          break;
        case '50k-100k':
          filtered = filtered.filter(p => p.price >= 50000 && p.price < 100000);
          break;
        case 'over100k':
          filtered = filtered.filter(p => p.price >= 100000);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, statusFilter, priceFilter, sortBy, sortOrder]);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get price display (with variants consideration)
  const getPriceDisplay = (product) => {
    if (product.hasVariants && product.variants.length > 0) {
      const activeVariants = product.variants.filter(v => v.isActive);
      if (activeVariants.length > 0) {
        const minPrice = Math.min(...activeVariants.map(v => v.price));
        const maxPrice = Math.max(...activeVariants.map(v => v.price));
        
        if (minPrice === maxPrice) {
          return formatPrice(minPrice);
        } else {
          return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
        }
      }
    }
    return formatPrice(product.price);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (productForm.imagePreview && productForm.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(productForm.imagePreview);
      }
    };
  }, [productForm.imagePreview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Products</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your menu items and products ({totalCount} total)
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={fetchProducts}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleAddProduct}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && stats && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Statistics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.withVariants}</div>
              <div className="text-sm text-gray-600">With Variants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.withImages}</div>
              <div className="text-sm text-gray-600">With Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatPrice(stats.averagePrice)}</div>
              <div className="text-sm text-gray-600">Avg Price</div>
            </div>
          </div>
          
          {/* Price Range Distribution */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">{stats.priceRanges.under25k}</div>
              <div className="text-xs text-gray-500">Under 25K</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">{stats.priceRanges['25k-50k']}</div>
              <div className="text-xs text-gray-500">25K - 50K</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">{stats.priceRanges['50k-100k']}</div>
              <div className="text-xs text-gray-500">50K - 100K</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">{stats.priceRanges.over100k}</div>
              <div className="text-xs text-gray-500">Over 100K</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="under25k">Under 25K</option>
              <option value="25k-50k">25K - 50K</option>
              <option value="50k-100k">50K - 100K</option>
              <option value="over100k">Over 100K</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' || priceFilter !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-600">×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-green-600">×</button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-purple-600">×</button>
              </span>
            )}
            {priceFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Price: {priceFilter}
                <button onClick={() => setPriceFilter('all')} className="ml-1 hover:text-orange-600">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStatusFilter('all');
                setPriceFilter('all');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">#{product.id}</span>
                      {product.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                  </div>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="ml-2 text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                    title="Edit product"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="mt-1">
                      {product.category ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          <Tag className="w-3 h-3 mr-1" />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No category</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <div className="font-semibold text-orange-600 mt-1">
                      {getPriceDisplay(product)}
                    </div>
                    {product.hasVariants && (
                      <div className="text-xs text-gray-500">
                        Base: {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                  
                  {product.hasVariants && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Variants:</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {product.variants.length} total, {product.activeVariantsCount} active
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {product.updatedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Updated: {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">ID</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Name</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Category</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Price</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Variants</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Status</th>
                <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 lg:px-6">
                    <span className="text-sm font-mono text-gray-600">
                      #{product.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <div className="font-semibold text-gray-800 text-sm lg:text-base">
                      {product.name}
                    </div>
                    {product.updatedAt && (
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(product.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    {product.category ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No category</span>
                    )}
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <div>
                      <span className="font-semibold text-orange-600 text-sm lg:text-base">
                        {getPriceDisplay(product)}
                      </span>
                      {product.hasVariants && (
                        <div className="text-xs text-gray-500">
                          Base: {formatPrice(product.price)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    {product.hasVariants ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {product.variants.length} total
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.activeVariantsCount} active
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No variants</span>
                    )}
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    {product.isActive ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="Edit product"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 px-4">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' || priceFilter !== 'all'
                ? 'No matching products found'
                : 'No products found'
              }
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' || priceFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding your first product to the menu'
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {(searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' || priceFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                    setPriceFilter('all');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center justify-center"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleAddProduct}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        )}
      </div>

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