import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { getMenu, saveMenu} from "@/utils/asyncStorage";
import { AppState } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { MealPlan, RecipeShort, SlotMeal } from "@/models/mealPlan";
import { ApiResponse } from "@/context/AuthContext";
import { useMyRecipes } from "@/hooks/useMyRecipes";


interface MenuContextType {
  menu: MealPlan | null;
  loading: boolean;
  generateMenu: () => Promise<ApiResponse>;
  deleteMeal: (mealItemId: number) => Promise<ApiResponse>;
  removeRecipeFromPlan: (recipeIdToRemove: number) => void;
  updateMealRecipe: (dayIndex: number, slotMealToChange: SlotMeal, newRecipe: RecipeShort) => Promise<ApiResponse>;
  addMealRecipe: (dayIndex: number, slot: number, mealType: string, newRecipe: RecipeShort) => Promise<ApiResponse>;
  fetchMenuFromServer: (isSilentRefresh?: boolean) => Promise<void>;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menu, setMenu] = useState<MealPlan | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { myRecipes } = useMyRecipes();

  const fetchAndSetMenuFromServer = async (isSilentRefresh: boolean = false) => {
    if (!isSilentRefresh) {
      setLoading(true);
    }
    
    try {
      const { data: apiMenuData } = await api.get("/meal_plans/me");
      if (JSON.stringify(apiMenuData) !== JSON.stringify(menu)) {
        setMenu(apiMenuData);
        await saveMenu(apiMenuData);
      }
    } catch (err) {
      console.log("Error fetching menu from server:", err);
    } finally {
      if (!isSilentRefresh) setLoading(false);
    }
  };

  const loadInitialMenuFlow = async () => {
      setLoading(true);
      
      try {
        const storedApiMenu = await getMenu();
        if (storedApiMenu) {
          setMenu(storedApiMenu);
          await fetchAndSetMenuFromServer(true);
        } else {
          await fetchAndSetMenuFromServer(false);
        }
      } catch (err) {
        console.error("Error during initial menu load flow:", err);
        setMenu(null);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

  useEffect(() => {
    if(user){
      loadInitialMenuFlow();
    }else {
      setMenu(null);
      setLoading(false);
      setInitialLoadComplete(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !initialLoadComplete) return;
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && !loading) {
        await fetchAndSetMenuFromServer(true);
      }
    });
    return () => { subscription.remove(); };
  }, [user, initialLoadComplete, loading]);


  const generateMenu = async (): Promise<ApiResponse> => {
    try {
      const response = await api.post("/meal_plans/generate");
      setMenu(response.data.meal_plan);
      await saveMenu(response.data.meal_plan);
      return { success: true, data: response.data, error: null};
    } catch (error) {
      return {success: false, error: handleApiError(error)};
    }
  };

  const updateMealRecipe = async (dayIndex: number, slotMealToChange: SlotMeal, newRecipe: RecipeShort): Promise<ApiResponse> => {
    if (!menu) {
      return { success: false, error: { code: null, message: "No menu available" } };
    }
    const originalMenu = JSON.parse(JSON.stringify(menu));
    
    try {
      const updatedDays = menu.days.map((dayGroup) => {
        if (dayGroup.day !== dayIndex) {
          return dayGroup;
        }

        const updatedMeals = dayGroup.meals.map((meal) =>
          meal.meal_item_id === slotMealToChange.meal_item_id
            ? { ...meal, recipe: newRecipe }
            : meal
        );

        return { ...dayGroup, meals: updatedMeals };
      });
      
      const updatedMenu: MealPlan = {...menu, days: updatedDays,};

      setMenu(updatedMenu);
      await saveMenu(updatedMenu);

      await api.patch(`/meal_plans/meal_items/${slotMealToChange.meal_item_id}`, {new_recipe_id: newRecipe.id,});
      
      return { success: true, error: null };
    } catch (error: any) {
      setMenu(originalMenu);
      await saveMenu(originalMenu);
      return { success: false, error: handleApiError(error)};
    }
  };

  const addMealRecipe = async (dayIndex: number, slot: number, mealType: string, newRecipe: RecipeShort): Promise<ApiResponse> => {
    if (!menu) return { success: false, error: {code: null, message: "No menu available"} };
    const originalMenu = JSON.parse(JSON.stringify(menu));

    const tempItemId = Date.now()
    let mealAddedOrUpdated = false;
    const updatedDays = menu.days.map(day => {
      if (day.day !== dayIndex) return day;

      const updatedMeals = day.meals.map(meal => {
        if (meal.slot === slot) {
          mealAddedOrUpdated = true;
          return { ...meal, recipe: newRecipe, meal_type: mealType, meal_item_id: tempItemId };
        }
          return meal;
      });
        
      if (!mealAddedOrUpdated) {
        updatedMeals.push({ meal_item_id: tempItemId, slot: slot, meal_type: mealType, recipe: newRecipe });
      }
      return { ...day, meals: updatedMeals };
    });
    setMenu({ ...menu, days: updatedDays });

    try {
      const { data: finalNewMealItem } = await api.post<SlotMeal>(`/meal_plans/meal_items`, {
        meal_plan_id: menu.id,
        day_index: dayIndex,
        slot: slot,
        recipe_id: newRecipe.id,
        meal_type: mealType
      });

      const finalMenuState: MealPlan = { ...menu, days: originalMenu.days };
      const finalUpdatedDays = finalMenuState.days.map(day => {
        if (day.day !== dayIndex) return day;
          
        let mealReplaced = false;
        const finalMeals = day.meals.map((m) => {
          if (m.slot === slot) {
            mealReplaced = true;
            return finalNewMealItem;
          }
          return m;
        });
        if (!mealReplaced) {
          finalMeals.push(finalNewMealItem);
        }
        return { ...day, meals: finalMeals };
      });

      setMenu({ ...finalMenuState, days: finalUpdatedDays });
      await saveMenu({ ...finalMenuState, days: finalUpdatedDays });

      return { success: true, error: null, data: finalNewMealItem };

    } catch (error) {
        setMenu(originalMenu);
        await saveMenu(originalMenu);
        return { success: false, error: handleApiError(error)};
    }
  };

  const deleteMeal = async (mealItemId: number): Promise<ApiResponse> => {
    if (!menu) return { success: false, error: {code: null, message: "No menu available"} };
    const originalMenu = JSON.parse(JSON.stringify(menu));
    let mealToDelete: SlotMeal | undefined;

    menu.days.forEach(day => {
      const found = day.meals.find(meal => meal.meal_item_id === mealItemId);
      if (found) mealToDelete = found;
    });

    if (!mealToDelete) {
      return { success: false, error: { message: "Meal not found", code: null} };
    }

    const updatedMenu: MealPlan = {
      ...menu,
      days: menu.days.map(day => ({
        ...day,
        meals: day.meals.map(meal => {
          if (meal.meal_item_id !== mealItemId) {
            return meal;
          }

          if (meal.slot <= 2) {
            return {...meal, recipe: null, meal_item_id: null,};
          }
          return null;
        }).filter(Boolean) as SlotMeal[]
      }))
    };
    
    setMenu(updatedMenu);

    try {
      await api.delete(`/meal_plans/meal_items/${mealItemId}`);
      await saveMenu(updatedMenu);
      return { success: true, error: null };
    } catch (error) {
      setMenu(originalMenu);
      await saveMenu(originalMenu);
      return { success: false, error: handleApiError(error) };
    }
  };

  const removeRecipeFromPlan = (recipeIdToRemove: number) => {
    if (!menu) return;
    const updatedMenu: MealPlan = {
      ...menu,
      days: menu.days.map(day => ({
        ...day,
        meals: day.meals.map(meal => {
          if (meal.recipe?.id !== recipeIdToRemove) {
            return meal;
          }
          if (meal.slot <= 2) {
            return { ...meal, recipe: null, meal_item_id: null };
          }
          return null;
        }).filter(Boolean) as SlotMeal[]
      }))
    };

    setMenu(updatedMenu);
    saveMenu(updatedMenu);
  };
  

   useEffect(() => {
    if (!menu || myRecipes.length === 0) {
      return;
    }

    const masterRecipes = new Map(myRecipes.map(recipe => [recipe.id, recipe]));
    let needsUpdate = false;

    const newDays = menu.days.map(day => {
      const newMeals = day.meals.map(meal => {
        if (meal.recipe) {
          const masterRecipe = masterRecipes.get(meal.recipe.id);
          
          if (masterRecipe && JSON.stringify(masterRecipe) !== JSON.stringify(meal.recipe)) {
            needsUpdate = true;
            return { ...meal, recipe: masterRecipe };
          }
        }
        return meal;
      });
      return { ...day, meals: newMeals };
    });

    if (needsUpdate) {
      console.log("Sincronizando el menú con los datos de recetas actualizados...");
      const newMenu = { ...menu, days: newDays };
      setMenu(newMenu);
      saveMenu(newMenu); 
    }

  }, [myRecipes, menu]);


  
  const value = {
    menu,
    loading,
    generateMenu,
    updateMealRecipe,
    addMealRecipe,
    removeRecipeFromPlan,
    deleteMeal,
    fetchMenuFromServer: () => fetchAndSetMenuFromServer(false),
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
