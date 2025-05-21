import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { getMenu, saveMenu} from "@/utils/asyncStorage";

export interface Meal {
  id: number;
  name: string;
  calories: number;
}

export interface DailyMenu {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

export type WeeklyMenu = {
  [day in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"]: DailyMenu
};

export type ApiResponse<T = never> = {
  success: boolean;
  error: string;
  data?: T; 
};

interface MenuContextType {
  menu: WeeklyMenu | null;
  loading: boolean;
  generateMenu: () => Promise<ApiResponse>;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const loadStoredMenu = async () => {
        const storedMenu = await getMenu();
        if (storedMenu){
            setMenu(storedMenu);
        }else {
            await loadMenu();
        }
      };
      
      //loadStoredMenu();
      setLoading(false);
    }, []);


  const loadMenu = async () => {
    try {
      const { data: menuData } = await api.get("/users/menu-weekly");
      setMenu(menuData);
      await saveMenu(menuData);
    } catch (error) {
      console.error("Error loading menu", error);
    }
  };

  const generateMenu = async () => {
    try {
      const { data: menuData } = await api.post("/menu/generate-weekly", {
        user_id: "x",
        user_preferences: {
         
        },
      });
      await saveMenu(menuData);
      setMenu(menuData);
      return { success: true, error: ""};
    } catch (error) {
      return {success: false, error: handleApiError(error)};
    }
  };

  const value = {
    menu,
    loading,
    generateMenu,
  };

  return (
    <MenuContext.Provider value={value}>
      {!loading && children}
    </MenuContext.Provider>
  );
};
