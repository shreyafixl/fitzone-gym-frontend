# API Service Utility Functions Guide

This guide documents the utility functions created for API service integration in the Trainer Dashboard MongoDB Integration spec.

## Overview

The API service layer consists of several utility modules that work together to provide:
- Request/response interceptors
- Error handling and logging
- Data transformation and normalization
- Loading state management
- Authentication token management
- Pagination, filtering, and sorting utilities

## Modules

### 1. axiosConfig.js

Provides Axios configuration with interceptors for authentication, error handling, and logging.

#### Key Exports

**Configuration:**
- `API_CONFIG` - Configuration object with base URL, timeout, and logging settings
- `apiClient` - Configured Axios instance

**Authentication Functions:**
- `getAuthToken()` - Get stored authentication token
- `setAuthToken(token)` - Store authentication token
- `clearAuthData()` - Clear all authentication data
- `isAuthenticated()` - Check if user is authenticated

**Parameter Formatting:**
- `formatPaginationParams(page, limit)` - Format pagination parameters
- `formatFilterParams(filters, allowedFilters)` - Format filter parameters
- `formatSortParams(sortBy, sortOrder, allowedFields)` - Format sort parameters
- `buildQueryParams(params)` - Build clean query parameters

**Utilities:**
- `handleAPIError(error)` - Handle API errors
- `retryRequest(requestFn, maxRetries, initialDelay)` - Retry failed requests with exponential backoff
- `validateResponseData(data, requiredFields)` - Validate response data
- `transformResponse(response)` - Transform response to standardized format

#### Usage Examples

```javascript
import apiClient, { 
  getAuthToken, 
  formatPaginationParams,
  formatFilterParams 
} from '../utils/axiosConfig';

// Make authenticated request
const response = await apiClient.get('/api/trainer/dashboard');

// Format pagination
const pagination = formatPaginationParams(1, 10); // { page: 1, limit: 10, skip: 0 }

// Format filters
const filters = formatFilterParams(
  { status: 'active', goal: 'weight_loss' },
  ['status', 'goal', 'gender']
); // { status: 'active', goal: 'weight_loss' }

// Retry request with exponential backoff
const result = await retryRequest(
  () => apiClient.get('/api/trainer/members'),
  3,
  1000
);
```

### 2. errorHandler.js

Provides comprehensive error handling utilities for API errors.

#### Key Exports

**Constants:**
- `ERROR_TYPES` - Error type constants (NETWORK_ERROR, TIMEOUT_ERROR, etc.)

**Functions:**
- `classifyError(status)` - Classify error by HTTP status code
- `getUserFriendlyMessage(error)` - Get user-friendly error message
- `getErrorDetails(error)` - Get detailed error information
- `logError(error, context)` - Log error to console
- `handleAPIError(error, context)` - Handle API error and return standardized object
- `isRetryable(error)` - Determine if error is retryable
- `extractValidationErrors(error)` - Extract validation errors from response
- `formatErrorForDisplay(error)` - Format error for UI display
- `normalizeError(error)` - Normalize error response
- `isErrorType(error, errorType)` - Check if error is specific type
- `handleErrorByType(error, handlers)` - Handle error with custom logic by type

#### Usage Examples

```javascript
import { 
  handleAPIError, 
  getUserFriendlyMessage,
  extractValidationErrors,
  ERROR_TYPES 
} from '../utils/errorHandler';

try {
  const data = await apiClient.get('/api/trainer/members');
} catch (error) {
  // Get user-friendly message
  const message = getUserFriendlyMessage(error);
  console.log(message); // "Network connection error..."

  // Extract validation errors
  const validationErrors = extractValidationErrors(error);
  // { email: 'Invalid email', password: 'Too short' }

  // Handle error with custom logic
  const result = handleAPIError(error, 'Fetch Members');
  // { success: false, message: '...', error: {...}, retry: true }
}
```

### 3. dataTransformer.js

Provides functions to transform and normalize API responses.

#### Key Exports

