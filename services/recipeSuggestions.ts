import api from "@/utils/api";
import { RecipeShort } from "@/models/mealPlan";
import { handleApiError } from "@/utils/errorHandler";

export const fetchRecipeSuggestions = async(params: { meal_item_id?: number; dayIndex?: number; slot?: number }) => {
   try {
    const queryParams = new URLSearchParams();
    if (params.meal_item_id) {
      queryParams.append('meal_item_id', params.meal_item_id.toString());
    }
    if (params.dayIndex !== undefined) {
      queryParams.append('day_index', params.dayIndex.toString());
    }
    if (params.slot !== undefined) {
      queryParams.append('slot', params.slot.toString());
    }
    
    const { data } = await api.get<RecipeShort[]>(`/meal_plans/suggestions?${queryParams.toString()}`);
    return { success: true, error: null, data: data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};