// src/components/LoginScreen.js
import React from 'react';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

// Add 'loading' and 'error' to the destructured props
const LoginScreen = ({ loginForm, showPassword, setLoginForm, setShowPassword, handleLogin, loading, error }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Prevent login if already loading
      if (!loading) {
        handleLogin();
      }
    }
  };

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
              onKeyPress={handleKeyPress}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your username"
              required
              autoComplete="username"
              disabled={loading} // Disable input while loading
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
                onKeyPress={handleKeyPress}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading} // Disable input while loading
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading} // Disable button while loading
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Display error message */}
          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            // Dynamically change button appearance based on loading state
            className={`w-full py-2 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base ${
              loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Pood Restaurant Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;