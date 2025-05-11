import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "@/i18n/locales/en-US/translation.json";
import translationEs from "@/i18n/locales/es-ES/translation.json";
import { Platform } from "react-native";

const resources = {
  "es-ES": { translation: translationEs },
  "en-US": { translation: translationEn },
};

const getSavedLanguage = async (): Promise<string | null> => {
  if (
    Platform.OS === "web"
  ) {
    return Localization.locale;
    //return window.localStorage.getItem("language");
  } else {
    return await AsyncStorage.getItem("language");
  }
};

const initI18n = async () => {
  let savedLanguage = await getSavedLanguage();

  if (!savedLanguage) {
    savedLanguage = Localization.locale;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage,
    fallbackLng: "es-ES",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
