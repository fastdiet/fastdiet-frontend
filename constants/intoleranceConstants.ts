import { TFunction } from "i18next";

export const INTOLERANCE_IDS = {
  DAIRY: 1,
  GLUTEN: 2,
  EGG: 3,
  PEANUT: 4,
  TREE_NUT: 5,
  SHELLFISH: 6,
  SEAFOOD: 7,
  SOY: 8,
  WHEAT: 9,
  SESAME: 10,
  SULFITE: 11,
  GRAIN: 12,
};

export const INTOLERANCE_EMOJIS = {
  [INTOLERANCE_IDS.DAIRY]: "🥛🧀",
  [INTOLERANCE_IDS.GLUTEN]: "🍞",
  [INTOLERANCE_IDS.EGG]: "🥚",
  [INTOLERANCE_IDS.PEANUT]: "🥜",
  [INTOLERANCE_IDS.TREE_NUT]: "🌰",
  [INTOLERANCE_IDS.SHELLFISH]: "🦞",
  [INTOLERANCE_IDS.SEAFOOD]: "🐟",
  [INTOLERANCE_IDS.SOY]: "🌱",
  [INTOLERANCE_IDS.WHEAT]: "🌾",
  [INTOLERANCE_IDS.SESAME]: "⚪",
  [INTOLERANCE_IDS.SULFITE]: "🧪",
  [INTOLERANCE_IDS.GRAIN]: "🌽",
};

export const getIntoleranceOptions = (t: TFunction) => {
  return [
    {
      id: INTOLERANCE_IDS.DAIRY,
      name: t("constants.intolerances.dairy"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.DAIRY],
    },
    {
      id: INTOLERANCE_IDS.GLUTEN,
      name: t("constants.intolerances.gluten"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.GLUTEN],
    },
    {
      id: INTOLERANCE_IDS.EGG,
      name: t("constants.intolerances.egg"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.EGG],
    },
    {
      id: INTOLERANCE_IDS.PEANUT,
      name: t("constants.intolerances.peanut"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.PEANUT],
    },
    {
      id: INTOLERANCE_IDS.TREE_NUT,
      name: t("constants.intolerances.treeNut"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.TREE_NUT],
    },
    {
      id: INTOLERANCE_IDS.SHELLFISH,
      name: t("constants.intolerances.shellfish"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.SHELLFISH],
    },
    {
      id: INTOLERANCE_IDS.SEAFOOD,
      name: t("constants.intolerances.seafood"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.SEAFOOD],
    },
    {
      id: INTOLERANCE_IDS.SOY,
      name: t("constants.intolerances.soy"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.SOY],
    },
    {
      id: INTOLERANCE_IDS.WHEAT,
      name: t("constants.intolerances.wheat"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.WHEAT],
    },
    {
      id: INTOLERANCE_IDS.SESAME,
      name: t("constants.intolerances.sesame"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.SESAME],
    },
    {
      id: INTOLERANCE_IDS.SULFITE,
      name: t("constants.intolerances.sulfite"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.SULFITE],
    },
    {
      id: INTOLERANCE_IDS.GRAIN,
      name: t("constants.intolerances.grain"),
      emoji: INTOLERANCE_EMOJIS[INTOLERANCE_IDS.GRAIN],
    },
  ];
};