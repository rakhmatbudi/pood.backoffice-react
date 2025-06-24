// src/App.js
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import LoginScreen from './components/LoginScreen';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  // Destructure loading and error from useAuth
  const {
    isAuthenticated,
    loginForm,
    showPassword,
    handleLogin,
    handleLogout,
    setLoginForm,
    setShowPassword,
    loading,
    error,
    currentUser,
    API_BASE_URL
  } = useAuth();

  // --- FIX IS HERE: Add menuItems to the destructuring ---
  const { currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, menuItems } = useNavigation();
  // --------------------------------------------------------

  if (!isAuthenticated) {
    return (
      <LoginScreen
        loginForm={loginForm}
        showPassword={showPassword}
        setLoginForm={setLoginForm}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      sidebarOpen={sidebarOpen}
      setCurrentPage={setCurrentPage}
      setSidebarOpen={setSidebarOpen}
      handleLogout={handleLogout}
      currentUser={currentUser}
      API_BASE_URL={API_BASE_URL}
      menuItems={menuItems} // Now 'menuItems' is correctly defined from useNavigation()
    />
  );
};

export default App;