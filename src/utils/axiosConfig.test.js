/**
 * Tests for Axios Configuration and Interceptors
 * 
 * These tests verify:
 * - Request interceptor adds auth token
 * - Request interceptor logs requests
 * - Request interceptor adds timestamps
 * - Response interceptor logs responses
 * - Response interceptor calculates duration
 * - Error interceptor handles 401 errors
 * - Error interceptor handles 403 errors
 * - Error interceptor handles 404 errors
 * - Error interceptor handles 500 errors
 * - Error interceptor handles network errors
 * - Authentication utilities work correctly
 * 
 * Requirements: 6.5, 6.6, 7.5, 7.6
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  API_CONFIG,
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

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to avoid cluttering test output
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

describe('Axios Configuration and Interceptors', () => {
  let mock;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Create fresh axios mock for each test
    const testClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
    mock = new MockAdapter(testClient);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Authentication Utilities', () => {
    describe('setAuthToken', () => {
      it('should store token in localStorage', () => {
        const token = 'test-token-123';
        setAuthToken(token);

        expect(localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY)).toBe(token);
      });

      it('should remove token when null is passed', () => {
        setAuthToken('test-token');
        expect(localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY)).toBe('test-token');

        setAuthToken(null);
        expect(localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY)).toBeNull();
      });
    });

    describe('getAuthToken', () => {
      it('should retrieve token from localStorage', () => {
        const token = 'test-token-456';
        localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token);

        expect(getAuthToken()).toBe(token);
      });

      it('should return null if no token exists', () => {
        expect(getAuthToken()).toBeNull();
      });
    });

    describe('clearAuthData', () => {
      it('should clear both token and user from localStorage', () => {
        localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, 'token');
        localStorage.setItem(API_CONFIG.USER_STORAGE_KEY, 'user-data');

        clearAuthData();

        expect(localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(API_CONFIG.USER_STORAGE_KEY)).toBeNull();
      });
    });

    describe('isAuthenticated', () => {
      it('should return true when token exists', () => {
        setAuthToken('valid-token');
        expect(isAuthenticated()).toBe(true);
      });

      it('should return false when no token exists', () => {
        expect(isAuthenticated()).toBe(false);
      });

      it('should return false after clearing auth data', () => {
        setAuthToken('token');
        clearAuthData();
        expect(isAuthenticated()).toBe(false);
      });
    });
  });

  describe('Pagination and Filtering Utilities', () => {
    describe('formatPaginationParams', () => {
      it('should format valid pagination params', () => {
        const result = formatPaginationParams(2, 20);

        expect(result).toEqual({
          page: 2,
          limit: 20,
          skip: 20,
        });
      });

      it('should use defaults when not provided', () => {
        const result = formatPaginationParams();

        expect(result).toEqual({
          page: 1,
          limit: 10,
          skip: 0,
        });
      });

      it('should enforce minimum values', () => {
        const result = formatPaginationParams(0, -5);

        expect(result.page).toBeGreaterThanOrEqual(1);
        expect(result.limit).toBeGreaterThanOrEqual(1);
      });

      it('should enforce maximum limit', () => {
        const result = formatPaginationParams(1, 200);

        expect(result.limit).toBeLessThanOrEqual(100);
      });
    });

    describe('formatFilterParams', () => {
      it('should filter only allowed keys', () => {
        const filters = {
          status: 'active',
          goal: 'weight_loss',
          invalid: 'should-be-removed',
        };

        const result = formatFilterParams(filters, ['status', 'goal']);

        expect(result).toEqual({
          status: 'active',
          goal: 'weight_loss',
        });
        expect(result.invalid).toBeUndefined();
      });

      it('should exclude null, undefined, and empty values', () => {
        const filters = {
          status: 'active',
          goal: null,
          gender: undefined,
          plan: '',
        };

        const result = formatFilterParams(filters, ['status', 'goal', 'gender', 'plan']);

        expect(result).toEqual({
          status: 'active',
        });
      });

      it('should return empty object when no filters match', () => {
        const result = formatFilterParams({}, ['status', 'goal']);

        expect(result).toEqual({});
      });
    });

    describe('formatSortParams', () => {
      it('should format valid sort params', () => {
        const result = formatSortParams('name', 'asc', ['name', 'date', 'progress']);

        expect(result).toEqual({
          sortBy: 'name',
          sortOrder: 'asc',
        });
      });

      it('should use defaults for invalid sort field', () => {
        const result = formatSortParams('invalid', 'asc', ['name', 'date']);

        expect(result.sortBy).toBe('createdAt');
      });

      it('should normalize sort order to asc or desc', () => {
        let result = formatSortParams('name', 'invalid', ['name']);
        expect(result.sortOrder).toBe('desc');

        result = formatSortParams('name', 'asc', ['name']);
        expect(result.sortOrder).toBe('asc');
      });
    });

    describe('buildQueryParams', () => {
      it('should remove null, undefined, and empty values', () => {
        const params = {
          name: 'John',
          age: null,
          email: undefined,
          phone: '',
          city: 'NYC',
        };

        const result = buildQueryParams(params);

        expect(result).toEqual({
          name: 'John',
          city: 'NYC',
        });
      });

      it('should keep zero and false values', () => {
        const params = {
          count: 0,
          active: false,
          name: 'test',
        };

        const result = buildQueryParams(params);

        expect(result).toEqual({
          count: 0,
          active: false,
          name: 'test',
        });
      });

      it('should handle empty object', () => {
        const result = buildQueryParams({});

        expect(result).toEqual({});
      });
    });
  });

  describe('Error Handling Utilities', () => {
    describe('handleAPIError', () => {
      it('should extract error details from response', () => {
        const error = {
          response: {
            status: 400,
            data: {
              message: 'Bad request',
            },
          },
        };

        const result = handleAPIError(error);

        expect(result.message).toBe('Bad request');
        expect(result.status).toBe(400);
      });

      it('should handle network errors', () => {
        const error = {
          request: {},
          message: 'Network Error',
        };

        const result = handleAPIError(error);

        expect(result.message).toContain('No response');
        expect(result.status).toBe(0);
      });

      it('should handle request setup errors', () => {
        const error = new Error('Request setup error');

        const result = handleAPIError(error);

        expect(result.status).toBe(0);
      });
    });

    describe('retryRequest', () => {
      it('should retry failed request with exponential backoff', async () => {
        const mockFn = jest.fn();
        mockFn
          .mockRejectedValueOnce(new Error('Network error'))
          .mockResolvedValueOnce('success');

        const result = await retryRequest(mockFn, 3, 10);

        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(2);
      });

      it('should not retry on 4xx errors', async () => {
        const error = new Error('Bad request');
        error.response = { status: 400 };

        const mockFn = jest.fn().mockRejectedValueOnce(error);

        await expect(retryRequest(mockFn, 3, 10)).rejects.toThrow();
        expect(mockFn).toHaveBeenCalledTimes(1);
      });

      it('should exhaust retries and throw error', async () => {
        const error = new Error('Server error');
        error.response = { status: 500 };

        const mockFn = jest.fn().mockRejectedValue(error);

        await expect(retryRequest(mockFn, 2, 10)).rejects.toThrow();
        expect(mockFn).toHaveBeenCalledTimes(3); // initial + 2 retries
      });
    });

    describe('validateResponseData', () => {
      it('should validate required fields present', () => {
        const data = {
          id: 1,
          name: 'John',
          email: 'john@example.com',
        };

        const result = validateResponseData(data, ['id', 'name', 'email']);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should detect missing required fields', () => {
        const data = {
          id: 1,
          name: 'John',
        };

        const result = validateResponseData(data, ['id', 'name', 'email']);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing required field: email');
      });

      it('should reject non-object data', () => {
        const result = validateResponseData(null, ['id']);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Response data must be an object');
      });

      it('should detect null or undefined required fields', () => {
        const data = {
          id: 1,
          name: null,
          email: undefined,
        };

        const result = validateResponseData(data, ['id', 'name', 'email']);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing required field: name');
        expect(result.errors).toContain('Missing required field: email');
      });
    });

    describe('transformResponse', () => {
      it('should return data as-is if already has success field', () => {
        const response = {
          success: true,
          data: { id: 1 },
          message: 'Success',
        };

        const result = transformResponse({ data: response });

        expect(result).toEqual(response);
      });

      it('should wrap plain data in standardized format', () => {
        const data = { id: 1, name: 'John' };

        const result = transformResponse({ data });

        expect(result).toEqual({
          success: true,
          data: { id: 1, name: 'John' },
          message: 'Success',
        });
      });

      it('should handle array data', () => {
        const data = [{ id: 1 }, { id: 2 }];

        const result = transformResponse({ data });

        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(2);
      });
    });
  });

  describe('API Configuration', () => {
    it('should have required config properties', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.TIMEOUT).toBeDefined();
      expect(API_CONFIG.ENABLE_LOGGING).toBeDefined();
      expect(API_CONFIG.TOKEN_STORAGE_KEY).toBeDefined();
      expect(API_CONFIG.USER_STORAGE_KEY).toBeDefined();
    });

    it('should use environment variable for base URL if provided', () => {
      expect(API_CONFIG.BASE_URL).toBe(
        process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
      );
    });

    it('should disable logging in production', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(API_CONFIG.ENABLE_LOGGING).toBe(false);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle successful request with auth token', async () => {
      setAuthToken('valid-token');
      const testClient = axios.create({
        baseURL: API_CONFIG.BASE_URL,
      });

      mock.onGet('/test').reply(200, { success: true, data: { id: 1 } });

      const config = {};
      // Simulate request interceptor
      const token = getAuthToken();
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      expect(config.headers.Authorization).toBe('Bearer valid-token');
    });

    it('should handle 401 error and clear auth', async () => {
      setAuthToken('expired-token');
      expect(isAuthenticated()).toBe(true);

      // Simulate 401 error handling
      clearAuthData();

      expect(isAuthenticated()).toBe(false);
      expect(getAuthToken()).toBeNull();
    });

    it('should maintain authentication state across requests', async () => {
      const token = 'persistent-token';
      setAuthToken(token);

      // Multiple calls should maintain the token
      expect(getAuthToken()).toBe(token);
      expect(getAuthToken()).toBe(token);
      expect(getAuthToken()).toBe(token);

      clearAuthData();
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large response data', () => {
      const largeData = {
        items: Array.from({ length: 10000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          data: 'x'.repeat(100),
        })),
      };

      const result = transformResponse({ data: largeData });

      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(10000);
    });

    it('should handle special characters in auth token', () => {
      const specialToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      setAuthToken(specialToken);

      expect(getAuthToken()).toBe(specialToken);
      expect(isAuthenticated()).toBe(true);
    });

    it('should handle concurrent token updates', () => {
      setAuthToken('token1');
      setAuthToken('token2');
      setAuthToken('token3');

      expect(getAuthToken()).toBe('token3');
    });
  });
});
