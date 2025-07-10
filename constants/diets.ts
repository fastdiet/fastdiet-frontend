import Diet from "@/models/diet";
import { TFunction } from "i18next";


const DIET_DATA = {
  "Balanced":          { id: 1,  emoji: "🍽️" },
  "Vegetarian":        { id: 2,  emoji: "🥦" },
  "Vegan":             { id: 3,  emoji: "🌱" },
  "Gluten Free":       { id: 4,  emoji: "🚫🍞" },
  "Pescetarian":       { id: 5,  emoji: "🐟" },
  "Ketogenic":         { id: 6,  emoji: "🥩🥑" },
  "Lacto-Vegetarian":  { id: 7,  emoji: "🧀" },
  "Ovo-Vegetarian":    { id: 8,  emoji: "🥚" },
  "Paleo":             { id: 9,  emoji: "🥩🍖" },
  "Primal":            { id: 10, emoji: "🍖🔥" },
  "Low FODMAP":        { id: 11, emoji: "🍎🚫" },
  "Whole30":           { id: 12, emoji: "🍽️🌱" },
};


export const getDietOptions = (t: TFunction): Diet[] => {
  
  return Object.entries(DIET_DATA).map(([nameInEnglish, data]) => {
    return {
      id: data.id,
      name: t(`constants.diets.${nameInEnglish}`),
      emoji: data.emoji,
    };
  });
};
