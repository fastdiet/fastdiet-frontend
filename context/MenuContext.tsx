import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { getMenu, saveMenu} from "@/utils/asyncStorage";
import { AppState } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { MealPlan } from "@/models/mealPlan";
import { ApiResponse } from "@/context/AuthContext";




interface MenuContextType {
  menu: MealPlan | null;
  loading: boolean;
  generateMenu: () => Promise<ApiResponse>;
  deleteMeal: (dayIndex: number, slotIndex: number) => Promise<ApiResponse>;
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

  const fetchAndSetMenuFromServer = async (isSilentRefresh: boolean = false) => {
    if (!isSilentRefresh) {
      setLoading(true);
    }
    
    try {
      const { data: apiMenuData } = await api.get("/meal_plans/me");
        setMenu(apiMenuData);
        await saveMenu(apiMenuData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.log("Error fetching menu from server:", errorMessage);
    } finally {
      if (!isSilentRefresh) {
        setLoading(false);
      }
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
        const errorMessage = handleApiError(err);
        console.error("Error during initial menu load flow:", errorMessage);
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
    let subscription: ReturnType<typeof AppState.addEventListener> | null = null;
    if (user && initialLoadComplete) {
      subscription = AppState.addEventListener('change', async (nextAppState) => {
        if (nextAppState === 'active' && !loading) {
          await fetchAndSetMenuFromServer(true);
        }
      });
    }
    return () => {
      subscription?.remove();
    };
  }, [user, initialLoadComplete, loading]);


  const generateMenu = async () => {
    try {
      const { data: menuData } = await api.post("/meal_plans/generate");
      setMenu(menuData);
      await saveMenu(menuData);
      return { success: true, error: ""};
    } catch (error) {
      return {success: false, error: handleApiError(error)};
    }
  };

  const deleteMeal = async (dayIndex: number, slotIndex: number): Promise<ApiResponse> => {
    if (!menu) return { success: false, error: "No menu available" };

    try {
      await api.delete(`/meal_plans/me/day/${dayIndex}/slot/${slotIndex}`);

      const newMenu: MealPlan = {
        ...menu,
        days: menu.days.map(dayGroup => 
          dayGroup.day === dayIndex 
            ? {
                ...dayGroup,
                meals: dayGroup.meals.filter(meal => meal.slot !== slotIndex)
              }
            : dayGroup
        )
      };
    
    setMenu(newMenu);
    await saveMenu(newMenu);

      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };


  
  const value = {
    menu,
    loading,
    generateMenu,
    deleteMeal,
    fetchMenuFromServer: () => fetchAndSetMenuFromServer(false),
  };

  return (
    <MenuContext.Provider value={value}>
      {(initialLoadComplete || menu) ? children : null}
    </MenuContext.Provider>
  );
};
