import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { handleApiError } from '@/utils/errorHandler';
import { RecipeDetail } from '@/models/mealPlan';

interface UseRecipeResult {
  recipe: RecipeDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRecipe = (recipeId?: string | number): UseRecipeResult => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = async () => {
    if (!recipeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const numericRecipeId = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId;
      if (isNaN(numericRecipeId)) {
        throw new Error("Invalid Recipe ID format.");
      }
      const { data } = await api.get<RecipeDetail>(`/recipes/${numericRecipeId}`);
      setRecipe(data);
    } catch (err) {
      const recipeError = handleApiError(err);
      console.error(`Error fetching recipe ${recipeId}:`, recipeError);
      setError(recipeError.message);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  return { recipe, loading, error, refetch: fetchRecipe };
};