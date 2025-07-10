import { TFunction } from "i18next";
import Intolerance from "@/models/intolerance";

const INTOLERANCE_DATA = {
  "Dairy":      { id: 1,  emoji: "🥛" },
  "Gluten":     { id: 2,  emoji: "🍞" },
  "Egg":        { id: 3,  emoji: "🥚" },
  "Peanut":     { id: 4,  emoji: "🥜" },
  "Tree Nut":   { id: 5,  emoji: "🌰" },
  "Shellfish":  { id: 6,  emoji: "🦞" },
  "Seafood":    { id: 7,  emoji: "🐟" },
  "Soy":        { id: 8,  emoji: "🌱" },
  "Wheat":      { id: 9,  emoji: "🌾" },
  "Sesame":     { id: 10, emoji: "⚪" },
  "Sulfite":    { id: 11, emoji: "🧪" },
  "Grain":      { id: 12, emoji: "🌽" },
};

export const getIntoleranceOptions = (t: TFunction): Intolerance[] => {
  return Object.entries(INTOLERANCE_DATA).map(([nameInEnglish, data]) => ({
    id: data.id,
    name: t(`constants.intolerances.${nameInEnglish}`),
    emoji: data.emoji,
  }));
};