import React, { createContext, useState, useEffect, ReactNode } from "react";
import User from "@/models/user";
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
import { getUserPreferences, saveMenu, saveUserPreferences } from "@/utils/asyncStorage";
import { UserPreferences } from "@/models/user_preferences";
import { GoogleSignin, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";

export interface ApiError {
  code: string | null;
  message: string;
}

export type ApiResponse<T = never> = {
  success: boolean;
  error: ApiError | null;
  data?: T; 
};

interface AuthContextType {
  // Auth state
  user: User | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  // Auth methods
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  login: (username: string, password: string) => Promise<ApiResponse>;
  handleGoogleLogin: () => Promise<ApiResponse>;
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
  changePassword: (currentPassword: string, newPassword: string) => Promise<ApiResponse>;
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
  const router = useRouter();

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

  

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data ?? {};

      if (!idToken) throw new Error("Google Sign-In failed: No ID token received");

      const { data: authResponse } = await api.post(
        "/login-with-google",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      await Promise.all([
        saveAccessToken(authResponse.tokens.access_token),
        saveRefreshToken(authResponse.tokens.refresh_token),
        saveUser(authResponse.user),
        saveUserPreferences(authResponse.preferences)
      ]);

      setUser(authResponse.user);
      setUserPreferences(authResponse.preferences);

      if (authResponse.preferences === null) {
        router.replace("/complete-register/basicInfo");
      } else {
        router.replace("/menu/");
      }

      return { success: true, error: null };
    } catch (error) {
      if (isErrorWithCode(error)) {
        let apiError: ApiError = {
          code: error.code ?? null,
          message: ""
        };
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            apiError.message = "Sign in was cancelled by user";
            break;
          case statusCodes.IN_PROGRESS:
            apiError.message = "Sign in already in progress";
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            apiError.message = "Play services not available";
            break;
          default:
            apiError.message = error.message || "Unknown Google Sign-In error";
            break;
        }
        return { success: false, error: apiError };
      }
      return { success: false, error: handleApiError(error) };
    }
  };

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
        saveUserPreferences(authResponse.preferences)
      ]);
      await GoogleSignin.signOut();
      setUserPreferences(authResponse.preferences);
      setUser(authResponse.user);
      return { success: true, error: null };
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
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const clearData = async () => {

    if (user?.auth_method === 'google') {
      console.log("user");
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.warn('Could not sign out from Google:', e);
      }
    }

    await Promise.all([
      saveUser(null),
      saveUserPreferences(null),
      deleteAccessToken(),
      deleteRefreshToken(),
      saveMenu(null),
    ]);
    setUser(null);
    setUserPreferences(null);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.warn('Could not revoke tokens:', e);
    }
    await clearData();
  };

  const deleteAccount = async () => {
    await api.delete('/users/me');
    await clearData();
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
      const normalizedUsername = username.toLowerCase().trim();
      const updatedUser = { ...user, username: normalizedUsername, name , gender, age, weight, height };
      const res = await api.patch(`/users/`, updatedUser);
      
      setUser(res.data.user);
      if (res.data.calories_goal) {
          setUserPreferences(prev => {
              if (!prev) return prev;
              return {
                  ...prev,
                  calories_goal: res.data.calories_goal,
              };
          });
      }
      await saveUser(res.data.user);
      if (res.data.calories_goal) {
          const updatedPrefsForStorage = { ...userPreferences, calories_goal: res.data.calories_goal };
          await saveUserPreferences(updatedPrefsForStorage);
        }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectActivity = async (activity: string) => {
    try {
      const res = await api.patch("/user_preferences/activity-level", {activity_level: activity});

      const newPreferences = {
          ...userPreferences,
          activity_level: res.data.activity_level,
          calories_goal: res.data.calories_goal,
      };
      setUserPreferences(newPreferences);
      await saveUserPreferences(newPreferences);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectGoal = async (goal: string) => {
    try {
      const res = await api.patch("/user_preferences/goal", {goal: goal});
      const newPreferences = {
        ...userPreferences,
        goal: res.data.goal,
        calories_goal: res.data.calories_goal,
      };
      setUserPreferences(newPreferences);
      await saveUserPreferences(newPreferences);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectDiet = async (diet_type_id: number) => {
    try {
      const res = await api.patch("/user_preferences/diet-type", {id: diet_type_id});

      const newPreferences = {
        ...userPreferences,
        diet: res.data.diet,
      };
      
      setUserPreferences(newPreferences);
      await saveUserPreferences(newPreferences);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectCuisines = async (cuisine_ids: number[]) => {
    try {
      const res = await api.patch("/user_preferences/cuisine-types", {
        cuisine_ids: cuisine_ids,
      });

      const newPreferences = {
        ...userPreferences,
        cuisines: res.data.cuisines,
      };
      
      setUserPreferences(newPreferences);
      await saveUserPreferences(newPreferences);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const selectIntolerances = async (intolerance_ids: number[]) => {
    try {
      const res = await api.patch("/user_preferences/intolerances", {
        intolerance_ids: intolerance_ids,
      });

      const newPreferences = {
        ...userPreferences,
        intolerances: res.data.intolerances,
      };
      
      setUserPreferences(newPreferences);
      await saveUserPreferences(newPreferences);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };


  // Verification methods
  const sendVerificationCode = async (email: string) => {
    try {
      await api.post("/send-verification-code", { email });
      return { success: true, error: null };
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
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  // Password reset methods
  const sendPasswordResetCode = async (email: string) => {
    try {
      await api.post("/send-reset-code", { email });
      setEmailReset(email);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const verifyPasswordResetCode = async (code: string) => {
    try {
      await api.post("/verify-reset-code", { email: emailReset, code });
      setResetCode(code);
      return { success: true, error: null };
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
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.put('/users/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const value = {
    user,
    userPreferences,
    loading,
    logout,
    deleteAccount,
    login,
    handleGoogleLogin,
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
    changePassword,
    emailReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
