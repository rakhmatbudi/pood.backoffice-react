// src/services/apiClient.js
import { API_CONFIG } from '../config/api';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  // Helper method to create full URL
  createURL(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  // Helper method to handle delays for retry
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method with retry logic
  async request(endpoint, options = {}) {
    const url = this.createURL(endpoint);
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          success: true,
          data: data,
          status: response.status,
          headers: response.headers,
        };

      } catch (error) {
        lastError = error;
        console.warn(`API request attempt ${attempt} failed:`, error.message);
        
        // Don't retry on client errors (4xx) except 408, 429
        if (error.message.includes('HTTP 4') && 
            !error.message.includes('HTTP 408') && 
            !error.message.includes('HTTP 429')) {
          break;
        }
        
        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    return {
      success: false,
      error: lastError.message,
      data: null,
    };
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(this.createURL(endpoint));
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.request(url.pathname + url.search, {
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

  // Set authorization header for authenticated requests
  setAuthToken(token) {
    this.authToken = token;
  }

  // Get current auth token
  getAuthToken() {
    return this.authToken;
  }

  // Clear auth token
  clearAuthToken() {
    this.authToken = null;
  }

  // Add auth header to requests if token exists
  request(endpoint, options = {}) {
    if (this.authToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${this.authToken}`,
      };
    }
    return super.request ? super.request(endpoint, options) : this.baseRequest(endpoint, options);
  }

  // Base request method (renamed to avoid recursion)
  async baseRequest(endpoint, options = {}) {
    const url = this.createURL(endpoint);
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          success: true,
          data: data,
          status: response.status,
          headers: response.headers,
        };

      } catch (error) {
        lastError = error;
        console.warn(`API request attempt ${attempt} failed:`, error.message);
        
        if (error.message.includes('HTTP 4') && 
            !error.message.includes('HTTP 408') && 
            !error.message.includes('HTTP 429')) {
          break;
        }
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    return {
      success: false,
      error: lastError.message,
      data: null,
    };
  }
}

// Create and export a singleton instance
const apiClient = new APIClient();
export default apiClient;