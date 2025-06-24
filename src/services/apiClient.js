// src/services/apiClient.js
import { API_CONFIG } from '../config/api';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
    this.authToken = null; // Will be set by useAuth
  }

  // Helper method to create full URL
  createURL(endpoint) {
    // Ensure the endpoint starts with '/' if baseURL doesn't end with it, and vice versa.
    // This makes sure we don't end up with '//' or missing '/'.
    const cleanedBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanedBaseURL}${cleanedEndpoint}`;
  }

  // Helper method to handle delays for retry
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method with retry logic and auth handling
  async request(endpoint, options = {}) {
    const url = this.createURL(endpoint);
    
    // Prepare headers. Default to application/json only if a JSON body is expected.
    // If a FormData body is provided, the browser will automatically set the correct
    // 'Content-Type: multipart/form-data' header with the boundary.
    let headers = {
      'Accept': 'application/json', // Always accept JSON responses
      ...options.headers,
    };

    // Determine the body and Content-Type
    let bodyToSend = options.body;
    if (bodyToSend instanceof FormData) {
      // If it's FormData, let the browser handle Content-Type.
      // Ensure 'Content-Type' is not explicitly set in headers for FormData.
      delete headers['Content-Type'];
    } else if (typeof bodyToSend === 'object' && bodyToSend !== null) {
      // If it's a plain object, stringify it and set Content-Type to JSON.
      bodyToSend = JSON.stringify(bodyToSend);
      headers['Content-Type'] = 'application/json';
    } else {
      // For other body types (string, undefined), don't force Content-Type unless explicitly set.
      // If no body, 'Content-Type' might not be needed.
      if (!headers['Content-Type']) {
         delete headers['Content-Type']; // Remove if not explicitly set and not a JSON/FormData body
      }
    }


    // Add auth token if available (this.authToken is set by useAuth)
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Consolidated fetch options
    const fetchOptions = {
      method: options.method || 'GET', // Default to GET
      headers,
      body: bodyToSend, // Use the prepared body
      // signal will be added by the AbortController
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...fetchOptions, // Use the consolidated options
          signal: controller.signal, // Add signal for timeout
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorMessage = await this.getErrorMessage(response);
          // Special handling for 401 Unauthorized errors
          if (response.status === 401) {
            console.error("401 Unauthorized: Token invalid or expired. Please re-authenticate.");
            // Do NOT call clearAuthToken/handleLogout directly here.
            // Let the higher-level hooks (like useAuth, useCategories) decide
            // how to handle authentication errors (e.g., redirect to login).
            // This client should throw the error, and the hook should catch and act.
            throw new Error(`Unauthorized: ${errorMessage}`, { cause: 'unauthorized' }); // Add a cause for easier identification
          }
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }

        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text(); // Fallback to text for non-JSON responses
        }

        return {
          success: true,
          data: data,
          status: response.status,
          headers: response.headers,
        };

      } catch (error) {
        lastError = error;
        console.warn(`API request attempt ${attempt} failed to ${url}:`, error.message);
        
        // Don't retry on specific unrecoverable errors (e.g., explicit unauthorized error)
        if (error.cause === 'unauthorized') { // Check the custom cause for immediate break
            break;
        }
        // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (error.message.includes('HTTP 4') && 
            !error.message.includes('HTTP 408') && 
            !error.message.includes('HTTP 429')) {
          break; // Break if it's a non-retriable 4xx error
        }
        if (error.name === 'AbortError') {
          console.warn('Request timed out');
        }
        
        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * attempt; // Exponential backoff
          await this.delay(delay);
        } else {
            // Last attempt failed, no more retries.
            break;
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Unknown error occurred',
      data: null,
      status: lastError?.message?.includes('HTTP') ? parseInt(lastError.message.split(' ')[1]) : null, // Attempt to extract status for 401
    };
  }

  // Helper to extract error message from response
  async getErrorMessage(response) {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        // Look for common error message fields from various backends
        return errorData.message || errorData.error || errorData.detail || response.statusText;
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
      // Correctly form the finalEndpoint with search params.
      // This is crucial to send the full URL with query parameters to the `request` method.
      // `createURL` handles the base, so we just append search params.
      finalEndpoint = `${endpoint}?${url.searchParams.toString()}`;
    }

    return this.request(finalEndpoint, {
      method: 'GET',
      // No body for GET requests
    });
  }

  // POST request
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data, // Pass data as is, `request` method will handle JSON.stringify or FormData
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data, // Pass data as is
      ...options,
    });
  }

  // PATCH request
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data, // Pass data as is
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  // Authentication methods
  setAuthToken(token) {
    this.authToken = token;
    console.log('APIClient: Auth token set.');
  }

  getAuthToken() {
    return this.authToken;
  }

  clearAuthToken() {
    this.authToken = null;
    console.log('APIClient: Auth token cleared.');
  }

  // Health check method
  async healthCheck() {
    try {
      // Use a known health check endpoint. If '/health' is the exact endpoint:
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
      
      const response = await fetch(this.baseURL, { // Ping the base URL
        method: 'HEAD', // HEAD request is efficient for connectivity check
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