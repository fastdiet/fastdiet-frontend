import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { useAuth } from "@/hooks/useAuth";
import { RecipeDetail, RecipeShort } from "@/models/mealPlan";
import { getMyRecipes, saveMyRecipes } from "@/utils/asyncStorage"; 
import { ApiResponse } from "@/context/AuthContext";

import { RecipeCreationData } from "@/models/recipeInput";
import { UploadUrlResponse } from "@/models/imageUploader";


interface MyRecipesContextType {
  myRecipes: RecipeShort[];
  recipeDetailsCache: Record<number, RecipeDetail>; 
  loading: boolean;
  fetchRecipes: () => Promise<void>;
  getRecipeById: (id: number) => Promise<RecipeDetail>; 
  createRecipe: (recipeData: RecipeCreationData) => Promise<ApiResponse<{ newRecipe: RecipeDetail }>>;
  generateUploadUrl: (fileName: string) => Promise<UploadUrlResponse>
  deleteRecipe: (recipeId: number, force: boolean) => Promise<ApiResponse>;
  updateRecipe: (recipeId: number, updatedData: Partial<RecipeCreationData>) => Promise<ApiResponse<{ updatedRecipe: RecipeDetail }>>;
}

export const MyRecipesContext = createContext<MyRecipesContextType | undefined>(undefined);

export const MyRecipesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myRecipes, setMyRecipes] = useState<RecipeShort[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [recipeDetailsCache, setRecipeDetailsCache] = useState<Record<number, RecipeDetail>>({});


  const fetchRecipes = async () => {
    if (!user) {
      setMyRecipes([]);
      return;
    }
    
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
        setRecipeDetailsCache({}); 
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

  const getRecipeById = async (id: number): Promise<RecipeDetail> => {
    if (recipeDetailsCache[id]) {
      return recipeDetailsCache[id];
    }

    try {
      const { data } = await api.get<RecipeDetail>(`/recipes/${id}`);
      setRecipeDetailsCache(prev => ({ ...prev, [id]: data }));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const createRecipe = async (recipeData: RecipeCreationData): Promise<ApiResponse<{ newRecipe: RecipeDetail }>> => {
    try {
      console.log("Creating recipe with data:", recipeData);
      const { data: newRecipe } = await api.post("/recipes/me", recipeData);
      const newShortRecipe: RecipeShort = {
        id: newRecipe.id,
        title: newRecipe.title,
        image_url: newRecipe.image_url,
        ready_min: newRecipe.ready_min,
        calories: newRecipe.calories,
        servings: newRecipe.servings,
        dish_types: newRecipe.dish_types
      };

      const updatedRecipes = [newShortRecipe, ...myRecipes];
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);

      setRecipeDetailsCache(prev => ({ ...prev, [newRecipe.id]: newRecipe }));
      return { success: true, error: null, data: { newRecipe} };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const generateUploadUrl = async (fileName: string): Promise<UploadUrlResponse> => {
    try {
      const response = await api.post<UploadUrlResponse>('/recipes/generate-upload-url', {
        file_name: fileName,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      throw new Error("Could not get the upload URL from the server.");
    }
  }

  const updateRecipe = async (recipeId: number, recipeData: Partial<RecipeCreationData>): Promise<ApiResponse<{ updatedRecipe: RecipeDetail }>> => {
    try {
      const { data: updatedRecipe } = await api.patch(`/recipes/me/${recipeId}`, recipeData);
      const updatedShortRecipe: RecipeShort = {
        id: updatedRecipe.id,
        title: updatedRecipe.title,
        image_url: updatedRecipe.image_url,
        ready_min: updatedRecipe.ready_min,
        calories: updatedRecipe.calories,
        servings: updatedRecipe.servings,
        dish_types: updatedRecipe.dish_types
      };
      const updatedRecipes = myRecipes.map(recipe => recipe.id === recipeId ? updatedShortRecipe : recipe);
      
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      setRecipeDetailsCache(prev => ({ ...prev, [recipeId]: updatedRecipe }));
      
      return { success: true, error: null, data: {updatedRecipe} };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const deleteRecipe = async (recipeId: number, force = false): Promise<ApiResponse> => {
    try {
      await api.delete(`/recipes/me/${recipeId}${force ? '?force=true' : ''}`);
      const updatedRecipes = myRecipes.filter(r => r.id !== recipeId);
      setMyRecipes(updatedRecipes);
      await saveMyRecipes(updatedRecipes);
      setRecipeDetailsCache(prevCache => {
        const newCache = { ...prevCache };
        delete newCache[recipeId];
        return newCache;
      });
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
        recipeDetailsCache,
        getRecipeById,
        fetchRecipes,
        createRecipe,
        generateUploadUrl,
        updateRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </MyRecipesContext.Provider>
  );
};