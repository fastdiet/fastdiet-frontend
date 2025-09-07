import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function AuthLayout() {

  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.colors.neutral[100] },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verifyEmail"  
        options={{
          headerShown: true,
          headerTitle: t("auth.verifyCode.verifyEmail"),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen name="sendPasswordResetCode" />
      <Stack.Screen name="verifyPasswordReset"
        options={{
          headerShown: true,
          headerTitle: t("auth.verifyCode.verifyEmail"),
          headerBackTitle: t('back'),
        }}
       />
      <Stack.Screen name="resetPassword" 
       options={{
          headerShown: true,
          headerTitle: t("profile.password"),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen name="complete-register/basicInfo"
       />
      <Stack.Screen name="complete-register/selectActivity"
        options={{
          headerShown: true,
          headerTitle: t("auth.completeRegister.activity.title"),
          headerBackTitle: t('back'),
        }}
       />
      <Stack.Screen name="complete-register/selectGoal" 
        options={{
          headerShown: true,
          headerTitle: t("auth.completeRegister.goal.title"),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen name="complete-register/selectDiet" 
        options={{
          headerShown: true,
          headerTitle: t("auth.completeRegister.diet.title"),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen name="complete-register/selectIntolerance"
        options={{
          headerShown: true,
          headerTitle: t("auth.completeRegister.intolerance.title"),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen name="complete-register/selectCuisine"
        options={{
          headerShown: true,
          headerTitle: t("auth.completeRegister.cuisine.title"),
          headerBackTitle: t('back'),
        }}
      />
    </Stack>
  );
}
