import { TFunction } from "i18next";
import { Apple, Coffee, Cookie, GlassWater, Leaf, LucideProps, Moon, Soup, Sun } from "lucide-react-native";

export interface MealTypeInfo {
  key: string;
  labelKey: string;
  icon: React.FC<LucideProps>;
  gender?: 'male' | 'female';
}

export const mainMealTypes: MealTypeInfo[] = [
  { key: 'breakfast', labelKey: 'constants.meals.breakfast', icon: Coffee, gender: 'male' },
  { key: 'lunch', labelKey: 'constants.meals.lunch', icon: Sun, gender: 'male' },
  { key: 'dinner', labelKey: 'constants.meals.dinner', icon: Moon, gender: 'female' },
];


export const extraMealTypes: MealTypeInfo[] = [
  { key: 'snack', labelKey: 'constants.meals.snack', icon: Apple, gender: 'male' },
  { key: 'dessert', labelKey: 'constants.meals.dessert', icon: Cookie, gender: 'male' },
  { key: 'salad', labelKey: 'constants.meals.salad', icon: Leaf, gender: 'female' },
  { key: 'beverage', labelKey: 'constants.meals.beverage', icon: GlassWater, gender: 'female' },
  { key: 'appetizer', labelKey: 'constants.meals.appetizer', icon: Soup, gender: 'male' },
];

export const allMealTypes: MealTypeInfo[] = [...mainMealTypes, ...extraMealTypes];

export type MealType = typeof allMealTypes[number]['key'];

const defaultMealType: MealTypeInfo = {
  key: 'default',
  labelKey: 'constants.meals.snack',
  icon: Apple,
  gender: 'male',
};

export const getMealTypeDetails = (mealKey: string): MealTypeInfo => {
  return allMealTypes.find(type => type.key === mealKey) || defaultMealType;
};

export const getMealTypeOptions = (t: TFunction, includeAllOption: boolean = false) => {
  const options = allMealTypes.map(type => ({
    id: type.key,
    label: t(type.labelKey),
    value: type.key,
  }));

  if (includeAllOption) {
    return [{ id: 'all', label: t('all'), value: 'all' }, ...options];
  }
  
  return options;
};
