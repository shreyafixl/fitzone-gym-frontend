/**
 * Loading State Manager
 * Provides utilities for managing loading states across the application
 * 
 * Requirements: 7.1
 */

/**
 * Loading state constants
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Create initial loading state
 * @param {string} initialState - Initial state (default: 'idle')
 * @returns {Object} - Initial loading state
 */
export function createInitialLoadingState(initialState = LOADING_STATES.IDLE) {
  return {
    state: initialState,
    isLoading: initialState === LOADING_STATES.LOADING,
    isSuccess: initialState === LOADING_STATES.SUCCESS,
    isError: initialState === LOADING_STATES.ERROR,
    error: null,
    data: null,
  };
}

/**
 * Create loading state for multiple sections
 * @param {Array} sections - Array of section names
 * @returns {Object} - Loading state for each section
 */
export function createMultipleSectionLoadingState(sections = []) {
  const state = {};

  sections.forEach((section) => {
    state[section] = createInitialLoadingState();
  });

  return state;
}

/**
 * Update loading state to loading
 * @param {Object} state - Current loading state
 * @returns {Object} - Updated loading state
 */
export function setLoading(state) {
  return {
    ...state,
    state: LOADING_STATES.LOADING,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  };
}

/**
 * Update loading state to success
 * @param {Object} state - Current loading state
 * @param {*} data - Success data
 * @returns {Object} - Updated loading state
 */
export function setSuccess(state, data = null) {
  return {
    ...state,
    state: LOADING_STATES.SUCCESS,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    data,
  };
}

/**
 * Update loading state to error
 * @param {Object} state - Current loading state
 * @param {Object} error - Error object
 * @returns {Object} - Updated loading state
 */
export function setError(state, error = null) {
  return {
    ...state,
    state: LOADING_STATES.ERROR,
    isLoading: false,
    isSuccess: false,
    isError: true,
    error,
    data: null,
  };
}

/**
 * Reset loading state to idle
 * @param {Object} state - Current loading state
 * @returns {Object} - Reset loading state
 */
export function resetLoadingState(state) {
  return {
    ...state,
    state: LOADING_STATES.IDLE,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
  };
}

/**
 * Update specific section loading state
 * @param {Object} state - Current loading state
 * @param {string} section - Section name
 * @param {string} newState - New state
 * @param {*} data - Optional data
 * @returns {Object} - Updated loading state
 */
export function updateSectionLoadingState(state, section, newState, data = null) {
  return {
    ...state,
    [section]: {
      state: newState,
      isLoading: newState === LOADING_STATES.LOADING,
      isSuccess: newState === LOADING_STATES.SUCCESS,
      isError: newState === LOADING_STATES.ERROR,
      error: newState === LOADING_STATES.ERROR ? data : null,
      data: newState === LOADING_STATES.SUCCESS ? data : null,
    },
  };
}

/**
 * Check if any section is loading
 * @param {Object} state - Loading state object
 * @returns {boolean} - True if any section is loading
 */
export function isAnySectionLoading(state) {
  return Object.values(state).some((section) => section.isLoading);
}

/**
 * Check if any section has error
 * @param {Object} state - Loading state object
 * @returns {boolean} - True if any section has error
 */
export function isAnySectionError(state) {
  return Object.values(state).some((section) => section.isError);
}

/**
 * Get all section errors
 * @param {Object} state - Loading state object
 * @returns {Object} - Object with section names and their errors
 */
export function getAllSectionErrors(state) {
  const errors = {};

  Object.entries(state).forEach(([section, loadingState]) => {
    if (loadingState.isError && loadingState.error) {
      errors[section] = loadingState.error;
    }
  });

  return errors;
}

/**
 * Get all section data
 * @param {Object} state - Loading state object
 * @returns {Object} - Object with section names and their data
 */
export function getAllSectionData(state) {
  const data = {};

  Object.entries(state).forEach(([section, loadingState]) => {
    if (loadingState.isSuccess && loadingState.data) {
      data[section] = loadingState.data;
    }
  });

  return data;
}

/**
 * Create loading state reducer
 * @returns {Function} - Reducer function
 */
export function createLoadingStateReducer() {
  return (state, action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return setLoading(state);

      case 'SET_SUCCESS':
        return setSuccess(state, action.payload);

      case 'SET_ERROR':
        return setError(state, action.payload);

      case 'RESET':
        return resetLoadingState(state);

      case 'UPDATE_SECTION':
        return updateSectionLoadingState(
          state,
          action.section,
          action.newState,
          action.data
        );

      default:
        return state;
    }
  };
}

/**
 * Create async action handler
 * @param {Function} asyncFn - Async function to execute
 * @param {Function} dispatch - Dispatch function
 * @param {Object} options - Options { onSuccess, onError }
 * @returns {Promise} - Result of async function
 */
export async function executeAsyncAction(asyncFn, dispatch, options = {}) {
  const { onSuccess, onError } = options;

  try {
    dispatch({ type: 'SET_LOADING' });

    const result = await asyncFn();

    dispatch({ type: 'SET_SUCCESS', payload: result });

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error });

    if (onError) {
      onError(error);
    }

    throw error;
  }
}

/**
 * Create section async action handler
 * @param {string} section - Section name
 * @param {Function} asyncFn - Async function to execute
 * @param {Function} dispatch - Dispatch function
 * @param {Object} options - Options { onSuccess, onError }
 * @returns {Promise} - Result of async function
 */
export async function executeSectionAsyncAction(section, asyncFn, dispatch, options = {}) {
  const { onSuccess, onError } = options;

  try {
    dispatch({
      type: 'UPDATE_SECTION',
      section,
      newState: LOADING_STATES.LOADING,
    });

    const result = await asyncFn();

    dispatch({
      type: 'UPDATE_SECTION',
      section,
      newState: LOADING_STATES.SUCCESS,
      data: result,
    });

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    dispatch({
      type: 'UPDATE_SECTION',
      section,
      newState: LOADING_STATES.ERROR,
      data: error,
    });

    if (onError) {
      onError(error);
    }

    throw error;
  }
}

/**
 * Debounce async action
 * @param {Function} asyncFn - Async function to execute
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounceAsyncAction(asyncFn, delay = 300) {
  let timeoutId;

  return function debounced(...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

/**
 * Throttle async action
 * @param {Function} asyncFn - Async function to execute
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttleAsyncAction(asyncFn, delay = 300) {
  let lastCall = 0;
  let timeoutId;

  return function throttled(...args) {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;

      const execute = async () => {
        try {
          lastCall = Date.now();
          const result = await asyncFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (timeSinceLastCall >= delay) {
        execute();
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(execute, delay - timeSinceLastCall);
      }
    });
  };
}

export default {
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
};