**Transform Functions:**
- `transformDashboardOverview(data)` - Transform dashboard overview response
- `transformClientList(data)` - Transform client list response
- `transformClientCard(member)` - Transform individual client card
- `transformClientProfile(data)` - Transform client profile response
- `transformAnalytics(data)` - Transform analytics response
- `transformMemberAnalytics(data)` - Transform member analytics
- `transformSessionAnalytics(data)` - Transform session analytics
- `transformAttendanceAnalytics(data)` - Transform attendance analytics
- `transformWorkoutAnalytics(data)` - Transform workout analytics
- `transformDietAnalytics(data)` - Transform diet analytics
- `transformProgressAnalytics(data)` - Transform progress analytics
- `transformPerformanceStats(data)` - Transform performance statistics
- `transformRatings(data)` - Transform ratings response
- `transformReviews(data)` - Transform reviews response

**Utility Functions:**
- `formatDate(date, format)` - Format date for display
- `formatDuration(seconds)` - Format time duration
- `calculateBMI(weight, height)` - Calculate BMI
- `getBMICategory(bmi)` - Get BMI category
- `normalizePagination(pagination)` - Normalize pagination data

#### Usage Examples

```javascript
import { 
  transformClientList,
  transformDashboardOverview,
  formatDate,
  calculateBMI 
} from '../utils/dataTransformer';

// Transform API response
const rawData = await apiClient.get('/api/trainer/members');
const transformedData = transformClientList(rawData.data);
// { members: [...], pagination: {...} }

// Format date
const formatted = formatDate(new Date(), 'MM/DD/YYYY');
// "12/25/2023"

// Calculate BMI
const bmi = calculateBMI(75, 180); // weight in kg, height in cm
// 23.1
```

### 4. loadingStateManager.js

Provides utilities for managing loading states across the application.

#### Key Exports

**Constants:**
- `LOADING_STATES` - Loading state constants (IDLE, LOADING, SUCCESS, ERROR)

**State Management Functions:**
- `createInitialLoadingState(initialState)` - Create initial loading state
- `createMultipleSectionLoadingState(sections)` - Create loading state for multiple sections
- `setLoading(state)` - Update state to loading
- `setSuccess(state, data)` - Update state to success
- `setError(state, error)` - Update state to error
- `resetLoadingState(state)` - Reset state to idle
- `updateSectionLoadingState(state, section, newState, data)` - Update specific section

**Query Functions:**
- `isAnySectionLoading(state)` - Check if any section is loading
- `isAnySectionError(state)` - Check if any section has error
- `getAllSectionErrors(state)` - Get all section errors
- `getAllSectionData(state)` - Get all section data

**Async Utilities:**
- `createLoadingStateReducer()` - Create reducer for loading state
- `executeAsyncAction(asyncFn, dispatch, options)` - Execute async action with loading state
- `executeSectionAsyncAction(section, asyncFn, dispatch, options)` - Execute section async action
- `debounceAsyncAction(asyncFn, delay)` - Debounce async action
- `throttleAsyncAction(asyncFn, delay)` - Throttle async action

#### Usage Examples

```javascript
import { 
  createInitialLoadingState,
  setLoading,
  setSuccess,
  setError,
  executeAsyncAction 
} from '../utils/loadingStateManager';

// Create initial state
const [loadingState, setLoadingState] = useState(
  createInitialLoadingState()
);

// Execute async action
const fetchData = async () => {
  try {
    await executeAsyncAction(
      () => apiClient.get('/api/trainer/members'),
      (action) => {
        switch (action.type) {
          case 'SET_LOADING':
            setLoadingState(setLoading(loadingState));
            break;
          case 'SET_SUCCESS':
            setLoadingState(setSuccess(loadingState, action.payload));
            break;
          case 'SET_ERROR':
            setLoadingState(setError(loadingState, action.payload));
            break;
        }
      }
    );
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
```

## Integration with API Services

### trainerDashboardAPI.js

Provides functions for dashboard-related API calls:

