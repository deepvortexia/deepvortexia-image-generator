export interface FavoriteImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const FAVORITES_KEY = 'deepvortex_favorites';

export const favoritesStorage = {
  getAll: (): FavoriteImage[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  add: (imageUrl: string, prompt: string): FavoriteImage => {
    const favorite: FavoriteImage = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      imageUrl,
      prompt,
      createdAt: new Date().toISOString(),
    };

    const favorites = favoritesStorage.getAll();
    favorites.unshift(favorite); // Add to beginning
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
    }

    return favorite;
  },

  remove: (id: string): void => {
    const favorites = favoritesStorage.getAll();
    const filtered = favorites.filter(fav => fav.id !== id);
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  exists: (imageUrl: string): boolean => {
    const favorites = favoritesStorage.getAll();
    return favorites.some(fav => fav.imageUrl === imageUrl);
  },
};
