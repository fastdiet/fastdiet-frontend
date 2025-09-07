export interface Measure {
  amount: number;
  unit?: string
}

export interface ShoppingListItem {
  ingredientId: number;
  name: string;
  image_filename?: string;
  amount?: number;
  unit?: string;
  measures: {
    [system: string]: Measure;
  };
  pantryItem: boolean;
  aisle: string;
  cost: number;
}

export interface Aisle {
  aisle: string;
  items: ShoppingListItem[];
}

export interface ShoppingListResponse {
  aisles: Aisle[];
  cost: number;
}