```javascript
import {
  getDashboardOverview,
  getMemberAnalytics,
  getSessionAnalytics,
  getAttendanceAnalytics,
  getWorkoutAnalytics,
  getDietAnalytics,
  getProgressAnalytics,
  getPerformanceStats,
  getTrainerRatings,
  getTrainerReviews,
  getTrainerProfile,
  updateTrainerProfile
} from '../services/trainerDashboardAPI';

// Fetch dashboard overview
const overview = await getDashboardOverview();

// Fetch analytics
const memberAnalytics = await getMemberAnalytics();
const sessionAnalytics = await getSessionAnalytics();

// Fetch ratings and reviews
const ratings = await getTrainerRatings();
const reviews = await getTrainerReviews(1, 10, 5); // page, limit, rating filter
```

### trainerMembersAPI.js

Provides functions for member-related API calls:

```javascript
import {
  getAssignedMembers,
  getMemberById,
  getMemberFitnessGoals,
  getMemberMembership,
  getMemberAttendance,
  getMemberProgress,
  getMemberWorkouts,
  searchMembers,
  getMembersStats,
  addProgressNote,
  updateMemberProgress,
  addMemberGoal
} from '../services/trainerMembersAPI';

// Fetch assigned members with pagination and filtering
const members = await getAssignedMembers(
  1,                                    // page
  10,                                   // limit
  'john',                               // search
  { status: 'active', goal: 'weight_loss' }, // filters
  { sortBy: 'name', sortOrder: 'asc' }  // sort
);

// Fetch member details
const member = await getMemberById('memberId');

// Fetch member attendance with date range
const attendance = await getMemberAttendance(
  'memberId',
  1,
  10,
  '2023-01-01',
  '2023-12-31'
);

// Add progress note
const note = await addProgressNote('memberId', 'Great progress this week!');
```

## Error Handling Pattern

```javascript
import { handleAPIError, getUserFriendlyMessage } from '../utils/errorHandler';
import { setError } from '../utils/loadingStateManager';

try {
  const data = await apiClient.get('/api/trainer/members');
  // Handle success
} catch (error) {
  // Get user-friendly message
  const message = getUserFriendlyMessage(error);
  
  // Update loading state
  setLoadingState(setError(loadingState, error));
  
  // Show error to user
  showErrorNotification(message);
  
  // Log error for debugging
  console.error('API Error:', error);
}
```

## Request/Response Interceptor Flow

1. **Request Interceptor:**
   - Adds authentication token from localStorage
   - Logs request details
   - Adds request timestamp

2. **Response Interceptor:**
   - Logs response details
   - Calculates request duration
   - Validates response format

3. **Error Interceptor:**
   - Logs error details
   - Handles 401 (Unauthorized) - redirects to login
   - Handles 403 (Forbidden) - shows permission error
   - Handles 404 (Not Found) - shows not found error
   - Handles 500 (Server Error) - shows server error
   - Handles network errors - shows connection error

## Best Practices

1. **Always use the utility functions** instead of making raw Axios calls
2. **Handle errors properly** using the error handler utilities
3. **Transform API responses** using the data transformer utilities
4. **Manage loading states** using the loading state manager
5. **Use pagination, filtering, and sorting** utilities for query parameters
6. **Log errors** for debugging and monitoring
7. **Retry failed requests** for transient errors
8. **Validate response data** before using it

## Testing

All utility functions are designed to be easily testable:

```javascript
import { formatPaginationParams, formatFilterParams } from '../utils/axiosConfig';
import { transformClientList } from '../utils/dataTransformer';

describe('API Utilities', () => {
  test('formatPaginationParams', () => {
    const result = formatPaginationParams(2, 20);
    expect(result).toEqual({ page: 2, limit: 20, skip: 20 });
  });

  test('transformClientList', () => {
    const rawData = { members: [...], pagination: {...} };
    const result = transformClientList(rawData);
    expect(result.members).toBeDefined();
    expect(result.pagination).toBeDefined();
  });
});
```

## Requirements Mapping

These utilities satisfy the following requirements:

- **Requirement 6.1-6.8:** API service functions with proper error handling and interceptors
- **Requirement 7.1-7.9:** Loading states and error handling
- **Requirement 7.10:** Toast notifications (can be integrated with error handler)

## Future Enhancements

1. Add caching layer for frequently accessed data
2. Add request deduplication
3. Add offline support with service workers
4. Add real-time updates with WebSocket
5. Add analytics tracking for API calls
6. Add request/response compression
7. Add GraphQL support
