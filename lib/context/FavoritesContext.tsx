import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationResult } from '../inheritance/types';

export interface FavoriteItem {
  id: string;
  timestamp: string;
  result: CalculationResult;
  note?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (result: CalculationResult, note?: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  loadFavorite: (id: string) => CalculationResult | undefined;
  clearFavorites: () => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = '@merath_favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = async (result: CalculationResult, note?: string) => {
    const newFavorite: FavoriteItem = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      result,
      note,
    };
    setFavorites(prev => [newFavorite, ...prev]);
  };

  const removeFavorite = async (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const loadFavorite = (id: string) => {
    const fav = favorites.find(f => f.id === id);
    return fav?.result;
  };

  const clearFavorites = async () => {
    setFavorites([]);
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      loadFavorite,
      clearFavorites,
      isFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
