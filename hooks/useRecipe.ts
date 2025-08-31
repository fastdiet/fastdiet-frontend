import { useState, useEffect, useCallback } from 'react';
import { useMyRecipes } from '@/hooks/useMyRecipes';
import { RecipeDetail } from '@/models/mealPlan';

interface UseRecipeResult {
  recipe: RecipeDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRecipe = (recipeId: number): UseRecipeResult => {
  const { getRecipeById, recipeDetailsCache } = useMyRecipes();
  
  const [recipe, setRecipe] = useState<RecipeDetail | null>(recipeDetailsCache[recipeId] || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!recipe);

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return;

    setLoading(true);
    setError(null);
    try {
      //await new Promise((res) => setTimeout(res, 3000));
      const data = await getRecipeById(recipeId);
      setRecipe(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [recipeId, getRecipeById]);

  useEffect(() => {
    if (!recipe) {
      fetchRecipe();
    }
  }, [recipeId, fetchRecipe, recipe]);

  useEffect(() => {
    const cachedRecipe = recipeDetailsCache[recipeId];
    if (cachedRecipe) {
      setRecipe(cachedRecipe);
    }
  }, [recipeDetailsCache, recipeId]);

  

  return { recipe, loading, error, refetch: fetchRecipe };
};