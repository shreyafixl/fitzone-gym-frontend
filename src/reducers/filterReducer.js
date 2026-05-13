export const filterInitialState = {
  searchQuery: '',
  selectedCategory: 'All',
  selectedDifficulty: 'All',
  sortBy: 'name'
};

export function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, selectedDifficulty: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'RESET_FILTERS':
      return filterInitialState;
    default:
      return state;
  }
}
