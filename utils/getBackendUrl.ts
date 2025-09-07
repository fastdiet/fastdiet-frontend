import { Platform } from "react-native";
import Constants from "expo-constants";

export const getBackendUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  const { API_URL_WEB, API_URL_ANDROID, API_URL_IOS } = Constants.expoConfig?.extra || {};
  if (Platform.OS === "android") {
    return API_URL_ANDROID as string;
  } else if (Platform.OS === "ios") {
    return API_URL_IOS as string;
  } else {
    return API_URL_WEB as string;
  }
};