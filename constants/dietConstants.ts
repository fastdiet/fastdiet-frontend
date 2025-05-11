import { TFunction } from "i18next";

export const DIET_IDS = {
  BALANCED: 1,
  VEGETARIAN: 2,
  VEGAN: 3,
  GLUTEN_FREE: 4,
  PESCETARIAN: 5,
  KETOGENIC: 6,
  LACTO_VEGETARIAN: 7,
  OVO_VEGETARIAN: 8,
  PALEO: 9,
  PRIMAL: 10,
  LOW_FODMAP: 11,
  WHOLE30: 12,
};

export const DIET_EMOJIS = {
  [DIET_IDS.BALANCED]: "🍽️",
  [DIET_IDS.VEGETARIAN]: "🥦",
  [DIET_IDS.VEGAN]: "🌱",
  [DIET_IDS.GLUTEN_FREE]: "🚫🍞", 
  [DIET_IDS.PESCETARIAN]: "🐟",
  [DIET_IDS.KETOGENIC]: "🥩🥑",
  [DIET_IDS.LACTO_VEGETARIAN]: "🧀",
  [DIET_IDS.OVO_VEGETARIAN]: "🥚",
  [DIET_IDS.PALEO]: "🥩🍖",
  [DIET_IDS.PRIMAL]: "🍖🔥",
  [DIET_IDS.LOW_FODMAP]: "🍎🚫",
  [DIET_IDS.WHOLE30]: "🍽️🌱",
};

export const getDietOptions = (t: TFunction) => {
  return [
    {
      id: DIET_IDS.BALANCED,
      name: t("constants.diets.balanced"),
      emoji: DIET_EMOJIS[DIET_IDS.BALANCED],
    },
    {
      id: DIET_IDS.VEGETARIAN,
      name: t("constants.diets.vegetarian"),
      emoji: DIET_EMOJIS[DIET_IDS.VEGETARIAN],
    },
    {
      id: DIET_IDS.VEGAN,
      name: t("constants.diets.vegan"),
      emoji: DIET_EMOJIS[DIET_IDS.VEGAN],
    },
    {
      id: DIET_IDS.GLUTEN_FREE,
      name: t("constants.diets.glutenFree"),
      emoji: DIET_EMOJIS[DIET_IDS.GLUTEN_FREE],
    },
    {
      id: DIET_IDS.PESCETARIAN,
      name: t("constants.diets.pescetarian"),
      emoji: DIET_EMOJIS[DIET_IDS.PESCETARIAN],
    },
    {
      id: DIET_IDS.KETOGENIC,
      name: t("constants.diets.ketogenic"),
      emoji: DIET_EMOJIS[DIET_IDS.KETOGENIC],
    },
    {
      id: DIET_IDS.LACTO_VEGETARIAN,
      name: t("constants.diets.lactoVegetarian"),
      emoji: DIET_EMOJIS[DIET_IDS.LACTO_VEGETARIAN],
    },
    {
      id: DIET_IDS.OVO_VEGETARIAN,
      name: t("constants.diets.ovoVegetarian"),
      emoji: DIET_EMOJIS[DIET_IDS.OVO_VEGETARIAN],
    },
    {
      id: DIET_IDS.PALEO,
      name: t("constants.diets.paleo"),
      emoji: DIET_EMOJIS[DIET_IDS.PALEO],
    },
    {
      id: DIET_IDS.PRIMAL,
      name: t("constants.diets.primal"),
      emoji: DIET_EMOJIS[DIET_IDS.PRIMAL],
    },
    {
      id: DIET_IDS.LOW_FODMAP,
      name: t("constants.diets.lowFodmap"),
      emoji: DIET_EMOJIS[DIET_IDS.LOW_FODMAP],
    },
    {
      id: DIET_IDS.WHOLE30,
      name: t("constants.diets.whole30"),
      emoji: DIET_EMOJIS[DIET_IDS.WHOLE30],
    },
  ]
}
