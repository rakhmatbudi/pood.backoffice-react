// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient'; // <-- Import the apiClient instance

// Define your backend API base URL directly
const API_LOGIN_URL = 'https://api.pood.lol/users/login';
const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';
const TENANT_STORAGE_KEY = 'tenantInfo';


export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const API_BASE_URL = 'https://api.pood.lol'; // General base for other API calls if needed

    // Helper function to get the token from localStorage
    const getToken = useCallback(() => {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }, []);

    // Effect to check for an existing token and user data on component mount
    // And to set the token on apiClient immediately
    useEffect(() => {
        const token = getToken();
        if (token) {
            // Set the token on the apiClient instance immediately
            apiClient.setAuthToken(token);
            setIsAuthenticated(true);
            try {
                const storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
                setCurrentUser(storedUser);
            } catch (e) {
                console.error("Failed to parse stored user data from localStorage:", e);
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem(TENANT_STORAGE_KEY);
                setIsAuthenticated(false);
                apiClient.clearAuthToken(); // Also clear from apiClient if local storage is corrupt
            }
        }
    }, [getToken]); // getToken is stable due to useCallback

    const handleLogin = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(API_LOGIN_URL, {
                email: loginForm.username,
                password: loginForm.password,
            });

            const { token, user, tenant } = response.data.data;

            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));

            // Set the token on the apiClient instance here after successful login
            apiClient.setAuthToken(token);

            setIsAuthenticated(true);
            setCurrentUser(user);
            setLoginForm({ username: '', password: '' });

        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
            setIsAuthenticated(false);
            setCurrentUser(null);
            apiClient.clearAuthToken(); // Clear token from apiClient on login failure
        } finally {
            setLoading(false);
        }
    }, [loginForm.username, loginForm.password]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TENANT_STORAGE_KEY);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setError('');
        apiClient.clearAuthToken(); // <-- Clear the token from the apiClient instance
    }, []);

    return {
        isAuthenticated,
        loginForm,
        showPassword,
        loading,
        error,
        currentUser,
        setLoginForm,
        setShowPassword,
        handleLogin,
        handleLogout,
        API_BASE_URL,
        getToken
    };
};