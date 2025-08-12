import { TFunction } from "i18next";
import { LucideIcon, ShoppingBasket } from "lucide-react-native";

const AISLE_DATA: { [key: string]: { translationKey: string; icon: string } } = {
  // Basics
  "Baking":                         { translationKey: "baking", icon: "🍰" },
  "Pasta and Rice":                 { translationKey: "pastaAndRice", icon: "🍝" },
  "Cereal":                         { translationKey: "cereal", icon: "🥣" },
  "Pantry Items":                   { translationKey: "pantryItems", icon: "🥫" },
  "Canned and Jarred":              { translationKey: "cannedAndJarred", icon: "🫙" },
  "Spices and Seasonings":          { translationKey: "spicesAndSeasonings", icon: "🧂" },
  "Oil, Vinegar, Salad Dressing":   { translationKey: "oilsAndVinegars", icon: "🫒" },
  "Condiments":                     { translationKey: "condiments", icon: "🍶" },
  "Nut butters, Jams, and Honey":   { translationKey: "nutButtersAndJams", icon: "🍯" },

  // Fresh
  "Produce":                        { translationKey: "produce", icon: "🥬" },
  "Meat":                           { translationKey: "meat", icon: "🥩" },
  "Seafood":                        { translationKey: "seafood", icon: "🐟" },
  "Milk, Eggs, Other Dairy":        { translationKey: "dairy", icon: "🥛" },
  "Cheese":                         { translationKey: "cheese", icon: "🧀" },
  "Bakery/Bread":                   { translationKey: "bread", icon: "🍞" },
  "Refrigerated":                   { translationKey: "refrigerated", icon: "🧊" },
  "Frozen":                         { translationKey: "frozen", icon: "❄️" },

  // Drinks
  "Beverages":                      { translationKey: "beverages", icon: "🥤" },
  "Tea and Coffee":                 { translationKey: "teaAndCoffee", icon: "☕️" },
  "Alcoholic Beverages":            { translationKey: "alcoholicBeverages", icon: "🍷" },

  // Snacks and Sweets
  "Savory Snacks":                  { translationKey: "savorySnacks", icon: "🥨" },
  "Sweet Snacks":                   { translationKey: "sweetSnacks", icon: "🍫" },
  "Nuts":                           { translationKey: "nuts", icon: "🥜" },
  "Dried Fruits":                   { translationKey: "driedFruits", icon: "🍇" },

  // Speciality
  "Health Foods":                   { translationKey: "healthFoods", icon: "❤️‍🩹" },
  "Ethnic Foods":                   { translationKey: "ethnicFoods", icon: "🗺️" },
  "Gluten Free":                    { translationKey: "glutenFree", icon: "🚫🌾" },
  "Gourmet":                        { translationKey: "gourmet", icon: "🧑‍🍳" },
  "Online":                         { translationKey: "online", icon: "💻" },
  "Grilling Supplies":              { translationKey: "grillingSupplies", icon: "🔥" },
  "Not in Grocery Store/Homemade":  { translationKey: "homemade", icon: "🏠" },

  "Generic":                        { translationKey: "generic", icon: "🧺" }, 
};

const DEFAULT_AISLE = {
  icon: "🛒", 
};

interface AisleInfo {
  name: string;
  icon: string | LucideIcon;
}

export const getAisleInfo = (aisleName: string, t: TFunction): AisleInfo => {
  const aisleData = AISLE_DATA[aisleName];

  if (aisleData) {
    return {
      name: t(`constants.aisles.${aisleData.translationKey}`),
      icon: aisleData.icon,
    };
  }
  return {
    name: aisleName.charAt(0).toUpperCase() + aisleName.slice(1),
    icon: DEFAULT_AISLE.icon,
  };
};