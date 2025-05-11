import * as SecureStore from "expo-secure-store";
import User from "@/models/user";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const saveAccessToken = async (accessToken: string) => {
  if (isWeb) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    await SecureStore.setItemAsync("accessToken", accessToken);
  }
};

export const deleteAccessToken = async () => {
  if (isWeb) {
    localStorage.removeItem("accessToken");
  } else {
    await SecureStore.deleteItemAsync("access_token");
  }
};

export const saveRefreshToken = async (refreshToken: string) => {
  if (isWeb) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  }
};

export const deleteRefreshToken = async () => {
  if (isWeb) {
     localStorage.removeItem("refreshToken");
  } else {
    await SecureStore.deleteItemAsync("refresh_token");
  }
 
};

export const saveUser = async (user: User | null) => {
  if (isWeb) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  }
};

export const getAccessToken = async () => {
  if (isWeb) {
    return localStorage.getItem("accessToken");
  } else {
    return await SecureStore.getItemAsync("accessToken");
  }
};

export const getRefreshToken = async () => {
  if (isWeb) {
    return localStorage.getItem("refreshToken");
  } else {
    return await SecureStore.getItemAsync("refreshToken");
  }
};

export const getUser = async (): Promise<User | null> => {
  let userString: string | null = null;

  if (isWeb) {
    userString = localStorage.getItem("user");
  } else {
    userString = await SecureStore.getItemAsync("user");
  }

  return userString ? JSON.parse(userString) as User : null;
};
