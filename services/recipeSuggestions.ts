import api from "@/utils/api";
import { RecipeShort } from "@/models/mealPlan";
import { handleApiError } from "@/utils/errorHandler";

export const fetchRecipeSuggestions = async(params: { meal_item_id?: number; dayIndex?: number; slot?: number, mealType?: string }) => {
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
    if (params.mealType) {
      queryParams.append('meal_type', params.mealType);
    }
    
    const { data } = await api.get<RecipeShort[]>(`/meal_plans/suggestions?${queryParams.toString()}`);
    return { success: true, error: null, data: data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};