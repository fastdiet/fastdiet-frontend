import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useAuth } from "@/hooks/useAuth";
import { RecipeDetail } from "@/models/mealPlan";
import { getMyRecipes, saveMyRecipes } from "@/utils/asyncStorage"; 
import { ApiResponse } from "@/context/AuthContext";


type RecipeInputData = Omit<RecipeDetail, 'id' | 'ingredients' | 'analyzed_instructions'> & {
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: string[];
};


interface MyRecipesContextType {
  myRecipes: RecipeDetail[];
  loading: boolean;
  createRecipe: (recipeData: RecipeInputData) => Promise<ApiResponse>;
  deleteRecipe: (recipeId: number) => Promise<ApiResponse>;
}

export const MyRecipesContext = createContext<MyRecipesContextType | undefined>(undefined);

export const MyRecipesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myRecipes, setMyRecipes] = useState<RecipeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const storedRecipes = await getMyRecipes();
      if (storedRecipes) {
        setMyRecipes(storedRecipes);
      }
      // Petición a la API para refrescar los datos
      const { data } = await api.get('/recipes/me'); // Endpoint de ejemplo para tus recetas
      setMyRecipes(data);
      await saveMyRecipes(data);

    } catch (err) {
      console.error("Failed to fetch my recipes:", handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyRecipes();
    } else {
      setMyRecipes([]);
    }
  }, [user, fetchMyRecipes]);

  const createRecipe = async (recipeData: RecipeInputData): Promise<ApiResponse> => {
    try {
      // Endpoint de ejemplo para crear una receta
      const { data: newRecipe } = await api.post("/recipes/me", recipeData);
      const updatedRecipes = [...myRecipes, newRecipe];
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const deleteRecipe = async (recipeId: number): Promise<ApiResponse> => {
    try {
      // Endpoint de ejemplo para borrar
      await api.delete(`/recipes/me/${recipeId}`);
      const updatedRecipes = myRecipes.filter(r => r.id !== recipeId);
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const value = { myRecipes, loading, createRecipe, deleteRecipe };

  return (
    <MyRecipesContext.Provider value={value}>
      {children}
    </MyRecipesContext.Provider>
  );
};