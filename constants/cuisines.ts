import { TFunction } from "i18next";
import Cuisine from "@/models/cuisine";

const CUISINE_DATA = {
  "European":        { id: 1,  emoji: "🍽️" },
  "American":        { id: 2,  emoji: "🍔" },
  "Asian":           { id: 3,  emoji: "🍣" },
  "African":         { id: 4,  emoji: "🫖" },
  "Mediterranean":   { id: 5,  emoji: "🫒" },
  "Latin American":  { id: 6,  emoji: "🌮" },
  "Spanish":         { id: 7,  emoji: "🥘" },
  "Italian":         { id: 8,  emoji: "🍕" },
  "French":          { id: 9,  emoji: "🥐" },
  "British":         { id: 10, emoji: "🍵" },
  "German":          { id: 11, emoji: "🥨" },
  "Greek":           { id: 12, emoji: "🥙" },
};

export const getCuisineOptions = (t: TFunction): Cuisine[] => {
  return Object.entries(CUISINE_DATA).map(([nameInEnglish, data]) => ({
    id: data.id,
    name: t(`constants.cuisines.${nameInEnglish}`),
    emoji: data.emoji,
  }));
};