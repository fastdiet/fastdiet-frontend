import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import User from "@/models/user";
import UserPreferences from "@/models/user_preferences";
import {
  saveAccessToken,
  saveRefreshToken,
  saveUser,
  getUser,
  deleteAccessToken,
  deleteRefreshToken,
} from "@/utils/secureTokens";
import api from "@/utils/api";
import { handleApiError } from "@/utils/errorHandler";
import { getUserPreferences, saveUserPreferences } from "@/utils/asyncStorage";

WebBrowser.maybeCompleteAuthSession();

export type ApiResponse<T = never> = {
  success: boolean;
  error: string;
  data?: T; 
};

interface AuthContextType {
  // Auth state
  user: User | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  // Auth methods
  promptAsync: () => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<ApiResponse>;
  register: (email: string, password: string) => Promise<ApiResponse>;
  completeBasicInfo: (username: string, name: string, gender: string, age: number, weight: number, height: number) => Promise<ApiResponse>;
  selectActivity: (activityLevel: string) => Promise<ApiResponse>;
  selectGoal: (goal: string) => Promise<ApiResponse>;
  selectDiet: (diet_type_id: number) => Promise<ApiResponse>;
  selectCuisines: (cuisine_ids: number[]) => Promise<ApiResponse>;
  selectIntolerances: (intolerance_ids: number[]) => Promise<ApiResponse>;
  // Verification methods
  sendVerificationCode: (email: string) => Promise<ApiResponse>;
  verifyEmail: (code: string) => Promise<ApiResponse>;

  // Password reset methods
  sendPasswordResetCode: (email: string) => Promise<ApiResponse>;
  verifyPasswordResetCode: (code: string) => Promise<ApiResponse>;
  resetPassword: (newPassword: string) => Promise<ApiResponse>;
  emailReset: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailReset, setEmailReset] = useState<string>("");
  const [resetCode, setResetCode] = useState<string>("");
  const redirectUri = AuthSession.makeRedirectUri({ scheme: "fastdiet" });
  console.log("Redirección URI: ", redirectUri);

  // Google Auth config
  const webClientId = "x";
  const iosClientId = "x";
  const androidClientId = "x";
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId,
    responseType: "id_token",
    scopes: ["profile", "email"],
    extraParams: { access_type: "offline", prompt: "consent" },
    redirectUri,
  });

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      if (storedUser) setUser(storedUser);
    };
    const loadUserPreferences = async () => {
      const storedUserPreferences = await getUserPreferences();
      if (storedUserPreferences) setUserPreferences(storedUserPreferences);
    };
    
    loadUser();
    loadUserPreferences();
    setLoading(false);
  }, []);

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleToken(response.params.id_token);
    }
  }, [response]);

  const handleGoogleToken = async (idToken: string | undefined) => {
    if (!idToken) return;

    try {
      const { data: authResponse } = await api.post(
        "/login-with-google",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      await Promise.all([
        saveAccessToken(authResponse.tokens.access_token),
        saveRefreshToken(authResponse.tokens.refresh_token),
        saveUser(authResponse.user),
      ]);

      setUser(authResponse.user);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  // Auth methods
  const login = async (userid: string, password: string) => {
    try {
      const { data: authResponse } = await api.post(
        "/login",
        new URLSearchParams({ username: userid, password })
      );

      await Promise.all([
        saveAccessToken(authResponse.tokens.access_token),
        saveRefreshToken(authResponse.tokens.refresh_token),
        saveUser(authResponse.user),
      ]);

      setUser(authResponse.user);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data: userData } = await api.post("/register", {
        email,
        password,
      });
      await saveUser(userData);
      setUser(userData);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const logout = async () => {
    await Promise.all([
      saveUser(null),
      saveUserPreferences(null),
      deleteAccessToken(),
      deleteRefreshToken()
    ]);
    setUser(null);
    setUserPreferences(null);
  };

  const completeBasicInfo = async (
    username: string,
    name: string,
    gender: string,
    age: number,
    weight: number,
    height: number
  ) => {
    try {
      const updatedUser = { ...user, username, name , gender, age, weight, height };
      await api.put(`/users/`, updatedUser);
      await saveUser(updatedUser);
      setUser(updatedUser);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectActivity = async (activity: string) => {
    try {
      const res = await api.patch("/user_preferences/activity-level", {activity_level: activity});
      setUserPreferences(res.data);
      saveUserPreferences(res.data);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectGoal = async (goal: string) => {
    try {
      const res = await api.patch("/user_preferences/goal", {goal: goal});
      setUserPreferences(res.data);
      saveUserPreferences(res.data);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectDiet = async (diet_type_id: number) => {
    try {
      const res = await api.patch("/user_preferences/diet-type", {id: diet_type_id});
      setUserPreferences(res.data);
      saveUserPreferences(res.data);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectCuisines = async (cuisine_ids: number[]) => {
    try {
      const res = await api.patch("/user_preferences/cuisine-types", {
        cuisine_ids: cuisine_ids,
      });
      setUserPreferences(res.data);
      saveUserPreferences(res.data);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectIntolerances = async (intolerance_ids: number[]) => {
    try {
      const res = await api.patch("/user_preferences/intolerances", {
        intolerance_ids: intolerance_ids,
      });
      setUserPreferences(res.data);
      saveUserPreferences(res.data);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  // Verification methods
  const sendVerificationCode = async (email: string) => {
    try {
      await api.post("/send-verification-code", { email });
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      const { data: authResponse } =  await api.post("/verify-email", {
        email: user!.email,
        code,
      });

      await Promise.all([
        saveAccessToken(authResponse.tokens.access_token),
        saveRefreshToken(authResponse.tokens.refresh_token),
        saveUser(authResponse.user),
      ]);
    
      setUser(authResponse.user);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  // Password reset methods
  const sendPasswordResetCode = async (email: string) => {
    try {
      await api.post("/send-reset-code", { email });
      setEmailReset(email);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const verifyPasswordResetCode = async (code: string) => {
    try {
      await api.post("/verify-reset-code", { email: emailReset, code });
      setResetCode(code);
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const resetPassword = async (
    newPassword: string,
  ) => {
    try {
      await api.post("/reset-password", {
        email: emailReset,
        new_password: newPassword,
        code: resetCode,
      });
      setEmailReset("");
      setResetCode("");
      return { success: true, error: "" };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const value = {
    user,
    userPreferences,
    loading,
    promptAsync,
    logout,
    login,
    register,
    completeBasicInfo,
    selectActivity,
    selectGoal,
    selectDiet,
    selectCuisines,
    selectIntolerances,
    sendVerificationCode,
    verifyEmail,
    sendPasswordResetCode,
    verifyPasswordResetCode,
    resetPassword,
    emailReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
