/**
 * Error Handling Utilities
 * Provides standardized error handling, user-friendly messages, and error logging
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */

/**
 * Error type constants
 */
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_TYPES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_TYPES.UNAUTHORIZED_ERROR]: 'Your session has expired. Please log in again.',
  [ERROR_TYPES.FORBIDDEN_ERROR]: 'You do not have permission to access this resource.',
  [ERROR_TYPES.NOT_FOUND_ERROR]: 'The requested resource was not found.',
  [ERROR_TYPES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_TYPES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Classify error based on status code
 * @param {number} status - HTTP status code
 * @returns {string} - Error type
 */
export function classifyError(status) {
  switch (status) {
    case 400:
      return ERROR_TYPES.VALIDATION_ERROR;
    case 401:
      return ERROR_TYPES.UNAUTHORIZED_ERROR;
    case 403:
      return ERROR_TYPES.FORBIDDEN_ERROR;
    case 404:
      return ERROR_TYPES.NOT_FOUND_ERROR;
    case 408:
    case 504:
      return ERROR_TYPES.TIMEOUT_ERROR;
    case 500:
    case 502:
    case 503:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return ERROR_TYPES.UNKNOWN_ERROR;
  }
}

/**
 * Get user-friendly error message
 * @param {Object} error - Error object or Axios error
 * @returns {string} - User-friendly error message
 */
export function getUserFriendlyMessage(error) {
  // If error has custom message, use it
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // If error has response data with message, use it
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Classify error and get standard message
  const status = error?.response?.status;
  if (status) {
    const errorType = classifyError(status);
    return ERROR_MESSAGES[errorType];
  }

  // Check for network error
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return ERROR_MESSAGES[ERROR_TYPES.TIMEOUT_ERROR];
  }

  if (!error?.response) {
    return ERROR_MESSAGES[ERROR_TYPES.NETWORK_ERROR];
  }

  return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR];
}

/**
 * Get error details for logging
 * @param {Object} error - Error object or Axios error
 * @returns {Object} - Error details { type, status, message, data }
 */
export function getErrorDetails(error) {
  const status = error?.response?.status;
  const errorType = status ? classifyError(status) : ERROR_TYPES.UNKNOWN_ERROR;

  return {
    type: errorType,
    status: status || 0,
    message: error?.response?.data?.message || error?.message || 'Unknown error',
    data: error?.response?.data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Log error to console with formatting
 * @param {Object} error - Error object or Axios error
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = 'API Call') {
  const details = getErrorDetails(error);

  console.error(`[${context}] Error:`, {
    type: details.type,
    status: details.status,
    message: details.message,
    timestamp: details.timestamp,
    fullError: error,
  });
}

/**
 * Handle API error and return standardized error object
 * @param {Object} error - Axios error object
 * @param {string} context - Context where error occurred
 * @returns {Object} - Standardized error object { success, message, error, retry }
 */
export function handleAPIError(error, context = 'API Call') {
  // Log error
  logError(error, context);

  const details = getErrorDetails(error);
  const userMessage = getUserFriendlyMessage(error);

  return {
    success: false,
    message: userMessage,
    error: details,
    retry: isRetryable(error),
  };
}

/**
 * Determine if error is retryable
 * @param {Object} error - Axios error object
 * @returns {boolean} - True if error is retryable
 */
export function isRetryable(error) {
  // Don't retry on client errors (4xx)
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    // Except for 408 (timeout) and 429 (too many requests)
    if (error.response.status === 408 || error.response.status === 429) {
      return true;
    }
    return false;
  }

  // Retry on server errors (5xx)
  if (error?.response?.status >= 500) {
    return true;
  }

  // Retry on network errors
  if (!error?.response) {
    return true;
  }

  return false;
}

/**
 * Extract validation errors from response
 * @param {Object} error - Axios error object
 * @returns {Object} - Validation errors { fieldName: 'error message' }
 */
export function extractValidationErrors(error) {
  const errors = {};

  // Check for errors array in response
  if (Array.isArray(error?.response?.data?.errors)) {
    error.response.data.errors.forEach((err) => {
      if (err.field) {
        errors[err.field] = err.message;
      }
    });
  }

  // Check for errors object in response
  if (error?.response?.data?.errors && typeof error.response.data.errors === 'object') {
    Object.assign(errors, error.response.data.errors);
  }

  return errors;
}

/**
 * Create error boundary error object
 * @param {Object} error - Error object
 * @param {string} errorInfo - Error info from error boundary
 * @returns {Object} - Error boundary error object
 */
export function createErrorBoundaryError(error, errorInfo) {
  return {
    error: error?.toString() || 'Unknown error',
    errorInfo: errorInfo?.componentStack || '',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
}

/**
 * Format error for display in UI
 * @param {Object} error - Error object or Axios error
 * @returns {Object} - Formatted error { title, message, details }
 */
export function formatErrorForDisplay(error) {
  const details = getErrorDetails(error);
  const userMessage = getUserFriendlyMessage(error);

  let title = 'Error';
  switch (details.type) {
    case ERROR_TYPES.NETWORK_ERROR:
      title = 'Connection Error';
      break;
    case ERROR_TYPES.TIMEOUT_ERROR:
      title = 'Request Timeout';
      break;
    case ERROR_TYPES.UNAUTHORIZED_ERROR:
      title = 'Session Expired';
      break;
    case ERROR_TYPES.FORBIDDEN_ERROR:
      title = 'Access Denied';
      break;
    case ERROR_TYPES.NOT_FOUND_ERROR:
      title = 'Not Found';
      break;
    case ERROR_TYPES.VALIDATION_ERROR:
      title = 'Validation Error';
      break;
    case ERROR_TYPES.SERVER_ERROR:
      title = 'Server Error';
      break;
    default:
      title = 'Error';
  }

  return {
    title,
    message: userMessage,
    details: details,
    canRetry: isRetryable(error),
  };
}

/**
 * Normalize error response
 * @param {Object} error - Error object
 * @returns {Object} - Normalized error { success, message, errors, statusCode }
 */
export function normalizeError(error) {
  return {
    success: false,
    message: getUserFriendlyMessage(error),
    errors: extractValidationErrors(error),
    statusCode: error?.response?.status || 0,
  };
}

/**
 * Check if error is specific type
 * @param {Object} error - Error object
 * @param {string} errorType - Error type to check
 * @returns {boolean} - True if error matches type
 */
export function isErrorType(error, errorType) {
  const details = getErrorDetails(error);
  return details.type === errorType;
}

/**
 * Handle specific error types with custom logic
 * @param {Object} error - Error object
 * @param {Object} handlers - Object with error type handlers
 * @returns {*} - Result from handler or default error message
 */
export function handleErrorByType(error, handlers = {}) {
  const details = getErrorDetails(error);
  const handler = handlers[details.type];

  if (handler && typeof handler === 'function') {
    return handler(error, details);
  }

  return getUserFriendlyMessage(error);
}

export default {
  ERROR_TYPES,
  classifyError,
  getUserFriendlyMessage,
  getErrorDetails,
  logError,
  handleAPIError,
  isRetryable,
  extractValidationErrors,
  createErrorBoundaryError,
  formatErrorForDisplay,
  normalizeError,
  isErrorType,
  handleErrorByType,
};
