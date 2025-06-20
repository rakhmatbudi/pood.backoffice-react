// src/App.js
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import LoginScreen from './components/LoginScreen';
import DashboardLayout from './components/DashboardLayout'; // Assuming this component exists

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
    loading, // <--- New: Loading state
    error,   // <--- New: Error message
    currentUser, // <--- New: Current logged-in user data
    API_BASE_URL // <--- New: Base URL for API calls
  } = useAuth();

  const { currentPage, sidebarOpen, setCurrentPage, setSidebarOpen } = useNavigation();

  if (!isAuthenticated) {
    return (
      <LoginScreen
        loginForm={loginForm}
        showPassword={showPassword}
        setLoginForm={setLoginForm}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
        loading={loading} // <--- Pass loading state to LoginScreen
        error={error}   // <--- Pass error message to LoginScreen
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
      currentUser={currentUser} // Pass current user data to DashboardLayout
      API_BASE_URL={API_BASE_URL} // Pass API base URL if needed by sub-components
    />
  );
};

export default App;