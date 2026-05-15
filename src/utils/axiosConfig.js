/**
 * Axios Configuration and Interceptors
 * Handles request/response interceptors, error handling, authentication token injection,
 * and request/response logging for all API calls
 * 
 * Requirements: 6.5, 6.6, 7.5, 7.6
 */

import axios from 'axios';

/**
 * Configuration for API requests
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  ENABLE_LOGGING: process.env.NODE_ENV !== 'production',
  TOKEN_STORAGE_KEY: 'gym-auth-token',
  USER_STORAGE_KEY: 'gym-auth-user',
};

/**
 * Logger utility for API requests and responses
 */
class APILogger {
  /**
   * Log outgoing request
   * @param {Object} config - Axios request config
   */
  static logRequest(config) {
    if (!API_CONFIG.ENABLE_LOGGING) return;

    const logData = {
      timestamp: new Date().toISOString(),
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      headers: this.sanitizeHeaders(config.headers),
    };

    console.log('[API Request]', logData);
  }

  /**
   * Log incoming response
   * @param {Object} response - Axios response object
   */
  static logResponse(response) {
    if (!API_CONFIG.ENABLE_LOGGING) return;

    const logData = {
      timestamp: new Date().toISOString(),
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataSize: JSON.stringify(response.data).length,
    };

    console.log('[API Response]', logData);
  }

  /**
   * Log error
   * @param {Object} error - Axios error object
   */
  static logError(error) {
    if (!API_CONFIG.ENABLE_LOGGING) return;

    const logData = {
      timestamp: new Date().toISOString(),
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      errorData: error.response?.data,
    };

    console.error('[API Error]', logData);
  }

  /**
   * Sanitize headers to remove sensitive data
   * @param {Object} headers - Request headers
   * @returns {Object} - Sanitized headers
   */
  static sanitizeHeaders(headers) {
    if (!headers) return headers;

    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}

/**
 * Create Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log request
    APILogger.logRequest(config);

    // Add authentication token
    const token = localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    APILogger.logError(error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles response validation and error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response
    APILogger.logResponse(response);

    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log(`[API Duration] ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }

    return response;
  },
  (error) => {
    // Log error
    APILogger.logError(error);

    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          handleUnauthorized();
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not Found
          console.error('Resource not found:', data.message);
          break;

        case 500:
          // Server Error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.message);
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Handle unauthorized errors (401)
 * Clears auth data and redirects to login
 */
function handleUnauthorized() {
  // Clear authentication data
  localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
  localStorage.removeItem(API_CONFIG.USER_STORAGE_KEY);

  // Redirect to login page if not already there
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/**
 * Get authentication token
 * @returns {string|null} - Authentication token or null
 */
export function getAuthToken() {
  return localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
}

/**
 * Set authentication token
 * @param {string} token - Authentication token
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
  }
}

/**
 * Clear authentication data
 */
export function clearAuthData() {
  localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
  localStorage.removeItem(API_CONFIG.USER_STORAGE_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Format pagination parameters
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} - Formatted pagination { page, limit, skip }
 */
export function formatPaginationParams(page = 1, limit = 10) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));

  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum,
  };
}

/**
 * Format filter parameters
 * @param {Object} filters - Filter object
 * @param {Array} allowedFilters - Array of allowed filter keys
 * @returns {Object} - Formatted filters
 */
export function formatFilterParams(filters = {}, allowedFilters = []) {
  const formatted = {};

  allowedFilters.forEach((key) => {
    if (filters.hasOwnProperty(key) && filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      formatted[key] = filters[key];
    }
  });

  return formatted;
}

/**
 * Format sort parameters
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @param {Array} allowedFields - Array of allowed sort fields
 * @returns {Object} - Formatted sort { sortBy, sortOrder }
 */
export function formatSortParams(sortBy = 'createdAt', sortOrder = 'desc', allowedFields = []) {
  const field = allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';

  return {
    sortBy: field,
    sortOrder: order,
  };
}

/**
 * Build query parameters object
 * @param {Object} params - Query parameters
 * @returns {Object} - Cleaned query parameters
 */
export function buildQueryParams(params = {}) {
  const cleaned = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

/**
 * Handle API error response
 * @param {Object} error - Axios error object
 * @returns {Object} - Formatted error object { message, status, data }
 */
export function handleAPIError(error) {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || error.response.statusText || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
      data: null,
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'An error occurred',
      status: 0,
      data: null,
    };
  }
}

/**
 * Retry failed request with exponential backoff
 * @param {Function} requestFn - Function that makes the API request
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise} - Result of the request
 */
export async function retryRequest(requestFn, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // Don't retry if we've exhausted retries
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      if (API_CONFIG.ENABLE_LOGGING) {
        console.log(`[API Retry] Attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Validate response data
 * @param {Object} data - Response data
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result { valid: boolean, errors: Array }
 */
export function validateResponseData(data, requiredFields = []) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: ['Response data must be an object'],
    };
  }

  requiredFields.forEach((field) => {
    if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Transform API response to standardized format
 * @param {Object} response - Axios response object
 * @returns {Object} - Transformed response { success, data, message }
 */
export function transformResponse(response) {
  const { data } = response;

  // If response already has success field, return as is
  if (data && typeof data === 'object' && data.hasOwnProperty('success')) {
    return data;
  }

  // Otherwise, wrap in standardized format
  return {
    success: true,
    data: data,
    message: 'Success',
  };
}

export default apiClient;
