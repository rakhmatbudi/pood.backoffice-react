// src/App.js
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import LoginScreen from './components/LoginScreen';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const { isAuthenticated, loginForm, showPassword, handleLogin, handleLogout, setLoginForm, setShowPassword } = useAuth();
  const { currentPage, sidebarOpen, setCurrentPage, setSidebarOpen } = useNavigation();

  if (!isAuthenticated) {
    return (
      <LoginScreen
        loginForm={loginForm}
        showPassword={showPassword}
        setLoginForm={setLoginForm}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
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
    />
  );
};

export default App;