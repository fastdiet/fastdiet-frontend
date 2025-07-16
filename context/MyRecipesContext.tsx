import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useAuth } from "@/hooks/useAuth";
import { RecipeDetail, RecipeShort } from "@/models/mealPlan";
import { getMyRecipes, saveMyRecipes } from "@/utils/asyncStorage"; 
import { ApiResponse } from "@/context/AuthContext";

import { RecipeCreationData } from "@/models/recipeInput"; // Asegúrate de que este modelo exista y sea correcto


interface MyRecipesContextType {
  myRecipes: RecipeShort[];
  loading: boolean;
  fetchRecipes: () => Promise<void>;
  createRecipe: (recipeData: RecipeCreationData) => Promise<ApiResponse>;
  deleteRecipe: (recipeId: number, force: boolean) => Promise<ApiResponse>;
  //updateRecipe: (recipeId: number, updatedData: Partial<UserRecipe>) => Promise<ApiResponse>;
}

export const MyRecipesContext = createContext<MyRecipesContextType | undefined>(undefined);

export const MyRecipesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myRecipes, setMyRecipes] = useState<RecipeShort[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecipes = async () => {
    if (!user) {
      setMyRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/recipes/my-recipes");
      setMyRecipes(data.recipes);
      await saveMyRecipes(data.recipes);
    } catch (error) {
      console.error("Error fetching recipes:", handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialRecipes = async () => {
      if (!user) {
        setMyRecipes([]);
        await saveMyRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const cached = await getMyRecipes();
        if (cached) {
          setMyRecipes(cached);
          fetchRecipes();
        } else {
          await fetchRecipes();
        }
      } catch (error) {
        console.error("Error loading recipes:", handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadInitialRecipes();
  }, [user]);

  const createRecipe = async (recipeData: RecipeCreationData): Promise<ApiResponse> => {
    try {
      console.log("Creating recipe with data:", recipeData);
      const { data: newRecipe } = await api.post("/recipes/me", recipeData);
      const updatedRecipes = [...myRecipes, newRecipe];
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const deleteRecipe = async (recipeId: number, force = false): Promise<ApiResponse> => {
    try {
      console.log("Deleting recipe with ID:", recipeId);
      await api.delete(`/recipes/me/${recipeId}${force ? '?force=true' : ''}`);
      const updatedRecipes = myRecipes.filter(r => r.id !== recipeId);
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };


  return (
    <MyRecipesContext.Provider
      value={{
        myRecipes,
        loading,
        fetchRecipes,
        createRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </MyRecipesContext.Provider>
  );
};