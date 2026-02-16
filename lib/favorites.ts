export interface FavoriteImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  aspect_ratio: string | null;
  is_favorite: boolean;
  created_at: string;
}

export const fetchFavorites = async (token: string): Promise<FavoriteImage[]> => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch favorites:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const toggleFavorite = async (token: string, imageId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ imageId }),
    });

    if (!response.ok) {
      console.error('Failed to toggle favorite:', response.statusText);
      return false;
    }

    const data = await response.json();
    return data.isFavorite || false;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};
