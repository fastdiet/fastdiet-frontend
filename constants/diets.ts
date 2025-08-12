import Diet from "@/models/diet";
import { TFunction } from "i18next";


const DIET_DATA = {
  "Balanced":          { id: 1,  emoji: "🍽️" },
  "Vegetarian":        { id: 2,  emoji: "🥦" },
  "Vegan":             { id: 3,  emoji: "🌱" },
  "Gluten Free":       { id: 4,  emoji: "🚫🍞" },
  "Dairy Free":        { id: 5,  emoji: "🚫🥛" },
  "Pescatarian":       { id: 6,  emoji: "🐟" },
  "Ketogenic":         { id: 7,  emoji: "🥩🥑" },
  "Lacto-Vegetarian":  { id: 8,  emoji: "🧀" },
  "Ovo-Vegetarian":    { id: 9,  emoji: "🥚" },
  "Paleo":             { id: 10,  emoji: "🥩🍖" },
  "Primal":            { id: 11, emoji: "🍖🔥" },
  "Low Fodmap":        { id: 12, emoji: "🍎🚫" },
  "Whole 30":           { id: 13, emoji: "🍽️🌱" },
};


export const getDietOptions = (t: TFunction): Diet[] => {
  
  return Object.entries(DIET_DATA).map(([nameInEnglish, data]) => {
    return {
      id: data.id,
      name: t(`constants.diets.${data.id}`),
      emoji: data.emoji,
    };
  });
};
