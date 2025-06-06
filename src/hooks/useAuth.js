// src/hooks/useAuth.js
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = () => {
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid credentials. Use username: admin, password: password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  return {
    isAuthenticated,
    loginForm,
    showPassword,
    handleLogin,
    handleLogout,
    setLoginForm,
    setShowPassword
  };
};