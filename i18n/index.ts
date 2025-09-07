import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "@/i18n/locales/en-US/translation.json";
import translationEs from "@/i18n/locales/es-ES/translation.json";

const resources = {
  "es-ES": { translation: translationEs },
  "en-US": { translation: translationEn },
};

const normalizeLanguageCode = (locale: string): string => {
  if (locale.startsWith("es")) return "es-ES";
  if (locale.startsWith("en")) return "en-US";
  return "en-US";
};

const getSavedLanguage = async (): Promise<string> => {
  try {
    const storedLang = await AsyncStorage.getItem("language");
    if (storedLang) return normalizeLanguageCode(storedLang);

    const systemLang = Localization.getLocales()[0]?.languageTag || "en-US";
    const normalizedLang = normalizeLanguageCode(systemLang);
    await AsyncStorage.setItem("language", normalizedLang);
    return normalizedLang;
  } catch (error) {
    console.error("Error getting saved language:", error);
    return "en-US";
  }
};

export const initI18n = async () => {
  const savedLanguage = await getSavedLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};
export default i18n;
