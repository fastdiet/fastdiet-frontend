import { TFunction } from "i18next";

export const CUISINE_IDS = {
  EUROPEAN: 1,
  AMERICAN: 2,
  ASIAN: 3,
  AFRICAN: 4,
  MEDITERRANEAN: 5,
  LATIN_AMERICAN: 6,
  SPANISH: 7,
  ITALIAN: 8,
  FRENCH: 9,
  BRITISH: 10,
  GERMAN: 11,
  GREEK: 12,
};

export const CUISINE_EMOJIS = {
  [CUISINE_IDS.EUROPEAN]: "🍽️",         
  [CUISINE_IDS.AMERICAN]: "🍔",           
  [CUISINE_IDS.ASIAN]: "🍣",            
  [CUISINE_IDS.AFRICAN]: "🫖",            
  [CUISINE_IDS.MEDITERRANEAN]: "🫒",    
  [CUISINE_IDS.LATIN_AMERICAN]: "🌮",   
  [CUISINE_IDS.SPANISH]: "🥘",          
  [CUISINE_IDS.ITALIAN]: "🍕",           
  [CUISINE_IDS.FRENCH]: "🥐",             
  [CUISINE_IDS.BRITISH]: "🍵",            
  [CUISINE_IDS.GERMAN]: "🥨",            
  [CUISINE_IDS.GREEK]: "🥙",          
};

export const getCuisineOptions = (t: TFunction) => {
  return [
    {
      id: CUISINE_IDS.EUROPEAN,
      name: t("constants.cuisines.european"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.EUROPEAN],
    },
    {
      id: CUISINE_IDS.AMERICAN,
      name: t("constants.cuisines.american"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.AMERICAN],
    },
    {
      id: CUISINE_IDS.ASIAN,
      name: t("constants.cuisines.asian"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.ASIAN],
    },
    {
      id: CUISINE_IDS.AFRICAN,
      name: t("constants.cuisines.african"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.AFRICAN],
    },
    {
      id: CUISINE_IDS.MEDITERRANEAN,
      name: t("constants.cuisines.mediterranean"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.MEDITERRANEAN],
    },
    {
      id: CUISINE_IDS.LATIN_AMERICAN,
      name: t("constants.cuisines.latinAmerican"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.LATIN_AMERICAN],
    },
    {
      id: CUISINE_IDS.SPANISH,
      name: t("constants.cuisines.spanish"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.SPANISH],
    },
    {
      id: CUISINE_IDS.ITALIAN,
      name: t("constants.cuisines.italian"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.ITALIAN],
    },
    {
      id: CUISINE_IDS.FRENCH,
      name: t("constants.cuisines.french"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.FRENCH],
    },
    {
      id: CUISINE_IDS.BRITISH,
      name: t("constants.cuisines.british"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.BRITISH],
    },
    {
      id: CUISINE_IDS.GERMAN,
      name: t("constants.cuisines.german"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.GERMAN],
    },
    {
      id: CUISINE_IDS.GREEK,
      name: t("constants.cuisines.greek"),
      emoji: CUISINE_EMOJIS[CUISINE_IDS.GREEK],
    },
  ];
};
