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
  addMealRecipe: (dayIndex: number, slot: number, newRecipe: RecipeShort) => Promise<ApiResponse>;
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


  const generateMenu = async () => {
    try {
      const { data: menuData } = await api.post("/meal_plans/generate");
      setMenu(menuData);
      await saveMenu(menuData);
      return { success: true, error: null};
    } catch (error) {
      return {success: false, error: handleApiError(error)};
    }
  };

  const updateMealRecipe = async (dayIndex: number, slotMealToChange: SlotMeal, newRecipe: RecipeShort): Promise<ApiResponse> => {
    //TODO NO MENU AVAILABLE
    if (!menu) return { success: false, error: {code: null, message: "No menu available"} };
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

  const addMealRecipe = async (dayIndex: number, slot: number, newRecipe: RecipeShort): Promise<ApiResponse> => {
    if (!menu) return { success: false, error: {code: null, message: "No menu available"} };
    const originalMenu = JSON.parse(JSON.stringify(menu));

    const tempMealItemId = Date.now();
    const tempNewMealItem: SlotMeal = {
      meal_item_id: tempMealItemId,
      recipe: newRecipe,
      slot: slot,
    };

    const updatedDays = menu.days.map(day => {
      if (day.day !== dayIndex) return day;
      return { ...day, meals: [...day.meals, tempNewMealItem] };
    });
    
    const updatedMenu: MealPlan = { ...menu, days: updatedDays };
    setMenu(updatedMenu);

    try {
      const { data: finalNewMealItem } = await api.post<SlotMeal>(`/meal_plans/meal_items`, {
        meal_plan_id: menu.id,
        day_index: dayIndex,
        slot: slot,
        recipe_id: newRecipe.id
      });

     const finalUpdatedDays = updatedMenu.days.map(day => {
        if (day.day !== dayIndex) return day;
        return {
          ...day,
          meals: day.meals.map(meal => meal.meal_item_id === tempMealItemId ? finalNewMealItem : meal),
        };
      });
      const finalMenu: MealPlan = { ...menu, days: finalUpdatedDays };
      setMenu(finalMenu);
      await saveMenu(finalMenu);

      return { success: true, error: null };
    } catch (error) {
        setMenu(originalMenu);
        await saveMenu(originalMenu);
        return { success: false, error: handleApiError(error)};
    }
  };

  const deleteMeal = async (mealItemId: number): Promise<ApiResponse> => {
    if (!menu) return { success: false, error: {code: null, message: "No menu available"} };
    const originalMenu = JSON.parse(JSON.stringify(menu));

    const updatedMenu: MealPlan = {
      ...menu,
      days: menu.days.map(day => ({
        ...day,
        meals: day.meals.filter(meal => meal.meal_item_id !== mealItemId)
      }))
    };
    setMenu(updatedMenu); 

    try {
      await api.delete(`/meal_plans/meal_items/${mealItemId}`);
      console.log(updatedMenu)
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
    const newMenu: MealPlan = {
      ...menu,
      days: menu.days.map(day => ({
        ...day,
        meals: day.meals.filter(meal => meal.recipe?.id !== recipeIdToRemove)
      }))
    };
    setMenu(newMenu);
    saveMenu(newMenu);
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
      {(initialLoadComplete || menu) ? children : null}
    </MenuContext.Provider>
  );
};
