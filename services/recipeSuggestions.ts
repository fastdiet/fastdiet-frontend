import api from "@/utils/api";
import { RecipeShort } from "@/models/mealPlan";
import { handleApiError } from "@/utils/errorHandler";

export const fetchRecipeSuggestions = async(meal_item_id: number) => {
   try {
    const { data } = await api.get<RecipeShort[]>(`/meal_plans/suggestions/${meal_item_id}`);
    return { success: true, error: null, data: data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};
