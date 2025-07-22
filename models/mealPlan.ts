
export interface RecipeShort {
  id: number;
  spoonacular_id?: number | null;
  title: string;
  image_url?: string | null;
  ready_min?: number | null;
  calories?: number | null;
  servings?: number | null;
}

export interface IngredientInfo {
  id: number;
  name: string;
  image_filename?: string | null;
  aisle?: string | null;
}

export interface RecipeIngredient {
  original_ingredient_name?: string | null;
  amount: number;
  unit?: string | null;
  measures_json?: Record<string, any> | null;
  ingredient: IngredientInfo;
}

export interface NutrientDetail {
  name: string;
  amount: number;
  unit: string;
  is_primary: boolean;
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients?: { id: number; name: string; localizedName: string; image: string }[];
  equipment?: { id: number; name: string; localizedName: string; image: string }[];
  length?: { number: number; unit: string };
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface RecipeDetail {
  id: number;
  spoonacular_id?: number | null;
  title: string;
  image_url?: string | null;
  ready_min?: number | null;
  servings?: number | null;
  summary?: string | null;
  vegetarian?: boolean | null;
  vegan?: boolean | null;
  gluten_free?: boolean | null;
  dairy_free?: boolean | null;
  very_healthy?: boolean | null;
  cheap?: boolean | null;
  very_popular?: boolean | null;
  sustainable?: boolean | null;
  low_fodmap?: boolean | null;

  preparation_min?: number | null;
  cooking_min?: number | null;
  calories?: number | null;
  analyzed_instructions?: AnalyzedInstruction[] | null; 
  cuisines?: string[];
  dish_types?: string[];
  diets?: string[];
  
  ingredients: RecipeIngredient[];
  nutrients: NutrientDetail[];
}

export interface SlotMeal{
  meal_item_id: number;
  slot: number;
  recipe: RecipeShort | null;
}

export interface DayMealsGroup{
  day: number;
  meals: SlotMeal[];
}

export interface MealPlan {
  id: number | null;
  days: DayMealsGroup[];
}

