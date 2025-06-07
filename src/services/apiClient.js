// src/services/apiClient.js
import { API_CONFIG } from '../config/api';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
    this.authToken = null;
  }

  // Helper method to create full URL
  createURL(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  // Helper method to handle delays for retry
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method with retry logic and auth handling
  async request(endpoint, options = {}) {
    const url = this.createURL(endpoint);
    
    // Prepare headers with auth token if available
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const config = {
      timeout: this.timeout,
      headers,
      ...options,
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        // Handle different response types
        if (!response.ok) {
          const errorMessage = await this.getErrorMessage(response);
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }

        // Try to parse JSON, fallback to text if needed
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        return {
          success: true,
          data: data,
          status: response.status,
          headers: response.headers,
        };

      } catch (error) {
        lastError = error;
        console.warn(`API request attempt ${attempt} failed:`, error.message);
        
        // Don't retry on client errors (4xx) except 408 (timeout), 429 (rate limit), and network errors
        if (error.name === 'AbortError') {
          console.warn('Request timed out');
        } else if (error.message.includes('HTTP 4') && 
                   !error.message.includes('HTTP 408') && 
                   !error.message.includes('HTTP 429')) {
          // Don't retry client errors except timeout and rate limit
          break;
        }
        
        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * attempt; // Exponential backoff
          await this.delay(delay);
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Unknown error occurred',
      data: null,
    };
  }

  // Helper to extract error message from response
  async getErrorMessage(response) {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        return errorData.message || errorData.error || response.statusText;
      } else {
        const textError = await response.text();
        return textError || response.statusText;
      }
    } catch (e) {
      return response.statusText;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    let finalEndpoint = endpoint;
    
    // Add query parameters if provided
    if (Object.keys(params).length > 0) {
      const url = new URL(this.createURL(endpoint));
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
      // Extract just the path and search from the URL
      finalEndpoint = url.pathname.replace(this.baseURL.replace(/https?:\/\/[^\/]+/, ''), '') + url.search;
    }

    return this.request(finalEndpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication methods
  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthToken() {
    return this.authToken;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  // Health check method
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Method to check if API is reachable
  async ping() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for ping
      
      const response = await fetch(this.baseURL, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get API configuration
  getConfig() {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      hasAuthToken: !!this.authToken,
    };
  }

  // Update configuration
  updateConfig(newConfig) {
    if (newConfig.baseURL) this.baseURL = newConfig.baseURL;
    if (newConfig.timeout) this.timeout = newConfig.timeout;
    if (newConfig.retryAttempts) this.retryAttempts = newConfig.retryAttempts;
    if (newConfig.retryDelay) this.retryDelay = newConfig.retryDelay;
  }
}

// Create and export a singleton instance
const apiClient = new APIClient();
export default apiClient;