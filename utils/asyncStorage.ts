import { WeeklyMenu } from "@/context/MenuContext";
import UserPreferences from "@/models/user_preferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserPreferences = async (userPreferences : UserPreferences | null) => {
  try {
    await AsyncStorage.setItem("user_preferences", JSON.stringify(userPreferences));
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserPreferences = async () => {
  try {
    const cachedUserPreferences = await AsyncStorage.getItem("user_preferences");
    return cachedUserPreferences ? JSON.parse(cachedUserPreferences) : null;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const saveMenu = async (menu: WeeklyMenu) => {
  try {
    await AsyncStorage.setItem("menu", JSON.stringify(menu));
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getMenu = async () => {
  try {
    const cachedMenu = await AsyncStorage.getItem("menu");
    return cachedMenu ? JSON.parse(cachedMenu) : null;
  } catch (error: any) {
    throw new Error(error);
  }
}