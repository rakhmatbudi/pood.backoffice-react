import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, LogOut, Eye, EyeOff, Menu, X, BarChart3, Package, TrendingUp, Users, DollarSign } from 'lucide-react';

const PoodBackoffice = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      category: 'food',
      price: 25000,
      description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
      stock: 50,
      image: 'https://via.placeholder.com/100x100?text=Nasi+Goreng',
      isActive: true
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      category: 'drink',
      price: 5000,
      description: 'Teh manis dingin yang menyegarkan',
      stock: 100,
      image: 'https://via.placeholder.com/100x100?text=Es+Teh',
      isActive: true
    },
    {
      id: 3,
      name: 'Ayam Bakar',
      category: 'food',
      price: 30000,
      description: 'Ayam bakar dengan bumbu khas dan sambal',
      stock: 25,
      image: 'https://via.placeholder.com/100x100?text=Ayam+Bakar',
      isActive: false
    },
    {
      id: 4,
      name: 'Gado-gado',
      category: 'food',
      price: 20000,
      description: 'Sayuran segar dengan bumbu kacang',
      stock: 30,
      image: 'https://via.placeholder.com/100x100?text=Gado-gado',
      isActive: true
    },
    {
      id: 5,
      name: 'Jus Jeruk',
      category: 'drink',
      price: 8000,
      description: 'Jus jeruk segar tanpa gula tambahan',
      stock: 75,
      image: 'https://via.placeholder.com/100x100?text=Jus+Jeruk',
      isActive: true
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'food',
    price: '',
    description: '',
    stock: '',
    image: '',
    isActive: true
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package }
  ];

  const handleLogin = () => {
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
      setCurrentPage('dashboard');
    } else {
      alert('Invalid credentials. Use username: admin, password: password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    setCurrentPage('dashboard');
    setSidebarOpen(false);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'food',
      price: '',
      description: '',
      stock: '',
      image: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
      image: product.image,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.stock) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: productForm.name,
              category: productForm.category,
              price: parseInt(productForm.price),
              description: productForm.description,
              stock: parseInt(productForm.stock),
              image: productForm.image || 'https://via.placeholder.com/100x100?text=Product',
              isActive: productForm.isActive
            }
          : p
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: productForm.name,
        category: productForm.category,
        price: parseInt(productForm.price),
        description: productForm.description,
        stock: parseInt(productForm.stock),
        image: productForm.image || 'https://via.placeholder.com/100x100?text=Product',
        isActive: productForm.isActive
      };
      setProducts([...products, newProduct]);
    }
    
    setShowModal(false);
  };

  const toggleProductStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calculate dashboard stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const foodProducts = products.filter(p => p.category === 'food').length;
  const drinkProducts = products.filter(p => p.category === 'drink').length;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Pood Backoffice</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Admin Dashboard Login</p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
            >
              Login
            </button>
          </div>
          
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Demo credentials:<br />
              Username: <strong>admin</strong><br />
              Password: <strong>password</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <div className="bg-orange-100 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Pood Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                  currentPage === item.id 
                    ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {currentPage}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {currentPage === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Pood Dashboard</h3>
                <p className="text-gray-600">Overview of your restaurant operations</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Products</p>
                      <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Food Items</span>
                      </div>
                      <span className="font-semibold text-gray-900">{foodProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Drink Items</span>
                      </div>
                      <span className="font-semibold text-gray-900">{drinkProducts}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Product inventory updated</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">New products added to menu</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Stock levels checked</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('products')}
                    className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Manage Products →
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'products' && (
            <div>
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your restaurant's food and drink items</p>
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                        />
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit2 size={14} className="sm:hidden" />
                            <Edit2 size={16} className="hidden sm:block" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={14} className="sm:hidden" />
                            <Trash2 size={16} className="hidden sm:block" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3 sm:mb-4">
                        <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-orange-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.category === 'food' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {product.category === 'food' ? 'Food' : 'Drink'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Stock: {product.stock}
                        </span>
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (IDR)
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({...productForm, isActive: e.target.checked})}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active (available for ordering)
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoodBackoffice;