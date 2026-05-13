import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export function useFavorites(key = 'gym-favorites') {
  const [favorites, setFavorites] = useLocalStorage(key, []);

  const addFavorite = useCallback((item) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((itemId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== itemId));
  }, [setFavorites]);

  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, item];
    });
  }, [setFavorites]);

  const isFavorite = useCallback((itemId) => {
    return favorites.some(fav => fav.id === itemId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
