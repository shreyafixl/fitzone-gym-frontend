/**
 * Utilities Index
 * Central export point for all utility functions
 */

// Axios Configuration
export {
  API_CONFIG,
  APILogger,
  getAuthToken,
  setAuthToken,
  clearAuthData,
  isAuthenticated,
  formatPaginationParams,
  formatFilterParams,
  formatSortParams,
  buildQueryParams,
  handleAPIError,
  retryRequest,
  validateResponseData,
  transformResponse,
} from './axiosConfig';

export { default as apiClient } from './axiosConfig';

// Error Handling
export {
  ERROR_TYPES,
  classifyError,
  getUserFriendlyMessage,
  getErrorDetails,
  logError,
  handleAPIError as handleAPIErrorUtil,
  isRetryable,
  extractValidationErrors,
  createErrorBoundaryError,
  formatErrorForDisplay,
  normalizeError,
  isErrorType,
  handleErrorByType,
} from './errorHandler';

// Data Transformation
export {
  transformDashboardOverview,
  transformClientList,
  transformClientCard,
  transformClientProfile,
  transformAnalytics,
  transformMemberAnalytics,
  transformSessionAnalytics,
  transformAttendanceAnalytics,
  transformWorkoutAnalytics,
  transformDietAnalytics,
  transformProgressAnalytics,
  transformPerformanceStats,
  transformRatings,
  transformReviews,
  formatDate,
  formatDuration,
  calculateBMI,
  getBMICategory,
  normalizePagination,
} from './dataTransformer';

// Loading State Management
export {
  LOADING_STATES,
  createInitialLoadingState,
  createMultipleSectionLoadingState,
  setLoading,
  setSuccess,
  setError,
  resetLoadingState,
  updateSectionLoadingState,
  isAnySectionLoading,
  isAnySectionError,
  getAllSectionErrors,
  getAllSectionData,
  createLoadingStateReducer,
  executeAsyncAction,
  executeSectionAsyncAction,
  debounceAsyncAction,
  throttleAsyncAction,
} from './loadingStateManager';
