export interface FormInputIngredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
}

export interface FormInputStep{
  id: string;
  description: string;
}

export interface ApiInputIngredient {
  name: string;
  amount: number;
  unit?: string;
}

export interface ApiInstructionStep {
  number: number;
  step: string;
  ingredients: []
  equipment: []
}

export interface RecipeCreationData {
  title: string;
  summary?: string;
  image_url?: string | null;
  ready_min?: number;
  servings?: number;
  ingredients: ApiInputIngredient[];
  analyzed_instructions?: ApiInstructionStep[];
}