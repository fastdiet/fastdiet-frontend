import { Platform } from "react-native";
import Constants from "expo-constants";

export const getBackendUrl = (): string => {
  const { API_URL_WEB, API_URL_ANDROID, API_URL_IOS } = Constants.expoConfig?.extra || {};
  if (Platform.OS === "android") {
    return API_URL_ANDROID;
  } else if (Platform.OS === "ios") {
    return API_URL_IOS;
  } else {
    return API_URL_WEB;
  }
};
