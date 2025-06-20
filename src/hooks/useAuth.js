// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls

// Define your backend API base URL directly
// For a production app, it's still recommended to use environment variables
const API_LOGIN_URL = 'https://api.pood.lol/users/login'; // Direct URL for the login endpoint

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' }); // Using 'username' in form for email input
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState('');     // State for error messages
    const [currentUser, setCurrentUser] = useState(null); // Stores logged-in user data
    // Assuming API_BASE_URL might be needed elsewhere, derive it or define it separately
    const API_BASE_URL = 'https://api.pood.lol'; // General base for other API calls if needed

    // Effect to check for an existing token and user data on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a production app, you would ideally validate this token with your backend
            // (e.g., by calling a /users/me endpoint that requires the token)
            setIsAuthenticated(true);
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setCurrentUser(storedUser);
            } catch (e) {
                console.error("Failed to parse stored user data from localStorage:", e);
                // Clear corrupted data and reset auth status
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('tenantInfo');
                setIsAuthenticated(false);
            }
        }
    }, []);

    const handleLogin = async () => {
        setLoading(true); // Start loading
        setError('');     // Clear any previous errors

        try {
            // Make the API call to your specific login endpoint
            // The API expects 'email' and 'password' in the body
            const response = await axios.post(API_LOGIN_URL, {
                email: loginForm.username, // Map frontend 'username' input to backend 'email'
                password: loginForm.password,
            });

            // Assuming your backend sends back 'token', 'user' details, and 'tenant' info
            // Access the 'data' property of the response, then 'data' again if nested
            const { token, user, tenant } = response.data.data; 

            // Store the token and user information in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('tenantInfo', JSON.stringify(tenant)); // Store tenant info if applicable

            setIsAuthenticated(true);         // Set authentication status to true
            setCurrentUser(user);             // Store the user data
            setLoginForm({ username: '', password: '' }); // Clear the login form
            
        } catch (err) {
            console.error('Login error:', err);
            // Extract a user-friendly error message from the API response
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Use the specific error message from your API
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
            setIsAuthenticated(false); // Ensure authentication status is false on error
            setCurrentUser(null);      // Clear current user data on error
        } finally {
            setLoading(false); // Stop loading, regardless of success or failure
        }
    };

    const handleLogout = () => {
        // Clear all stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenantInfo'); // Clear tenant info
        setIsAuthenticated(false);
        setCurrentUser(null);
        setError(''); // Clear any pending error messages on logout
    };

    return {
        isAuthenticated,
        loginForm,
        showPassword,
        loading,      // Return loading state
        error,        // Return error message
        currentUser,  // Return current user data
        setLoginForm,
        setShowPassword,
        handleLogin,
        handleLogout,
        API_BASE_URL // General API base, if other parts of the app need it
    };
};